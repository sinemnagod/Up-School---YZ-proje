import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  is_published: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  function fetchProducts() {
    api.get('/admin/products')
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await api.delete(`/admin/products/${id}`)
    fetchProducts()
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await api.put(`/admin/products/${id}`, { is_published: !current })
    fetchProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Admin</p>
          <h1 className="font-display text-display-lg text-gl-ink">Products</h1>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gl-stone text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gl-stone text-sm">No products yet. Add your first one.</p>
      ) : (
        <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gl-dustypetal bg-gl-petalmist">
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Brand</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={`border-b border-gl-pebble ${i % 2 === 0 ? '' : 'bg-gl-petalmist'}`}>
                  <td className="px-5 py-3 font-display text-base text-gl-ink">{p.name}</td>
                  <td className="px-5 py-3 text-gl-stone">{p.brand}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gl-softbloom text-gl-plum border border-gl-dustypetal">
                      {p.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleTogglePublish(p.id, p.is_published)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                        p.is_published
                          ? 'bg-gl-moss text-white'
                          : 'bg-gl-petalmist text-gl-stone border border-gl-pebble'
                      }`}
                    >
                      {p.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="text-gl-wildrose text-xs font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-gl-danger text-xs font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
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