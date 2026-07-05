import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      validation: Rule => Rule.required(),
    }),
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
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body Content (English)',
      type: 'text',
      rows: 6,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bodyDe',
      title: 'Body Content (German)',
      type: 'text',
      rows: 6,
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'titleEn',
      date: 'date',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, date, media} = selection
      return {
        title,
        subtitle: date,
        media,
      }
    },
  },
})
