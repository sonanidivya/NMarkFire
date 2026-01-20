
import { useCallback, useEffect, useState } from 'react'
import { DocumentActionProps, useClient } from 'sanity'
import { Stack, Card, Text, Dialog, Box, Button, Spinner, Flex, useToast } from '@sanity/ui'
import { SortIcon, DragHandleIcon } from '@sanity/icons'
import { Reorder } from 'framer-motion'
import { nanoid } from 'nanoid'

export function ReorderTrustedBy(props: DocumentActionProps) {
  const { id, type, draft, published } = props
  const client = useClient({ apiVersion: '2024-01-01' })
  const toast = useToast()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<{_id: string, name: string}[]>([])

  if (type !== 'trustedByItem') return null

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setIsLoading(true)
    
    try {
      // Fetch all trustedBy items
      const result = await client.fetch(
        `*[_type == "trustedByItem"] | order(order asc, _updatedAt desc) {
          "_id": _id, 
          "name": name
        }`
      )
      
      // Deduplicate for UI (prefer drafts if present, but use base ID)
      const uniqueItems = new Map()
      result.forEach((item: any) => {
         const baseId = item._id.replace('drafts.', '')
         if (!uniqueItems.has(baseId)) {
             uniqueItems.set(baseId, { ...item, _id: baseId })
         }
      })
      
      setItems(Array.from(uniqueItems.values()))

    } catch (err: any) {
      console.error(err)
      toast.push({
        status: 'error',
        title: 'Failed to seek items',
        description: err.message
      })
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [client, toast])

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    const tx = client.transaction()
    
    items.forEach((uiItem, index) => {
        // Patch both draft and published if they exist to keep sync
        // We'll just try to patch the specific IDs we know about or infer
        // For simplicity, we patch the base ID and 'drafts.' + base ID
        tx.patch(uiItem._id, { set: { order: index } })
        tx.patch(`drafts.${uiItem._id}`, { set: { order: index } })
    })

    try {
        await tx.commit()
        toast.push({
            status: 'success',
            title: 'Order Saved',
            description: 'The logo order has been updated.'
        })
        setIsOpen(false)
    } catch (err: any) {
        // Ignore document not found errors for drafts
        console.warn("Some patches might have failed if draft didn't exist, checking...", err)
        // If strict error, show toast
        if(!err.message.includes('not find')) {
             toast.push({ status: 'error', title: 'Save Failed', description: err.message })
        } else {
             // Treat as success if it was just missing drafts
            setIsOpen(false)
        }
    } finally {
        setIsLoading(false)
    }
  }, [client, items, toast])

  return {
    label: 'Reorder Logos',
    icon: SortIcon,
    onHandle: handleOpen,
    dialog: isOpen ? {
      type: 'dialog' as const,
      onClose: () => setIsOpen(false),
      width: 'small', 
      header: `Reorder Partners`,
      content: (
        <Box padding={4}>
            {isLoading && items.length === 0 ? (
                <Flex align="center" justify="center" padding={4}><Spinner /></Flex>
            ) : items.length === 0 ? (
                <Text>No partners found to reorder.</Text>
            ) : (
                <Stack space={3}>
                    <Text size={1} muted>Drag items to reorder. Click Save to apply.</Text>
                    
                    <Reorder.Group axis="y" values={items} onReorder={setItems} style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {items.map((item) => (
                            <Reorder.Item key={item._id} value={item} style={{marginBottom: '8px'}}>
                                <Card padding={3} border radius={2} style={{cursor: 'grab', userSelect: 'none'}} className="hover:bg-gray-50">
                                    <Flex align="center" gap={3}>
                                        <DragHandleIcon style={{fontSize: '1.2rem', color: '#6e7681'}} />
                                        <Text weight="medium">{item.name}</Text>
                                    </Flex>
                                </Card>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    <Button 
                        text={isLoading ? "Saving..." : "Save Order"} 
                        tone="primary" 
                        onClick={handleSave} 
                        disabled={isLoading}
                        style={{marginTop: '1rem'}}
                    />
                </Stack>
            )}
        </Box>
      )
    } : null
  }
}
