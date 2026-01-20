import { defineField, defineType } from 'sanity'
import { MessageCircle } from 'lucide-react'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  icon: MessageCircle,
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The name of the person giving the testimonial.',
    }),
    defineField({
      name: 'authorCompany',
      title: 'Company / Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'authorImage',
        title: 'Author Image',
        type: 'image',
        options: {
            hotspot: true,
        },
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true, 
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'authorCompany',
      media: 'authorImage',
      quote: 'quote'
    },
    prepare({ title, subtitle, media, quote }) {
      return {
        title: title || 'Unknown Author',
        subtitle: subtitle || 'No Company',
        media: media || MessageCircle,
        description: quote
      }
    },
  },
})
