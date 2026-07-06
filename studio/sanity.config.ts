import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {TranslateAction} from './actions/TranslateAction'

export default defineConfig({
  name: 'default',
  title: 'Skipping Mondays Studio',

  projectId: '9mzj9v38',
  dataset: 'production',

  plugins: [structureTool()],

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
