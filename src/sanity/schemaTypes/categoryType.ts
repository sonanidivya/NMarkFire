import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  // Category Schema
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fieldsets: [
    {name: 'details', title: 'Category Details'},
    {name: 'settings', title: 'Display Settings', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      fieldset: 'details',
      validation: rule => rule.required()
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
      validation: rule => rule.required()
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      fieldset: 'details',
      to: [{type: 'category'}],
      description: 'Select a parent category if this is a subcategory',
    }),
    defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
        fieldset: 'details',
    }),
    defineField({
      name: 'isShowcased',
      title: 'Show on Home Page',
      type: 'boolean',
      fieldset: 'settings',
      description: 'Toggle to display this category in the Core Solutions section on the home page.',
      initialValue: false,
    }),
    defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        fieldset: 'details',
        options: {
            hotspot: true,
        },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'parent.name',
      media: 'image',
    },
    prepare(selection: Record<string, unknown>) {
        const title = selection.title as string;
        const subtitle = selection.subtitle as string;
        const media = selection.media;
        
        return {
            title: title,
            subtitle: subtitle ? `Subcategory of ${subtitle}` : 'Main Category',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            media: media as any
        }
    }
  },
})
