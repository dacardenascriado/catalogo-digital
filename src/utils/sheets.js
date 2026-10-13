/**
 * Acepta cualquier enlace de Google Sheets y devuelve las URLs CSV a intentar, en orden.
 *  - Publicado en la web (…/d/e/XXX/pubhtml o …/pub?output=csv) → CSV publicado
 *  - Enlace de compartir / edición (…/d/ID/edit?usp=sharing#gid=0) → export CSV y, de respaldo, gviz
 *  - Cualquier otra URL (o un .csv local) se usa tal cual.
 */
export function csvCandidates(raw) {
  const url = (raw || '').trim()
  if (!url.includes('docs.google.com/spreadsheets')) return [url]

  const gid = url.match(/[#&?]gid=(\d+)/)?.[1]

  const published = url.match(/\/spreadsheets\/d\/e\/([\w-]+)/)
  if (published) {
    return [`https://docs.google.com/spreadsheets/d/e/${published[1]}/pub?output=csv${gid ? `&gid=${gid}` : ''}`]
  }

  const id = url.match(/\/spreadsheets\/d\/([\w-]+)/)?.[1]
  if (!id) return [url]
  return [
    `https://docs.google.com/spreadsheets/d/${id}/export?format=csv${gid ? `&gid=${gid}` : ''}`,
    `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv${gid ? `&gid=${gid}` : ''}`,
  ]
}
