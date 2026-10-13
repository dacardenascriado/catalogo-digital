import { useEffect, useMemo } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { CartProvider, useCart } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { useProducts } from './hooks/useProducts'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WhatsAppFloat from './components/WhatsAppFloat'
import { EmptyState } from './components/States'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'

/** Scroll arriba al cambiar de página, o al ancla (#catalogo) si la URL la trae. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Esperar a que la sección exista (puede montarse tras cargar productos)
      let tries = 0
      const tick = () => {
        const el = document.getElementById(hash.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else if (tries++ < 20) setTimeout(tick, 50)
      }
      tick()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function Shell() {
  const { products } = useProducts()
  const { sync } = useCart()

  // Mantiene el carrito al día con precios y disponibilidad de la hoja
  useEffect(() => sync(products), [products, sync])

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only z-[80] rounded-full bg-white px-4 py-2 font-medium text-copper-dark shadow-lift focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <ScrollManager />
      <Header />
      <main id="contenido" className="flex-1 pt-[118px] md:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:categoria" element={<Home />} />
          <Route path="/producto/:id/:slug?" element={<ProductPage />} />
          <Route
            path="*"
            element={
              <div className="px-4 py-20">
                <EmptyState
                  icon={Compass}
                  title="Página no encontrada"
                  message="El enlace que seguiste no existe o fue movido."
                  action={
                    <Link to="/" className="btn-metal">
                      Ir al inicio
                    </Link>
                  }
                />
              </div>
            }
          />
        </Routes>
      </main>
      <Footer categories={categories} />
      <WhatsAppFloat />
      <CartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </ToastProvider>
  )
}
