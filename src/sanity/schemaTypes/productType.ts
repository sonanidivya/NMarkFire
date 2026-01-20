import {TrolleyIcon, TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import { PremiumPreview } from '../components/PremiumPreview'
import { SolidObjectInput } from '../components/SolidObjectInput'
import { SolidStringInput } from '../components/SolidStringInput'
import { CertificationsInput } from '../components/CertificationsInput'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TrolleyIcon,
  fieldsets: [
    { 
      name: 'classification', 
      title: 'Step 1: Classification',
      description: 'Select the hierarchy level for this product.',
      options: { columns: 1 } 
    },
    { 
      name: 'details', 
      title: 'Step 2: Product Info',
      description: 'Basic product details.' 
    },
    { 
      name: 'visibility', 
      title: 'Step 3: Visibility & Settings',
      options: { collapsible: true, collapsed: false } 
    },
    { 
      name: 'seo', 
      title: 'Step 4: SEO', 
      options: { collapsible: true, collapsed: true } 
    },
  ],
  orderings: [
    {
        title: 'Display Order',
        name: 'displayOrderAsc',
        by: [{field: 'order', direction: 'asc'}]
    },
    {
        title: 'Name',
        name: 'nameAsc',
        by: [{field: 'name', direction: 'asc'}]
    }
  ],
  fields: [
    // Step 1: Classification
    defineField({
      name: 'mainCategory',
      title: 'Main Category',
      type: 'reference',
      to: [{ type: 'mainCategory' }],
      fieldset: 'classification',
      validation: rule => rule.required(),
      description: 'Level 1: e.g., Fire Extinguishers',
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'reference',
      to: [{ type: 'subCategory' }],
      fieldset: 'classification',
      validation: rule => rule.required(),
      options: {
        filter: ({ document }) => {
          if (!document?.mainCategory) {
            return { filter: '!defined(_id)' } // Disable if no Main selected
          }
          return {
            filter: 'parent._ref == $mainId',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params: { mainId: (document.mainCategory as any)._ref }
          }
        }
      },
      description: 'Level 2: e.g., Clean Agent, Semiautomatic',
    }),
    defineField({
      name: 'systemType',
      title: 'System Type',
      type: 'reference',
      to: [{ type: 'systemType' }],
      fieldset: 'classification',
      // Not required, as some chains might end at Sub
      options: {
        filter: ({ document }) => {
          if (!document?.subCategory) {
            return { filter: '!defined(_id)' }
          }
          return {
            filter: 'parent._ref == $subId',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params: { subId: (document.subCategory as any)._ref }
          }
        }
      },
      description: 'Level 3 (Optional): e.g., Portable, Modular',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'reference',
      to: [{ type: 'variant' }],
      fieldset: 'classification',
      hidden: ({ document }) => !document?.systemType, // Hide if no System Type
      options: {
        filter: ({ document }) => {
          if (!document?.systemType) {
            return { filter: '!defined(_id)' }
          }
          return {
            filter: 'parent._ref == $sysId',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params: { sysId: (document.systemType as any)._ref }
          }
        }
      },
      description: 'Level 4 (Optional)',
      validation: rule => rule.custom(async (value, context) => {
         // 1. If no System Type selected, this field is hidden/irrelevant (handled by hidden callback)
         const doc = context.document as any;
         if (!doc?.systemType?._ref) return true;

         // 2. Fetch the System Type to check 'hasVariants'
         const client = context.getClient({apiVersion: '2023-01-01'});
         const systemType = await client.fetch(`*[_id == $id][0].hasVariants`, { id: doc.systemType._ref });
         
         // 3. Logic
         if (systemType === true && !value) {
            return 'Variant selection is required for this System Type.';
         }
         if (systemType === false && value) {
            return 'This System Type does not support variants. Please remove this selection.';
         }
         
         return true;
      }),
    }),

    // Step 2: Info
    defineField({
      name: 'name',
      title: 'Product Name',
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
      name: 'description',
      title: 'Short Description',
      type: 'text',
      fieldset: 'details',
      rows: 3,
    }),
    defineField({
        name: 'image',
        title: 'Main Image',
        type: 'image',
        fieldset: 'details',
        options: {
            hotspot: true,
        },
        description: 'Best aspect ratio: 4:3 or 1:1. Used in product cards. (Max: 15MB. Formats: JPG, PNG, SVG).',
    }),

    // Features & Specs (Keep these from old schema, they are good)
    defineField({
        name: 'features',
        title: 'Features List',
        type: 'array',
        fieldset: 'details',
        of: [{type: 'string'}],
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
                    { name: 'label', type: 'string', title: 'Label', components: { input: SolidStringInput } },
                    { name: 'value', type: 'string', title: 'Value', components: { input: SolidStringInput } }
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
      name: 'applications',
      title: 'Applications',
      type: 'array',
      fieldset: 'details',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'iconName', type: 'string', title: 'Icon Name (Lucide)' }
          ],
          preview: {
            select: { title: 'name', subtitle: 'iconName' },
          }
        }
      ]
    }),


    // Step 2.5: Premium Content
    defineField({
        name: 'gallery',
        title: 'Image Gallery',
        type: 'array',
        fieldset: 'details',
        of: [{type: 'image', options: {hotspot: true}}],
        description: 'Additional product images for the gallery view.',
    }),
    defineField({
        name: 'fullDescription',
        title: 'Detailed Description',
        type: 'text', 
        fieldset: 'details',
        rows: 6,
        description: 'Detailed explanation of "What it is" and "How it works". Displayed in the About section.',
    }),
    defineField({
        name: 'certifications',
        title: 'Certifications & Trust Badges',
        type: 'array',
        fieldset: 'details',
        of: [{type: 'string'}], 
        components: { input: CertificationsInput },
        description: 'Add certifications (click Quick Add or type custom and hit enter).'
    }),

    // Step 3: Visibility
    defineField({
      name: 'showOnWebsite',
      title: 'Show on Website',
      type: 'boolean',
      fieldset: 'visibility',
      initialValue: true,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      fieldset: 'visibility',
      description: 'Toggle to display in Featured Solutions section on the Products page.',
      initialValue: false,
    }),
    defineField({
      name: 'isNewTechnology',
      title: 'New Technology',
      type: 'boolean',
      fieldset: 'visibility',
      description: 'Mark as "New Technology" (Innovation Spotlight).',
      initialValue: false,
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      fieldset: 'visibility',
      description: 'Short label like "Best Seller", "New", etc.',
    }),
    defineField({
        name: 'order',
        title: 'Display Order',
        type: 'number',
        fieldset: 'visibility',
        initialValue: 0,
    }),

    // SEO
    defineField({name: 'seoTitle', title: 'SEO Title', type: 'string', fieldset: 'seo'}),
    defineField({name: 'seoDescription', title: 'SEO Description', type: 'text', fieldset: 'seo'}),
  ],
  preview: {
    select: {
        title: 'name',
        subtitle: 'mainCategory.name',
        media: 'image',
    },
    // @ts-ignore
    components: {
        preview: PremiumPreview
    }
  },
})
