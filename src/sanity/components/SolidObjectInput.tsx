import { Card } from '@sanity/ui'
import { ObjectInputProps } from 'sanity'

export function SolidObjectInput(props: ObjectInputProps) {
  return (
    <Card 
        padding={2} // Compact internal spacing
        radius={0} // Square corners to sit flush against the dialog frame
        shadow={1} 
        tone="default"
        style={{
            background: '#222', 
            border: '1px solid #333' 
        }}
    >
      {/* CSS Hack to force the Native Dialog Header to be Solid Black */}
      <style>{`
        /* Target the Native Dialog Header using attribute wildcard */
        div[class*="DialogHeader"] {
            background: #1a1a1a !important;
            border-bottom: 1px solid #333 !important;
            backdrop-filter: none !important;
            box-shadow: none !important;
        }
        div[class*="DialogHeader"] h2 {
            color: #eee !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            font-weight: 700 !important;
        }
        div[class*="DialogHeader"] button {
            color: #eee !important;
        }

        /* Target the Dialog Body/Content */
        div[class*="DialogContent"] {
            background: #1a1a1a !important;
            padding: 0 !important; /* Remove huge native padding to kill vertical gaps */
            height: auto !important; /* Allow shrinking */
            min-height: 0 !important;
            flex: 0 0 auto !important; /* Stop flex expansion */
        }

        /* Target the Root Dialog Card to ensure no gray edges */
        [data-ui="DialogCard"] {
            background: #1a1a1a !important; 
            border: 1px solid #333 !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
            height: auto !important; /* Shrink to fit content */
            min-height: 0 !important; 
        }
      `}</style>
      
      {props.renderDefault(props)}
    </Card>
  )
}
