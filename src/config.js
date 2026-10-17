// ============================================================
//  Configuración de la tienda — edita aquí tus datos.
// ============================================================

export const config = {
  storeName: 'Mundo Tecnológico Virtual',
  signature: 'D&A',

  instagram: 'https://www.instagram.com/techtiendaonline',
  instagramHandle: '@techtiendaonline',

  // WhatsApp en formato internacional, SOLO números y sin "+".
  // Colombia: 57 + número de 10 dígitos  →  573001234567
  whatsapp: '573002067609',

  // Moneda y formato de precios (ver README para MXN / USD)
  currency: {
    code: 'COP',
    locale: 'es-CO',
    decimals: 0,
  },

  // Enlace de la hoja de Google Sheets: sirve el de "Compartir" o el de "Publicar en la web".
  // Déjala vacía ('') para usar el archivo de ejemplo /public/productos.csv
  csvUrl: 'https://docs.google.com/spreadsheets/d/1ro5d5HHwn4Tcc31H9fmCTSCg4HHHVHpBOaWZ4DJDkd0/edit?usp=sharing',

  // Minutos que los productos quedan en caché en memoria antes de volver a pedirlos
  cacheMinutes: 5,

  // Textos del hero
  hero: {
    eyebrow: 'Tienda online de tecnología',
    title: 'Mundo Tecnológico Virtual',
    slogan: 'Tecnología con estilo',
    description:
      'Celulares, audífonos, accesorios y gadgets seleccionados para ti. Elige, agrega al carrito y haz tu pedido por WhatsApp en segundos.',
    cta: 'Ver catálogo',
  },

  // Mensaje del botón flotante de WhatsApp (consultas generales)
  whatsappGreeting: 'Hola Mundo Tecnológico Virtual, quiero hacer una consulta 😊',

  // Orden sugerido de las categorías en los chips (las que no estén aquí van al final)
  categoryOrder: ['Celulares', 'Audífonos', 'Parlantes', 'Cargadores', 'Fundas', 'Smartwatch', 'Accesorios'],
}
