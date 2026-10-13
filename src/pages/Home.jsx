import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { PackageSearch, SearchX } from 'lucide-react'
import { config } from '../config'
import { useProducts } from '../hooks/useProducts'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { matchesSearch, sortProducts, SORTS } from '../utils/products'
import { slugify } from '../utils/format'
import Hero from '../components/Hero'
import ProductCard, { ProductCardSkeleton, ProductGrid } from '../components/ProductCard'
import { CategoryChips, Toolbar } from '../components/Filters'
import { EmptyState, ErrorState } from '../components/States'
import { SectionTitle } from '../components/Ornament'

export default function Home() {
  const { products, loading, error, retry } = useProducts()
  const { categoria = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const brand = params.get('marca') || ''
  const sort = SORTS[params.get('orden')] ? params.get('orden') : 'relevancia'

  const categories = useMemo(() => {
    const map = new Map()
    products.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1))
    const rank = (name) => {
      const i = config.categoryOrder.findIndex((c) => slugify(c) === slugify(name))
      return i === -1 ? 999 : i
    }
    return [...map.entries()]
      .map(([name, count]) => ({ name, slug: slugify(name), count }))
      .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, 'es'))
  }, [products])

  const activeCategory = categories.find((c) => c.slug === categoria)
  const inCategory = useMemo(
    () => (categoria ? products.filter((p) => slugify(p.category) === categoria) : products),
    [products, categoria],
  )
  const brands = useMemo(
    () => [...new Set(inCategory.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [inCategory],
  )
  const results = useMemo(
    () =>
      sortProducts(
        inCategory.filter((p) => (!brand || p.brand === brand) && matchesSearch(p, query)),
        sort,
      ),
    [inCategory, brand, query, sort],
  )
  const featured = useMemo(() => products.filter((p) => p.featured && p.available).slice(0, 8), [products])

  const filtering = Boolean(query || brand || categoria)

  useDocumentMeta(
    activeCategory ? activeCategory.name : query ? `Búsqueda: ${query}` : '',
    activeCategory ? `${activeCategory.name} en ${config.storeName}. Haz tu pedido por WhatsApp.` : undefined,
  )

  function updateParam(key, value, fallback = '') {
    const next = new URLSearchParams(params)
    value && value !== fallback ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const clearFilters = () => setParams({}, { replace: true, preventScrollReset: true })
  const categoryMissing = !loading && !error && categoria && !activeCategory

  return (
    <>
      <Hero />

      {!filtering && (loading || featured.length > 0) && !error && (
        <section id="destacados" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6" aria-labelledby="destacados-title">
          <SectionTitle id="destacados-title" script="Lo más deseado" title="Destacados" />
          {/* Carrusel deslizable en móvil, grilla en escritorio */}
          <div className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="w-[68%] shrink-0 snap-start sm:w-auto">
                    <ProductCardSkeleton />
                  </div>
                ))
              : featured.map((p, i) => (
                  <div key={p.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
          </div>
        </section>
      )}

      <section id="catalogo" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6" aria-labelledby="catalogo-title">
        <SectionTitle
          id="catalogo-title"
          eyebrow="Explora"
          title={activeCategory ? activeCategory.name : 'Catálogo'}
          script={activeCategory ? undefined : 'Nuestra colección'}
        />

        <div className="mt-8 space-y-4">
          {!error && (loading ? <ChipsSkeleton /> : <CategoryChips categories={categories} active={categoria} search={params.toString() ? `?${params}` : ''} />)}
          {!error && !loading && !categoryMissing && (
            <Toolbar
              brands={brands}
              brand={brand}
              onBrand={(v) => updateParam('marca', v)}
              sort={sort}
              onSort={(v) => updateParam('orden', v, 'relevancia')}
              total={results.length}
              query={query}
            />
          )}
        </div>

        <div className="mt-6">
          {error ? (
            <ErrorState error={error} onRetry={retry} />
          ) : categoryMissing ? (
            <EmptyState
              icon={PackageSearch}
              title="Categoría no encontrada"
              message="Es posible que esta categoría ya no esté disponible. Mira todo nuestro catálogo."
              action={
                <Link to="/#catalogo" className="btn-metal">
                  Ver todo
                </Link>
              }
            />
          ) : !loading && results.length === 0 ? (
            <EmptyState
              icon={products.length ? SearchX : PackageSearch}
              title={products.length ? 'Sin resultados' : 'Catálogo en preparación'}
              message={
                products.length
                  ? `No encontramos productos${query ? ` para “${query}”` : ''} con estos filtros. Prueba con otra palabra o quita los filtros.`
                  : 'Muy pronto verás aquí nuestros productos. Mientras tanto, escríbenos por WhatsApp.'
              }
              action={
                products.length > 0 && (
                  <button onClick={clearFilters} className="btn-ghost">
                    Quitar filtros
                  </button>
                )
              }
            />
          ) : (
            <ProductGrid products={results} loading={loading} />
          )}
        </div>
      </section>
    </>
  )
}

function ChipsSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden" aria-hidden>
      {[64, 96, 110, 92, 84, 104].map((w, i) => (
        <div key={i} className="skeleton h-10 shrink-0 rounded-full" style={{ width: w }} />
      ))}
    </div>
  )
}
