
import { useCallback, useEffect, useState } from 'react'
import { DocumentActionProps, useClient } from 'sanity'
import { Stack, Card, Text, Dialog, Box, Button, Spinner, Flex, useToast } from '@sanity/ui'
import { SortIcon, DragHandleIcon } from '@sanity/icons'
import { Reorder } from 'framer-motion'
import { nanoid } from 'nanoid'

// Define which types can have their children reordered
const SUPPORTED_TYPES = ['mainCategory', 'subCategory', 'systemType']

export function ReorderChildren(props: DocumentActionProps) {
  const { id, type, draft, published } = props
  const client = useClient({ apiVersion: '2024-01-01' })
  const toast = useToast()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<{_id: string, name: string}[]>([])

  // Determine what type of children to fetch
  const getChildType = () => {
    if (type === 'mainCategory') return 'subCategory'
    if (type === 'subCategory') return 'systemType'
    if (type === 'systemType') return 'variant'
    return null
  }

  const childType = getChildType()
  
  // Only show action if type is supported
  if (!SUPPORTED_TYPES.includes(type)) {
    return null
  }

  const [rawDocs, setRawDocs] = useState<{_id: string}[]>([])

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setIsLoading(true)
    
    // We use the published ID for parent reference queries usually
    const parentId = id.replace('drafts.', '')

    try {
      const result = await client.fetch(
        `*[_type == $childType && parent._ref == $parentId] | order(displayOrder asc, _updatedAt desc) {
          "_id": _id, 
          "name": name
        }`,
        { childType, parentId }
      )
      
      setRawDocs(result) // Keep all docs (drafts + published)

      // Deduplicate for UI
      const uniqueItems = new Map()
      result.forEach((item: any) => {
         const baseId = item._id.replace('drafts.', '')
         if (!uniqueItems.has(baseId)) {
             uniqueItems.set(baseId, { ...item, _id: baseId }) // Ensure UI uses baseId
         }
      })
      
      setItems(Array.from(uniqueItems.values()))

    } catch (err: any) {
      console.error(err)
      toast.push({
        status: 'error',
        title: 'Failed to fetch children',
        description: err.message
      })
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [client, id, childType, toast])

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    const tx = client.transaction()
    

    items.forEach((uiItem, index) => {
        // Find all actual docs (draft or published) that match this UI item
        const relatedDocs = rawDocs.filter(d => d._id.replace('drafts.', '') === uiItem._id)
        
        if (relatedDocs.length === 0) {
             tx.patch(uiItem._id, { set: { displayOrder: index } })
        } else {
            relatedDocs.forEach(doc => {
                 tx.patch(doc._id, { set: { displayOrder: index } })
            })
        }
    })

    try {
        await tx.commit()
        toast.push({
            status: 'success',
            title: 'Order Saved',
            description: 'The new order has been applied.'
        })
        setIsOpen(false)
        // Ideally trigger a revalidation or UI refresh? 
        // Studio usually listens to mutations.
    } catch (err: any) {
        console.error("Save failed", err)
        toast.push({
            status: 'error',
            title: 'Save Failed',
            description: err.message
        })
    } finally {
        setIsLoading(false)
    }
  }, [client, items, rawDocs, toast])

  return {
    label: 'Reorder Children',
    icon: SortIcon,
    onHandle: handleOpen,
    dialog: isOpen ? {
      type: 'dialog' as const,
      onClose: () => setIsOpen(false),
      width: 'small', // small, medium, large, full ... wait, type check said number? No, documentation says string.
      // previous file had `width: 'medium'` fix, so I will use 'small' here string.
      header: `Reorder ${childType}s`,
      content: (
        <Box padding={4}>
            {isLoading && items.length === 0 ? (
                <Flex align="center" justify="center" padding={4}><Spinner /></Flex>
            ) : items.length === 0 ? (
                <Text>No children found to reorder.</Text>
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
                                        <Text size={0} muted style={{marginLeft: 'auto', fontFamily: 'monospace'}}>{item._id.slice(0,8)}...</Text>
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
