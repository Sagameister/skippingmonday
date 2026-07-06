import { useState } from 'react'
import { useDocumentOperation } from 'sanity'

export function TranslateAction(props: any) {
  const { id, type, published, draft, onComplete } = props
  const { patch } = useDocumentOperation(id, type)
  const [isTranslating, setIsTranslating] = useState(false)

  // Get current document data
  const doc = draft || published
  if (!doc) return null

  const handle = async () => {
    setIsTranslating(true)
    try {
      const titleEn = doc.titleEn
      const bodyEn = doc.bodyEn
      
      const textsToTranslate = []
      const fields = []

      if (titleEn) {
        textsToTranslate.push(titleEn)
        fields.push('titleDe')
      }
      if (bodyEn) {
        textsToTranslate.push(bodyEn)
        fields.push('bodyDe')
      }

      if (textsToTranslate.length === 0) {
        alert('Please fill out the English Title or Body Content first!')
        setIsTranslating(false)
        onComplete()
        return
      }

      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': 'DeepL-Auth-Key 6f95895f-c90d-4b6c-b4b7-c631fe79b629:fx',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textsToTranslate,
          target_lang: 'DE'
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.message || `DeepL API error: ${response.status}`);
      }

      const data = await response.json()
      const translations = data.translations

      const patches: Record<string, any> = {}
      fields.forEach((field, index) => {
        patches[field] = translations[index].text
      })

      patch.execute([{ set: patches }])
      alert('Translation complete! German fields updated.')
    } catch (err: any) {
      console.error('Translation error:', err)
      alert(`Translation failed: ${err.message}`)
    } finally {
      setIsTranslating(false)
      onComplete()
    }
  }

  return {
    label: isTranslating ? 'Translating...' : 'Translate EN ➔ DE',
    disabled: isTranslating,
    onHandle: handle
  }
}
