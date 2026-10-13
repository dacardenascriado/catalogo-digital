// Genera favicons, logo optimizado e imagen Open Graph a partir de public/logo.jpg.
// Uso: npm run icons   (vuelve a correrlo si cambias el logo)
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (f) => path.join(root, 'public', f)
const src = pub('logo.jpg')

// Recorte circular: el logo es un medallón, así que el favicon se ve mejor redondo.
const circleMask = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`)

async function roundIcon(size, out) {
  await sharp(src)
    .resize(size, size)
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
    .png()
    .toFile(pub(out))
}

await roundIcon(32, 'favicon-32.png')
await roundIcon(192, 'icon-192.png')
await sharp(src).resize(180, 180).png().toFile(pub('apple-touch-icon.png'))

// Logo optimizado para header y hero (el original pesa ~200 KB)
await sharp(src).resize(160, 160).webp({ quality: 82 }).toFile(pub('logo-160.webp'))
await sharp(src).resize(560, 560).webp({ quality: 82 }).toFile(pub('logo-560.webp'))

// Open Graph 1200x630: logo centrado sobre fondo mármol rosado
const logo = await sharp(src).resize(560, 560).toBuffer()
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#F8ECE8' } })
  .composite([{ input: logo, top: 35, left: 320 }])
  .jpeg({ quality: 85 })
  .toFile(pub('og-image.jpg'))

console.log('Íconos generados en /public')
