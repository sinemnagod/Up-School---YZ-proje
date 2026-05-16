import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  skin_type_tags: string[]
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gl-parchment">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-gl-petalmist">GlowLogic</h1>
        <div className="flex items-center gap-4">
          <span className="text-gl-blush text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-gl-lavender text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
            Product Catalog
          </p>
          <h2 className="font-display text-display-lg text-gl-ink">
            All Products
          </h2>
        </div>

        {loading ? (
          <div className="text-gl-stone text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-gl-stone text-sm">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-36 bg-gradient-to-br from-gl-blush to-gl-softbloom flex items-center justify-center">
                  <span className="font-display text-4xl text-gl-dustypetal">
                    {product.name.charAt(0)}
                  </span>
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
                    {product.skin_type_tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gl-petalmist text-gl-stone border border-gl-pebble">
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}