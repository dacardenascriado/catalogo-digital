import { useState } from 'react'
import { Smartphone } from 'lucide-react'
import { fallbackImageUrl } from '../utils/images'

/**
 * Imagen con lazy loading, fundido al cargar y placeholder elegante
 * en tonos oro rosa si no hay URL o la imagen falla.
 */
export default function ProductImage({ src, alt, className = '', imgClassName = 'object-contain', eager = false, sizes, compact = false }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  const [prevSrc, setPrevSrc] = useState(src)
  const [current, setCurrent] = useState(src)
  if (src !== prevSrc) {
    // Si cambia la imagen (galería, toasts reutilizados) reiniciamos el estado
    setPrevSrc(src)
    setCurrent(src)
    setStatus(src ? 'loading' : 'error')
  }

  function handleError() {
    // Un intento con la URL alternativa (Drive) antes de mostrar el placeholder
    const fallback = current === src ? fallbackImageUrl(src) : null
    if (fallback) setCurrent(fallback)
    else setStatus('error')
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-white via-marble to-blush/60 ${className}`}>
      {status !== 'error' && (
        <img
          src={current}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('ok')}
          onError={handleError}
          className={`h-full w-full transition duration-500 ${imgClassName} ${status === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {status === 'loading' && <div className="skeleton absolute inset-0" aria-hidden />}
      {status === 'error' && <Placeholder label={alt} compact={compact} />}
    </div>
  )
}

function Placeholder({ label, compact }) {
  return (
    <div
      // Si la imagen es decorativa (alt vacío), el placeholder también lo es
      {...(label ? { role: 'img', 'aria-label': `${label} (imagen no disponible)` } : { 'aria-hidden': true })}
      className="bg-marble-texture absolute inset-0 flex flex-col items-center justify-center gap-2"
    >
      <div className={`flex items-center justify-center rounded-full border border-rosegold/40 bg-white/70 shadow-soft ${compact ? 'h-8 w-8' : 'h-14 w-14'}`}>
        <Smartphone className={compact ? 'h-4 w-4 text-rosegold-deep' : 'h-6 w-6 text-rosegold-deep'} strokeWidth={1.4} aria-hidden />
      </div>
      {!compact && <span className="font-script text-xl text-rosegold-deep/80">Mundo Tecnológico</span>}
    </div>
  )
}
