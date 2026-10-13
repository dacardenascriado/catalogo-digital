import { config } from '../config'
import { formatPrice } from './format'

export function whatsappLink(text) {
  const base = `https://wa.me/${config.whatsapp}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

/**
 * Arma el mensaje del pedido.
 * @param {Array<{name, qty, price}>} items
 * @param {{name, phone, delivery: 'domicilio'|'recoger', address, notes}} customer
 */
export function buildOrderMessage(items, customer) {
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const lines = [
    `Hola ${config.storeName}, quiero hacer este pedido:`,
    '',
    ...items.map((it) => `- ${it.qty} x ${it.name} — ${formatPrice(it.price * it.qty)}`),
    '',
    `Total: ${formatPrice(total)}`,
    '',
    `Nombre: ${customer.name.trim()}`,
    `Teléfono: ${customer.phone.trim()}`,
    `Entrega: ${customer.delivery === 'domicilio' ? 'Domicilio' : 'Recoger en tienda'}`,
  ]
  if (customer.delivery === 'domicilio') lines.push(`Dirección: ${customer.address.trim()}`)
  lines.push(`Notas: ${customer.notes.trim() || 'Ninguna'}`)
  return lines.join('\n')
}

export function productInquiry(product) {
  return `Hola ${config.storeName}, me interesa este producto: ${product.name} (${formatPrice(product.price)}). ${window.location.href}`
}
