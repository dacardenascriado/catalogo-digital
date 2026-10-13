import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductImage from './ProductImage'

/** Galería deslizable: swipe nativo con scroll-snap en móvil, flechas y miniaturas. */
export default function Gallery({ images, alt, dimmed = false, children }) {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const list = images.length ? images : ['']

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const go = (i) => {
    const el = track.current
    const idx = (i + list.length) % list.length
    el?.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="lg:sticky lg:top-24" role="region" aria-roledescription="carrusel" aria-label={`Imágenes de ${alt}`}>
      <div className="group relative overflow-hidden rounded-[28px] border border-blush bg-white shadow-soft">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          tabIndex={list.length > 1 ? 0 : -1}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(active + 1)
            if (e.key === 'ArrowLeft') go(active - 1)
          }}
        >
          {list.map((src, i) => (
            <div key={i} className="w-full shrink-0 snap-center" aria-label={`Imagen ${i + 1} de ${list.length}`}>
              <ProductImage
                src={src}
                alt={i === 0 ? alt : `${alt}, imagen ${i + 1}`}
                eager={i === 0}
                className="aspect-square"
                imgClassName={`object-contain p-4 sm:p-8 ${dimmed ? 'grayscale-[60%] opacity-70' : ''}`}
              />
            </div>
          ))}
        </div>

        {children}

        {list.length > 1 && (
          <>
            {[
              { dir: -1, Icon: ChevronLeft, pos: 'left-3', label: 'Imagen anterior' },
              { dir: 1, Icon: ChevronRight, pos: 'right-3', label: 'Imagen siguiente' },
            ].map(({ dir, Icon, pos, label }) => (
              <button
                key={dir}
                onClick={() => go(active + dir)}
                className={`absolute ${pos} top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blush bg-white/90 text-copper-dark shadow-soft transition hover:bg-white sm:flex sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100`}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {list.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-metal' : 'w-1.5 bg-rosegold/30'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${i === active ? 'border-rosegold' : 'border-transparent opacity-70 hover:opacity-100'}`}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active}
            >
              <ProductImage src={src} alt="" className="h-16 w-16" compact imgClassName="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
