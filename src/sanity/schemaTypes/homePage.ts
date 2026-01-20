import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page Configuration',
  type: 'document',
  // Singleton configuration will be handled in structure/index.ts
  icon: HomeIcon,
  fieldsets: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'showcase', title: 'Dynamic Showcase' },
    { name: 'featured', title: 'Featured Solutions' },
    { name: 'innovation', title: 'New Technology' },
    { name: 'about', title: 'About Page', options: { collapsible: true } }, 
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      fieldset: 'hero',
      initialValue: 'Complete Fire Safety & Industrial Solutions',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subtitle',
      type: 'text',
      fieldset: 'hero',
      rows: 3,
      initialValue: 'NMarkFire provides state-of-the-art fire suppression systems, lifting equipment, and safety gear designed for reliability.',
    }),
    defineField({
      name: 'heroAnimatedWords',
      title: 'Hero Animated Words',
      type: 'array',
      fieldset: 'hero',
      description: 'Words that cycle in the red highlighted text',
      of: [{ type: 'string' }],
      initialValue: ['Safety', 'Protection', 'Reliability', 'Innovation']
    }),

    // Showcase (Driven by Main Categories, but we can add title)
    defineField({
      name: 'showcaseTitle',
      title: 'Showcase Section Title',
      type: 'string',
      fieldset: 'showcase',
      initialValue: 'Browse by Category',
    }),
    defineField({
      name: 'showcaseDescription',
      title: 'Showcase Description',
      type: 'text',
      rows: 2,
      fieldset: 'showcase',
    }),

    // Featured Solutions
    defineField({
      name: 'featuredTitle',
      title: 'Featured Section Title',
      type: 'string',
      fieldset: 'featured',
      initialValue: 'Featured Solutions',
    }),
    defineField({
      name: 'featuredItems',
      title: 'Featured Items',
      type: 'array',
      fieldset: 'featured',
      description: 'Select Categories or Products to feature.',
      of: [
        { 
          type: 'reference', 
          to: [
            { type: 'product' }, 
            { type: 'variant' },
            { type: 'subCategory' },
            { type: 'systemType' }
          ],
          options: {
            filter: `
              _type == "product" || 
              _type == "variant" || 
              (_type == "subCategory" && !defined(*[_type == "systemType" && parent._ref == @._id][0]._id) && !defined(*[_type == "product" && subCategory._ref == @._id][0]._id)) ||
              (_type == "systemType" && !defined(*[_type == "variant" && parent._ref == @._id][0]._id) && !defined(*[_type == "product" && systemType._ref == @._id][0]._id))
            `
          }
        }
      ],
      validation: rule => rule.max(6).warning('Keep it under 6 for best layout.')
    }),

    // Innovation / New Tech
    defineField({
      name: 'newTechnology',
      title: 'New Technology Highlights',
      type: 'array',
      fieldset: 'innovation',
      description: 'Products marked as "New Technology" or "Innovation".',
      of: [
        { 
          type: 'reference', 
          to: [
            { type: 'product' }, 
            { type: 'variant' },
            { type: 'subCategory' },
            { type: 'systemType' }
          ],
          options: {
            filter: `
              _type == "product" || 
              _type == "variant" || 
              (_type == "subCategory" && !defined(*[_type == "systemType" && parent._ref == @._id][0]._id) && !defined(*[_type == "product" && subCategory._ref == @._id][0]._id)) ||
              (_type == "systemType" && !defined(*[_type == "variant" && parent._ref == @._id][0]._id) && !defined(*[_type == "product" && systemType._ref == @._id][0]._id))
            `
          }
        }
      ]
    }),

    // About Page - Leadership
    defineField({
      name: 'leaders',
      title: 'Leadership Team',
      type: 'array',
      fieldset: 'about',
      description: 'Add team members to display on the About page.',
      of: [{ type: 'reference', to: [{ type: 'leader' }] }]
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'Meta Title',
      type: 'string',
      fieldset: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      fieldset: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page Configuration',
      }
    },
  },
})
