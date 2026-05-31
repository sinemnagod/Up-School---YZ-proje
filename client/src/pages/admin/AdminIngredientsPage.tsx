import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'

interface Ingredient {
  id: string
  inci_name: string
  common_name: string | null
  comedogenic_rating: number
  irritation_potential: string
  is_active: boolean
}

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/ingredients')
      .then(({ data }) => setIngredients(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Admin</p>
          <h1 className="font-display text-display-lg text-gl-ink">Ingredients</h1>
        </div>
        <Link
          to="/admin/ingredients/new"
          className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
        >
          + Add Ingredient
        </Link>
      </div>

      {loading ? (
        <p className="text-gl-stone text-sm">Loading...</p>
      ) : (
        <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gl-dustypetal bg-gl-petalmist">
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">INCI Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Common Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Comedogenic</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Irritation</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr key={ing.id} className={`border-b border-gl-pebble ${i % 2 === 0 ? '' : 'bg-gl-petalmist'}`}>
                  <td className="px-5 py-3 text-gl-ink font-medium">{ing.inci_name}</td>
                  <td className="px-5 py-3 text-gl-stone">{ing.common_name ?? '—'}</td>
                  <td className="px-5 py-3 text-gl-stone">{ing.comedogenic_rating} / 5</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      ing.irritation_potential === 'HIGH'
                        ? 'bg-gl-danger-light text-gl-danger'
                        : ing.irritation_potential === 'MEDIUM'
                        ? 'bg-[#F5EDD4] text-[#6B540A]'
                        : 'bg-gl-softbloom text-gl-plum'
                    }`}>
                      {ing.irritation_potential}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      ing.is_active ? 'bg-gl-moss text-white' : 'bg-gl-petalmist text-gl-stone'
                    }`}>
                      {ing.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/ingredients/${ing.id}/edit`}
                      className="text-gl-wildrose text-xs font-medium hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}