/**
 * Convierte enlaces de Google Drive a una URL de imagen directa.
 * Soporta:
 *   https://drive.google.com/file/d/ID/view?usp=sharing
 *   https://drive.google.com/open?id=ID
 *   https://drive.google.com/uc?id=ID&export=download
 *   https://drive.google.com/thumbnail?id=ID
 * Cualquier otra URL se devuelve tal cual.
 */
export function toDirectImageUrl(raw) {
  const url = (raw || '').trim()
  if (!url) return ''
  if (!/drive\.google\.com|docs\.google\.com/.test(url)) return url

  const id =
    url.match(/\/file\/d\/([\w-]{10,})/)?.[1] ||
    url.match(/[?&]id=([\w-]{10,})/)?.[1] ||
    url.match(/\/d\/([\w-]{10,})/)?.[1]

  // lh3.googleusercontent.com sirve la imagen sin la página intermedia de Drive.
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1200` : url
}

/**
 * URL alternativa para imágenes de Drive: si lh3 falla (Drive limita las peticiones
 * con un error 429), se reintenta con el endpoint de miniaturas de Drive.
 */
export function fallbackImageUrl(url) {
  const id = url?.match(/lh3\.googleusercontent\.com\/d\/([\w-]+)/)?.[1]
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1200` : null
}

/** "url1 | url2|url3" → ['url1', 'url2', 'url3'] ya convertidas */
export function parseImageList(raw) {
  return (raw || '')
    .split('|')
    .map(toDirectImageUrl)
    .filter(Boolean)
}
