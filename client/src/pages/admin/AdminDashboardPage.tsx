import { useEffect, useState } from 'react'
import api from '../../api/client'

interface Stats {
  products: number
  ingredients: number
  users: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, ingredients: 0, users: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
    ]).then(([{ data }]) => setStats(data)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Products',    value: stats.products    },
    { label: 'Total Ingredients', value: stats.ingredients },
    { label: 'Total Users',       value: stats.users       },
  ]

  return (
    <div>
      <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Overview</p>
      <h1 className="font-display text-display-lg text-gl-ink mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6">
            <p className="text-xs text-gl-stone mb-2">{card.label}</p>
            <p className="font-display text-5xl font-light text-gl-plum">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}