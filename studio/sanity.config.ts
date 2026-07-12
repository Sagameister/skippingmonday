import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {TranslateAction} from './actions/TranslateAction'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'Skipping Mondays Studio',

  projectId: '9mzj9v38',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('song').title('Hero Song Titles'),
            orderableDocumentListDeskItem({type: 'photo', title: 'Photos (Drag to Sort)', S, context}),
            orderableDocumentListDeskItem({type: 'video', title: 'Videos (Drag to Sort)', S, context}),
          ])
    })
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'post') {
        return [...prev, TranslateAction]
      }
      return prev
    }
  }
})
