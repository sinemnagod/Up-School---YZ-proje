import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import EmptyState from '../components/EmptyState'
import { ProductGridSkeleton } from '../components/skeletons/Skeletons'
import { getApiErrorMessage } from '../utils/apiError'
import { toastError } from '../store/toastStore'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  skin_type_tags: string[]
  image_url: string | null
}

const categoryColors: Record<string, string> = {
  CLEANSER:    'bg-gl-softbloom text-gl-plum',
  TONER:       'bg-gl-softbloom text-gl-plum',
  SERUM:       'bg-gl-nightbloom text-gl-petalmist',
  MOISTURIZER: 'bg-gl-moss text-white',
  SPF:         'bg-gl-pollen text-gl-nightbloom',
  OIL:         'bg-gl-lavender text-gl-nightbloom',
  EXFOLIANT:   'bg-gl-danger-light text-gl-danger',
  EYE_CREAM:   'bg-gl-softbloom text-gl-plum',
  MASK:        'bg-gl-blush text-gl-plum',
}

export default function ProductsPage() {
  const { user } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch((err) => {
        setLoadError(true)
        toastError(getApiErrorMessage(err, 'Could not load products.'))
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
            Product Catalog
          </p>
          <h2 className="font-display text-display-lg text-gl-ink">All Products</h2>
        </div>
      </div>

      <div className="mb-8">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or brand..."
          className="w-full max-w-md bg-gl-softbloom border border-gl-dustypetal rounded-md px-4 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
        />
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : loadError ? (
        <EmptyState
          title="Could not load products"
          description="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="The catalog is being curated. Check back soon — new products are added regularly."
          actionLabel={user ? 'Go to Dashboard' : 'Create account'}
          actionTo={user ? '/challenges' : '/register'}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matches found"
          description={`Nothing matched "${search}". Try a different name or brand.`}
          actionLabel="Clear search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden hover:border-gl-wildrose hover:shadow-md transition-all group"
            >
              <div className="h-36 bg-gradient-to-br from-gl-blush to-gl-softbloom flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="font-display text-4xl text-gl-dustypetal">
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium tracking-wider uppercase text-gl-stone mb-1">
                  {product.brand}
                </p>
                <h3 className="font-display text-lg text-gl-ink leading-snug mb-3">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[product.category] ?? 'bg-gl-petalmist text-gl-stone'}`}>
                    {product.category.replace('_', ' ')}
                  </span>
                  {product.skin_type_tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gl-petalmist text-gl-stone border border-gl-pebble">
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
