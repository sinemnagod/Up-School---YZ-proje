import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.accessToken)
      navigate('/products')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gl-parchment flex items-center justify-center p-4">
      <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-8 w-full max-w-md">

        <h1 className="font-display text-display-lg text-gl-ink mb-2">
          Welcome back
        </h1>
        <p className="text-gl-stone text-sm mb-8">
          Sign in to your GlowLogic account
        </p>

        {error && (
          <div className="bg-gl-danger-light border border-gl-danger-mid text-gl-danger text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gl-ink">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gl-ink">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gl-moss text-white font-medium text-sm px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gl-stone mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gl-wildrose font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}