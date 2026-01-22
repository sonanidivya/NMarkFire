import { defineField, defineType } from 'sanity'
import { DatabaseIcon } from '@sanity/icons'
import { PremiumPreview } from '../components/PremiumPreview'
import { SolidObjectInput } from '../components/SolidObjectInput'
import { SolidStringInput } from '../components/SolidStringInput'
import { CertificationsInput } from '../components/CertificationsInput'

export const systemType = defineType({
  name: 'systemType',
  title: 'System Type',
  type: 'document',
  icon: DatabaseIcon,
  fieldsets: [
    { name: 'details', title: 'Details' },
    { name: 'hierarchy', title: 'Hierarchy' },
    { name: 'seo', title: 'SEO & Metadata', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'System Type Name',
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
      title: 'Parent Sub Category',
      type: 'reference',
      to: [{ type: 'subCategory' }],
      fieldset: 'hierarchy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      fieldset: 'details',
      rows: 2,
    }),
    defineField({
      name: 'image',
      title: 'System Type Image',
      type: 'image',
      fieldset: 'details',
      options: { hotspot: true },
      description: 'Image for the card display.',
    }),
    defineField({
      name: 'hasVariants',
      title: 'Has Variants?',
      type: 'boolean',
      fieldset: 'details',
      initialValue: false,
      description: 'Turn ON if this system type has distinct variants (e.g. Portable vs. Automatic). If OFF, the Product creation form will hide/disable the Variant selector.',
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
          components: { input: SolidObjectInput },
          fields: [
            {name: 'label', type: 'string', title: 'Label', components: { input: SolidStringInput }},
            {name: 'value', type: 'string', title: 'Value', components: { input: SolidStringInput }}
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
                    // media: TagIcon // Disabled
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
      title: 'Key Features',
      type: 'array',
      fieldset: 'details',
      of: [
        {
          type: 'object',
          title: 'Feature',
          components: { input: SolidObjectInput },
          fields: [
            {name: 'title', type: 'string', title: 'Title', components: { input: SolidStringInput }},
            {name: 'description', type: 'text', title: 'Description', rows: 2, components: { input: SolidStringInput }},
            {name: 'icon', type: 'string', title: 'Icon Name (Lucide)', components: { input: SolidStringInput }}
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
                    // media: TagIcon // Disabled
                }
            }
          }
        }
      ],
      options: {
        layout: 'grid'
      },
      description: 'Highlight key benefits (e.g. "Zero Residue", "24/7 Protection").'
    }),
    defineField({
      name: 'applicationRefs',
      title: 'Applications (Strict Link)',
      type: 'array',
      fieldset: 'details',
      of: [{type: 'reference', to: [{type: 'application'}]}],
      description: 'Link this system to specific applications. PREFERRED: Link to Variants instead if they exist.',
      validation: rule => rule.custom(async (value, context) => {
         const doc = context.document as any;
         if (!doc._id) return true;
         
         const client = context.getClient({apiVersion: '2023-01-01'});
         // Check if this system has any children (variants)
         const childCount = await client.fetch(`count(*[_type == "variant" && parent._ref == $id])`, { id: doc._id.replace("drafts.", "") });
         
         if (childCount > 0 && value && value.length > 0) {
            return "Warning: This System has Variants. You should usually attach applications to the specific Variants instead (Leaf Nodes).";
         }
         return true;
      })
    }),
    defineField({
      name: 'applications',
      title: 'Ideal Applications (Legacy)',
      type: 'array',
      fieldset: 'details',
      of: [
        {
          type: 'object',
          title: 'Application',
          components: { input: SolidObjectInput },
          fields: [
            {name: 'name', type: 'string', title: 'Application Name', components: { input: SolidStringInput }},
            {name: 'image', type: 'image', title: 'Image', options: {hotspot: true}}
          ],
          preview: {
            select: {
                title: 'name',
                media: 'image'
            },
            prepare({ title, media }) {
                return {
                    title: title || 'New Application',
                    // media: media // Disabled to force Text Card view
                }
            }
          }
        }
      ],
      options: {
        layout: 'grid'
      },
      description: 'Where should this be used? (e.g. Server Rooms, Kitchens)'
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
