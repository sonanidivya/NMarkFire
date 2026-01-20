import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'
import { PremiumPreview } from '../components/PremiumPreview'

export const mainCategory = defineType({
  name: 'mainCategory',
  title: 'Main Category',
  type: 'document',
  icon: HomeIcon,
  fieldsets: [
    { name: 'details', title: 'Category Details' },
    { name: 'visibility', title: 'Visibility & Control' },
    { name: 'seo', title: 'SEO & Metadata', options: { collapsible: true, collapsed: true } },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    }
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      fieldset: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      fieldset: 'details',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      fieldset: 'details',
      description: 'Used for Home Page cards and SEO.',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      fieldset: 'details',
      options: { 
        hotspot: true,
      },
      description: 'High-quality image for the category card. (Max: 15MB. Formats: JPG, PNG, WEBP, SVG).',
    }),
    defineField({
        name: 'icon',
        title: 'Icon (Lucide Name)',
        type: 'string',
        fieldset: 'details',
        description: 'Name of the Lucide icon to use (e.g., "FireExtinguisher", "ShieldCheck").'
    }),
    // Visibility
    defineField({
      name: 'showOnWebsite',
      title: 'Show on Website',
      type: 'boolean',
      fieldset: 'visibility',
      initialValue: true,
    }),
    defineField({
      name: 'showOnHome',
      title: 'Show on Home Page',
      type: 'boolean',
      fieldset: 'visibility',
      initialValue: false,
    }),
    defineField({
      name: 'showOnNav',
      title: 'Show in Navigation',
      type: 'boolean',
      fieldset: 'visibility',
      initialValue: true,
      description: 'Check to include in the main website navigation menu.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      fieldset: 'visibility',
      initialValue: 0,
      description: 'Lower numbers appear first.',
    }),
    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      fieldset: 'seo',
      description: 'Overrides default title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      fieldset: 'seo',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      showOnHome: 'showOnHome',
      showOnNav: 'showOnNav',
      media: 'image',
    },
    // @ts-ignore
    components: {
        preview: PremiumPreview
    }
  },
})
