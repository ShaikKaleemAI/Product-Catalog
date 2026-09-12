export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const clamp = (n) => Math.min(max, Math.max(min, n))

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') {
      onChange(min)
      return
    }
    onChange(clamp(parseInt(raw, 10)))
  }

  const btnSize = size === 'lg' ? 'h-11 w-11' : 'h-8 w-8'
  const inputSize = size === 'lg' ? 'h-11 w-14 text-base' : 'h-8 w-10 text-sm'

  return (
    <div className="inline-flex items-center rounded-full border border-rule">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${btnSize} flex items-center justify-center rounded-full text-ink transition-colors hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-30`}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInput}
        aria-label="Quantity"
        className={`${inputSize} border-x border-rule bg-transparent text-center font-mono tabular-nums text-ink outline-none`}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${btnSize} flex items-center justify-center rounded-full text-ink transition-colors hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-30`}
      >
        +
      </button>
    </div>
  )
}
