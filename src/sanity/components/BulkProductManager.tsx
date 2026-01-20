'use client'

import { Card, Stack, Text, Button, Box, ThemeProvider, studioTheme, Flex, Badge, Checkbox, Dialog, TextInput, ToastProvider, useToast, Grid, Portal } from '@sanity/ui'
import { TrashIcon, RefreshIcon, CloseIcon } from '@sanity/icons'
import { useRouter } from 'sanity/router'
import React, { useEffect, useState, useMemo } from 'react'
import { useClient } from 'sanity'

export function BulkProductManager() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [products, setProducts] = useState<any[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  const toast = useToast()

  const fetchProducts = async () => {
    setLoading(true)
    const query = `*[_type in ["product", "mainCategory", "subCategory", "systemType", "variant"]] | order(_createdAt desc) { _id, _type, name, title }`
    try {
        const data = await client.fetch(query)
        setProducts(data)
    } catch (err) {
        console.error("Failed to fetch products", err)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [client])

  // Select Logic
  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === products.length) {
        setSelected(new Set())
    } else {
        setSelected(new Set(products.map(p => p._id)))
    }
  }

  // Delete Logic
  const handleDelete = async () => {
     if (deleteInput.toUpperCase() !== 'DELETE') return;
     
     setIsDeleting(true)
     
     // 1. Analyze Hierarchy for Cascade
     // We need to find all children of the selected items to ensure complete cleanup
     let allIdsToDelete = new Set(selected)
     let childCount = 0

     try {
         // Query for children of the selected IDs
         // We do this by chunks or one complex query. 
         // Strategy: Get all SubCategories where parent in Selected, All Systems where parent in Selected...
         // This is a bit heavy, but safer.
         
         const selectedArray = Array.from(selected)
         
         // Find dependent children (Sub -> System -> Variant)
         // We can do a broad fetch: find everything that descends from these IDs
         const descendantsParams = { ids: selectedArray }
         const query = `*[
            (parent._ref in $ids) || 
            (parent._ref in *[parent._ref in $ids]._id) ||
            (parent._ref in *[parent._ref in *[parent._ref in $ids]._id]._id)
         ]._id`
         
         const descendantIds = await client.fetch(query, descendantsParams)
         descendantIds.forEach((id: string) => allIdsToDelete.add(id))
         
         childCount = descendantIds.length


         
         // 2. Perform Transactional Delete
         const tx = client.transaction()
         const finalIdList = Array.from(allIdsToDelete)
         
         // Cleanup Reference (Home Page)
         const homePages = await client.fetch(`*[_type == "homePage"]._id`)
         if (homePages.length > 0) {
            homePages.forEach((hpId: string) => {
                // Batch unset for efficiency? Or iterate. 
                // Patch unsets are cheap.
                finalIdList.forEach(id => {
                     tx.patch(hpId, p => p.unset([
                         `featuredItems[_ref=="${id}"]`,
                         `newTechnology[_ref=="${id}"]`
                     ]))
                })
            })
         }
    
         finalIdList.forEach(id => {
            tx.delete(id)
            tx.delete(`drafts.${id}`)
         })
         
         await tx.commit()
         
         // Success
         toast.push({
             status: 'success',
             title: 'Bulk Delete Successful',
             description: `Deleted ${selected.size} generated + ${childCount} children.`
         })
         
         // Optimistic Local Update
         setProducts(prev => prev.filter(p => !allIdsToDelete.has(p._id)))
         setSelected(new Set())
         setShowConfirm(false)
         setDeleteInput('')
         
     } catch (err) {
         console.error("Bulk delete failed", err)
         toast.push({
             status: 'error',
             title: 'Delete failed',
             description: (err as Error).message
         })
         setShowConfirm(true)
     } finally {
        setIsDeleting(false)
     }
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <ToastProvider>
        <Card padding={4} height="fill" overflow="auto">
            <Stack space={4}>
                
                {/* Header */}
                {!showConfirm && (
                    <Card borderBottom paddingBottom={4}>
                       <Flex align="center" justify="space-between">
                           <Stack space={2}>
                              <Text weight="bold" size={3}>Bulk Content Manager</Text>
                              <Text muted size={1}>Manage products and categories.</Text>
                           </Stack>
                           <Flex gap={2}>
                               <Button 
                                   icon={RefreshIcon} 
                                   mode="ghost" 
                                   onClick={fetchProducts} 
                                   text="Refresh" 
                                   disabled={loading}
                               />
                               {selected.size > 0 && (
                                   <Button 
                                      icon={TrashIcon} 
                                      tone="critical" 
                                      mode="default" 
                                      text={`Delete (${selected.size})`} 
                                      onClick={() => setShowConfirm(true)}
                                   />
                               )}
                           </Flex>
                       </Flex>
                    </Card>
                )}

                {/* Table Header */}
                <Box padding={2}>
                   <Grid columns={[1, 1, 12]} gap={2} style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '8px' }}>
                       <Box columnStart={1} columnEnd={1}>
                          <Checkbox 
                             checked={products.length > 0 && selected.size === products.length} 
                             indeterminate={selected.size > 0 && selected.size < products.length}
                             onClick={toggleSelectAll} 
                          />
                       </Box>
                       <Box columnStart={2} columnEnd={3}><Text weight="bold" size={1} muted>TYPE</Text></Box>
                       <Box columnStart={3} columnEnd={12}><Text weight="bold" size={1} muted>NAME / TITLE</Text></Box>
                   </Grid>
                </Box>

                {/* List */}
                <Stack space={1}>
                    {loading ? <Text align="center" muted>Loading...</Text> : products.map(item => (
                       <Card 
                            key={item._id} 
                            padding={3} 
                            radius={2} 
                            tone={selected.has(item._id) ? 'primary' : 'default'}
                            style={{ borderBottom: '1px solid var(--card-border-color)' }}
                        >
                            <Grid columns={[1, 1, 12]} gap={2}>
                                <Box columnStart={1} columnEnd={1}>
                                    <Checkbox 
                                        checked={selected.has(item._id)} 
                                        onClick={() => toggleSelect(item._id)} 
                                    />
                                </Box>
                                <Box columnStart={2} columnEnd={3}>
                                     <Badge mode="outline" tone={item._type === 'product' ? 'primary' : 'caution'}>
                                        {item._type}
                                     </Badge>
                                </Box>
                                <Box columnStart={3} columnEnd={12}>
                                    <Text weight="medium">{item.name || item.title || 'Untitled'}</Text>
                                    <Box marginTop={1}><Text size={0} muted>{item._id}</Text></Box>
                                </Box>
                            </Grid>
                       </Card>
                    ))}
                    {!loading && products.length === 0 && (
                        <Card padding={5} radius={2} border tone="caution">
                           <Flex align="center" justify="center" direction="column" gap={3}>
                               <Text size={3} weight="bold">No Content Found</Text>
                               <Text muted>Use the "Create" button in the Studio to add Products or Categories.</Text>
                           </Flex>
                        </Card>
                    )}
                </Stack>

            </Stack>

            {/* Confirmation Overlay (Custom Portal) */}
            {showConfirm && (
                <Portal>
                    <div style={{
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        zIndex: 9999999, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)'
                    }}>
                        <div style={{width: '600px', maxWidth: '90vw'}}>
                            <ThemeProvider theme={studioTheme}>
                                <Card scheme="dark" style={{backgroundColor: '#1a1a1a', color: 'white'}} radius={3} overflow="hidden" shadow={4}>
                                    {/* Custom Header */}
                                    <Card padding={4} borderBottom style={{borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'transparent'}}>
                                         <Flex align="center" justify="space-between">
                                             <Text weight="bold" size={2}>Confirm Deletion</Text>
                                             <Button icon={CloseIcon} mode="bleed" onClick={() => setShowConfirm(false)} />
                                         </Flex>
                                    </Card>

                                    <Box padding={4}>
                                        <Stack space={4}>
                                            <Text size={2} style={{color: '#ddd'}}>
                                                You are about to permanently delete <strong style={{color:'#ef4444'}}>{selected.size} items</strong>.
                                                This action cannot be undone.
                                            </Text>
                                            
                                            <Card padding={3} style={{backgroundColor: '#222', border: '1px solid #333'}} radius={2}>
                                                <Stack space={3}>
                                                    <Text weight="bold" size={1} style={{color: '#ddd'}}>Type &quot;DELETE&quot; to confirm:</Text>
                                                    <TextInput 
                                                        value={deleteInput} 
                                                        onChange={(e) => setDeleteInput(e.currentTarget.value)}
                                                        placeholder="DELETE"
                                                        padding={3}
                                                        fontSize={2}
                                                        style={{
                                                            backgroundColor: '#111', 
                                                            border: '1px solid #444', 
                                                            color: '#fff'
                                                        }}
                                                    />
                                                </Stack>
                                            </Card>

                                            <Flex justify="flex-end" gap={3} marginTop={2}>
                                                <Button text="Cancel" mode="ghost" onClick={() => setShowConfirm(false)} />
                                                <Button 
                                                    text="Delete Selected" 
                                                    tone="critical" 
                                                    disabled={deleteInput !== 'DELETE' || isDeleting}
                                                    loading={isDeleting}
                                                    onClick={handleDelete}
                                                />
                                            </Flex>
                                        </Stack>
                                    </Box>
                                </Card>
                            </ThemeProvider>
                        </div>
                    </div>
                </Portal>
            )}

        </Card>
      </ToastProvider>
    </ThemeProvider>
  )
}
