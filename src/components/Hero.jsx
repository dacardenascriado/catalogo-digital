import { ArrowDown, ShieldCheck, Truck, MessageCircle } from 'lucide-react'
import { config } from '../config'
import Ornament from './Ornament'

const PERKS = [
  { icon: MessageCircle, label: 'Pedido por WhatsApp' },
  { icon: Truck, label: 'Envío a domicilio' },
  { icon: ShieldCheck, label: 'Productos garantizados' },
]

export default function Hero() {
  const { hero } = config
  return (
    <section className="bg-marble-texture relative overflow-hidden" aria-labelledby="hero-title">
      {/* Halo cálido detrás del logo */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,124,94,0.18),transparent_65%)] lg:left-[72%] lg:top-1/2"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="animate-fade-up font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-copper-dark sm:text-xs">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-3 animate-fade-up font-display text-[2.1rem] font-extrabold uppercase leading-[1.05] tracking-[0.04em] [animation-delay:80ms] sm:text-5xl lg:text-6xl"
          >
            <span className="text-metal">{hero.title}</span>
          </h1>
          <p className="mt-2 animate-fade-up font-script text-4xl text-rosegold-deep [animation-delay:160ms] sm:text-5xl">
            {hero.slogan}
          </p>
          <Ornament className="my-5 animate-fade-up [animation-delay:200ms] lg:mx-0" width="max-w-[260px]" />
          <p className="mx-auto max-w-xl animate-fade-up text-[15px] leading-relaxed text-ink-soft [animation-delay:240ms] sm:text-base lg:mx-0">
            {hero.description}
          </p>
          <div className="mt-7 flex animate-fade-up flex-col items-center gap-3 [animation-delay:300ms] sm:flex-row sm:justify-center lg:justify-start">
            <a href="#catalogo" className="btn-metal w-full sm:w-auto">
              {hero.cta}
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
            <a href="#destacados" className="btn-ghost w-full sm:w-auto">
              Destacados
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink-soft sm:text-sm lg:justify-start">
            {PERKS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-copper-dark" aria-hidden strokeWidth={1.8} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative animate-fade-up">
            {/* Aro metálico decorativo */}
            <div className="absolute -inset-3 rounded-full border border-rosegold/30 sm:-inset-5" aria-hidden />
            <div className="absolute -inset-6 rounded-full border border-dashed border-rosegold/20 sm:-inset-10" aria-hidden />
            <div className="rounded-full bg-metal p-[3px] shadow-lift">
              <img
                src="/logo-560.webp"
                alt={`Logo de ${config.storeName}`}
                width="560"
                height="560"
                fetchpriority="high"
                className="h-56 w-56 rounded-full sm:h-72 sm:w-72 lg:h-[400px] lg:w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-marble" aria-hidden />
    </section>
  )
}
