import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', label = 'Cantidad' }) {
  const s = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11'
  const text = size === 'sm' ? 'w-8 text-sm' : 'w-10 text-base'
  return (
    <div className="inline-flex items-center rounded-full border border-blush bg-white" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className={`${s} flex items-center justify-center rounded-full text-copper-dark transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-35`}
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={`${text} text-center font-semibold tabular-nums text-ink`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={`${s} flex items-center justify-center rounded-full text-copper-dark transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-35`}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
