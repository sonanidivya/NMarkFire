import { useState, useCallback } from 'react'
import { TrashIcon } from '@sanity/icons'
import { useToast, Dialog, Box, Stack, Text, Card, Flex, TextInput, Button, Spinner, Label } from '@sanity/ui'
import { DocumentActionDescription, DocumentActionProps, useClient } from 'sanity'

export function SafeDelete({ id, type, onComplete }: DocumentActionProps): DocumentActionDescription {
  const client = useClient({ apiVersion: '2024-01-01' })
  const toast = useToast()
  
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Cascade State
  const [stats, setStats] = useState<{
    subs: number,
    systems: number, 
    variants: number,
    idsToDelete: string[]
  } | null>(null)

  // 1. Analysis Step: Fetch Dependents
  const analyzeDeps = useCallback(async () => {
    setIsLoading(true)
    try {
        let query = ''
        const params = { id }

        // Logic based on hierarchy level
        if (type === 'mainCategory') {
            // Find Subs, Systems (via Subs), Variants (via Systems)
            query = `{
                "subs": *[_type == "subCategory" && parent._ref == $id]._id,
                "systems": *[_type == "systemType" && parent._ref in *[_type == "subCategory" && parent._ref == $id]._id]._id,
                "variants": *[_type == "variant" && parent._ref in *[_type == "systemType" && parent._ref in *[_type == "subCategory" && parent._ref == $id]._id]._id]._id
            }`
        } else if (type === 'subCategory') {
            // Find Systems, Variants (via Systems)
            query = `{
                "subs": [],
                "systems": *[_type == "systemType" && parent._ref == $id]._id,
                "variants": *[_type == "variant" && parent._ref in *[_type == "systemType" && parent._ref == $id]._id]._id
            }`
        } else if (type === 'systemType') {
             // Find Variants
             query = `{
                "subs": [],
                "systems": [],
                "variants": *[_type == "variant" && parent._ref == $id]._id
            }`
        } else {
             // Leaf node or Product
             setStats({ subs: 0, systems: 0, variants: 0, idsToDelete: [id] })
             setIsLoading(false)
             return
        }

        const res = await client.fetch(query, params)
        const allIds = [
            id,
            ...(res.subs || []),
            ...(res.systems || []),
            ...(res.variants || [])
        ]

        setStats({
            subs: res.subs?.length || 0,
            systems: res.systems?.length || 0,
            variants: res.variants?.length || 0,
            idsToDelete: allIds
        })

    } catch (err) {
        console.error("Analysis failed", err)
        toast.push({ status: 'error', title: 'Dependency Check Failed' })
    } finally {
        setIsLoading(false)
    }
  }, [id, type, client, toast])

  const handleDialogOpen = () => {
    setDialogOpen(true)
    analyzeDeps()
  }

  const handleConfirm = async () => {
    if (confirmValue.toUpperCase() !== 'DELETE') return
    
    setIsDeleting(true)
    const tx = client.transaction()

    // Delete all identified IDs
    stats?.idsToDelete.forEach(docId => {
        tx.delete(docId)
        tx.delete(`drafts.${docId}`) // Ensure drafts are gone too
    })

    // Cleanup Home Page References (Orphans)
    // We try to remove any reference to these IDs from the homePage
    // Since we don't know exactly which ID is on homePage, we can either:
    // 1. Query homePage and check.
    // 2. Blindly try to unset references in a separate patch if possible, 
    //    but inside a transaction we can just patch 'homePage' if we know its ID.
    //    For now, we'll rely on the bulk manager logic or just let Sanity handle loose refs logic if configured.
    //    To be safe/strict, let's fetch homePage ID.
    try {
        const homePageId = await client.fetch(`*[_type == "homePage"][0]._id`)
        if (homePageId) {
             stats?.idsToDelete.forEach(toRemove => {
                 tx.patch(homePageId, p => p.unset([
                     `featuredItems[_ref=="${toRemove}"]`,
                     `newTechnology[_ref=="${toRemove}"]`
                 ]))
             })
        }

        await tx.commit()
        toast.push({
            status: 'success',
            title: 'Cascade Delete Successful',
            description: `Deleted ${stats?.idsToDelete.length} items.`
        })
        onComplete()
        setDialogOpen(false)

    } catch (err) {
        console.error("Delete failed", err)
        toast.push({
            status: 'error',
            title: 'Delete Failed',
            description: (err as Error).message
        })
    } finally {
        setIsDeleting(false)
    }
  }

  return {
    label: 'Delete',
    icon: TrashIcon,
    shortcut: 'Ctrl+Alt+D',
    tone: 'critical',
    onHandle: handleDialogOpen,
    dialog: isDialogOpen ? {
      type: 'dialog' as const,
      onClose: () => setDialogOpen(false),
      header: null as any, // Disable default header to fix transparency overlap
      width: 'medium',
      content: (
        <Card padding={4} radius={2} tone="default" style={{backgroundColor: '#1a1a1a'}}>
            <Stack space={4}>
                {/* Custom Opaque Header */}
                <Flex justify="space-between" align="center">
                    <Text size={3} weight="bold" style={{color: 'white'}}>Confirm Cascade Deletion</Text>
                </Flex>

                {isLoading ? (
                    <Flex align="center" justify="center" direction="column" gap={3} padding={4}>
                        <Spinner muted />
                        <Text muted size={1}>Analyzing hierarchy...</Text>
                    </Flex>
                ) : (
                    <>
                        <Card padding={4} radius={2} tone="caution" border style={{backgroundColor: '#222'}}>
                            <Flex align="flex-start" gap={3}>
                                <Text size={3}>⚠️</Text>
                                <Stack space={3}>
                                    <Text weight="bold" size={2}>Warning: Permanent Cascade Delete</Text>
                                    <Text size={1}>
                                        You are about to delete <strong style={{textDecoration:'underline'}}>{stats?.idsToDelete.length} items</strong>.
                                    </Text>
                                    <Box marginLeft={3}>
                                        <ul style={{margin: 0, paddingLeft: '1.2em', listStyleType: 'disc'}}>
                                            {stats?.subs ? <li><Text size={1}>{stats.subs} Sub Categories</Text></li> : null}
                                            {stats?.systems ? <li><Text size={1}>{stats.systems} System Types</Text></li> : null}
                                            {stats?.variants ? <li><Text size={1}>{stats.variants} Variants</Text></li> : null}
                                            <li><Text size={1}>1 Parent ({type})</Text></li>
                                        </ul>
                                    </Box>
                                    <Text size={1} weight="medium" style={{color: 'var(--card-tone-caution-fg)'}}>
                                        This action is irreversible and will remove these items from the website immediately.
                                    </Text>
                                </Stack>
                            </Flex>
                        </Card>

                        <Stack space={3}>
                            <Label size={1}>Type "DELETE" to confirm</Label>
                            <TextInput 
                                value={confirmValue} 
                                onChange={(e) => setConfirmValue(e.currentTarget.value)}
                                placeholder="DELETE"
                                style={{borderColor: 'red'}}
                            />
                        </Stack>
                    </>
                )}
            </Stack>
        </Card>
      ),
      footer: (
         <Box padding={3}>
            <Flex justify="flex-end" gap={3}>
                <Button mode="ghost" onClick={() => setDialogOpen(false)} text="Cancel" />
                <Button 
                    tone="critical" 
                    disabled={isLoading || confirmValue.toUpperCase() !== 'DELETE' || isDeleting} 
                    loading={isDeleting}
                    onClick={handleConfirm} 
                    text="Yes, Delete All" 
                />
            </Flex>
         </Box>
      )
    } : null
  }
}
