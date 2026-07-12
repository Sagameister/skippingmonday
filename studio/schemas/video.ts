import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'video',
  title: 'Videos',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'video'}),
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
  ],
  preview: {
    select: {
      title: 'titleEn',
    },
  },
})
