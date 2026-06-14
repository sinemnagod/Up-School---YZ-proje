import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import EmptyState from '../components/EmptyState'
import { ProfileSkeleton } from '../components/skeletons/Skeletons'
import { getApiErrorMessage } from '../utils/apiError'
import { toastError, toastSuccess } from '../store/toastStore'

const SKIN_TYPES = ['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'ACNE_PRONE', 'NORMAL']

interface Ingredient {
  id: string
  inci_name: string
  common_name: string | null
}

interface Trigger {
  id: string
  ingredient_id: string
  personal_note: string | null
  ingredient: Ingredient
}

export default function ProfilePage() {
  const { user } = useAuthStore()

  const [skinType, setSkinType] = useState<string>('')
  const [savedSkinType, setSavedSkinType] = useState<string>('')
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const [profileResult, triggersResult, ingredientsResult] = await Promise.allSettled([
        api.get('/user/profile'),
        api.get('/user/triggers'),
        api.get('/ingredients'),
      ])

      if (cancelled) return

      if (profileResult.status === 'fulfilled') {
        setSkinType(profileResult.value.data.skin_type ?? '')
        setSavedSkinType(profileResult.value.data.skin_type ?? '')
      } else {
        toastError(getApiErrorMessage(profileResult.reason, 'Could not load profile.'))
      }

      if (triggersResult.status === 'fulfilled') {
        setTriggers(triggersResult.value.data)
      } else {
        toastError(getApiErrorMessage(triggersResult.reason, 'Could not load triggers.'))
      }

      if (ingredientsResult.status === 'fulfilled') {
        setAllIngredients(ingredientsResult.value.data)
      }

      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  async function saveSkinType() {
    setSaving(true)
    try {
      await api.put('/user/profile', { skin_type: skinType })
      setSavedSkinType(skinType)
      toastSuccess('Skin type saved!')
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not save skin type.'))
    } finally {
      setSaving(false)
    }
  }

  async function addTrigger(ingredient: Ingredient) {
    if (triggers.find(t => t.ingredient_id === ingredient.id)) return
    try {
      const { data } = await api.post('/user/triggers', { ingredient_id: ingredient.id })
      setTriggers(prev => [...prev, data])
      setSearch('')
      toastSuccess(`${ingredient.inci_name} added to blacklist.`)
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not add ingredient.'))
    }
  }

  async function removeTrigger(id: string) {
    try {
      await api.delete(`/user/triggers/${id}`)
      setTriggers(prev => prev.filter(t => t.id !== id))
      toastSuccess('Ingredient removed from blacklist.')
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not remove ingredient.'))
    }
  }

  const filteredIngredients = search.length > 1
    ? allIngredients.filter(i =>
        i.inci_name.toLowerCase().includes(search.toLowerCase()) ||
        i.common_name?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : []

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Account</p>
      <h1 className="font-display text-display-lg text-gl-ink mb-2">My Profile</h1>
      {user?.email && (
        <p className="text-sm text-gl-stone mb-10">{user.email}</p>
      )}

      <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6 mb-6">
        <h2 className="font-display text-display-md text-gl-ink mb-1">Skin Type</h2>
        <p className="text-xs text-gl-stone mb-5">This helps us score product compatibility for you.</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {SKIN_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSkinType(type)}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                skinType === type
                  ? 'bg-gl-plum text-gl-petalmist border-gl-plum'
                  : 'bg-gl-petalmist text-gl-stone border-gl-pebble hover:border-gl-dustypetal'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button
          onClick={saveSkinType}
          disabled={saving || skinType === savedSkinType || !skinType}
          className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-all disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save Skin Type'}
        </button>
        {!savedSkinType && (
          <p className="text-xs text-gl-wildrose mt-3">
            Tip: Set your skin type to get personalised product scores.{' '}
            <Link to="/products" className="underline">Browse products →</Link>
          </p>
        )}
      </section>

      <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6">
        <h2 className="font-display text-display-md text-gl-ink mb-1">Ingredient Blacklist</h2>
        <p className="text-xs text-gl-stone mb-5">Add ingredients you want to avoid. We'll flag them on every product.</p>

        <div className="relative mb-5">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ingredient to add..."
            className="w-full bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
          />
          {filteredIngredients.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gl-white border border-gl-dustypetal rounded-md shadow-lg z-10 overflow-hidden">
              {filteredIngredients.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => addTrigger(ing)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gl-ink hover:bg-gl-petalmist flex items-center justify-between"
                >
                  <span>{ing.inci_name}</span>
                  {ing.common_name && <span className="text-xs text-gl-stone">{ing.common_name}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {triggers.length === 0 ? (
          <EmptyState
            title="No ingredients blacklisted yet"
            description="Search above to add ingredients your skin reacts to. They'll be flagged on every product you view."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {triggers.map(trigger => (
              <div
                key={trigger.id}
                className="flex items-center gap-2 bg-gl-danger-light border border-gl-danger-mid text-gl-danger text-xs px-3 py-1.5 rounded-full"
              >
                <span>{trigger.ingredient.inci_name}</span>
                <button onClick={() => removeTrigger(trigger.id)} className="hover:opacity-70 font-bold leading-none">×</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
