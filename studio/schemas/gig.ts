import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gig',
  title: 'Gigs',
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
      name: 'city',
      title: 'City',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
    }),
    defineField({
      name: 'soldOut',
      title: 'Sold Out',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isPast',
      title: 'Past Show',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this true if the show has already happened.',
    }),
  ],
  preview: {
    select: {
      title: 'city',
      subtitle: 'venue',
      date: 'date',
    },
    prepare(selection) {
      const {title, subtitle, date} = selection
      return {
        title: `${title} — ${subtitle}`,
        subtitle: date,
      }
    },
  },
})
