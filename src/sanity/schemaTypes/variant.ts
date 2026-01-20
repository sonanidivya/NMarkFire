import { defineField, defineType } from 'sanity'
import { ComponentIcon, TagIcon } from '@sanity/icons'
import { PremiumPreview } from '../components/PremiumPreview'
import { SolidObjectInput } from '../components/SolidObjectInput'
import { SolidStringInput } from '../components/SolidStringInput'
import { CertificationsInput } from '../components/CertificationsInput'

export const variant = defineType({
  name: 'variant',
  title: 'Variant',
  type: 'document',
  icon: ComponentIcon,
  fieldsets: [
    { name: 'details', title: 'Details' },
    { name: 'hierarchy', title: 'Hierarchy' },
    { name: 'seo', title: 'SEO & Metadata', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Variant Name',
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
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      fieldset: 'hierarchy',
      initialValue: 0,
      hidden: true,
    }),
    defineField({
      name: 'parent',
      title: 'Parent System Type',
      type: 'reference',
      to: [{ type: 'systemType' }],
      fieldset: 'hierarchy',
      validation: (rule) => rule.required(),
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
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      fieldset: 'details',
      rows: 5,
    }),
    defineField({
      name: 'specifications',
      title: 'Technical Specifications',
      type: 'array',
      fieldset: 'details',
      of: [
        {
          type: 'object',
          title: 'Technical Specification',
          icon: TagIcon,
          components: { input: SolidObjectInput },
          fields: [
            {name: 'label', type: 'string', title: 'Label', components: { input: SolidStringInput } },
            {name: 'value', type: 'string', title: 'Value', components: { input: SolidStringInput } }
          ],
          preview: {
            select: {
                title: 'label',
                subtitle: 'value'
            },
            prepare({ title, subtitle }) {
                return {
                    title: title || 'New Specification',
                    subtitle: subtitle ? `Value: ${subtitle}` : 'No value set',
                    // media: TagIcon // Disabled to force Text Card view in Grid
                }
            }
          }
        }
      ],
      options: {
        layout: 'grid'
      }
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      fieldset: 'details',
      of: [{type: 'string'}],
      components: { input: CertificationsInput },
      description: 'Add certifications (click Quick Add or type custom and hit enter).'
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      fieldset: 'details',
      of: [
        {
          type: 'object',
          title: 'Feature',
          components: { input: SolidObjectInput },
          fields: [
            { name: 'title', type: 'string', title: 'Title', components: { input: SolidStringInput } },
            { name: 'description', type: 'text', title: 'Description', components: { input: SolidStringInput } },
            { name: 'icon', type: 'string', title: 'Icon Name (Lucide)', components: { input: SolidStringInput } },
          ],
          preview: {
            select: {
                title: 'title',
                subtitle: 'description'
            },
            prepare({ title, subtitle }) {
                return {
                    title: title || 'New Feature',
                    subtitle: subtitle || 'No description',
                    // media: TagIcon // Disabled to force Text Card view
                }
            }
          }
        },
      ],
      options: {
        layout: 'grid'
      }
    }),
    defineField({
      name: 'applications',
      title: 'Applications',
      type: 'array',
      fieldset: 'details',
      of: [
        {
          type: 'object',
          title: 'Application',
          components: { input: SolidObjectInput },
          fields: [
            { name: 'name', type: 'string', title: 'Name', components: { input: SolidStringInput } },
            { name: 'image', type: 'image', title: 'Image' }, // Image stays standard input (file upload)
          ],
          preview: {
            select: {
                title: 'name',
                media: 'image'
            },
            prepare({ title, media }) {
                return {
                    title: title || 'New Application',
                    // media: media // Disabled to force Text Card view per "same" request
                }
            }
          }
        },
      ],
      options: {
        layout: 'grid'
      }
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
