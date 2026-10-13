import { config } from '../config'
import { whatsappLink } from '../utils/whatsapp'
import { WhatsAppIcon } from './BrandIcons'

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(config.whatsappGreeting)}
      target="_blank"
      rel="noopener noreferrer"
      className="metal-sheen group fixed bottom-5 right-4 z-30 flex items-center gap-2 overflow-hidden rounded-full bg-metal p-[3px] shadow-lift transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      aria-label="Escríbenos por WhatsApp"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#128C7E] sm:h-14 sm:w-14">
        <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      </span>
      <span className="hidden pr-4 font-display text-xs font-semibold uppercase tracking-wider text-white lg:inline">
        ¿Dudas? Escríbenos
      </span>
      {/* Pulso sutil */}
      <span className="pointer-events-none absolute left-[3px] top-[3px] h-12 w-12 animate-ping rounded-full bg-white/30 [animation-duration:2.6s] sm:h-14 sm:w-14" aria-hidden />
    </a>
  )
}
