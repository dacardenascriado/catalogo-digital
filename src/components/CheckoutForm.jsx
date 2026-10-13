import { useState } from 'react'
import { Home, Store } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { buildOrderMessage, whatsappLink } from '../utils/whatsapp'
import { formatPrice } from '../utils/format'
import { WhatsAppIcon } from './BrandIcons'

const CUSTOMER_KEY = 'mtv-customer-v1'

const EMPTY = { name: '', phone: '', delivery: 'domicilio', address: '', notes: '' }

function loadCustomer() {
  try {
    const { name, phone, delivery, address } = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '{}')
    return {
      ...EMPTY,
      name: name || '',
      phone: phone || '',
      delivery: delivery === 'recoger' ? 'recoger' : 'domicilio',
      address: address || '',
    }
  } catch {
    return EMPTY
  }
}

function validate(f) {
  const errors = {}
  if (f.name.trim().length < 2) errors.name = 'Escribe tu nombre.'
  const digits = f.phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) errors.phone = 'Escribe un teléfono válido (solo números).'
  if (f.delivery === 'domicilio' && f.address.trim().length < 5) errors.address = 'Escribe la dirección de entrega.'
  return errors
}

export default function CheckoutForm({ items, total, onDone }) {
  const { clear } = useCart()
  const [form, setForm] = useState(loadCustomer)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  function onSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`co-${Object.keys(found)[0]}`)?.focus()
      return
    }
    // Recordamos los datos del cliente (sin notas) para su próximo pedido
    try {
      const { notes, ...rest } = form
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(rest))
    } catch {
      /* sin almacenamiento disponible */
    }
    const message = buildOrderMessage(items, form)
    window.open(whatsappLink(message), '_blank', 'noopener')
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#128C7E]">
          <WhatsAppIcon className="h-8 w-8" />
        </div>
        <h3 className="font-display text-lg font-bold uppercase tracking-wider">¡Ya casi!</h3>
        <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
          Abrimos WhatsApp con tu pedido listo. Solo presiona <strong className="text-ink">Enviar</strong> en el chat y te
          confirmaremos disponibilidad y envío.
        </p>
        <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={() => {
              clear()
              onDone()
            }}
            className="btn-metal w-full"
          >
            Ya lo envié, vaciar carrito
          </button>
          <button onClick={() => setSent(false)} className="btn-ghost w-full">
            Volver al formulario
          </button>
        </div>
      </div>
    )
  }

  const fieldError = (key) =>
    errors[key] && (
      <p id={`co-${key}-err`} className="mt-1.5 text-xs font-medium text-[#A12C2C]">
        {errors[key]}
      </p>
    )
  const aria = (key) => ({ 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `co-${key}-err` : undefined })

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5">
        <div>
          <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium">
            Nombre <span className="text-copper-dark">*</span>
          </label>
          <input id="co-name" className="field" value={form.name} onChange={set('name')} autoComplete="name" {...aria('name')} />
          {fieldError('name')}
        </div>

        <div>
          <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium">
            Teléfono / WhatsApp <span className="text-copper-dark">*</span>
          </label>
          <input
            id="co-phone"
            className="field"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
            placeholder="300 123 4567"
            {...aria('phone')}
          />
          {fieldError('phone')}
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium">
            Tipo de entrega <span className="text-copper-dark">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'domicilio', label: 'Domicilio', icon: Home },
              { value: 'recoger', label: 'Recoger', icon: Store },
            ].map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper-dark ${
                  form.delivery === value
                    ? 'border-rosegold bg-blush/60 text-copper-dark'
                    : 'border-blush bg-white text-ink hover:border-rosegold/50'
                }`}
              >
                <input type="radio" name="delivery" value={value} checked={form.delivery === value} onChange={set('delivery')} className="sr-only" />
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {form.delivery === 'domicilio' && (
          <div className="animate-fade-up">
            <label htmlFor="co-address" className="mb-1.5 block text-sm font-medium">
              Dirección <span className="text-copper-dark">*</span>
            </label>
            <input
              id="co-address"
              className="field"
              value={form.address}
              onChange={set('address')}
              autoComplete="street-address"
              placeholder="Calle, número, barrio y ciudad"
              {...aria('address')}
            />
            {fieldError('address')}
          </div>
        )}

        <div>
          <label htmlFor="co-notes" className="mb-1.5 block text-sm font-medium">
            Notas <span className="font-normal text-ink-soft">(opcional)</span>
          </label>
          <textarea
            id="co-notes"
            className="field min-h-[84px] resize-none"
            value={form.notes}
            onChange={set('notes')}
            placeholder="Color preferido, horario de entrega, forma de pago…"
            maxLength={400}
          />
        </div>
      </div>

      <footer className="pb-safe border-t border-blush bg-white/80 px-5 pt-4 backdrop-blur">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-wider">Total</span>
          <span className="font-display text-xl font-extrabold text-copper-dark">{formatPrice(total)}</span>
        </div>
        <button type="submit" className="btn-metal w-full">
          <WhatsAppIcon className="h-5 w-5" />
          Enviar pedido por WhatsApp
        </button>
      </footer>
    </form>
  )
}
