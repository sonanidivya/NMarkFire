import React, { useEffect, useState } from 'react'
import { Card, Flex, Grid, Heading, Text, Box, Stack, Spinner, Button } from '@sanity/ui'
import { DashboardIcon, CubeIcon, TagIcon, DatabaseIcon, EditIcon } from '@sanity/icons'
import { useClient } from 'sanity'

function StatCard({ title, value, icon, delay }: any) {
    return (
        <Card 
            padding={4} 
            radius={3} 
            style={{
                backgroundColor: 'rgba(30,30,30,0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: `fadeIn 0.5s ease-out ${delay}s forwards`,
                opacity: 0,
                transform: 'translateY(10px)'
            }}
        >
            <Flex align="center" justify="space-between">
                <Stack space={3}>
                    <Text size={1} style={{color: '#888', textTransform: 'uppercase', letterSpacing: '1px'}}>{title}</Text>
                    <Heading size={4} style={{fontFamily: 'Manrope', color: '#fff'}}>{value}</Heading>
                </Stack>
                <Box style={{color: 'var(--active-red)', opacity: 0.8}}>
                    {React.createElement(icon, {style: {fontSize: '32px'}})}
                </Box>
            </Flex>
        </Card>
    )
}

export function Dashboard() {
    const client = useClient({apiVersion: '2023-01-01'})
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        const query = `{
            "products": count(*[_type == "product"]),
            "variants": count(*[_type == "variant"]),
            "systems": count(*[_type == "systemType"]),
            "recent": *[_type in ["product", "variant", "systemType"]] | order(_updatedAt desc)[0...5] {
                _id, _type, name, _updatedAt
            }
        }`
        client.fetch(query).then(setStats)
    }, [])

    if (!stats) return <Flex align="center" justify="center" height="fill"><Spinner /></Flex>

    return (
        <div id="nmark-dashboard-active" style={{ display: 'contents' }}>
        <Box padding={5} style={{
            minHeight: '100%', 
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 10,
            background: 'var(--my-bg-gradient)' // Cover the watermark
        }}>
            <Stack space={5}>
                {/* Header */}
                <Flex align="center" justify="space-between" style={{animation: 'fadeIn 0.5s ease-out'}}>
                    <Stack space={2}>
                        <Heading size={4} style={{fontFamily: 'Manrope', fontWeight: 800}}>COMMAND CENTER</Heading>
                        <Text size={2} style={{color: '#888'}}>NMarkFire OS // Status: <span style={{color: '#16a34a'}}>● Online</span></Text>
                    </Stack>
                    <Button 
                        fontSize={2} 
                        padding={3} 
                        tone="critical" 
                        mode="ghost" 
                        text="System Settings" 
                        icon={DashboardIcon}
                    />
                </Flex>

                {/* Stats Grid */}
                <Grid columns={[1, 2, 4]} gap={4}>
                    <StatCard title="Total Products" value={stats.products} icon={CubeIcon} delay={0.1} />
                    <StatCard title="Active Variants" value={stats.variants} icon={TagIcon} delay={0.2} />
                    <StatCard title="System Types" value={stats.systems} icon={DatabaseIcon} delay={0.3} />
                    <StatCard title="System Health" value="100%" icon={DashboardIcon} delay={0.4} />
                </Grid>

                {/* Main Content Area */}
                <Grid columns={[1, 1, 3]} gap={4}>
                    {/* Recent Activity */}
                    <Card columnStart={[1, 1, 1]} columnEnd={[1, 1, 3]} padding={4} radius={3} style={{backgroundColor: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <Stack space={4}>
                            <Heading size={2}>Recent Transmissions</Heading>
                            <Stack space={3}>
                                {stats.recent.map((doc: any, i: number) => (
                                    <Flex key={doc._id} align="center" justify="space-between" padding={3} style={{background: 'rgba(255,255,255,0.03)', borderRadius: '8px'}}>
                                        <Flex align="center" gap={3}>
                                            <EditIcon style={{color: '#666'}} />
                                            <Stack space={1}>
                                                <Text size={2} weight="bold">{doc.name || 'Untitled'}</Text>
                                                <Text size={1} style={{color: '#666'}}>Updated {new Date(doc._updatedAt).toLocaleTimeString()}</Text>
                                            </Stack>
                                        </Flex>
                                        <Card radius={2} tone="primary" padding={1}><Text size={0}>{doc._type}</Text></Card>
                                    </Flex>
                                ))}
                            </Stack>
                        </Stack>
                    </Card>

                    {/* Quick Launch */}
                    <Card padding={4} radius={3} style={{backgroundColor: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.05)'}}>
                         <Stack space={4}>
                            <Heading size={2}>Quick Protocols</Heading>
                            <Grid columns={1} gap={2}>
                                <Button mode="ghost" tone="default" text="Add New Product" style={{textAlign: 'left'}} icon={CubeIcon} />
                                <Button mode="ghost" tone="default" text="Manage Hierarchy" style={{textAlign: 'left'}} icon={DatabaseIcon} />
                                <Button mode="ghost" tone="default" text="Run Diagnostics" style={{textAlign: 'left'}} icon={DashboardIcon} />
                            </Grid>
                        </Stack>
                    </Card>
                </Grid>
            </Stack>
        </Box>
        </div>
    )
}
