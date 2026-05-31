import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'

const FUNCTIONS = [
  'HUMECTANT', 'EMOLLIENT', 'EXFOLIANT', 'ANTIOXIDANT',
  'PRESERVATIVE', 'SURFACTANT', 'EMULSIFIER', 'FRAGRANCE',
  'COLORANT', 'ACTIVE', 'OTHER'
]

const SKIN_TYPES = [
  { key: 'oily',        label: 'Oily' },
  { key: 'dry',         label: 'Dry' },
  { key: 'combination', label: 'Combination' },
  { key: 'sensitive',   label: 'Sensitive' },
  { key: 'acne_prone',  label: 'Acne Prone' },
  { key: 'normal',      label: 'Normal' },
]

export default function AdminIngredientFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [inciName, setInciName]       = useState('')
  const [commonName, setCommonName]   = useState('')
  const [functions, setFunctions]     = useState<string[]>([])
  const [comedogenic, setComedogenic] = useState(0)
  const [irritation, setIrritation]   = useState('LOW')
  const [notes, setNotes]             = useState('')
  const [isActive, setIsActive]       = useState(true)
  const [skinFlags, setSkinFlags]     = useState({
    oily: true, dry: true, combination: true,
    sensitive: true, acne_prone: true, normal: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/ingredients/${id}`).then(({ data }) => {
      setInciName(data.inci_name)
      setCommonName(data.common_name ?? '')
      setFunctions(data.functions ?? [])
      setComedogenic(data.comedogenic_rating)
      setIrritation(data.irritation_potential)
      setNotes(data.notes ?? '')
      setIsActive(data.is_active)
      setSkinFlags(data.skin_type_flags)
    }).catch(() => {})
  }, [id, isEdit])

  function toggleFunction(fn: string) {
    setFunctions(prev =>
      prev.includes(fn) ? prev.filter(f => f !== fn) : [...prev, fn]
    )
  }

  function toggleSkinFlag(key: string) {
    setSkinFlags(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        inci_name: inciName,
        common_name: commonName || null,
        functions,
        comedogenic_rating: comedogenic,
        irritation_potential: irritation,
        notes: notes || null,
        is_active: isActive,
        skin_type_flags: skinFlags,
      }
      if (isEdit) {
        await api.put(`/admin/ingredients/${id}`, payload)
      } else {
        await api.post('/admin/ingredients', payload)
      }
      navigate('/admin/ingredients')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
          Admin / Ingredients
        </p>
        <h1 className="font-display text-display-lg text-gl-ink">
          {isEdit ? 'Edit Ingredient' : 'Add Ingredient'}
        </h1>
      </div>

      {error && (
        <div className="bg-gl-danger-light border border-gl-danger-mid text-gl-danger text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* INCI Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">INCI Name *</label>
          <input
            value={inciName}
            onChange={e => setInciName(e.target.value)}
            required
            placeholder="e.g. Niacinamide"
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
          <span className="text-xs text-gl-stone">Official ingredient name as it appears on packaging</span>
        </div>

        {/* Common Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Common Name</label>
          <input
            value={commonName}
            onChange={e => setCommonName(e.target.value)}
            placeholder="e.g. Vitamin B3"
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
        </div>

        {/* Functions */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Functions</label>
          <div className="flex flex-wrap gap-2">
            {FUNCTIONS.map(fn => (
              <button
                key={fn} type="button" onClick={() => toggleFunction(fn)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  functions.includes(fn)
                    ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble hover:border-gl-dustypetal'
                }`}
              >
                {fn}
              </button>
            ))}
          </div>
        </div>

        {/* Comedogenic Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">
            Comedogenic Rating — {comedogenic} / 5
          </label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map(n => (
              <button
                key={n} type="button" onClick={() => setComedogenic(n)}
                className={`w-10 h-10 rounded-lg text-sm font-medium border transition-all ${
                  comedogenic === n
                    ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble hover:border-gl-dustypetal'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <span className="text-xs text-gl-stone">0 = non-comedogenic, 5 = highly comedogenic</span>
        </div>

        {/* Irritation Potential */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Irritation Potential</label>
          <div className="flex gap-2">
            {['LOW', 'MEDIUM', 'HIGH'].map(level => (
              <button
                key={level} type="button" onClick={() => setIrritation(level)}
                className={`text-xs px-4 py-2 rounded-full border transition-all ${
                  irritation === level
                    ? level === 'HIGH'
                      ? 'bg-gl-danger text-white border-gl-danger'
                      : level === 'MEDIUM'
                      ? 'bg-gl-pollen text-gl-nightbloom border-gl-pollen'
                      : 'bg-gl-moss text-white border-gl-moss'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble hover:border-gl-dustypetal'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Skin Type Flags */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">
            Suitable for Skin Types
          </label>
          <div className="flex flex-wrap gap-2">
            {SKIN_TYPES.map(({ key, label }) => (
              <button
                key={key} type="button"
                onClick={() => toggleSkinFlag(key)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  skinFlags[key as keyof typeof skinFlags]
                    ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gl-stone">
            Highlighted = suitable for this skin type
          </span>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Internal Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Any notes about this ingredient..."
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose resize-none"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              isActive ? 'bg-gl-moss' : 'bg-gl-pebble'
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              isActive ? 'left-5' : 'left-1'
            }`} />
          </button>
          <span className="text-sm text-gl-ink">
            {isActive ? 'Active — visible in ingredient picker' : 'Inactive — hidden'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="bg-gl-moss text-white font-medium text-sm px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Ingredient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/ingredients')}
            className="bg-gl-lavender text-gl-nightbloom font-medium text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}