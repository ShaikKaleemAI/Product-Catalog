export default function StateNotice({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-rule px-6 py-20 text-center">
      {eyebrow && <span className="eyebrow text-ink-muted">{eyebrow}</span>}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="eyebrow mt-2 rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-bg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
