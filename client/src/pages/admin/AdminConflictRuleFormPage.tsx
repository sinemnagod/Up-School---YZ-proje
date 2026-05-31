import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'

interface Ingredient {
  id: string
  inci_name: string
  common_name: string | null
}

export default function AdminConflictRuleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [ruleName, setRuleName]       = useState('')
  const [ingredientAId, setIngredientAId] = useState('')
  const [ingredientBId, setIngredientBId] = useState('')
  const [scope, setScope]             = useState('SAME_SLOT')
  const [alertType, setAlertType]     = useState('HIGH_IRRITATION')
  const [severity, setSeverity]       = useState('WARNING')
  const [explanation, setExplanation] = useState('')
  const [safeToOverride, setSafeToOverride] = useState(true)
  const [isActive, setIsActive]       = useState(true)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')

  useEffect(() => {
    api.get('/admin/ingredients').then(({ data }) => setIngredients(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/conflict-rules/${id}`).then(({ data }) => {
      setRuleName(data.rule_name)
      setIngredientAId(data.ingredient_a_id)
      setIngredientBId(data.ingredient_b_id)
      setScope(data.conflict_scope)
      setAlertType(data.alert_type)
      setSeverity(data.severity)
      setExplanation(data.explanation)
      setSafeToOverride(data.safe_to_override)
      setIsActive(data.is_active)
    }).catch(() => {})
  }, [id, isEdit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ingredientAId || !ingredientBId) {
      setError('Please select both ingredients')
      return
    }
    if (ingredientAId === ingredientBId) {
      setError('Ingredient A and B must be different')
      return
    }
    setError('')
    setLoading(true)
    try {
      const payload = {
        rule_name: ruleName,
        ingredient_a_id: ingredientAId,
        ingredient_b_id: ingredientBId,
        conflict_scope: scope,
        alert_type: alertType,
        severity,
        explanation,
        safe_to_override: safeToOverride,
        is_active: isActive,
      }
      if (isEdit) {
        await api.put(`/admin/conflict-rules/${id}`, payload)
      } else {
        await api.post('/admin/conflict-rules', payload)
      }
      navigate('/admin/conflict-rules')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = search.length > 0
    ? ingredients.filter(i =>
        i.inci_name.toLowerCase().includes(search.toLowerCase()) ||
        i.common_name?.toLowerCase().includes(search.toLowerCase())
      )
    : ingredients

  function ingredientName(ingId: string) {
    const ing = ingredients.find(i => i.id === ingId)
    return ing ? ing.inci_name : 'Select ingredient'
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">
          Admin / Conflict Rules
        </p>
        <h1 className="font-display text-display-lg text-gl-ink">
          {isEdit ? 'Edit Rule' : 'Add Conflict Rule'}
        </h1>
      </div>

      {error && (
        <div className="bg-gl-danger-light border border-gl-danger-mid text-gl-danger text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Rule Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Rule Name *</label>
          <input
            value={ruleName}
            onChange={e => setRuleName(e.target.value)}
            required
            placeholder="e.g. AHA + Retinol Conflict"
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
        </div>

        {/* Ingredient selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Search Ingredients</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type to filter ingredients..."
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
        </div>

        {/* Ingredient A */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">
            Ingredient A * {ingredientAId && <span className="text-gl-wildrose">— {ingredientName(ingredientAId)}</span>}
          </label>
          <div className="bg-gl-petalmist border border-gl-pebble rounded-md max-h-36 overflow-y-auto">
            {filteredIngredients.map(ing => (
              <button
                key={ing.id}
                type="button"
                onClick={() => setIngredientAId(ing.id)}
                className={`w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between ${
                  ingredientAId === ing.id
                    ? 'bg-gl-plum text-gl-petalmist'
                    : 'text-gl-ink hover:bg-gl-softbloom'
                }`}
              >
                <span>{ing.inci_name}</span>
                {ing.common_name && <span className="text-xs opacity-70">{ing.common_name}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient B */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">
            Ingredient B * {ingredientBId && <span className="text-gl-wildrose">— {ingredientName(ingredientBId)}</span>}
          </label>
          <div className="bg-gl-petalmist border border-gl-pebble rounded-md max-h-36 overflow-y-auto">
            {filteredIngredients.map(ing => (
              <button
                key={ing.id}
                type="button"
                onClick={() => setIngredientBId(ing.id)}
                className={`w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between ${
                  ingredientBId === ing.id
                    ? 'bg-gl-plum text-gl-petalmist'
                    : 'text-gl-ink hover:bg-gl-softbloom'
                }`}
              >
                <span>{ing.inci_name}</span>
                {ing.common_name && <span className="text-xs opacity-70">{ing.common_name}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Conflict Scope */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Conflict Scope</label>
          <div className="flex gap-2">
            {['SAME_SLOT', 'ANY_SLOT'].map(s => (
              <button
                key={s} type="button" onClick={() => setScope(s)}
                className={`text-xs px-4 py-2 rounded-full border transition-all ${
                  scope === s
                    ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <span className="text-xs text-gl-stone">
            Same Slot = only fires if both are in AM or both in PM. Any Slot = always fires.
          </span>
        </div>

        {/* Alert Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Alert Type</label>
          <div className="flex gap-2 flex-wrap">
            {['HIGH_IRRITATION', 'PH_CONFLICT', 'OVERUSE'].map(type => (
              <button
                key={type} type="button" onClick={() => setAlertType(type)}
                className={`text-xs px-4 py-2 rounded-full border transition-all ${
                  alertType === type
                    ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                    : 'bg-gl-petalmist text-gl-stone border-gl-pebble'
                }`}
              >
                {type.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gl-ink">Severity</label>
          <div className="flex gap-2">
            <button
              type="button" onClick={() => setSeverity('WARNING')}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                severity === 'WARNING'
                  ? 'bg-gl-pollen text-gl-nightbloom border-gl-pollen'
                  : 'bg-gl-petalmist text-gl-stone border-gl-pebble'
              }`}
            >
              WARNING
            </button>
            <button
              type="button" onClick={() => setSeverity('DANGER')}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                severity === 'DANGER'
                  ? 'bg-gl-danger text-white border-gl-danger'
                  : 'bg-gl-petalmist text-gl-stone border-gl-pebble'
              }`}
            >
              DANGER
            </button>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gl-ink">Explanation *</label>
          <textarea
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            required
            rows={3}
            placeholder="e.g. Using AHA and Retinol in the same slot may cause significant irritation..."
            className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose resize-none"
          />
          <span className="text-xs text-gl-stone">This text is shown to the user when the alert fires.</span>
        </div>

        {/* Safe to override */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSafeToOverride(!safeToOverride)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              safeToOverride ? 'bg-gl-moss' : 'bg-gl-pebble'
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              safeToOverride ? 'left-5' : 'left-1'
            }`} />
          </button>
          <span className="text-sm text-gl-ink">
            {safeToOverride ? 'User can override and proceed' : 'User must fix this conflict'}
          </span>
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
            {isActive ? 'Rule is active' : 'Rule is disabled'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="bg-gl-moss text-white font-medium text-sm px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Rule'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/conflict-rules')}
            className="bg-gl-lavender text-gl-nightbloom font-medium text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}