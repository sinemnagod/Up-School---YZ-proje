import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  skin_type_tags: string[]
  image_url: string | null
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    clearAuth()
    navigate('/login')
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gl-parchment">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-gl-petalmist">GlowLogic</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="text-gl-blush text-sm hover:text-gl-petalmist transition-colors"
          >
            {user?.email}
          </Link>
          <Link
            to="/dashboard"
            className="bg-gl-pollen text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
          >
            My Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gl-lavender text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
              Product Catalog
            </p>
            <h2 className="font-display text-display-lg text-gl-ink">All Products</h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or brand..."
            className="w-full max-w-md bg-gl-softbloom border border-gl-dustypetal rounded-md px-4 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
        </div>

        {loading ? (
          <p className="text-gl-stone text-sm">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gl-stone text-sm">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden hover:border-gl-wildrose hover:shadow-md transition-all group"
              >
                {/* Image */}
                <div className="h-36 bg-gradient-to-br from-gl-blush to-gl-softbloom flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
      </main>
    </div>
  )
}