import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import ProductImage from '../components/ProductImage'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const show = useCallback(
    (toast) => {
      const id = ++idRef.current
      // Máximo 2 visibles para no tapar la pantalla en móvil
      setToasts((list) => [...list.slice(-1), { id, ...toast }])
      setTimeout(() => dismiss(id), toast.duration ?? 2800)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-2xl border border-blush bg-white/95 p-3 pr-2 shadow-lift backdrop-blur"
          >
            {t.product ? (
              <ProductImage
                src={t.product.images[0]}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl" compact
                imgClassName="object-cover"
              />
            ) : (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-copper-dark" aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{t.title}</p>
              {t.message && <p className="truncate text-xs text-ink-soft">{t.message}</p>}
            </div>
            {t.action && (
              <button
                onClick={() => {
                  t.action.onClick()
                  dismiss(t.id)
                }}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-copper-dark transition hover:bg-blush"
              >
                {t.action.label}
              </button>
            )}
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded-full p-1.5 text-ink-soft transition hover:bg-blush hover:text-ink"
              aria-label="Cerrar aviso"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
