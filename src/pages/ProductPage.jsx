import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronRight, PackageX, Share2, ShoppingBag } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { categoryPath, discountPercent, formatPrice } from '../utils/format'
import { productInquiry, whatsappLink } from '../utils/whatsapp'
import Gallery from '../components/Gallery'
import QuantitySelector from '../components/QuantitySelector'
import { Badge, ProductGrid } from '../components/ProductCard'
import { EmptyState, ErrorState } from '../components/States'
import Ornament, { SectionTitle } from '../components/Ornament'
import { WhatsAppIcon } from '../components/BrandIcons'

export default function ProductPage() {
  const { id } = useParams()
  const { products, loading, error, retry } = useProducts()
  const { add } = useCart()
  const toast = useToast()
  const [qty, setQty] = useState(1)

  const product = products.find((p) => p.id === id)

  useEffect(() => setQty(1), [id])
  useDocumentMeta(product?.name, product?.description)

  const related = useMemo(() => {
    if (!product) return []
    const others = products.filter((p) => p.id !== product.id && p.available)
    const same = others.filter((p) => p.category === product.category)
    const sameBrand = others.filter((p) => p.category !== product.category && p.brand && p.brand === product.brand)
    return [...same, ...sameBrand].slice(0, 4)
  }, [products, product])

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <ErrorState error={error} onRetry={retry} />
      </div>
    )
  }
  if (loading && !product) return <ProductSkeleton />
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={PackageX}
          title="Producto no encontrado"
          message="Es posible que este producto ya no esté en el catálogo. Descubre otras opciones para ti."
          action={
            <Link to="/#catalogo" className="btn-metal">
              Ver catálogo
            </Link>
          }
        />
      </div>
    )
  }

  const off = discountPercent(product.price, product.previousPrice)

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: `Mira este producto: ${product.name}`, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.show({ title: 'Enlace copiado', message: 'Pégalo en WhatsApp o Instagram para compartirlo.' })
      }
    } catch {
      /* el usuario canceló el diálogo de compartir */
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:pt-10">
      <nav aria-label="Ruta de navegación" className="mb-5 text-xs text-ink-soft sm:text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/" className="hover:text-copper-dark">
              Inicio
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li>
            <Link to={`${categoryPath(product.category)}#catalogo`} className="hover:text-copper-dark">
              {product.category}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li aria-current="page" className="line-clamp-1 max-w-[50vw] text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Gallery images={product.images} alt={product.name} dimmed={!product.available}>
          <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-1.5">
            {!product.available && <Badge tone="dark">Agotado</Badge>}
            {product.available && off > 0 && <Badge>-{off}%</Badge>}
            {product.tag && <Badge tone="soft">{product.tag}</Badge>}
          </div>
        </Gallery>

        <div className="animate-fade-up">
          {product.brand && (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-copper-dark">{product.brand}</p>
          )}
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="text-metal font-display text-3xl font-extrabold sm:text-4xl">{formatPrice(product.price)}</p>
            {product.previousPrice && (
              <>
                <p className="pb-1 text-base text-ink-soft line-through">
                  <span className="sr-only">Precio anterior </span>
                  {formatPrice(product.previousPrice)}
                </p>
                <span className="mb-1.5 rounded-full bg-blush px-2.5 py-0.5 text-xs font-semibold text-copper-dark">
                  Ahorras {formatPrice(product.previousPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${product.available ? 'text-[#2F6B4F]' : 'text-ink-soft'}`}>
            <span className={`h-2 w-2 rounded-full ${product.available ? 'bg-[#3E9B6E]' : 'bg-ink-soft/50'}`} aria-hidden />
            {product.available ? 'Disponible' : 'Agotado por ahora'}
          </p>

          <Ornament className="my-6 !mx-0" width="max-w-[200px]" />

          {product.description && (
            <div className="whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{product.description}</div>
          )}

          <div className="mt-8 space-y-3 rounded-3xl border border-blush bg-white/70 p-4 shadow-soft sm:p-5">
            {product.available ? (
              <>
                <div className="flex items-center gap-3">
                  <QuantitySelector value={qty} onChange={(q) => setQty(Math.max(1, Math.min(99, q)))} />
                  <button onClick={() => add(product, qty)} className="btn-metal flex-1">
                    <ShoppingBag className="h-4 w-4" aria-hidden />
                    Agregar<span className="hidden min-[420px]:inline"> al carrito</span>
                  </button>
                </div>
                <p className="text-right text-xs text-ink-soft">
                  Subtotal: <span className="font-semibold text-copper-dark">{formatPrice(product.price * qty)}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-soft">
                Este producto está agotado. Escríbenos y te avisamos cuando vuelva a estar disponible.
              </p>
            )}
            <div className="flex gap-2">
              <a
                href={whatsappLink(productInquiry(product))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex-1 !px-4 normal-case tracking-normal"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#128C7E]" />
                {product.available ? 'Preguntar por WhatsApp' : 'Avísame cuando llegue'}
              </a>
              <button onClick={share} className="btn-ghost !px-4" aria-label="Compartir producto">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
            {['Pedido rápido por WhatsApp', 'Envíos a domicilio', 'Pago al confirmar tu pedido', 'Asesoría personalizada'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-copper-dark" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="relacionados">
          <SectionTitle id="relacionados" script="También te puede gustar" title="Relacionados" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-14" aria-busy="true" aria-label="Cargando producto">
      <div className="skeleton aspect-square rounded-[28px]" />
      <div className="space-y-4 pt-2">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton h-8 w-4/5 rounded-full" />
        <div className="skeleton h-10 w-40 rounded-full" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-28 w-full rounded-3xl" />
      </div>
    </div>
  )
}
