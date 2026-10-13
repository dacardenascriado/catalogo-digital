import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { discountPercent, formatPrice, productPath } from '../utils/format'
import ProductImage from './ProductImage'

export function Badge({ children, tone = 'metal' }) {
  const tones = {
    metal: 'bg-metal text-white',
    soft: 'bg-white/90 text-copper-dark border border-blush',
    dark: 'bg-ink/85 text-white',
  }
  return (
    <span className={`rounded-full px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider shadow-sm ${tones[tone]}`}>
      {children}
    </span>
  )
}

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const off = discountPercent(product.price, product.previousPrice)
  const href = productPath(product)

  function handleAdd() {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article
      className="group relative flex animate-fade-up flex-col overflow-hidden rounded-3xl border border-blush/70 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-rosegold/40 hover:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <Link to={href} className="metal-sheen relative block overflow-hidden" tabIndex={-1} aria-hidden>
        <ProductImage
          src={product.images[0]}
          alt=""
          className="aspect-square"
          imgClassName={`object-contain p-3 transition duration-500 group-hover:scale-105 ${product.available ? '' : 'grayscale-[60%] opacity-70'}`}
        />
      </Link>

      <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
        {!product.available && <Badge tone="dark">Agotado</Badge>}
        {product.available && off > 0 && <Badge>-{off}%</Badge>}
        {product.tag && <Badge tone="soft">{product.tag}</Badge>}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {product.brand && (
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-copper-dark sm:text-[11px]">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-ink sm:text-[15px]">
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-0">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex flex-col gap-2.5 pt-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            {product.previousPrice && (
              <p className="text-xs text-ink-soft line-through">
                <span className="sr-only">Antes </span>
                {formatPrice(product.previousPrice)}
              </p>
            )}
            <p className="font-display text-base font-bold text-copper-dark sm:text-lg">
              {product.previousPrice && <span className="sr-only">Ahora </span>}
              {formatPrice(product.price)}
            </p>
          </div>

          {product.available ? (
            <button
              onClick={handleAdd}
              className="metal-sheen relative z-10 flex h-10 shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-metal px-4 text-sm font-semibold text-white shadow-soft transition hover:shadow-lift active:scale-95"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              {added ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
              <span>{added ? 'Listo' : 'Agregar'}</span>
            </button>
          ) : (
            <span className="relative z-10 flex h-10 shrink-0 items-center justify-center rounded-full bg-blush/60 px-4 text-sm font-medium text-ink-soft">
              Sin stock
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-blush/70 bg-white shadow-soft" aria-hidden>
      <div className="skeleton aspect-square" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-2.5 w-1/3 rounded-full" />
        <div className="skeleton h-3.5 w-11/12 rounded-full" />
        <div className="skeleton h-3.5 w-2/3 rounded-full" />
        <div className="flex items-end justify-between pt-3">
          <div className="skeleton h-5 w-1/3 rounded-full" />
          <div className="skeleton h-10 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductGrid({ products, loading, skeletons = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {loading
        ? Array.from({ length: skeletons }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  )
}
