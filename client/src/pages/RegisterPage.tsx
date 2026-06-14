import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { getApiErrorMessage } from '../utils/apiError'
import { toastSuccess } from '../store/toastStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', { email, password })
      toastSuccess('Account created! Please sign in.')
      navigate('/login')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gl-parchment flex flex-col">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-gl-petalmist">
          GlowLogic
        </Link>
        <Link
          to="/login"
          className="text-gl-blush text-sm hover:text-gl-petalmist transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-8 w-full max-w-md">

          <h1 className="font-display text-display-lg text-gl-ink mb-2">
            Create account
          </h1>
          <p className="text-gl-stone text-sm mb-8">
            Start your GlowLogic journey
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
                placeholder="Min. 8 characters"
                required
                className="bg-gl-petalmist border border-gl-pebble rounded-md px-3 py-2 text-sm text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gl-moss text-white font-medium text-sm px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gl-stone mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gl-wildrose font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gl-nightbloom px-6 py-6 text-center">
        <Link to="/" className="font-display text-xl text-gl-petalmist block mb-1">
          GlowLogic
        </Link>
        <p className="text-gl-stone text-xs">Find solutions to all of your skin concerns</p>
      </footer>

    </div>
  )
}