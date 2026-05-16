import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/admin',             label: 'Dashboard',   exact: true },
  { to: '/admin/products',    label: 'Products'  },
  { to: '/admin/ingredients', label: 'Ingredients' },
]

export default function AdminLayout() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gl-parchment flex flex-col">

      {/* Top bar */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <span className="font-display text-2xl text-gl-petalmist">
          GlowLogic <span className="text-gl-dustypetal text-lg font-body font-normal">Admin</span>
        </span>
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

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-52 bg-gl-softbloom border-r border-gl-dustypetal p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `text-sm px-3 py-2.5 rounded-md transition-all ${
                  isActive
                    ? 'bg-gl-petalmist text-gl-plum font-medium'
                    : 'text-gl-stone hover:bg-gl-petalmist hover:text-gl-plum'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}