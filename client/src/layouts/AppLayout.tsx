import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function FlowerShopIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path style={{fill:'#FCE469'}} d="M306.992,33.526c-6.035-7.66-14.993-11.651-24.043-11.656c-5.604-7.105-14.283-11.671-24.034-11.671c-9.469,0-17.932,4.302-23.546,11.057c-8.783,0.005-17.499,3.768-23.548,11.054c-9.394,11.316-9.255,27.391-0.494,38.489c-9.042,10.87-9.592,26.936-0.491,38.489c6.035,7.66,14.993,11.651,24.043,11.656c5.604,7.105,14.284,11.671,24.035,11.671c9.469,0,17.932-4.302,23.546-11.057c8.783-0.005,17.499-3.768,23.548-11.054c9.394-11.316,9.255-27.391,0.494-38.489C315.543,61.144,316.094,45.078,306.992,33.526z"/>
      <circle style={{fill:'#FFA22B'}} cx="258.917" cy="70.823" r="18.095"/>
      <path style={{fill:'#FF5E8A'}} d="M133.302,74.787c-7.746-0.919-15.072,1.891-20.194,7.007c-7.189-0.849-14.682,1.478-20.199,6.994c-5.357,5.357-7.711,12.578-7.065,19.574c-4.966,4.971-7.768,12.03-7.067,19.573c1.087,11.715,10.259,20.73,21.493,22.052c1.034,11.264,9.812,20.664,21.495,22.05c7.746,0.919,15.072-1.891,20.194-7.007c7.189,0.849,14.682-1.478,20.199-6.994c5.357-5.357,7.711-12.578,7.065-19.574c4.966-4.971,7.768-12.03,7.067-19.573c-1.087-11.715-10.259-20.73-21.493-22.052C153.762,85.572,144.986,76.173,133.302,74.787z"/>
      <circle style={{fill:'#FFCC85'}} cx="127.204" cy="123.074" r="14.476"/>
      <path style={{fill:'#FCE469'}} d="M33.526,205.008c-7.66,6.035-11.651,14.993-11.656,24.043c-7.105,5.604-11.671,14.283-11.671,24.034c0,9.469,4.302,17.932,11.057,23.546c0.005,8.783,3.768,17.499,11.054,23.548c11.316,9.394,27.391,9.255,38.489,0.494c10.87,9.042,26.936,9.592,38.489,0.491c7.66-6.035,11.651-14.993,11.656-24.043c7.105-5.604,11.671-14.284,11.671-24.035c0-9.469-4.302-17.932-11.057-23.546c-0.005-8.783-3.768-17.499-11.054-23.548c-11.316-9.394-27.391-9.255-38.489-0.494C61.144,196.457,45.078,195.906,33.526,205.008z"/>
      <circle style={{fill:'#FFA22B'}} cx="70.823" cy="253.083" r="18.095"/>
      <path style={{fill:'#FF5E8A'}} d="M74.787,378.698c-0.919,7.746,1.891,15.072,7.007,20.194c-0.849,7.189,1.478,14.682,6.994,20.199c5.357,5.357,12.578,7.711,19.574,7.065c4.971,4.966,12.03,7.768,19.573,7.067c11.715-1.087,20.73-10.259,22.052-21.493c11.264-1.034,20.664-9.812,22.05-21.495c0.919-7.746-1.891-15.072-7.007-20.194c0.849-7.189-1.478-14.682-6.994-20.198c-5.357-5.357-12.578-7.711-19.574-7.065c-4.971-4.966-12.03-7.768-19.573-7.067c-11.715,1.087-20.73,10.259-22.052,21.493C85.572,358.238,76.173,367.014,74.787,378.698z"/>
      <circle style={{fill:'#FFCC85'}} cx="123.074" cy="384.796" r="14.476"/>
      <path style={{fill:'#FCE469'}} d="M205.008,478.474c6.035,7.66,14.993,11.651,24.043,11.656c5.604,7.105,14.284,11.671,24.035,11.671c9.469,0,17.932-4.302,23.546-11.057c8.783-0.005,17.499-3.768,23.548-11.054c9.395-11.316,9.255-27.391,0.494-38.489c9.042-10.87,9.592-26.936,0.491-38.489c-6.035-7.66-14.993-11.651-24.043-11.656c-5.604-7.105-14.284-11.671-24.035-11.671c-9.469,0-17.932,4.302-23.546,11.057c-8.783,0.004-17.499,3.768-23.548,11.054c-9.394,11.316-9.255,27.391-0.494,38.489C196.457,450.856,195.906,466.922,205.008,478.474z"/>
      <circle style={{fill:'#FFA22B'}} cx="253.083" cy="441.177" r="18.095"/>
      <path style={{fill:'#FF5E8A'}} d="M378.698,437.213c7.746,0.919,15.072-1.891,20.194-7.007c7.189,0.849,14.682-1.478,20.199-6.994c5.357-5.357,7.711-12.578,7.065-19.574c4.966-4.971,7.768-12.03,7.067-19.573c-1.087-11.715-10.259-20.73-21.493-22.052c-1.034-11.264-9.812-20.664-21.495-22.05c-7.746-0.919-15.072,1.891-20.194,7.007c-7.189-0.849-14.682,1.478-20.198,6.994c-5.357,5.357-7.711,12.578-7.065,19.574c-4.966,4.971-7.768,12.03-7.067,19.573c1.087,11.715,10.259,20.73,21.493,22.052C358.238,426.428,367.014,435.827,378.698,437.213z"/>
      <circle style={{fill:'#FFCC85'}} cx="384.796" cy="388.916" r="14.476"/>
      <path style={{fill:'#FCE469'}} d="M478.474,306.992c7.66-6.035,11.651-14.993,11.656-24.043c7.105-5.604,11.671-14.284,11.671-24.035c0-9.469-4.302-17.932-11.057-23.546c-0.005-8.783-3.768-17.499-11.054-23.548c-11.316-9.394-27.391-9.255-38.489-0.494c-10.87-9.042-26.936-9.592-38.489-0.491c-7.66,6.035-11.651,14.993-11.656,24.043c-7.105,5.604-11.671,14.284-11.671,24.035c0,9.469,4.302,17.932,11.057,23.546c0.004,8.783,3.768,17.499,11.054,23.548c11.316,9.395,27.391,9.255,38.489,0.494C450.856,315.543,466.922,316.094,478.474,306.992z"/>
      <circle style={{fill:'#FFA22B'}} cx="441.177" cy="258.917" r="18.095"/>
      <path style={{fill:'#FF5E8A'}} d="M437.213,133.302c0.919-7.746-1.891-15.072-7.007-20.194c0.849-7.189-1.478-14.682-6.994-20.199c-5.357-5.357-12.578-7.711-19.574-7.065c-4.971-4.966-12.03-7.768-19.573-7.067c-11.715,1.087-20.73,10.259-22.052,21.493c-11.264,1.034-20.664,9.812-22.05,21.495c-0.919,7.746,1.891,15.072,7.007,20.194c-0.849,7.189,1.478,14.682,6.994,20.199c5.357,5.357,12.578,7.711,19.574,7.065c4.971,4.966,12.03,7.768,19.573,7.067c11.715-1.087,20.73-10.259,22.052-21.493C426.428,153.762,435.827,144.986,437.213,133.302z"/>
      <circle style={{fill:'#FFCC85'}} cx="388.916" cy="127.204" r="14.476"/>
    </svg>
  )
}

function BouquetIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g fill="#a0ece6">
        <path d="M28.28 37.32c-1.022-.789-2.263.781-1.242 1.568c2.405 1.857 3.734 4.264 4.431 6.916c-2.759-.672-6.519.057-8.47 1.75c-.454.393-.593 1.199-.023 1.584c2.563 1.734 6.292 1.539 9.08.227c.303 4.03-.354 8.309-.766 11.984c-.141 1.277 1.842 1.547 1.985.262c.905-8.135 2.501-18.504-4.996-24.291"/>
        <path d="M40.37 34.805c1.022-.789 2.262.781 1.242 1.568c-2.406 1.855-3.734 4.264-4.431 6.916c2.759-.674 6.519.057 8.47 1.748c.454.393.592 1.201.023 1.586c-2.564 1.732-6.293 1.537-9.08.225c-.302 4.03.355 8.309.766 11.984c.142 1.279-1.841 1.547-1.984.262c-.904-8.133-2.502-18.504 4.996-24.289"/>
      </g>
      <path fill="#ff8fa3" d="M32 8c-4 0-7 3-7 7s3 7 7 7s7-3 7-7s-3-7-7-7z"/>
      <path fill="#ffb3ba" d="M22 14c-3 0-5 2-5 5s2 5 5 5c1.5 0 2.8-.6 3.8-1.6C24.6 21.6 24 20.4 24 19c0-2.2 1.1-4.1 2.8-5.3C25.8 13.3 24 13 22 13z"/>
      <path fill="#ffb3ba" d="M42 14c2 0 3.8.9 5 2.4c.1.5.2 1.1.2 1.6c0 2.8-2.2 5-5 5c-1 0-2-.3-2.8-.8C40.4 21 41 19.6 41 18c0-1.8-.7-3.4-1.8-4.6C40 13.2 41 14 42 14z"/>
      <path fill="#ffd54f" d="M32 18c0 0-3-4-3-6h6c0 2-3 6-3 6z"/>
      <circle cx="32" cy="20" r="3" fill="#ff6b9d"/>
      <path fill="#7cb342" d="M29 28c0 0-5-3-5-8h3c0 3 2 6 2 8z"/>
      <path fill="#7cb342" d="M35 28c0 0 5-3 5-8h-3c0 3-2 6-2 8z"/>
      <path fill="#ff6b9d" d="M25 22c-2-1-4 0-5 2s0 4 2 5s4 0 5-2s0-4-2-5z"/>
      <path fill="#ff6b9d" d="M39 22c2-1 4 0 5 2s0 4-2 5s-4 0-5-2s0-4 2-5z"/>
    </svg>
  )
}

function PollenIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path fill="#f783ac" stroke="#f06595" strokeMiterlimit="10" strokeWidth="2" d="M327.5 258.6a74.1 74.1 0 0 0-17.7-5.8a74.3 74.3 0 0 0 10-15.8c13.5-28.5 7.1-59.8-14.2-69.8s-49.6 4.8-63 33.3a74.3 74.3 0 0 0-5.8 17.7a74.5 74.5 0 0 0-15.7-10c-28.5-13.5-59.8-7.1-70 14.2s5 49.6 33.4 63a74.6 74.6 0 0 0 17.7 5.8a74.3 74.3 0 0 0-10 15.8c-13.4 28.5-7 59.7 14.3 69.8s49.5-4.8 63-33.3a74.2 74.2 0 0 0 5.7-17.7a75 75 0 0 0 15.8 10c28.5 13.4 59.8 7 69.9-14.3s-4.9-49.5-33.4-63z"/>
      <circle cx="256" cy="272" r="22" fill="#ffd54f" stroke="#f8af18" strokeWidth="2"/>
    </svg>
  )
}

const loggedInLinks = [
  { to: '/products',   icon: <FlowerShopIcon />, label: 'Products' },
  { to: '/routine',    icon: <PollenIcon />,     label: 'Routine' },
  { to: '/challenges', icon: <BouquetIcon />,    label: 'Activity' },
  { to: '/profile',    icon: '👤',               label: 'Profile', iconOnly: true },
]

const mobileTabs = [
  { to: '/products',   icon: <FlowerShopIcon />, label: 'Shop' },
  { to: '/routine',    icon: <PollenIcon />,      label: 'Routine' },
  { to: '/challenges', icon: <BouquetIcon />,     label: 'Activity' },
  { to: '/profile',    icon: '👤',                label: 'Profile', iconOnly: true },
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
    navigate('/')
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
