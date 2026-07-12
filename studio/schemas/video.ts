import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'video',
  title: 'Videos',
  type: 'document',
  fields: [
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'titleDe',
      title: 'Title (German)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video Link (YouTube/Vimeo)',
      type: 'url',
      description: 'URL of the video to open/play',
      validation: Rule => Rule.required(),
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
      title: 'titleEn',
    },
  },
})
