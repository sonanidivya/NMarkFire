import { useToast } from '@sanity/ui'
import { useRouter } from 'sanity/router'
import { useCallback, useState } from 'react'
import { ArrowUpDown, Check, X } from 'lucide-react'
import { DocumentActionDescription, DocumentActionProps, useClient } from 'sanity'
import { Dialog, Card, Grid, Flex, Text, Button, Box } from '@sanity/ui'
import { SortIcon } from '@sanity/icons'
import { motion, Reorder } from 'framer-motion'

export function ReorderTestimonials(props: DocumentActionProps): DocumentActionDescription {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const client = useClient({ apiVersion: '2024-01-01' })
  const toast = useToast()
  const router = useRouter()

  const onOpen = useCallback(async () => {
    // 1. Fetch ALL testimonials
    const docs = await client.fetch(`*[_type == "testimonial"] | order(order asc, _createdAt desc) { _id, authorName, authorCompany, quote, order }`)
    setItems(docs.map((d: any, i: number) => ({ ...d, order: i }))) // Normalize order
    setDialogOpen(true)
  }, [client])

  const onSave = useCallback(async () => {
    setIsSaving(true)
    const transaction = client.transaction()

    items.forEach((item, index) => {
      transaction.patch(item._id, { set: { order: index } })
    })

    try {
      await transaction.commit()
      toast.push({
        status: 'success',
        title: 'Testimonials reordered',
      })
      setDialogOpen(false)
      window.location.reload() // Force refresh to see changes
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'Failed to reorder',
      })
    } finally {
      setIsSaving(false)
    }
  }, [items, client, toast])

  return {
    label: 'Reorder Testimonials',
    icon: SortIcon,
    onHandle: onOpen,
    dialog: isDialogOpen && {
      type: 'popover',
      onClose: props.onComplete,
      content: (
        <Dialog 
            header="Reorder Testimonials" 
            id="reorder-testimonials-dialog" 
            onClose={() => setDialogOpen(false)} 
            width={1}
            footer={
                <Grid columns={2} gap={2} padding={2}>
                    <Button text="Cancel" mode="ghost" onClick={() => setDialogOpen(false)} icon={X} />
                    <Button text="Save Order" tone="primary" onClick={onSave} loading={isSaving} icon={Check} />
                </Grid>
            }
        >
          <Box padding={4}>
            {/* Using Framer Motion for Drag & Drop */}
            <Reorder.Group axis="y" values={items} onReorder={setItems} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((item) => (
                <Reorder.Item key={item._id} value={item} style={{ marginBottom: '8px' }}>
                  <Card padding={3} radius={2} shadow={1} style={{ cursor: 'grab', userSelect: 'none', border: '1px solid #333', background: '#0d1117' }}>
                    <Flex align="center" gap={3}>
                       <ArrowUpDown size={16} style={{ color: '#666' }} />
                       <Box flex={1}>
                          <Text weight="bold" size={1}>{item.authorName} <span style={{opacity: 0.5, fontWeight: 'normal'}}> - {item.authorCompany}</span></Text>
                          <Text size={1} style={{ opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                             "{item.quote}"
                          </Text>
                       </Box>
                    </Flex>
                  </Card>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            
            <Text size={1} muted style={{ marginTop: '16px', textAlign: 'center' }}>
               Drag and drop items to reorder. Click Save to apply changes.
            </Text>
          </Box>
        </Dialog>
      )
    },
  }
}
