import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  image_url: string | null
}

interface RoutineSlot {
  id: string
  product_id: string
  slot: 'AM' | 'PM'
  step_order: number
  product: Product
}

interface ConflictAlert {
  rule_name: string
  alert_type: string
  severity: string
  explanation: string
  safe_to_override: boolean
  rule_id: string
}

const STEPS = [
  { order: 1, label: 'Cleanser' },
  { order: 2, label: 'Toner' },
  { order: 3, label: 'Serum' },
  { order: 4, label: 'Moisturizer' },
  { order: 5, label: 'SPF / Oil' },
]

export default function RoutinePage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const [amSlots, setAmSlots] = useState<RoutineSlot[]>([])
  const [pmSlots, setPmSlots] = useState<RoutineSlot[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [conflicts, setConflicts] = useState<ConflictAlert[]>([])
  const [overloads, setOverloads] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [searchModal, setSearchModal] = useState<{ slot: 'AM' | 'PM'; step: number } | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [dismissedConflicts, setDismissedConflicts] = useState<string[]>([])

  useEffect(() => {
    api.get('/routine').then(({ data }) => {
      setAmSlots(data.filter((s: RoutineSlot) => s.slot === 'AM'))
      setPmSlots(data.filter((s: RoutineSlot) => s.slot === 'PM'))
    }).catch(() => {})

    api.get('/products').then(({ data }) => setAllProducts(data)).catch(() => {})
  }, [])

  function getSlotProduct(slot: 'AM' | 'PM', stepOrder: number): RoutineSlot | undefined {
    const slots = slot === 'AM' ? amSlots : pmSlots
    return slots.find(s => s.step_order === stepOrder)
  }

  function addToSlot(product: Product, slot: 'AM' | 'PM', stepOrder: number) {
    const newSlot: RoutineSlot = {
      id: crypto.randomUUID(),
      product_id: product.id,
      slot,
      step_order: stepOrder,
      product,
    }
    if (slot === 'AM') {
      setAmSlots(prev => [...prev.filter(s => s.step_order !== stepOrder), newSlot])
    } else {
      setPmSlots(prev => [...prev.filter(s => s.step_order !== stepOrder), newSlot])
    }
    setSearchModal(null)
    setProductSearch('')
  }

  function removeFromSlot(slot: 'AM' | 'PM', stepOrder: number) {
    if (slot === 'AM') setAmSlots(prev => prev.filter(s => s.step_order !== stepOrder))
    else setPmSlots(prev => prev.filter(s => s.step_order !== stepOrder))
  }

  async function saveRoutine() {
    setSaving(true)
    try {
      const slots = [
        ...amSlots.map(s => ({ product_id: s.product_id, slot: 'AM', step_order: s.step_order })),
        ...pmSlots.map(s => ({ product_id: s.product_id, slot: 'PM', step_order: s.step_order })),
      ]
      await api.put('/routine', { slots })

      // Run conflict check
      const { data } = await api.get('/routine/conflicts')
      setConflicts(data.conflicts ?? [])
      setOverloads(data.overloads ?? [])

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {}
    finally { setSaving(false) }
  }

  function dismissConflict(ruleId: string) {
    setDismissedConflicts(prev => [...prev, ruleId])
  }

  const visibleConflicts = conflicts.filter(c => !dismissedConflicts.includes(c.rule_id))
  const filteredProducts = productSearch.length > 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase())
      )
    : allProducts

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gl-parchment">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-gl-petalmist">GlowLogic</h1>
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-gl-blush text-sm hover:text-gl-petalmist">Products</Link>
          <Link to="/dashboard" className="text-gl-blush text-sm hover:text-gl-petalmist">Dashboard</Link>
          <Link to="/profile" className="text-gl-blush text-sm hover:text-gl-petalmist">Profile</Link>
          <button onClick={handleLogout} className="bg-gl-lavender text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Skincare</p>
        <h2 className="font-display text-display-lg text-gl-ink mb-8">My Routine</h2>

        {/* Conflict Alerts */}
        {visibleConflicts.length > 0 && (
          <div className="flex flex-col gap-3 mb-8">
            {visibleConflicts.map(conflict => (
              <div
                key={conflict.rule_id}
                className={`rounded-lg p-4 border-l-4 ${
                  conflict.severity === 'DANGER'
                    ? 'bg-gl-danger-light border-gl-danger'
                    : 'bg-[#FFFBEF] border-gl-pollen'
                }`}
              >
                <p className={`text-sm font-medium mb-1 ${conflict.severity === 'DANGER' ? 'text-[#8B1B1B]' : 'text-[#7A4F00]'}`}>
                  {conflict.rule_name}
                </p>
                <p className={`text-xs mb-3 ${conflict.severity === 'DANGER' ? 'text-[#A33030]' : 'text-[#6B4500]'}`}>
                  {conflict.explanation}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => dismissConflict(conflict.rule_id)}
                    className="text-xs px-3 py-1.5 bg-white/60 rounded-md text-gl-stone hover:bg-white transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overload Warning */}
        {overloads.length > 0 && (
          <div className="bg-[#F5EDD4] border-l-4 border-gl-pollen rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-[#7A4F00] mb-1">Ingredient Overload Detected</p>
            <p className="text-xs text-[#6B4500]">
              {overloads.join(', ')} appear in 3 or more products in your routine.
            </p>
          </div>
        )}

        {/* Routine Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {(['AM', 'PM'] as const).map(slot => (
            <div key={slot}>
              <h3 className="font-display text-display-md text-gl-ink mb-4">
                {slot === 'AM' ? '☀️' : '🌙'} {slot} Routine
              </h3>
              <div className="flex flex-col gap-3">
                {STEPS.filter(s => !(slot === 'AM' && s.order === 5) || slot === 'AM').map(step => {
                  const filled = getSlotProduct(slot, step.order)
                  return (
                    <div key={step.order} className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-4">
                      <p className="text-xs font-medium tracking-wider uppercase text-gl-stone mb-2">
                        Step {step.order} — {step.label}
                      </p>

                      {filled ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Mini image */}
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gl-blush to-gl-softbloom flex items-center justify-center flex-shrink-0 overflow-hidden border border-gl-pebble">
                              {filled.product.image_url ? (
                                <img src={filled.product.image_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-display text-sm text-gl-dustypetal">
                                  {filled.product.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gl-ink truncate">{filled.product.name}</p>
                              <p className="text-xs text-gl-stone">{filled.product.brand}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromSlot(slot, step.order)}
                            className="text-gl-danger text-xs hover:underline flex-shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setSearchModal({ slot, step: step.order }); setProductSearch('') }}
                          className="w-full text-xs text-gl-stone border border-dashed border-gl-pebble rounded-lg py-3 hover:border-gl-wildrose hover:text-gl-wildrose transition-all"
                        >
                          + Add product
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={saveRoutine}
            disabled={saving}
            className="bg-gl-moss text-white font-medium text-sm px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Routine & Check Conflicts'}
          </button>
          {saved && (
            <span className="text-sm text-[#3D5030]">✓ Routine saved!</span>
          )}
        </div>
      </main>

      {/* Product Search Modal */}
      {searchModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-gl-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-gl-plum px-5 py-4 flex items-center justify-between">
              <p className="text-gl-petalmist font-medium text-sm">
                Add to {searchModal.slot} — {STEPS.find(s => s.order === searchModal.step)?.label}
              </p>
              <button
                onClick={() => setSearchModal(null)}
                className="text-gl-blush hover:text-gl-petalmist text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <input
                autoFocus
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2.5 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose mb-3"
              />
              <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToSlot(p, searchModal.slot, searchModal.step)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gl-petalmist transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gl-blush to-gl-softbloom flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.image_url
                        ? <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        : <span className="font-display text-xs text-gl-dustypetal">{p.name.charAt(0)}</span>
                      }
                    </div>
                    <div>
                      <p className="text-sm text-gl-ink font-medium">{p.name}</p>
                      <p className="text-xs text-gl-stone">{p.brand}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}