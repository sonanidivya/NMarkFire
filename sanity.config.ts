'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {SafeDelete} from './src/sanity/actions/SafeDelete'
import {ReorderChildren} from './src/sanity/actions/ReorderChildren'
import {ReorderTrustedBy} from './src/sanity/actions/ReorderTrustedBy'
import {ReorderTestimonials} from './src/sanity/actions/ReorderTestimonials'
import {DocumentActionComponent} from 'sanity'
import {StudioIcon} from './src/sanity/components/StudioIcon'
import {myTheme} from './src/sanity/theme'
import {Dashboard} from './src/sanity/tools/Dashboard'
import {DashboardIcon} from '@sanity/icons'

export default defineConfig({
  basePath: '/studio',
  title: 'NMarkFire OS',
  icon: StudioIcon,
  theme: myTheme,
  components: {},
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schema.types,
    templates: (prev) => [
      ...prev,
      {
        id: 'subCategory-by-mainCategory',
        title: 'Sub Category by Main',
        schemaType: 'subCategory',
        parameters: [{ name: 'parentId', type: 'string' }],
        value: ({ parentId }: { parentId: string }) => ({
          parent: { _type: 'reference', _ref: parentId },
        }),
      },
      {
        id: 'systemType-by-subCategory',
        title: 'System Type by Sub',
        schemaType: 'systemType',
        parameters: [{ name: 'parentId', type: 'string' }],
        value: ({ parentId }: { parentId: string }) => ({
          parent: { _type: 'reference', _ref: parentId },
        }),
      },
      {
        id: 'variant-by-systemType',
        title: 'Variant by System',
        schemaType: 'variant',
        parameters: [{ name: 'parentId', type: 'string' }],
        value: ({ parentId }: { parentId: string }) => ({
          parent: { _type: 'reference', _ref: parentId },
        }),
      },
    ],
  },
  plugins: [
    structureTool({structure}),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    actions: (prev, context) => {
      // Replace default delete with SafeDelete
      const actions = prev.map((originalAction) =>
        originalAction.action === 'delete' ? (SafeDelete as DocumentActionComponent) : originalAction
      )
      
      // Add Reorder Action to specific types (prepend to make visible)
      if (['mainCategory', 'subCategory', 'systemType'].includes(context.schemaType)) {
          const originalPublish = actions.find(a => a.action === 'publish')
          const rest = actions.filter(a => a.action !== 'publish')
          
          if (originalPublish) {
            const CustomPublish: DocumentActionComponent = (props) => {
                const result = originalPublish(props)
                if (!props.draft) return null
                return result
            }
            return [CustomPublish, (ReorderChildren as DocumentActionComponent), ...rest]
          }
          return [(ReorderChildren as DocumentActionComponent), ...actions]
      }

      if (context.schemaType === 'trustedByItem') {
        return [(ReorderTrustedBy as DocumentActionComponent), ...actions]
      }

      if (context.schemaType === 'testimonial') {
        return [(ReorderTestimonials as DocumentActionComponent), ...actions]
      }
      
      return actions
    },
  },
  tools: (prev) => {
      return [
          {
              name: 'dashboard',
              title: 'Command Center',
              component: Dashboard,
              icon: DashboardIcon,
          },
          ...prev
      ]
  },
})
