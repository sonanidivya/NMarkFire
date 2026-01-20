import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export const trustedByItem = defineType({
  name: 'trustedByItem',
  title: 'Trusted By',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Used for alt text and fallback display.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      validation: (rule) => rule.required(),
      options: {
        hotspot: true,
      },
      description: 'Upload a transparent PNG or SVG for best results.',
    }),
    defineField({
      name: 'link',
      title: 'Website Link',
      type: 'url',
      description: 'Optional. Links to the partner\'s website.',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this logo on the website.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true,
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      active: 'isActive',
    },
    prepare({ title, media, active }) {
        return {
            title,
            media,
            subtitle: active ? 'Active' : 'Inactive',
        }
    }
  },
})
