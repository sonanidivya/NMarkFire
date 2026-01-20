'use client'

import { Card, Stack, Text, Button, Box, ThemeProvider, studioTheme, Flex, Badge, Checkbox, Dialog, TextInput, ToastProvider, useToast, Grid, Spinner } from '@sanity/ui'
import { TrashIcon, RefreshIcon, CheckmarkCircleIcon, CloseIcon, EyeOpenIcon, EyeClosedIcon } from '@sanity/icons'
import React, { useEffect, useState, useCallback } from 'react'
import { useClient } from 'sanity'

interface GenericBulkManagerProps {
    schemaType: string
    title?: string
    itemName?: string
}

export function GenericBulkManager({ schemaType, title = 'Bulk Manager', itemName = 'Items' }: GenericBulkManagerProps) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  
  // Delete Dialog State
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  
  const toast = useToast()

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const query = `*[_type == $schemaType] | order(_updatedAt desc) { _id, _type, name, title, authorName, quote, isActive, order }`
    try {
        const data = await client.fetch(query, { schemaType })
        setItems(data)
        // Clear selection on refresh to avoid outdated IDs
        setSelected(new Set()) 
    } catch (err) {
        console.error("Failed to fetch items", err)
        toast.push({ status: 'error', title: 'Fetch failed', description: (err as Error).message })
    } finally {
        setLoading(false)
    }
  }, [client, schemaType, toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Selection
  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === items.length) {
        setSelected(new Set())
    } else {
        setSelected(new Set(items.map(p => p._id)))
    }
  }

  // Bulk Output Logic (Enable/Disable)
  const handleBulkStatus = async (status: boolean) => {
      setProcessing(true)
      const tx = client.transaction()
      const selectedArray = Array.from(selected)
      
      selectedArray.forEach(id => {
          tx.patch(id, p => p.set({ isActive: status }))
      })

      try {
          await tx.commit()
          toast.push({
              status: 'success',
              title: status ? 'Activated Selected' : 'Deactivated Selected',
              description: `Updated ${selectedArray.length} items.`
          })
          // Local update
          setItems(prev => prev.map(item => selected.has(item._id) ? { ...item, isActive: status } : item))
      } catch (err) {
          toast.push({ status: 'error', title: 'Update failed', description: (err as Error).message })
      } finally {
          setProcessing(false)
      }
  }

  // Bulk Delete
  const handleDelete = async () => {
     if (deleteInput.toUpperCase() !== 'DELETE') return;
     
     setProcessing(true)
     const tx = client.transaction()
     const selectedArray = Array.from(selected)

     selectedArray.forEach(id => {
         tx.delete(id)
         tx.delete(`drafts.${id}`)
     })
     
     try {
         await tx.commit()
         toast.push({
             status: 'success',
             title: 'Bulk Delete Successful',
             description: `Deleted ${selectedArray.length} items.`
         })
         
         // Remove from local list
         setItems(prev => prev.filter(p => !selected.has(p._id)))
         setSelected(new Set())
         setShowConfirm(false)
         setDeleteInput('')
         
     } catch (err) {
         toast.push({ status: 'error', title: 'Delete failed', description: (err as Error).message })
         setShowConfirm(true) // Keep dialog open on error
     } finally {
        setProcessing(false)
     }
  }

  // Helper to get display name
  const getDisplayName = (item: any) => {
      return item.name || item.title || item.authorName || 'Untitled'
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <ToastProvider>
        <Card padding={4} height="fill" overflow="auto">
            <Stack space={4}>
                
                {/* Header Actions */}
                <Card borderBottom paddingBottom={4}>
                   <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                       <Stack space={2}>
                          <Text weight="bold" size={3}>{title}</Text>
                          <Text muted size={1}>Manage {itemName} in bulk.</Text>
                       </Stack>
                       <Flex gap={2} wrap="wrap">
                           <Button 
                              icon={RefreshIcon} 
                              mode="ghost" 
                              onClick={fetchItems} 
                              text="Refresh" 
                              disabled={loading || processing}
                           />
                           
                           {selected.size > 0 && (
                               <>
                                   <Button 
                                      icon={EyeOpenIcon} 
                                      tone="positive" 
                                      mode="ghost" 
                                      text="Enable" 
                                      onClick={() => handleBulkStatus(true)}
                                      disabled={processing}
                                   />
                                   <Button 
                                      icon={EyeClosedIcon} 
                                      tone="caution" 
                                      mode="ghost" 
                                      text="Disable" 
                                      onClick={() => handleBulkStatus(false)}
                                      disabled={processing}
                                   />
                                   <Button 
                                      icon={TrashIcon} 
                                      tone="critical" 
                                      mode="default" 
                                      text={`Delete (${selected.size})`} 
                                      onClick={() => setShowConfirm(true)}
                                      disabled={processing}
                                   />
                               </>
                           )}
                       </Flex>
                   </Flex>
                </Card>

                {/* Table Header */}
                <Box padding={2}>
                   <Grid columns={[1, 1, 12]} gap={2} style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '8px' }}>
                       <Box columnStart={1} columnEnd={1}>
                          <Checkbox 
                             checked={items.length > 0 && selected.size === items.length} 
                             indeterminate={selected.size > 0 && selected.size < items.length}
                             onClick={toggleSelectAll} 
                             disabled={loading}
                          />
                       </Box>
                       <Box columnStart={2} columnEnd={3}><Text weight="bold" size={1} muted>STATUS</Text></Box>
                       <Box columnStart={3} columnEnd={12}><Text weight="bold" size={1} muted>NAME</Text></Box>
                   </Grid>
                </Box>

                {/* List */}
                <Stack space={1}>
                    {loading ? (
                        <Flex justify="center" padding={5}><Spinner muted /></Flex>
                    ) : items.length === 0 ? (
                        <Card padding={5} radius={2} border tone="caution">
                           <Flex align="center" justify="center" direction="column" gap={3}>
                               <Text size={2}>No {itemName} Found</Text>
                           </Flex>
                        </Card>
                    ) : items.map(item => (
                       <Card 
                            key={item._id} 
                            padding={3} 
                            radius={2} 
                            tone={selected.has(item._id) ? 'primary' : 'default'}
                            style={{ borderBottom: '1px solid var(--card-border-color)', transition: 'background-color 0.2s' }}
                        >
                            <Grid columns={[1, 1, 12]} gap={2} style={{ alignItems: 'center' }}>
                                <Box columnStart={1} columnEnd={1}>
                                    <Checkbox 
                                        checked={selected.has(item._id)} 
                                        onClick={() => toggleSelect(item._id)} 
                                    />
                                </Box>
                                <Box columnStart={2} columnEnd={3}>
                                     <Badge mode="outline" tone={item.isActive ? 'positive' : 'default'}>
                                        {item.isActive ? 'Active' : 'Hidden'}
                                     </Badge>
                                </Box>
                                <Box columnStart={3} columnEnd={12}>
                                    <Stack space={2}>
                                        <Text weight="medium">{getDisplayName(item)}</Text>
                                        {item.quote && <Text size={1} muted textOverflow="ellipsis">{item.quote}</Text>}
                                    </Stack>
                                </Box>
                            </Grid>
                       </Card>
                    ))}
                </Stack>

            </Stack>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <Dialog 
                   id="confirm-delete"
                   header="Confirm Bulk Deletion" 
                   onClose={() => setShowConfirm(false)}
                   width={1}
                >
                    <Box padding={4}>
                        <Stack space={4}>
                            <Text size={2}>
                                You are about to permanently delete <strong style={{color:'red'}}>{selected.size} {itemName}</strong>.
                                This action cannot be undone.
                            </Text>
                            
                            <Card padding={3} tone="critical" border radius={2}>
                                <Stack space={3}>
                                    <Text weight="bold" size={1}>Type &quot;DELETE&quot; to confirm:</Text>
                                    <TextInput 
                                        value={deleteInput} 
                                        onChange={(e) => setDeleteInput(e.currentTarget.value)}
                                        placeholder="DELETE"
                                        padding={3}
                                        fontSize={2}
                                        style={{ borderColor: 'red' }}
                                    />
                                </Stack>
                            </Card>

                            <Flex justify="flex-end" gap={3} marginTop={2}>
                                <Button text="Cancel" mode="ghost" onClick={() => setShowConfirm(false)} />
                                <Button 
                                    text="Delete Selected" 
                                    tone="critical" 
                                    disabled={deleteInput !== 'DELETE' || processing}
                                    loading={processing}
                                    onClick={handleDelete}
                                />
                            </Flex>
                        </Stack>
                    </Box>
                </Dialog>
            )}

        </Card>
      </ToastProvider>
    </ThemeProvider>
  )
}

export function TestimonialsBulkManager() {
    return <GenericBulkManager schemaType="testimonial" title="Testimonials Manager" itemName="Testimonials" />
}

export function TrustedByBulkManager() {
    return <GenericBulkManager schemaType="trustedByItem" title="Trusted By Manager" itemName="Partners" />
}
