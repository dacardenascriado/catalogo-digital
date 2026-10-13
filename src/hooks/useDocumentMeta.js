import { useEffect } from 'react'
import { config } from '../config'

const DEFAULT_TITLE = document.title

/** Actualiza título y meta descripción por página (útil al compartir y para SEO). */
export function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${config.storeName}` : DEFAULT_TITLE
    const meta = document.querySelector('meta[name="description"]')
    const previous = meta?.getAttribute('content')
    if (meta && description) meta.setAttribute('content', description.slice(0, 160))
    return () => {
      document.title = DEFAULT_TITLE
      if (meta && previous) meta.setAttribute('content', previous)
    }
  }, [title, description])
}
