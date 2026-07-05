import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'YOUR_SANITY_PROJECT_ID',
    dataset: 'production'
  }
})
