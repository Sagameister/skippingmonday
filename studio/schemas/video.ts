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
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'titleEn',
      media: 'thumbnail',
    },
  },
})
