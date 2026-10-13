import { parseImageList } from './images'
import { slugify } from './format'

/** Normaliza encabezados: " Precio Anterior " → "precio_anterior", "Imágenes" → "imagenes" */
export function normalizeHeader(header) {
  return slugify(header).replace(/-/g, '_')
}

/**
 * Convierte precios escritos de muchas formas a número:
 * "$1.299.000" "1,299,000" "1299000" "COP 89.900" "$ 19,99" "1.299,50"
 */
export function parsePrice(raw) {
  if (raw == null) return null
  let s = String(raw).replace(/[^\d.,-]/g, '')
  if (!s || !/\d/.test(s)) return null

  const lastDot = s.lastIndexOf('.')
  const lastComma = s.lastIndexOf(',')

  if (lastDot > -1 && lastComma > -1) {
    // El separador que aparece último es el decimal
    const decimalSep = lastDot > lastComma ? '.' : ','
    const thousandSep = decimalSep === '.' ? ',' : '.'
    s = s.split(thousandSep).join('').replace(decimalSep, '.')
  } else if (lastDot > -1 || lastComma > -1) {
    const sep = lastDot > -1 ? '.' : ','
    const parts = s.split(sep)
    const tail = parts[parts.length - 1]
    // "1.299.000" o "89.900" → miles; "19,99" o "19.5" → decimales
    s = parts.length > 2 || tail.length === 3 ? parts.join('') : parts.join('.')
  }

  const n = Number.parseFloat(s)
  return Number.isFinite(n) && n >= 0 ? n : null
}

const YES = new Set(['si', 'sí', 's', 'yes', 'y', 'true', '1', 'x', 'disponible'])
export function parseBool(raw, fallback = false) {
  const v = String(raw ?? '').trim().toLowerCase()
  if (!v) return fallback
  return YES.has(v)
}

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim()

/** Capitaliza la primera letra para que "celulares" y "Celulares" sean la misma categoría */
const titleCase = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : v)

/**
 * Recibe las filas crudas de PapaParse (con encabezados normalizados)
 * y devuelve productos limpios. Descarta filas vacías o sin nombre/precio válido.
 */
export function normalizeProducts(rows) {
  const seen = new Set()
  const products = []

  rows.forEach((row, index) => {
    const nombre = clean(row.nombre)
    const precio = parsePrice(row.precio)
    if (!nombre || precio == null) return

    let id = clean(row.id) || String(index + 1)
    if (seen.has(id)) id = `${id}-${index}` // ids duplicados en la hoja
    seen.add(id)

    const precioAnterior = parsePrice(row.precio_anterior)

    products.push({
      id,
      slug: slugify(nombre) || id,
      name: nombre,
      description: String(row.descripcion ?? '').trim(),
      price: precio,
      previousPrice: precioAnterior && precioAnterior > precio ? precioAnterior : null,
      category: titleCase(clean(row.categoria)) || 'Otros',
      brand: clean(row.marca),
      images: parseImageList(row.imagenes),
      available: parseBool(row.disponible, true),
      featured: parseBool(row.destacado, false),
      tag: clean(row.etiqueta),
      order: index, // posición en la hoja: las últimas filas son las más recientes
    })
  })

  return products
}

export const SORTS = {
  relevancia: { label: 'Destacados primero' },
  recientes: { label: 'Más recientes' },
  'precio-asc': { label: 'Precio: menor a mayor' },
  'precio-desc': { label: 'Precio: mayor a menor' },
  ofertas: { label: 'Ofertas' },
}

export function sortProducts(list, sort) {
  const arr = [...list]
  // Los agotados siempre van al final
  const avail = (a, b) => Number(b.available) - Number(a.available)
  const discount = (p) => (p.previousPrice ? (p.previousPrice - p.price) / p.previousPrice : 0)

  switch (sort) {
    case 'precio-asc':
      return arr.sort((a, b) => avail(a, b) || a.price - b.price)
    case 'precio-desc':
      return arr.sort((a, b) => avail(a, b) || b.price - a.price)
    case 'recientes':
      return arr.sort((a, b) => avail(a, b) || b.order - a.order)
    case 'ofertas':
      return arr.sort((a, b) => avail(a, b) || discount(b) - discount(a))
    default:
      return arr.sort((a, b) => avail(a, b) || Number(b.featured) - Number(a.featured) || a.order - b.order)
  }
}

const fold = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Búsqueda tolerante a tildes y mayúsculas; todas las palabras deben aparecer */
export function matchesSearch(product, query) {
  const q = fold(query.trim())
  if (!q) return true
  const haystack = fold(`${product.name} ${product.brand} ${product.category} ${product.description} ${product.tag}`)
  return q.split(/\s+/).every((word) => haystack.includes(word))
}
