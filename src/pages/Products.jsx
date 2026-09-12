import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts.js'
import ProductCard from '../components/ProductCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import SortControl from '../components/SortControl.jsx'
import LoadingGrid from '../components/LoadingGrid.jsx'
import StateNotice from '../components/StateNotice.jsx'
import { useChannelForCategory } from '../hooks/useChannel.js'
import { channelFor } from '../data/channels.js'

const VALID_SORTS = new Set(['featured', 'price-asc', 'price-desc', 'rating-desc'])

export default function Products() {
  const { products, status, error, retry } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get('category') || 'all'
  const sortParamRaw = searchParams.get('sort') || 'featured'
  const sortParam = VALID_SORTS.has(sortParamRaw) ? sortParamRaw : 'featured'
  const queryParam = searchParams.get('q') || ''

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products])

  // Input validation: ignore an unknown category value from the URL rather than
  // silently showing an empty grid.
  const activeCategory = categories.includes(categoryParam) ? categoryParam : 'all'

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length }
    for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1
    return counts
  }, [products])

  const searched = useMemo(() => {
    const q = queryParam.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [products, queryParam])

  const filtered = useMemo(() => {
    let list = [...searched]
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory)
    }
    switch (sortParam) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        list.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
        break
      default:
        break
    }
    return list
  }, [searched, activeCategory, sortParam])

  const updateCategory = (cat) => {
    const next = new URLSearchParams(searchParams)
    if (cat === 'all') next.delete('category')
    else next.set('category', cat)
    setSearchParams(next)
  }

  const updateSort = (sort) => {
    const next = new URLSearchParams(searchParams)
    if (sort === 'featured') next.delete('sort')
    else next.set('sort', sort)
    setSearchParams(next)
  }

  const clearQuery = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    setSearchParams(next)
  }

  // The active category tints the whole page — the ambient wash, focus
  // rings, and the rail segment above all read the same variable.
  useChannelForCategory(activeCategory !== 'all' ? activeCategory : null)
  const activeChannel = channelFor(activeCategory)

  return (
    <div className="channel-wash mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="eyebrow text-ink-muted">Full Index</span>
        <h1 className="mt-2 flex items-center gap-3 font-display text-4xl text-ink">
          Products
          {activeChannel && (
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-${activeChannel.color}/12 px-3 py-1 text-sm not-italic text-${activeChannel.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full bg-${activeChannel.color}`} aria-hidden="true" />
              {activeChannel.name}
            </span>
          )}
        </h1>
        {queryParam && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rule py-1.5 pl-4 pr-1.5 text-sm text-ink">
            Results for <span className="font-medium">&ldquo;{queryParam}&rdquo;</span>
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search"
              className="flex h-6 w-6 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
            >
              ✕
            </button>
          </div>
        )}
      </motion.div>

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <CategoryFilter categories={categories} active={activeCategory} onChange={updateCategory} counts={categoryCounts} />
          <div className="flex items-center gap-5">
            <span className="eyebrow whitespace-nowrap text-ink-muted">
              {filtered.length} item{filtered.length === 1 ? '' : 's'}
            </span>
            <SortControl value={sortParam} onChange={updateSort} />
          </div>
        </motion.div>
      )}

      {status === 'loading' && <LoadingGrid count={8} />}

      {status === 'error' && (
        <StateNotice
          eyebrow="Connection issue"
          title="The catalog couldn't be loaded"
          description={error?.message || 'Something went wrong while reaching the catalog service.'}
          actionLabel="Try again"
          onAction={retry}
        />
      )}

      {status === 'success' && filtered.length === 0 && (
        <StateNotice
          eyebrow="No matches"
          title={queryParam ? `Nothing matches "${queryParam}"` : 'Nothing filed under this section'}
          description="Try a different search term or category, or clear your filters to see the full index."
          actionLabel="Clear filters"
          onAction={() => setSearchParams({})}
        />
      )}

      {status === 'success' && filtered.length > 0 && (
        <motion.div layout className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} position={i + 1} total={filtered.length} priority={i < 4} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
