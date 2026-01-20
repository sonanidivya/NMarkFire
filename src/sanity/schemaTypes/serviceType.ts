import {ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
        name: 'shortDescription',
        title: 'Short Description',
        type: 'text',
    }),
    defineField({
        name: 'features',
        title: 'Features',
        type: 'array',
        of: [{type: 'string'}],
    }),
    defineField({
        name: 'iconName',
        title: 'Icon Name (Lucide)',
        type: 'string',
    }),
  ],
})
