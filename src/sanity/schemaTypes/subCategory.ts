import { defineField, defineType } from 'sanity'
import { FolderIcon } from '@sanity/icons'
import { PremiumPreview } from '../components/PremiumPreview'

export const subCategory = defineType({
  name: 'subCategory',
  title: 'Sub Category',
  type: 'document',
  icon: FolderIcon,
  fieldsets: [
    { name: 'header', title: 'Basic Information', options: { columns: 2 } }, 
    { name: 'details', title: 'Content' },
    { name: 'hierarchy', title: 'Hierarchy Assignment', options: { columns: 2 } },
    { name: 'seo', title: 'SEO & Metadata', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Sub Category Name',
      type: 'string',
      fieldset: 'header',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      fieldset: 'header',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      fieldset: 'hierarchy',
      initialValue: 0,
      hidden: true,
    }),
    defineField({
      name: 'parent',
      title: 'Parent Main Category',
      type: 'reference',
      to: [{ type: 'mainCategory' }],
      fieldset: 'hierarchy',
      validation: (rule) => rule.required(),
      description: 'The Main Category this belongs to.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      fieldset: 'details',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fieldset: 'details',
      options: { hotspot: true },
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
      subtitle: 'parent.name',
      media: 'image',
    },
    // @ts-ignore
    components: {
        preview: PremiumPreview
    }
  },
})
