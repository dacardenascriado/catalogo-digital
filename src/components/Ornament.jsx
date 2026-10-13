/** Separador fino con ornamento central, inspirado en el de "D&A" del logo. */
export default function Ornament({ className = '', width = 'max-w-xs' }) {
  return (
    <div className={`mx-auto flex w-full ${width} items-center gap-3 text-rosegold ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rosegold/60 to-rosegold" />
      <svg width="44" height="16" viewBox="0 0 44 16" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M22 8c-3-4.5-8-4.5-9.5-1.8C11 9 13.5 11.5 16 10.5S20 7 22 8Zm0 0c3-4.5 8-4.5 9.5-1.8C33 9 30.5 11.5 28 10.5S24 7 22 8Z" />
        <circle cx="22" cy="8" r="1.4" fill="currentColor" stroke="none" />
        <path d="M2 8h8M34 8h8" strokeLinecap="round" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-rosegold/60 to-rosegold" />
    </div>
  )
}

export function SectionTitle({ eyebrow, title, script, id, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      {script && <p className="font-script text-3xl leading-none text-rosegold-deep sm:text-4xl">{script}</p>}
      {eyebrow && !script && (
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-copper-dark">{eyebrow}</p>
      )}
      <h2 id={id} className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.08em] text-ink sm:text-3xl">
        {title}
      </h2>
      <Ornament className="mt-3" width="max-w-[220px]" />
    </div>
  )
}
