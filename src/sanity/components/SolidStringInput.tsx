import { TextInput, Card } from '@sanity/ui'
import { StringInputProps, set, unset } from 'sanity'
import { useCallback } from 'react'

export function SolidStringInput(props: StringInputProps) {
  const { elementProps, onChange, value = '' } = props

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value
    onChange(nextValue ? set(nextValue) : unset())
  }, [onChange])

  return (
    <Card 
      padding={0} 
      radius={2} 
      // Using a lighter background to pop against the #222 wrapper
      style={{
          background: '#333', 
          border: '1px solid #555' 
      }}
    >
      <TextInput
        {...elementProps}
        onChange={handleChange}
        value={value}
        style={{
            background: 'transparent', 
            border: 'none', 
            color: 'white',
            fontWeight: 500
        }}
        padding={3}
      />
    </Card>
  )
}
