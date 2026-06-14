import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const loggedInLinks = [
  { to: '/products', icon: '🔍', label: 'Products' },
  { to: '/routine', icon: '✨', label: 'Routine' },
  { to: '/challenges', icon: '🏠', label: 'Activity' },
  { to: '/profile', icon: '👤', label: 'Profile', iconOnly: true },
]

const mobileTabs = [
  { to: '/products', icon: '🔍', label: 'Shop' },
  { to: '/routine', icon: '✨', label: 'Routine' },
  { to: '/challenges', icon: '🏠', label: 'Home' },
  { to: '/profile', icon: '👤', label: 'Profile', iconOnly: true },
]

function navLinkClass(isActive: boolean) {
  return isActive
    ? 'text-gl-petalmist font-medium'
    : 'text-gl-blush hover:text-gl-petalmist transition-colors'
}

export default function AppLayout() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gl-parchment flex flex-col">
      <header className="bg-gl-plum px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="font-display text-2xl text-gl-petalmist">
          GlowLogic
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {loggedInLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  title={link.label}
                  aria-label={link.label}
                  className={({ isActive }) =>
                    `text-sm flex items-center gap-1.5 ${navLinkClass(isActive)}`
                  }
                >
                  <span className="text-base leading-none">{link.icon}</span>
                  {!link.iconOnly && <span>{link.label}</span>}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="text-gl-blush hover:text-gl-petalmist text-base leading-none p-1"
              >
                🚪
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/products"
                className={({ isActive }) => `text-sm flex items-center gap-1.5 ${navLinkClass(isActive)}`}
              >
                <span className="text-base">🔍</span>
                <span>Products</span>
              </NavLink>
              <Link to="/login" className="text-gl-blush text-sm hover:text-gl-petalmist transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-gl-moss text-white text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {!user && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden text-gl-petalmist text-xl leading-none p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? '×' : '☰'}
          </button>
        )}

        {user && (
          <button
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="md:hidden text-gl-petalmist text-lg leading-none p-1"
          >
            🚪
          </button>
        )}
      </header>

      {!user && menuOpen && (
        <div className="md:hidden bg-gl-plum border-t border-gl-wildrose/30 px-4 py-3 flex flex-col gap-3 z-40">
          <NavLink to="/products" onClick={() => setMenuOpen(false)} className="text-gl-blush text-sm flex items-center gap-2">
            <span>🔍</span> Products
          </NavLink>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gl-blush text-sm">
            Sign in
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-gl-moss text-white text-sm font-medium px-4 py-2 rounded-md text-center"
          >
            Get Started
          </Link>
        </div>
      )}

      <main className={`flex-1 ${user ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>

      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gl-plum border-t border-gl-wildrose/20 z-40">
          <div className="flex items-stretch justify-around">
            {mobileTabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                title={tab.label}
                aria-label={tab.label}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-2 px-1 flex-1 min-w-0 transition-colors ${
                    isActive ? 'text-gl-petalmist' : 'text-gl-blush/70'
                  }`
                }
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                {!tab.iconOnly && (
                  <span className="text-[10px] font-medium truncate w-full text-center mt-0.5">{tab.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
