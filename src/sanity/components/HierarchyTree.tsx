'use client'

import { Card, Stack, Text, Button, Box, ThemeProvider, studioTheme, Flex, Badge } from '@sanity/ui'
import { FolderIcon, CubeIcon, TagIcon, ComponentIcon, EditIcon, AddIcon, ChevronDownIcon, ChevronRightIcon } from '@sanity/icons'
import { useRouter } from 'sanity/router'
import React, { useEffect, useState, useMemo } from 'react'
import { useClient } from 'sanity'

// Icons mapping for levels
const LEVEL_ICONS: Record<string, any> = {
  mainCategory: FolderIcon,
  subCategory: FolderIcon,
  systemType: ComponentIcon,
  variant: TagIcon,
  product: CubeIcon
}

const LEVEL_COLORS: Record<string, string> = {
  mainCategory: 'blue',
  subCategory: 'cyan',
  systemType: 'orange',
  variant: 'green'
}

export function HierarchyTree() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch all hierarchy docs
  useEffect(() => {
    const query = `*[_type in ["mainCategory", "subCategory", "systemType", "variant"]] | order(displayOrder asc, order asc, name asc)`
    
    // Initial fetch
    client.fetch(query).then(data => {
      setItems(data)
      setLoading(false)
    })

    // Subscribe
    const subscription = client.listen(query).subscribe(update => {
      // Optimistic or full refetch. Simple full refetch for consistency.
      client.fetch(query).then(setItems)
    })

    return () => subscription.unsubscribe()
  }, [client])

  // Build Tree
  const tree = useMemo(() => {
    const mainCats = items.filter(i => i._type === 'mainCategory').sort((a,b) => (a.order||0) - (b.order||0))
    const subCats = items.filter(i => i._type === 'subCategory')
    const sysTypes = items.filter(i => i._type === 'systemType')
    const variants = items.filter(i => i._type === 'variant')

    return mainCats.map(main => ({
      ...main,
      children: subCats.filter(sub => sub.parent?._ref === main._id).map(sub => ({
        ...sub,
        children: sysTypes.filter(sys => sys.parent?._ref === sub._id).map(sys => ({
          ...sys,
          children: variants.filter(v => v.parent?._ref === sys._id)
        }))
      }))
    }))
  }, [items])

  if (loading) return <Box padding={4}><Text>Loading Hierarchy...</Text></Box>

  return (
    <ThemeProvider theme={studioTheme}>
      <Card padding={4} height="fill" overflow="auto">
        <Stack space={2}>
            <Card borderBottom paddingBottom={2}>
              <Flex align="center" justify="space-between">
                  <Text weight="bold" size={2}>Hierarchy Explorer</Text>
                  <Badge tone="primary">Live</Badge>
              </Flex>
            </Card>
            <Box paddingTop={2}>
                <Stack space={1}>
                {tree.map(node => (
                    <TreeNode key={node._id} node={node} level="mainCategory" />
                ))}
                {tree.length === 0 && <Text muted>No categories found.</Text>}
                </Stack>
            </Box>
        </Stack>
      </Card>
    </ThemeProvider>
  )
}

function TreeNode({ node, level }: { node: any, level: keyof typeof LEVEL_ICONS }) {
  const [isOpen, setIsOpen] = useState(level === 'mainCategory') // Default open mains
  const router = useRouter()
  
  const Icon = LEVEL_ICONS[level]
  const color = LEVEL_COLORS[level] as any
  const hasChildren = node.children && node.children.length > 0
  
    // Intent Logic
    const handleEdit = () => {
      // Navigate to valid intent
      router.navigateIntent('edit', { id: node._id, type: node._type })
    }
  
    const handleAddChild = (e: React.MouseEvent) => {
      e.stopPropagation()
      
      let childType = ''
      if (level === 'mainCategory') childType = 'subCategory'
      if (level === 'subCategory') childType = 'systemType'
      if (level === 'systemType') childType = 'variant'
      
      if (!childType) return 
  
      // We use a custom template ID constructed in sanity.config.ts
      // Template ID: {childType}-by-{parentType}
      const templateId = `${childType}-by-${level}`
      
      // @ts-ignore
      router.navigateIntent('create', { type: childType, template: templateId }, { parentId: node._id })
    }

  const childLevel = level === 'mainCategory' ? 'subCategory' : 
                     level === 'subCategory' ? 'systemType' : 
                     level === 'systemType' ? 'variant' : null

  return (
    <Box paddingLeft={level === 'mainCategory' ? 0 : 3}>
      <Card 
        padding={2} 
        radius={2} 
        shadow={1} 
        tone="inherit" 
        style={{ 
            backgroundColor: 'var(--card-bg-color)', 
            borderLeft: `4px solid ${level === 'mainCategory' ? '#2276FC' : 'transparent'}`,
            marginBottom: '4px' 
        }}
      >
        <Flex align="center" gap={3}>
            {/* Toggler */}
            <Button 
                padding={2} 
                mode="bleed" 
                icon={isOpen ? ChevronDownIcon : ChevronRightIcon} 
                onClick={() => setIsOpen(!isOpen)}
                style={{ visibility: hasChildren || childLevel ? 'visible' : 'hidden' }}
                disabled={!hasChildren && !childLevel}
            />

            {/* Icon & Label */}
            <Flex onClick={handleEdit} style={{ cursor: 'pointer', flex: 1 }} align="center" gap={3}>
                <Text size={2} style={{ color: 'var(--card-fg-color)' }}>
                    <Icon />
                </Text>
                <Stack space={1}>
                    <Text weight="medium" size={1}>{node.name}</Text>
                    <Text size={0} muted>{node.slug?.current}</Text>
                </Stack>
            </Flex>

            {/* Actions */}
            <Flex gap={1} align="center">
                <Button 
                    mode="ghost" 
                    icon={EditIcon} 
                    fontSize={1} 
                    padding={2} 
                    onClick={handleEdit} 
                    title="Edit Node"
                />
                {childLevel && (
                    <Button 
                        mode="ghost" 
                        tone="primary" 
                        icon={AddIcon} 
                        fontSize={1} 
                        padding={2} 
                        onClick={handleAddChild}
                        title={`Add ${childLevel}`}
                    />
                )}
            </Flex>
        </Flex>
      </Card>

      {/* Children Recursion */}
      {isOpen && node.children && node.children.length > 0 && (
         <Stack space={1} marginTop={1}>
            {node.children.map((child: any) => (
                <TreeNode key={child._id} node={child} level={childLevel as any} />
            ))}
         </Stack>
      )}
    </Box>
  )
}
