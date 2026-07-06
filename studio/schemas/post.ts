import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          {title: 'News Article', value: 'news'},
          {title: 'Gig / Show', value: 'gig'}
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required(),
      initialValue: 'news'
    }),
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
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body Content (English)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'bodyDe',
      title: 'Body Content (German)',
      type: 'text',
      rows: 6,
    }),
    
    // Gig-specific fields (hidden if postType is news)
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g. 20:00 or Doors: 19:30',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'priceEn',
      title: 'Price (English)',
      type: 'string',
      description: 'e.g. Free, €15, or €15 at the door',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'priceDe',
      title: 'Price (German)',
      type: 'string',
      description: 'z.B. Freier Eintritt, 15 € oder 15 € Abendkasse',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'soldOut',
      title: 'Sold Out',
      type: 'boolean',
      initialValue: false,
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'isPast',
      title: 'Past Show',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this true if the show has already happened.',
      hidden: ({document}) => document?.postType !== 'gig'
    }),
    defineField({
      name: 'locationType',
      title: 'Location Type',
      type: 'string',
      options: {
        list: [
          {title: 'Indoors', value: 'indoors'},
          {title: 'Outdoors', value: 'outdoors'}
        ]
      },
      hidden: ({document}) => document?.postType !== 'gig'
    }),
  ],
  preview: {
    select: {
      titleEn: 'titleEn',
      postType: 'postType',
      date: 'date',
      city: 'city',
      venue: 'venue',
      media: 'coverImage'
    },
    prepare(selection) {
      const {titleEn, postType, date, city, venue, media} = selection;
      const isGig = postType === 'gig';
      const formattedDate = date ? date.split('-').reverse().join('.') : '';
      return {
        title: isGig ? `${city || 'Unknown City'} — ${venue || 'Unknown Venue'}` : (titleEn || 'Untitled News'),
        subtitle: `${isGig ? '[Gig]' : '[News]'} ${formattedDate}`,
        media
      }
    }
  }
})
