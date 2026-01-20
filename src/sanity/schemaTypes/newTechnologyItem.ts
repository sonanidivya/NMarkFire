
import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export const newTechnologyItem = defineType({
  name: 'newTechnologyItem',
  title: 'New Technology Item',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'isActive',
      title: 'Active Status',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this item on the Home Page.'
    }),
    defineField({
        name: 'displayOrder',
        title: 'Display Order',
        type: 'number',
        initialValue: 0,
        validation: rule => rule.required(),
        description: 'Lower numbers appear first. 1, 2, 3...'
    }),
    defineField({
      name: 'title',
      title: 'Title (Override)',
      type: 'string',
      description: 'Optional: Override the product name for the display card.',
    }),
    defineField({
        name: 'description',
        title: 'Description (Override)',
        type: 'text',
        rows: 2,
        description: 'Optional: Override the product description.',
    }),
    
    // Guided Hierarchy Selection
    defineField({
        name: 'mainCategory',
        title: '1. Select Main Category',
        type: 'reference',
        to: [{ type: 'mainCategory' }],
        validation: rule => rule.required(),
        description: 'First, narrow down by Main Category.'
    }),
    defineField({
        name: 'subCategory',
        title: '2. Select Sub Category',
        type: 'reference',
        to: [{ type: 'subCategory' }],
        validation: rule => rule.required(),
        options: {
            filter: ({ document }) => {
                if (!document?.mainCategory) return { filter: '!defined(_id)' }
                return {
                    filter: 'parent._ref == $mainId',
                    params: { mainId: (document.mainCategory as any)._ref }
                }
            }
        },
        description: 'Then, select a Sub Category belonging to the above.'
    }),
    defineField({
        name: 'systemType',
        title: '3. Select System Type (Optional)',
        type: 'reference',
        to: [{ type: 'systemType' }],
        options: {
            filter: ({ document }) => {
                if (!document?.subCategory) return { filter: '!defined(_id)' }
                return {
                    filter: 'parent._ref == $subId',
                    params: { subId: (document.subCategory as any)._ref }
                }
            }
        },
    }),
    defineField({
        name: 'product',
        title: '4. Select Product',
        type: 'reference',
        to: [{ type: 'product' }],
        validation: rule => rule.required(),
        options: {
            filter: ({ document }) => {
                // Filter by the most specific parent selected
                if (document?.systemType) {
                    return {
                        filter: 'systemType._ref == $sysId',
                        params: { sysId: (document.systemType as any)._ref }
                    }
                }
                if (document?.subCategory) {
                    return {
                        filter: 'subCategory._ref == $subId',
                        params: { subId: (document.subCategory as any)._ref }
                    }
                }
                return { filter: '!defined(_id)' }
            }
        },
        description: 'Finally, select the product. List is filtered by the choices above.'
    }),

    // Read-only path visualization (using a string field that implies the path)
    defineField({
        name: 'hierarchyPath',
        title: 'Full Hierarchy Path',
        type: 'string',
        readOnly: true,
        description: 'References: Main > Sub > System > Product',
        // Note: This relies on the Preview to actually SHOW the data, as we can't auto-compute this string easily without a custom component. 
        // But requested by user. We'll leave it generally empty or use it if we add a hook later.
        // For now, the Preview is the best "computed" view.
        hidden: true 
    })
  ],
  preview: {
    select: {
      title: 'product.name',
      subtitle: 'title',
      isActive: 'isActive',
      main: 'mainCategory.name',
      sub: 'subCategory.name',
      sys: 'systemType.name',
      media: 'product.image'
    },
    prepare({ title, subtitle, isActive, main, sub, sys, media }) {
      const path = [main, sub, sys].filter(Boolean).join(' > ');
      const statusObj = isActive ? { title: '✅ Visible' } : { title: '⛔ Hidden' };
      return {
        title: title || 'No Product Selected',
        subtitle: `${statusObj.title} | ${path}`,
        media: media
      }
    }
  }
})
