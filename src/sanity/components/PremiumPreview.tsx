import { Box, Card, Flex, Text, Badge, Stack } from '@sanity/ui'
import { HomeIcon, MenuIcon } from '@sanity/icons'
import React from 'react'

export function PremiumPreview(props: any) {
  const { title, subtitle, media, showOnHome, showOnNav } = props
  
  // Media is likely a React node passed by Sanity (thumbnail) or an image url if we prepared it.
  // In `components.preview`, props contains specific fields if we select them.
  // Actually, standard usage: `props.renderDefault(props)` wraps standard. 
  // Custom: we take control.

  return (
    <Card 
        padding={2} 
        radius={2} 
        style={{ 
            backgroundColor: 'var(--card-bg-color)',
            border: '1px solid var(--card-border-color)',
            transition: 'all 0.2s'
        }}
    >
        <Flex align="center" gap={3}>
            {/* Image Thumbnail */}
            <Box style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                 {media}
            </Box>

            <Stack space={2} flex={1}>
                <Text weight="bold" size={2}>{title}</Text>
                {/* Badges inline */}
                <Flex gap={2} wrap="wrap">
                    {showOnNav && (
                        <Badge tone="primary" fontSize={0} mode="outline">
                            <Flex align="center" gap={1}>
                                <MenuIcon style={{width: '12px'}} /> Nav
                            </Flex>
                        </Badge>
                    )}
                    {showOnHome && (
                        <Badge tone="positive" fontSize={0} mode="outline">
                             <Flex align="center" gap={1}>
                                <HomeIcon style={{width: '12px'}} /> Home
                            </Flex>
                        </Badge>
                    )}
                </Flex>
            </Stack>
        </Flex>
    </Card>
  )
}
