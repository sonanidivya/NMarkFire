import { Card, Flex, Text, Button, TextInput, Box, Stack, Grid } from '@sanity/ui'
import { ArrayOfPrimitivesInputProps, set, unset, insert } from 'sanity'
import { useCallback, useState, KeyboardEvent } from 'react'
import { CloseIcon, AddIcon } from '@sanity/icons'

const COMMON_CERTS = [
  'ISI Marked',
  'CE Certified', 
  'ISO 9001',
  'UL Listed',
  'Clean Agent',
  'Eco Friendly'
]

export function CertificationsInput(props: ArrayOfPrimitivesInputProps) {
  const { value = [], onChange } = props
  const [inputValue, setInputValue] = useState('')

  // Helper to add a cert
  const addCert = useCallback((certValue: string) => {
    if (!certValue.trim()) return
    
    // Check if already exists
    if (value.includes(certValue)) return

    // Insert patch
    onChange(insert([certValue], 'after', [-1]))
    setInputValue('')
  }, [onChange, value])

  // Helper to remove a cert
  const removeCert = useCallback((indexToRemove: number) => {
    // If it's the last item and we are removing it, we might need unset([]) if empty? 
    // Sanity usually handles empty arrays fine, but insert/unset is safer.
    // Actually, distinct 'remove' patch is best for arrays.
    // But `insert` 'replace' or just calculating new array and `set` is often easier for simple arrays.
    
    // Ideally use array specific patches:
    // onChange(unset([indexToRemove])) -- wait path syntax is tricky for array root
    // Let's use set() with a new array for simplicity for primitives
    const newValue = value.filter((_, i) => i !== indexToRemove)
    onChange(newValue.length > 0 ? set(newValue) : unset())
  }, [onChange, value])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCert(inputValue)
    }
  }

  return (
    <Stack space={4}>
      {/* 1. Quick Add Chips */}
      <Card padding={3} radius={2} border style={{background: '#f9fafb'}}>
        <Stack space={3}>
            <Text size={1} weight="semibold" style={{color: '#6b7280'}}>Quick Add Standard Certifications:</Text>
            <Flex gap={2} wrap="wrap">
            {COMMON_CERTS.map(cert => {
                const isSelected = value.includes(cert)
                return (
                    <Button
                        key={cert}
                        mode={isSelected ? 'default' : 'ghost'}
                        tone={isSelected ? 'primary' : 'default'}
                        text={cert}
                        fontSize={1}
                        padding={2}
                        disabled={isSelected}
                        onClick={() => addCert(cert)}
                        icon={AddIcon}
                        style={{
                            border: isSelected ? '1px solid transparent' : '1px dashed #d1d5db',
                            background: isSelected ? '#22c55e' : 'white',
                            color: isSelected ? 'white' : 'inherit'
                        }}
                    />
                )
            })}
            </Flex>
        </Stack>
      </Card>

      {/* 2. Visual Tag List (Selected) */}
      {value.length > 0 && (
          <Flex gap={2} wrap="wrap">
            {(value as string[]).map((cert, index) => (
              <Card 
                key={`${cert}-${index}`} 
                padding={[2, 2, 2, 3]} 
                radius={4} 
                shadow={1}
                tone="primary" 
                style={{background: '#eff6ff', border: '1px solid #bfdbfe'}}
              >
                <Flex align="center" gap={2}>
                  <Text size={1} weight="semibold" style={{color: '#1e40af'}}>{cert}</Text>
                  <Button 
                    icon={CloseIcon} 
                    mode="bleed" 
                    padding={1} 
                    onClick={() => removeCert(index)}
                    style={{color: '#1d4ed8'}} 
                    title="Remove"
                  />
                </Flex>
              </Card>
            ))}
          </Flex>
      )}

      {/* 3. Custom Input */}
      <Stack space={2}>
          <Text size={1} style={{color: '#6b7280'}}>Or type a custom one:</Text>
          <Flex gap={2}>
            <Box flex={1}>
                <TextInput
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    value={inputValue}
                    placeholder="Type custom certification..."
                    padding={3}
                    radius={2}
                />
            </Box>
            <Button 
                text="Add" 
                mode="ghost"
                tone="primary"
                onClick={() => addCert(inputValue)}
                disabled={!inputValue.trim()}
            />
          </Flex>
      </Stack>
    </Stack>
  )
}
