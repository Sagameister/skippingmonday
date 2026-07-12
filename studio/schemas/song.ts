import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'song',
  title: 'Hero Song Titles',
  type: 'document',
  fields: [
    defineField({
      name: 'titleEn',
      title: 'Title / Label (English)',
      type: 'string',
      description: 'e.g. “Call In Sad” — out now or Hamburg — Molotow · Sep 19',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'titleDe',
      title: 'Title / Label (German)',
      type: 'string',
      description: 'e.g. „Call In Sad“ — jetzt draußen or Hamburg — Molotow · 19. Sep',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categoryEn',
      title: 'Category Label (English)',
      type: 'string',
      description: 'e.g. Upcoming gig, New release, Announcement',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categoryDe',
      title: 'Category Label (German)',
      type: 'string',
      description: 'e.g. Nächstes Konzert, Neue Single, Ankündigung',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured in Homepage Slider',
      type: 'boolean',
      initialValue: true,
      description: 'If checked, this item will appear in the cycling text slider on the homepage hero section.',
    }),
  ],
  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'categoryEn',
    },
  },
})
