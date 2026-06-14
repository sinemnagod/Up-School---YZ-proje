import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import EmptyState from '../components/EmptyState'
import { ProductDetailSkeleton } from '../components/skeletons/Skeletons'
import { getApiErrorMessage } from '../utils/apiError'
import { toastError } from '../store/toastStore'

interface Ingredient {
  id: string
  inci_name: string
  common_name: string | null
  comedogenic_rating: number
  irritation_potential: string
  functions: string[]
}

interface ProductIngredient {
  ingredient_id: string
  order_index: number
  ingredient: Ingredient
}

interface Product {
  id: string
  name: string
  brand: string
  category: string
  description: string | null
  image_url: string | null
  skin_type_tags: string[]
  is_published: boolean
  ingredients: ProductIngredient[]
}

const irritationColor: Record<string, string> = {
  HIGH:   'bg-gl-danger-light text-gl-danger border border-gl-danger-mid',
  MEDIUM: 'bg-[#F5EDD4] text-[#6B540A] border border-[#C8A844]',
  LOW:    'bg-gl-softbloom text-gl-plum border border-gl-dustypetal',
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true)
        } else {
          toastError(getApiErrorMessage(err, 'Could not load product.'))
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-4 w-32 bg-gl-pebble/60 animate-pulse rounded mb-8" />
        <ProductDetailSkeleton />
        <div className="space-y-3">
          <div className="h-6 w-48 bg-gl-pebble/60 animate-pulse rounded" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gl-pebble/60 animate-pulse rounded-md" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          actionLabel="Back to products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('/products')}
        className="text-gl-wildrose text-sm hover:underline mb-8 block"
      >
        ← Back to products
      </button>

      <div className="flex gap-8 mb-10 flex-col sm:flex-row">
        <div className="w-full sm:w-56 h-56 bg-gradient-to-br from-gl-blush to-gl-softbloom rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gl-dustypetal">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-6xl text-gl-dustypetal">{product.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">{product.brand}</p>
          <h1 className="font-display text-display-lg text-gl-ink mb-3 leading-tight">{product.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-gl-nightbloom text-gl-petalmist font-medium">
              {product.category.replace('_', ' ')}
            </span>
            {product.skin_type_tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-gl-softbloom text-gl-plum border border-gl-dustypetal">
                {tag.replace('_', ' ')}
              </span>
            ))}
          </div>
          {product.description && (
            <p className="text-sm text-gl-stone leading-relaxed">{product.description}</p>
          )}

          {!user && (
            <div className="mt-5 p-4 bg-gl-softbloom border border-gl-dustypetal rounded-xl">
              <p className="text-sm text-gl-ink mb-3">
                Create a free account to check this product against your skin triggers and build your routine.
              </p>
              <Link
                to="/register"
                className="bg-gl-moss text-white text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all inline-block"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4">
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Full Ingredient List</p>
          <h2 className="font-display text-display-md text-gl-ink">{product.ingredients.length} Ingredients</h2>
        </div>

        {product.ingredients.length === 0 ? (
          <EmptyState
            title="No ingredients listed"
            description="Ingredient data for this product hasn't been added yet."
            actionLabel="Browse other products"
            actionTo="/products"
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs px-2.5 py-1 rounded bg-gl-softbloom text-gl-plum border border-gl-dustypetal">Safe</span>
              <span className="text-xs px-2.5 py-1 rounded bg-[#F5EDD4] text-[#6B540A] border border-[#C8A844]">Medium irritation</span>
              <span className="text-xs px-2.5 py-1 rounded bg-gl-danger-light text-gl-danger border border-gl-danger-mid">High irritation</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.ingredients
                .sort((a, b) => a.order_index - b.order_index)
                .map(({ ingredient, ingredient_id }) => (
                  <div
                    key={ingredient_id}
                    className={`group relative text-xs px-3 py-1.5 rounded-md cursor-default ${irritationColor[ingredient.irritation_potential] ?? irritationColor.LOW}`}
                  >
                    <span>{ingredient.inci_name}</span>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-52 bg-gl-nightbloom text-gl-petalmist text-xs rounded-lg p-3 shadow-lg">
                      <p className="font-medium mb-1">{ingredient.inci_name}</p>
                      {ingredient.common_name && (
                        <p className="text-gl-blush mb-1">{ingredient.common_name}</p>
                      )}
                      <p className="text-gl-dustypetal">Comedogenic: {ingredient.comedogenic_rating}/5</p>
                      <p className="text-gl-dustypetal">Irritation: {ingredient.irritation_potential}</p>
                      {ingredient.functions?.length > 0 && (
                        <p className="text-gl-dustypetal mt-1">{ingredient.functions.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
