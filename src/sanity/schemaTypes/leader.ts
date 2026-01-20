import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const leader = defineType({
  name: 'leader',
  title: 'Leader / Team Member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'role',
      title: 'Role / Designation',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
        name: 'qualification',
        title: 'Qualification',
        type: 'string'
    }),
    defineField({
        name: 'experience',
        title: 'Experience',
        type: 'string'
    }),
    defineField({
        name: 'expertise',
        title: 'Expertise',
        type: 'string'
    }),
    defineField({
        name: 'bio',
        title: 'Role Description',
        type: 'text',
        rows: 3,
        description: 'Describes what they oversee (e.g., "Oversees purchasing strategies...")'
    }),
    defineField({
        name: 'linkedin',
        title: 'LinkedIn URL',
        type: 'url'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image'
    }
  }
})
