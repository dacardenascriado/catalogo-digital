import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, LayoutGrid, Tag } from 'lucide-react'
import { SORTS } from '../utils/products'
import { categoryPath } from '../utils/format'

/** Chips de categorías: deslizables en móvil, cada uno es un enlace compartible. */
export function CategoryChips({ categories, active, search }) {
  const activeRef = useRef(null)

  // Mantener visible el chip activo en el carrusel horizontal
  // (solo horizontal: scrollIntoView movería también la página)
  useEffect(() => {
    const chip = activeRef.current
    const rail = chip?.closest('ul')
    if (!chip || !rail || rail.scrollWidth <= rail.clientWidth) return
    rail.scrollTo({ left: chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  const chips = [{ label: 'Todo', to: '/', key: '' }, ...categories.map((c) => ({ label: c.name, to: categoryPath(c.name), key: c.slug, count: c.count }))]

  return (
    <nav aria-label="Categorías" className="-mx-4 sm:mx-0">
      <ul className="no-scrollbar relative flex gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:px-0">
        {chips.map((chip) => {
          const isActive = chip.key === (active || '')
          return (
            <li key={chip.key || 'all'}>
              <Link
                ref={isActive ? activeRef : undefined}
                to={{ pathname: chip.to, search, hash: '#catalogo' }}
                preventScrollReset
                className={`chip ${isActive ? 'chip-on' : 'chip-off'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {!chip.key && <LayoutGrid className="h-3.5 w-3.5" aria-hidden />}
                {chip.label}
                {chip.count != null && (
                  <span className={`text-xs ${isActive ? 'text-white/85' : 'text-ink-soft'}`}>{chip.count}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Select({ id, label, icon: Icon, value, onChange, children }) {
  return (
    <div className="relative min-w-0 flex-1 sm:flex-none">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-copper-dark" aria-hidden />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-blush bg-white pl-10 pr-9 text-sm font-medium text-ink transition hover:border-rosegold/50 focus:border-rosegold focus:outline-none focus:ring-4 focus:ring-rosegold/15 sm:w-56"
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function Toolbar({ brands, brand, onBrand, sort, onSort, total, query }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="order-2 text-sm text-ink-soft sm:order-1" aria-live="polite">
        <strong className="font-semibold text-ink">{total}</strong> {total === 1 ? 'producto' : 'productos'}
        {query && (
          <>
            {' '}para “<span className="text-copper-dark">{query}</span>”
          </>
        )}
      </p>
      <div className="order-1 flex gap-2 sm:order-2">
        {brands.length > 1 && (
          <Select id="filtro-marca" label="Filtrar por marca" icon={Tag} value={brand} onChange={onBrand}>
            <option value="">Todas las marcas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        )}
        <Select id="orden" label="Ordenar productos" icon={ArrowUpDown} value={sort} onChange={onSort}>
          {Object.entries(SORTS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
