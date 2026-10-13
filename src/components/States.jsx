import { RefreshCw, SearchX, WifiOff } from 'lucide-react'
import Ornament from './Ornament'

export function EmptyState({ icon: Icon = SearchX, title, message, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-blush bg-white/70 px-6 py-12 text-center shadow-soft">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-metal-soft">
        <Icon className="h-7 w-7 text-copper-dark" strokeWidth={1.6} aria-hidden />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-wider text-ink">{title}</h3>
      <Ornament className="my-3" width="max-w-[160px]" />
      {message && <p className="text-sm leading-relaxed text-ink-soft">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div role="alert">
      <EmptyState
        icon={WifiOff}
        title="No pudimos cargar el catálogo"
        message={error?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.'}
        action={
          <button onClick={onRetry} className="btn-metal">
            <RefreshCw className="h-4 w-4" aria-hidden />
            Reintentar
          </button>
        }
      />
    </div>
  )
}
