export default function LoadingGrid({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton mb-4 aspect-[4/5] rounded-2xl animate-shimmer" />
          <div className="skeleton h-2.5 w-16 rounded animate-shimmer" />
          <div className="skeleton mt-2 h-4 w-4/5 rounded animate-shimmer" />
          <div className="skeleton mt-2 h-3 w-1/3 rounded animate-shimmer" />
        </div>
      ))}
    </div>
  )
}
