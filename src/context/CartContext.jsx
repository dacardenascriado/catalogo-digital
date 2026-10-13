import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext'

const STORAGE_KEY = 'mtv-cart-v1'
const MAX_QTY = 99
const CartContext = createContext(null)

function readStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((it) => it?.id && it.qty > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  // Cada ítem guarda una copia de nombre/precio/imagen para poder pintar el
  // carrito al instante, incluso antes de que termine de cargar el catálogo.
  const [items, setItems] = useState(readStorage)
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(0) // dispara la animación del contador
  const toast = useToast()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* modo privado o almacenamiento lleno: el carrito sigue funcionando en memoria */
    }
  }, [items])

  const add = useCallback(
    (product, qty = 1) => {
      if (!product.available) return
      setItems((list) => {
        const existing = list.find((it) => it.id === product.id)
        if (existing) {
          return list.map((it) => (it.id === product.id ? { ...it, qty: Math.min(MAX_QTY, it.qty + qty) } : it))
        }
        return [
          ...list,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0] || '',
            qty,
          },
        ]
      })
      setBump((b) => b + 1)
      toast?.show({
        title: 'Agregado al carrito',
        message: `${qty > 1 ? `${qty} × ` : ''}${product.name}`,
        product,
        action: { label: 'Ver carrito', onClick: () => setOpen(true) },
      })
    },
    [toast],
  )

  const setQty = useCallback((id, qty) => {
    setItems((list) =>
      qty <= 0 ? list.filter((it) => it.id !== id) : list.map((it) => (it.id === id ? { ...it, qty: Math.min(MAX_QTY, qty) } : it)),
    )
  }, [])

  const remove = useCallback((id) => setItems((list) => list.filter((it) => it.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  /** Sincroniza precios/nombres con el catálogo actual y quita lo que ya no existe o se agotó. */
  const sync = useCallback((products) => {
    if (!products?.length) return
    const byId = new Map(products.map((p) => [p.id, p]))
    setItems((list) => {
      const next = list
        .filter((it) => byId.get(it.id)?.available)
        .map((it) => {
          const p = byId.get(it.id)
          return { ...it, name: p.name, price: p.price, brand: p.brand, slug: p.slug, image: p.images[0] || '' }
        })
      return JSON.stringify(next) === JSON.stringify(list) ? list : next
    })
  }, [])

  const value = useMemo(() => {
    const count = items.reduce((n, it) => n + it.qty, 0)
    const total = items.reduce((n, it) => n + it.qty * it.price, 0)
    return { items, count, total, open, setOpen, bump, add, setQty, remove, clear, sync }
  }, [items, open, bump, add, setQty, remove, clear, sync])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
