import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useOverlay } from '../hooks/useOverlay'
import { formatPrice } from '../utils/format'
import ProductImage from './ProductImage'
import QuantitySelector from './QuantitySelector'
import CheckoutForm from './CheckoutForm'
import { EmptyState } from './States'

export default function CartDrawer() {
  const { items, count, total, open, setOpen, setQty, remove } = useCart()
  const [step, setStep] = useState('cart') // 'cart' | 'checkout'

  const close = useCallback(() => {
    setOpen(false)
    setTimeout(() => setStep('cart'), 300)
  }, [setOpen])

  const panelRef = useOverlay(open, close)

  return (
    // `invisible` (con transición) saca el panel cerrado del orden de tabulación y de los lectores de pantalla
    <div className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${open ? 'visible' : 'pointer-events-none invisible'}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute flex flex-col bg-marble shadow-lift transition-transform duration-300 ease-out
          inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[28px]
          md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:rounded-none md:rounded-l-[28px]
          ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}`}
      >
        {/* Asa de la hoja inferior (móvil) */}
        <div className="flex justify-center pt-2.5 md:hidden" aria-hidden>
          <span className="h-1.5 w-12 rounded-full bg-rosegold/30" />
        </div>

        <header className="flex items-center gap-3 border-b border-blush px-5 pb-4 pt-3 md:pt-6">
          {step === 'checkout' && (
            <button
              onClick={() => setStep('cart')}
              className="-ml-2 rounded-full p-2 text-copper-dark hover:bg-blush"
              aria-label="Volver al carrito"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1">
            <h2 id="cart-title" className="font-display text-base font-extrabold uppercase tracking-[0.14em] text-ink">
              {step === 'cart' ? 'Tu carrito' : 'Datos del pedido'}
            </h2>
            <p className="text-xs text-ink-soft">
              {count} {count === 1 ? 'producto' : 'productos'} · {formatPrice(total)}
            </p>
          </div>
          <button onClick={close} className="rounded-full p-2 text-ink-soft hover:bg-blush hover:text-ink" aria-label="Cerrar carrito">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center overflow-y-auto p-5">
            <EmptyState
              icon={ShoppingBag}
              title="Tu carrito está vacío"
              message="Explora el catálogo y agrega tus productos favoritos. Te esperamos con lo último en tecnología."
              action={
                <Link to="/#catalogo" onClick={close} className="btn-metal">
                  Ver catálogo
                </Link>
              }
            />
          </div>
        ) : step === 'cart' ? (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 rounded-2xl border border-blush/70 bg-white p-2.5 shadow-soft">
                  <Link to={`/producto/${encodeURIComponent(it.id)}/${it.slug}`} onClick={close} className="shrink-0">
                    <ProductImage src={it.image} alt={it.name} className="h-20 w-20 rounded-xl" compact imgClassName="object-contain p-1" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start gap-2">
                      <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug text-ink">{it.name}</p>
                      <button
                        onClick={() => remove(it.id)}
                        className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-soft transition hover:bg-blush hover:text-copper-dark"
                        aria-label={`Quitar ${it.name} del carrito`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-ink-soft">{formatPrice(it.price)} c/u</p>
                    <div className="mt-auto flex items-center justify-between pt-1.5">
                      <QuantitySelector
                        size="sm"
                        value={it.qty}
                        min={0}
                        onChange={(q) => setQty(it.id, q)}
                        label={`Cantidad de ${it.name}`}
                      />
                      <p className="font-display text-sm font-bold text-copper-dark">{formatPrice(it.price * it.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="pb-safe border-t border-blush bg-white/80 px-5 pt-4 backdrop-blur">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <dt>Envío</dt>
                  <dd>Se acuerda por WhatsApp</dd>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <dt className="font-display font-bold uppercase tracking-wider text-ink">Total</dt>
                  <dd className="font-display text-xl font-extrabold text-copper-dark">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button onClick={() => setStep('checkout')} className="btn-metal mt-4 w-full">
                Continuar pedido
              </button>
            </footer>
          </>
        ) : (
          <CheckoutForm items={items} total={total} onDone={close} />
        )}
      </aside>
    </div>
  )
}
