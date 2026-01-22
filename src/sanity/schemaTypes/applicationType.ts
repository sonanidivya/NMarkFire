import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon, SearchIcon } from '@sanity/icons'

export const applicationType = defineType({
  name: 'application',
  title: 'Application',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fieldsets: [
    { name: 'details', title: 'Details' },
    { name: 'seo', title: 'SEO & Metadata', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'details',
      validation: (rule) => rule.required(),
      description: 'e.g. "Server Rooms", "Commercial Kitchens"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      fieldset: 'details',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name (Lucide)',
      type: 'string',
      fieldset: 'details',
      description: 'Name of the Lucide icon to use (e.g. "Server", "ChefHat", "Factory").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      fieldset: 'details',
      initialValue: 0,
      description: 'Higher numbers appear first in the list.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      fieldset: 'details',
      initialValue: true,
      description: 'Toggle to hide from the website without deleting.',
    }),
    
    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      fieldset: 'seo',
      description: 'Overrides default title for search engines.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      fieldset: 'seo',
      rows: 3,
      description: 'Description for search results and social sharing.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'New Application',
        subtitle: subtitle ? `/${subtitle}` : 'No slug',
        media: CheckmarkCircleIcon,
      }
    },
  },
})
