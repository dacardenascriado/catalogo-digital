import { config } from '../config'

const formatter = new Intl.NumberFormat(config.currency.locale, {
  style: 'currency',
  currency: config.currency.code,
  minimumFractionDigits: config.currency.decimals,
  maximumFractionDigits: config.currency.decimals,
})

/** 1299000 → "$ 1.299.000" (según moneda configurada) */
export function formatPrice(value) {
  if (value == null || Number.isNaN(value)) return ''
  // Intl usa un espacio duro entre símbolo y número; lo quitamos para un look más limpio.
  return formatter.format(value).replace(/ /g, ' ').replace(/^\$ /, '$')
}

export function discountPercent(price, previous) {
  if (!previous || !price || previous <= price) return 0
  return Math.round(((previous - price) / previous) * 100)
}

export function slugify(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productPath(product) {
  return `/producto/${encodeURIComponent(product.id)}/${product.slug}`
}

export function categoryPath(category) {
  return `/categoria/${slugify(category)}`
}
