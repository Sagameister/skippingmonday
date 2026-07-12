import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'photo',
  title: 'Photos',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'captionEn',
      title: 'Caption (English)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'captionDe',
      title: 'Caption (German)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured in Homepage Slider',
      type: 'boolean',
      initialValue: false,
      description: 'If checked, this photo will also appear in the photo slider on the homepage.',
    }),
    defineField({
      name: 'order',
      title: 'Order Position',
      type: 'number',
      description: 'Optional sorting number (e.g., 1, 2, 3). Lower numbers show first.',
      validation: Rule => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'captionEn',
      media: 'image',
    },
  },
})
