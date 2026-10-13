# Mundo Tecnológico Virtual — Catálogo web con pedido por WhatsApp

Tienda tipo catálogo para **Mundo Tecnológico Virtual** (firma **D&A**). Los productos se administran
desde una hoja de **Google Sheets**, los clientes arman su carrito y el pedido llega listo a tu
**WhatsApp**. Sin servidor, sin base de datos y gratis en **Vercel**.

Hecha con React + Vite, Tailwind CSS, React Router, PapaParse y Lucide.

---

## 1. Crear y publicar la hoja de Google Sheets

1. Entra a [sheets.new](https://sheets.new) y crea una hoja nueva (por ejemplo "Catálogo Mundo Tecnológico").
2. En la **fila 1** escribe exactamente estos encabezados (no importan mayúsculas ni tildes):

| id | nombre | descripcion | precio | precio_anterior | categoria | marca | imagenes | disponible | destacado | etiqueta |
|----|--------|-------------|--------|-----------------|-----------|-------|----------|------------|-----------|----------|
| 1 | Parlante Karaoke con Micrófono | ¡Que la música nunca falte…! | 89900 | 119900 | Parlantes | Genérico | https://drive.google.com/file/d/…/view | SI | SI | Más vendido |
| 2 | iPhone 15 128 GB | Pantalla de 6,1"… | 3.899.000 | | Celulares | Apple | url1 \| url2 | SI | NO | Nuevo |

Qué va en cada columna:

| Columna | Obligatoria | Detalle |
|---|---|---|
| `id` | Recomendada | Identificador único (1, 2, 3…). Es parte del enlace del producto: **no lo cambies** una vez compartido. |
| `nombre` | **Sí** | Nombre del producto. Filas sin nombre se ignoran. |
| `descripcion` | No | Puedes usar saltos de línea dentro de la celda (`Ctrl + Enter`); se respetan en la página. |
| `precio` | **Sí** | Acepta `89900`, `89.900`, `$89.900` o `1,299,000`. |
| `precio_anterior` | No | Si es mayor que el precio, se muestra tachado y con % de descuento. |
| `categoria` | No | Celulares, Audífonos, Parlantes, Cargadores, Fundas, Smartwatch, Accesorios… (crea las que quieras). |
| `marca` | No | Alimenta el filtro por marca. |
| `imagenes` | No | Una o varias URLs separadas por `\|`. La primera es la portada. Sin imagen se muestra un placeholder de la marca. |
| `disponible` | No | `SI` / `NO`. Los agotados se siguen viendo, marcados como "Agotado" y sin botón de agregar. Vacío = `SI`. |
| `destacado` | No | `SI` para mostrarlo en la sección "Destacados" (máximo 8). |
| `etiqueta` | No | Texto corto: "Nuevo", "Oferta", "Más vendido"… |

> El orden "Más recientes" usa el orden de las filas: **las últimas filas de la hoja son las más nuevas**.

3. Publica la hoja: **Archivo → Compartir → Publicar en la web**.
   - En "Vínculo" elige la **pestaña** de los productos y el formato **Valores separados por comas (.csv)**.
   - Clic en **Publicar** y copia la URL (termina en `output=csv`).
4. Pega esa URL en `src/config.js` → `csvUrl` (ver sección 3).

**Alternativa rápida:** también puedes pegar en `csvUrl` el enlace normal de **Compartir**
(`…/spreadsheets/d/ID/edit?usp=sharing`), siempre que el acceso sea
**"Cualquier persona con el enlace" (Lector)**. La tienda lo convierte sola a CSV.
Si la hoja está restringida (solo tú o solo tu organización), la tienda muestra
"La hoja de productos no es pública".

Los cambios en la hoja tardan **unos 5 minutos** en reflejarse (caché de Google). En la tienda,
los productos quedan además en caché en memoria durante `cacheMinutes` (5 por defecto).

💡 Tienes un CSV de ejemplo en `public/productos.csv`: puedes importarlo en Sheets con
**Archivo → Importar → Subir** para empezar con la plantilla ya hecha.

---

## 2. Subir imágenes y obtener sus enlaces

**Opción A — Google Drive (la más fácil)**

1. Sube las fotos a una carpeta de Drive.
2. Clic derecho en la imagen → **Compartir** → en "Acceso general" elige **Cualquier persona con el enlace** (Lector).
3. **Copiar vínculo** y pégalo tal cual en la columna `imagenes`
   (ej. `https://drive.google.com/file/d/1AbC…/view?usp=sharing`).
   La tienda lo convierte automáticamente a enlace de imagen directa.

> Si la imagen no aparece, casi siempre es porque el archivo no está compartido como "Cualquier persona con el enlace".

**Opción B — Dentro del proyecto**

Copia la imagen en `public/productos/` (por ejemplo `public/productos/airpods.webp`) y en la hoja
escribe `/productos/airpods.webp`. Se publica junto con la web en cada despliegue.

**Opción C — Cualquier URL pública** de imagen (Cloudinary, ImgBB, Imgur…) que termine en `.jpg`, `.png` o `.webp`.

Recomendaciones: fotos **cuadradas**, mínimo 800×800 px, fondo claro y de menos de 300 KB
(puedes comprimirlas gratis en [squoosh.app](https://squoosh.app)).

---

## 3. Configurar WhatsApp y los datos de la tienda

Todo está en **`src/config.js`**:

```js
whatsapp: '573001234567',      // 57 (Colombia) + número, sin "+" ni espacios
currency: { code: 'COP', locale: 'es-CO', decimals: 0 },
csvUrl: 'https://docs.google.com/spreadsheets/d/e/…/pub?output=csv',
instagram: 'https://www.instagram.com/techtiendaonline',
hero: { slogan: 'Tecnología con estilo', … },
```

- **WhatsApp:** formato internacional solo con números. Colombia `57…`, México `52…`, EE. UU. `1…`.
  ⚠️ El número que viene es de ejemplo (`573000000000`): **cámbialo antes de publicar.**
- **Moneda:** México → `{ code: 'MXN', locale: 'es-MX', decimals: 2 }`; dólares → `{ code: 'USD', locale: 'en-US', decimals: 2 }`.
- **Textos del hero**, mensaje del botón flotante y orden de las categorías también se editan ahí.
- **Logo:** reemplaza `public/logo.jpg` (cuadrado) y ejecuta `npm run icons` para regenerar favicon,
  logo optimizado e imagen para compartir (`og-image.jpg`).
- **Dominio para compartir:** en el archivo `.env` pon tu dominio final en `VITE_SITE_URL`
  (WhatsApp e Instagram necesitan la URL completa de la imagen de vista previa).

El pedido llega así a WhatsApp:

```
Hola Mundo Tecnológico Virtual, quiero hacer este pedido:

- 1 x Parlante Karaoke Inalámbrico con Micrófono — $89.900
- 2 x iPhone 15 128 GB — $7.798.000

Total: $7.887.900

Nombre: Laura Gómez
Teléfono: 300 123 4567
Entrega: Domicilio
Dirección: Cra 7 # 45-10, Bogotá
Notas: Ninguna
```

---

## 4. Correr el proyecto en local

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

Otros comandos:

```bash
npm run build    # genera la versión de producción en /dist
npm run preview  # sirve /dist para probarla
npm run icons    # regenera favicons y og-image desde public/logo.jpg
```

Con `csvUrl` vacío la tienda usa el archivo de ejemplo `public/productos.csv`.

---

## 5. Desplegar gratis en Vercel

1. Crea una cuenta gratuita en [github.com](https://github.com) y sube este proyecto a un repositorio nuevo
   (con GitHub Desktop: *File → Add local repository → Publish*).
2. Entra a [vercel.com](https://vercel.com) y regístrate **con tu cuenta de GitHub**.
3. Clic en **Add New… → Project** y elige el repositorio.
4. Vercel detecta Vite solo. Verifica:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. En **Environment Variables** agrega `VITE_SITE_URL` con la URL que tendrá tu tienda
   (por ejemplo `https://mundotecnologicovirtual.vercel.app`).
6. Clic en **Deploy**. En 1–2 minutos tendrás tu enlace público.
7. Pon ese enlace en la **biografía de Instagram** 🎉

Cada vez que subas cambios al repositorio, Vercel vuelve a publicar automáticamente.
**Los productos no requieren redesplegar**: se editan directo en Google Sheets.

El archivo `vercel.json` ya incluye la configuración para que los enlaces de productos y categorías
(`/producto/1/...`, `/categoria/celulares`) funcionen al abrirlos directamente o al compartirlos.

---

## Estructura del proyecto

```
public/
  logo.jpg              logo original (fuente de los íconos)
  productos.csv         8 productos de ejemplo
  productos/            imágenes locales de productos
src/
  config.js             ← datos de la tienda
  components/           Header, Hero, ProductCard, CartDrawer, CheckoutForm, Gallery, Filters…
  context/              carrito (localStorage) y avisos (toasts)
  hooks/                useProducts (CSV + caché), useOverlay, useDocumentMeta
  pages/                Home (catálogo / categoría) y ProductPage (detalle)
  utils/                limpieza de datos, precios, Google Drive, mensaje de WhatsApp
scripts/generate-icons.mjs
```

URLs compartibles:

- Producto: `/producto/<id>/<nombre>`
- Categoría: `/categoria/celulares`
- Búsqueda, marca y orden: `/?q=samsung&marca=Samsung&orden=precio-asc`

---

<p align="center"><em>D&amp;A</em></p>
