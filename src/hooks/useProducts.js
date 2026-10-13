import { useCallback, useEffect, useState } from 'react'
import Papa from 'papaparse'
import { config } from '../config'
import { normalizeHeader, normalizeProducts } from '../utils/products'
import { csvCandidates } from '../utils/sheets'

const SOURCES = csvCandidates(config.csvUrl?.trim() || '/productos.csv')
const TTL = (config.cacheMinutes ?? 5) * 60 * 1000

// Caché en memoria compartida por toda la app: una sola descarga aunque varios
// componentes usen el hook, y sin volver a pedir el CSV al navegar entre páginas.
let cache = { data: null, at: 0, promise: null }

const NOT_PUBLIC = new Error(
  'La hoja de productos no es pública. En Google Sheets usa "Compartir → Cualquier persona con el enlace" o "Archivo → Compartir → Publicar en la web".',
)

async function fetchCsv(url) {
  // Evita que el navegador/CDN de Google entregue una versión vieja del CSV
  const res = await fetch(url + (url.includes('?') ? '&' : '?') + `_=${Date.now()}`)
  if (res.status === 401 || res.status === 403) throw NOT_PUBLIC
  if (!res.ok) throw new Error('No pudimos conectarnos con el catálogo. Revisa tu conexión e inténtalo de nuevo.')
  const text = await res.text()
  // Google devuelve una página de inicio de sesión (HTML) cuando la hoja es privada
  if (/^\s*<(!doctype|html)/i.test(text)) throw NOT_PUBLIC
  return text
}

async function fetchProducts() {
  let lastError
  for (const url of SOURCES) {
    try {
      const text = await fetchCsv(url)
      const { data, meta } = Papa.parse(text, { header: true, skipEmptyLines: 'greedy', transformHeader: normalizeHeader })
      if (!meta.fields?.includes('nombre') || !meta.fields?.includes('precio')) {
        throw new Error('La hoja no tiene las columnas "nombre" y "precio". Revisa los encabezados de la fila 1.')
      }
      return normalizeProducts(data)
    } catch (err) {
      // fetch lanza TypeError ante fallas de red/CORS: probamos la siguiente URL
      lastError = err instanceof TypeError ? new Error('No pudimos conectarnos con el catálogo. Revisa tu conexión e inténtalo de nuevo.') : err
    }
  }
  throw lastError
}

export function loadProducts({ force = false } = {}) {
  const fresh = cache.data && Date.now() - cache.at < TTL
  if (!force && fresh) return Promise.resolve(cache.data)
  if (!force && cache.promise) return cache.promise

  cache.promise = fetchProducts()
    .then((data) => {
      cache = { data, at: Date.now(), promise: null }
      return data
    })
    .catch((err) => {
      cache.promise = null
      throw err
    })
  return cache.promise
}

export function useProducts() {
  const [state, setState] = useState(() => ({
    products: cache.data ?? [],
    loading: !cache.data,
    error: null,
  }))

  const load = useCallback((force = false) => {
    setState((s) => ({ ...s, loading: !cache.data || force, error: null }))
    return loadProducts({ force })
      .then((products) => setState({ products, loading: false, error: null }))
      .catch((error) => setState((s) => ({ ...s, loading: false, error })))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, retry: () => load(true) }
}
