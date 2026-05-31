import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

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
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const [skinType, setSkinType]       = useState<string>('')
  const [savedSkinType, setSavedSkinType] = useState<string>('')
  const [triggers, setTriggers]       = useState<Trigger[]>([])
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([])
  const [search, setSearch]           = useState('')
  const [saving, setSaving]           = useState(false)
  const [successMsg, setSuccessMsg]   = useState('')

  useEffect(() => {
    // Load profile
    api.get('/user/profile')
      .then(({ data }) => {
        setSkinType(data.skin_type ?? '')
        setSavedSkinType(data.skin_type ?? '')
      }).catch(() => {})

    // Load triggers
    api.get('/user/triggers')
      .then(({ data }) => setTriggers(data))
      .catch(() => {})

    // Load all ingredients for search
    api.get('/admin/ingredients')
      .then(({ data }) => setAllIngredients(data))
      .catch(() => {})
  }, [])

  async function saveSkinType() {
    setSaving(true)
    try {
      await api.put('/user/profile', { skin_type: skinType })
      setSavedSkinType(skinType)
      setSuccessMsg('Skin type saved!')
      setTimeout(() => setSuccessMsg(''), 2500)
    } catch {}
    finally { setSaving(false) }
  }

  async function addTrigger(ingredient: Ingredient) {
    if (triggers.find(t => t.ingredient_id === ingredient.id)) return
    try {
      const { data } = await api.post('/user/triggers', { ingredient_id: ingredient.id })
      setTriggers(prev => [...prev, data])
      setSearch('')
    } catch {}
  }

  async function removeTrigger(id: string) {
    try {
      await api.delete(`/user/triggers/${id}`)
      setTriggers(prev => prev.filter(t => t.id !== id))
    } catch {}
  }

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  const filteredIngredients = search.length > 1
    ? allIngredients.filter(i =>
        i.inci_name.toLowerCase().includes(search.toLowerCase()) ||
        i.common_name?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : []

  return (
    <div className="min-h-screen bg-gl-parchment">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/products')} className="font-display text-2xl text-gl-petalmist">
          GlowLogic
        </button>
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

      <main className="max-w-2xl mx-auto px-6 py-10">

        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Account</p>
        <h1 className="font-display text-display-lg text-gl-ink mb-10">My Profile</h1>

        {successMsg && (
          <div className="bg-[#E2EDD6] border border-gl-moss text-[#3D5030] text-sm px-4 py-3 rounded-lg mb-6">
            {successMsg}
          </div>
        )}

        {/* Skin type */}
        <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6 mb-6">
          <h2 className="font-display text-display-md text-gl-ink mb-1">Skin Type</h2>
          <p className="text-xs text-gl-stone mb-5">
            This helps us score product compatibility for you.
          </p>
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
            disabled={saving || skinType === savedSkinType}
            className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-all disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Skin Type'}
          </button>
        </section>

        {/* Trigger blacklist */}
        <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6">
          <h2 className="font-display text-display-md text-gl-ink mb-1">Ingredient Blacklist</h2>
          <p className="text-xs text-gl-stone mb-5">
            Add ingredients you want to avoid. We'll flag them on every product.
          </p>

          {/* Search */}
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
                    {ing.common_name && (
                      <span className="text-xs text-gl-stone">{ing.common_name}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current triggers */}
          {triggers.length === 0 ? (
            <p className="text-sm text-gl-stone">No ingredients blacklisted yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {triggers.map(trigger => (
                <div
                  key={trigger.id}
                  className="flex items-center gap-2 bg-gl-danger-light border border-gl-danger-mid text-gl-danger text-xs px-3 py-1.5 rounded-full"
                >
                  <span>{trigger.ingredient.inci_name}</span>
                  <button
                    onClick={() => removeTrigger(trigger.id)}
                    className="hover:opacity-70 font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}