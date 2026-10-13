import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { config } from '../config'

export default function Header() {
  const { count, bump, setOpen } = useCart()
  const [params, setParams] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const urlQuery = params.get('q') || ''
  const [query, setQuery] = useState(urlQuery)
  const debounce = useRef()

  const onCatalog = pathname === '/' || pathname.startsWith('/categoria/')

  useEffect(() => setQuery(urlQuery), [urlQuery])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function applyQuery(value) {
    if (onCatalog) {
      const next = new URLSearchParams(params)
      value.trim() ? next.set('q', value) : next.delete('q')
      setParams(next, { replace: true, preventScrollReset: true })
      // Llevar al usuario a los resultados si está viendo el hero
      const grid = document.getElementById('catalogo')
      if (value.trim() && grid && grid.getBoundingClientRect().top > window.innerHeight * 0.6) {
        grid.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (value.trim()) {
      navigate(`/?q=${encodeURIComponent(value)}#catalogo`)
    }
  }

  function onChange(e) {
    const value = e.target.value
    setQuery(value)
    clearTimeout(debounce.current)
    // En el catálogo filtramos en tiempo real; fuera de él esperamos a Enter
    if (onCatalog) debounce.current = setTimeout(() => applyQuery(value), 180)
  }

  function onSubmit(e) {
    e.preventDefault()
    clearTimeout(debounce.current)
    applyQuery(query)
    e.target.querySelector('input')?.blur()
  }

  function clearSearch() {
    setQuery('')
    applyQuery('')
  }

  const renderSearch = (id) => (
    <form role="search" onSubmit={onSubmit} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Buscar productos
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden />
      <input
        id={id}
        type="search"
        value={query}
        onChange={onChange}
        placeholder="Buscar celulares, audífonos, marcas…"
        autoComplete="off"
        enterKeyHint="search"
        className="h-11 w-full rounded-full border border-blush bg-white/90 pl-11 pr-10 text-[15px] text-ink placeholder:text-ink-soft/80 transition focus:border-rosegold focus:outline-none focus:ring-4 focus:ring-rosegold/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-soft hover:bg-blush hover:text-ink"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
        scrolled ? 'border-blush bg-marble/90 shadow-soft backdrop-blur-md' : 'border-transparent bg-marble/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-6 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${config.storeName}, inicio`}>
          <span className="rounded-full bg-metal p-[2px] shadow-soft transition group-hover:shadow-lift">
            <img src="/logo-160.webp" alt="" width="44" height="44" className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[13px] font-extrabold uppercase tracking-[0.18em] text-ink sm:text-sm">
              Mundo
            </span>
            <span className="-mt-0.5 block font-script text-xl text-rosegold-deep sm:text-[22px]">Tecnológico</span>
          </span>
        </Link>

        <div className="hidden flex-1 md:block md:max-w-xl md:mx-auto">{renderSearch('buscar')}</div>

        <button
          onClick={() => setOpen(true)}
          className="relative ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blush bg-white text-copper-dark shadow-soft transition hover:border-rosegold hover:shadow-lift md:ml-0"
          aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
          {count > 0 && (
            <span
              key={bump}
              className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-bump items-center justify-center rounded-full bg-metal px-1 text-[11px] font-bold text-white ring-2 ring-marble"
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
      </div>
      <div className="px-4 pb-2.5 md:hidden">{renderSearch('buscar-movil')}</div>
    </header>
  )
}
