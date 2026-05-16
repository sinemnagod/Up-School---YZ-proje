import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'

const CATEGORIES = ['CLEANSER','TONER','SERUM','MOISTURIZER','SPF','OIL','EXFOLIANT','EYE_CREAM','MASK']
const SKIN_TYPES = ['OILY','DRY','COMBINATION','SENSITIVE','ACNE_PRONE','NORMAL']

interface Ingredient { id: string; inci_name: string; common_name: string | null }

export default function AdminProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [name, setName]               = useState('')
  const [brand, setBrand]             = useState('')
  const [category, setCategory]       = useState('CLEANSER')
  const [description, setDescription] = useState('')
  const [skinTypes, setSkinTypes]     = useState<string[]>([])
  const [isPublished, setIsPublished] = useState(false)
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  // Load all ingredients for the multi-select
  useEffect(() => {
    api.get('/admin/ingredients').then(({ data }) => setIngredients(data))
  }, [])

  // If editing, load existing product data
  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/products/${id}`).then(({ data }) => {
      setName(data.name)
      setBrand(data.brand)
      setCategory(data.category)
      setDescription(data.description ?? '')
      setSkinTypes(data.skin_type_tags)
      setIsPublished(data.is_published)
      setImagePreview(data.image_url ?? '')
      setSelectedIngredients(data.ingredients?.map((i: any) => i.ingredient_id) ?? [])
    })
  }, [id, isEdit])

  function toggleSkinType(type: string) {
    setSkinTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  function toggleIngredient(ingId: string) {
    setSelectedIngredients(prev =>
      prev.includes(ingId) ? prev.filter(i => i !== ingId) : [...prev, ingId]
    )
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let image_url = imagePreview

      // Upload image to Cloudinary if a new file was selected
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('upload_preset', 'glowlogic_products')
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        image_url = data.secure_url
      }

      const payload = {
        name, brand, category, description,
        skin_type_tags: skinTypes,
        is_published: isPublished,
        image_url,
        ingredient_ids: selectedIngredients,
      }

      if (isEdit) {
        await api.put(`/admin/products/${id}`, payload)
      } else {
        await api.post('/admin/products', payload)
      }

      navigate('/admin/products')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Admin / Products</p>
        <h1 className="font-display text-display-lg text-gl-ink">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
      </div>

      {error && (
        <div className="bg-gl-danger-light border border-gl-danger-mid text-gl-danger text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Product Name *</label>
          <input
            value={name} onChange={e => setName(e.target.value)} required
            placeholder="e.g. Ultra Repair Cream"
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Brand *</label>
          <input
            value={brand} onChange={e => setBrand(e.target.value)} required
            placeholder="e.g. First Aid Beauty"
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Category *</label>
          <select
            value={category} onChange={e => setCategory(e.target.value)}
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink focus:outline-none focus:border-gl-wildrose"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Description</label>
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            rows={3} placeholder="Short product description..."
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose resize-none"
          />
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Product Image</label>
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="w-32 h-32 object-cover rounded-lg border border-gl-dustypetal mb-2" />
          )}
          <input
            type="file" accept="image/*" onChange={handleImageChange}
            className="text-sm text-gl-stone file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gl-moss file:text-white hover:file:opacity-90"
          />
        </div>

        {/* Skin types */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Suitable Skin Types</label>
          <div className="flex flex-wrap gap-2">
            {SKIN_TYPES.map(type => (
              <button
                key={type} type="button" onClick={() => toggleSkinType(type)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  skinTypes.includes(type)
                    ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble hover:border-gl-dustypetal'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">
            Ingredients ({selectedIngredients.length} selected)
          </label>
          <div className="bg-gl-petalmist border border-gl-pebble rounded-md p-3 max-h-48 overflow-y-auto flex flex-col gap-1">
            {ingredients.map(ing => (
              <label key={ing.id} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ing.id)}
                  onChange={() => toggleIngredient(ing.id)}
                  className="accent-gl-wildrose"
                />
                <span className="text-sm text-gl-ink">{ing.inci_name}</span>
                {ing.common_name && (
                  <span className="text-xs text-gl-stone">({ing.common_name})</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`relative w-10 h-6 rounded-full transition-colors ${isPublished ? 'bg-gl-moss' : 'bg-gl-pebble'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublished ? 'left-5' : 'left-1'}`} />
          </button>
          <span className="text-sm text-gl-ink">
            {isPublished ? 'Published — visible to users' : 'Draft — hidden from users'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="bg-gl-moss text-white font-medium text-sm px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button
            type="button" onClick={() => navigate('/admin/products')}
            className="bg-gl-lavender text-gl-nightbloom font-medium text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}