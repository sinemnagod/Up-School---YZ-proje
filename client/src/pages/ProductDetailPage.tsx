import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

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
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gl-parchment flex items-center justify-center">
      <p className="text-gl-stone text-sm">Loading product...</p>
    </div>
  )

  if (notFound || !product) return (
    <div className="min-h-screen bg-gl-parchment flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-display-md text-gl-ink mb-2">Product not found</p>
        <button onClick={() => navigate('/products')} className="text-gl-wildrose text-sm hover:underline">
          ← Back to products
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gl-parchment">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/products')}
          className="font-display text-2xl text-gl-petalmist"
        >
          GlowLogic
        </button>
        <div className="flex items-center gap-4">
          <span className="text-gl-blush text-sm">{user?.email}</span>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gl-lavender text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
          >
            My Profile
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Back link */}
        <button
          onClick={() => navigate('/products')}
          className="text-gl-wildrose text-sm hover:underline mb-8 block"
        >
          ← Back to products
        </button>

        {/* Product header */}
        <div className="flex gap-8 mb-10 flex-col sm:flex-row">

          {/* Image */}
          <div className="w-full sm:w-56 h-56 bg-gradient-to-br from-gl-blush to-gl-softbloom rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gl-dustypetal">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display text-6xl text-gl-dustypetal">
                {product.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
              {product.brand}
            </p>
            <h1 className="font-display text-display-lg text-gl-ink mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Category + skin types */}
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
              <p className="text-sm text-gl-stone leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Ingredient list */}
        <div>
          <div className="mb-4">
            <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
              Full Ingredient List
            </p>
            <h2 className="font-display text-display-md text-gl-ink">
              {product.ingredients.length} Ingredients
            </h2>
          </div>

          {product.ingredients.length === 0 ? (
            <p className="text-gl-stone text-sm">No ingredients listed for this product.</p>
          ) : (
            <>
              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs px-2.5 py-1 rounded bg-gl-softbloom text-gl-plum border border-gl-dustypetal">Safe</span>
                <span className="text-xs px-2.5 py-1 rounded bg-[#F5EDD4] text-[#6B540A] border border-[#C8A844]">Medium irritation</span>
                <span className="text-xs px-2.5 py-1 rounded bg-gl-danger-light text-gl-danger border border-gl-danger-mid">High irritation</span>
              </div>

              {/* Ingredients grid */}
              <div className="flex flex-wrap gap-2">
                {product.ingredients
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(({ ingredient, ingredient_id }) => (
                    <div
                      key={ingredient_id}
                      className={`group relative text-xs px-3 py-1.5 rounded-md cursor-default ${irritationColor[ingredient.irritation_potential] ?? irritationColor.LOW}`}
                    >
                      {/* Badge label */}
                      <span>{ingredient.inci_name}</span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-52 bg-gl-nightbloom text-gl-petalmist text-xs rounded-lg p-3 shadow-lg">
                        <p className="font-medium mb-1">{ingredient.inci_name}</p>
                        {ingredient.common_name && (
                          <p className="text-gl-blush mb-1">{ingredient.common_name}</p>
                        )}
                        <p className="text-gl-dustypetal">
                          Comedogenic: {ingredient.comedogenic_rating}/5
                        </p>
                        <p className="text-gl-dustypetal">
                          Irritation: {ingredient.irritation_potential}
                        </p>
                        {ingredient.functions?.length > 0 && (
                          <p className="text-gl-dustypetal mt-1">
                            {ingredient.functions.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}