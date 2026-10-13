import { Link } from 'react-router-dom'
import { config } from '../config'
import { categoryPath } from '../utils/format'
import { whatsappLink } from '../utils/whatsapp'
import { InstagramIcon, WhatsAppIcon } from './BrandIcons'
import Ornament from './Ornament'

export default function Footer({ categories = [] }) {
  return (
    <footer className="bg-marble-texture relative mt-20 border-t border-blush">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 lg:pb-14">
        <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="rounded-full bg-metal p-[2px] shadow-soft">
              <img src="/logo-160.webp" alt={config.storeName} width="88" height="88" loading="lazy" className="h-[88px] w-[88px] rounded-full" />
            </span>
            <p className="mt-4 font-display text-sm font-extrabold uppercase tracking-[0.2em]">Mundo</p>
            <p className="-mt-1 font-script text-2xl text-rosegold-deep">Tecnológico Virtual</p>
            <p className="mt-2 max-w-xs text-sm text-ink-soft">Tecnología con estilo, a un mensaje de distancia.</p>
          </div>

          {categories.length > 0 && (
            <nav aria-label="Categorías">
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-copper-dark">Categorías</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
                {categories.map((c) => (
                  <li key={c}>
                    <Link to={categoryPath(c)} className="text-ink-soft transition hover:text-copper-dark">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-copper-dark">Contáctanos</h2>
            <div className="mt-4 flex flex-col items-center gap-3 md:items-start">
              <a href={whatsappLink(config.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn-metal">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-copper-dark"
              >
                <InstagramIcon className="h-5 w-5" />
                {config.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <Ornament className="mt-12" width="max-w-md" />
        <div className="mt-4 flex flex-col items-center gap-1 text-center">
          <p className="font-script text-3xl text-rosegold-deep" aria-label="Firma D y A">
            {config.signature}
          </p>
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} {config.storeName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
