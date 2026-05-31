import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

interface Challenge {
  id: string
  title: string
  description: string
  goal_days: number
  start_date: string
  end_date: string
  badge_icon: string | null
}

interface Enrollment {
  id: string
  title: string
  description: string
  goal_days: number
  current_days: number
  completed: boolean
}

export default function ChallengesPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [enrolled, setEnrolled] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  function fetchData() {
    Promise.all([
      api.get('/challenges'),
      api.get('/challenges/mine'),
    ]).then(([{ data: all }, { data: mine }]) => {
      setChallenges(Array.isArray(all) ? all : [])
      setEnrolled(Array.isArray(mine) ? mine : [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  async function handleEnroll(challengeId: string) {
    setEnrolling(challengeId)
    try {
      await api.post(`/challenges/${challengeId}/enroll`)
      fetchData()
    } catch {}
    finally { setEnrolling(null) }
  }

  const enrolledIds = new Set(enrolled.map(e => e.id))

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
          <Link to="/products"  className="text-gl-blush text-sm hover:text-gl-petalmist">Products</Link>
          <Link to="/dashboard" className="text-gl-blush text-sm hover:text-gl-petalmist">Dashboard</Link>
          <Link to="/routine"   className="text-gl-blush text-sm hover:text-gl-petalmist">Routine</Link>
          <Link to="/profile"   className="text-gl-blush text-sm hover:text-gl-petalmist">Profile</Link>
          <button
            onClick={handleLogout}
            className="bg-gl-lavender text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Community</p>
        <h2 className="font-display text-display-lg text-gl-ink mb-10">Challenges</h2>

        {/* My active challenges */}
        {enrolled.length > 0 && (
          <section className="mb-10">
            <h3 className="font-display text-display-md text-gl-ink mb-4">My Challenges</h3>
            <div className="flex flex-col gap-3">
              {enrolled.map(e => (
                <div key={e.id} className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-gl-ink">{e.title}</p>
                    {e.completed && (
                      <span className="text-xs bg-gl-moss text-white px-2.5 py-1 rounded-full">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-gl-pebble rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gl-wildrose rounded-full transition-all"
                      style={{ width: `${Math.min((e.current_days / e.goal_days) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gl-stone">
                    {e.current_days} / {e.goal_days} days
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All challenges */}
        <section>
          <h3 className="font-display text-display-md text-gl-ink mb-4">
            {enrolled.length > 0 ? 'All Challenges' : 'Available Challenges'}
          </h3>

          {loading ? (
            <p className="text-gl-stone text-sm">Loading...</p>
          ) : challenges.length === 0 ? (
            <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-8 text-center">
              <p className="font-display text-display-md text-gl-ink mb-2">No challenges yet</p>
              <p className="text-sm text-gl-stone">Check back soon — new challenges are added regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {challenges.map(challenge => {
                const isEnrolled = enrolledIds.has(challenge.id)
                const isEnrolling = enrolling === challenge.id
                const endDate = new Date(challenge.end_date).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })

                return (
                  <div
                    key={challenge.id}
                    className={`bg-gl-softbloom border rounded-xl p-5 flex flex-col gap-3 ${
                      isEnrolled ? 'border-gl-wildrose' : 'border-gl-dustypetal'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg text-gl-ink leading-snug">
                          {challenge.title}
                        </p>
                        <p className="text-xs text-gl-stone mt-1">Ends {endDate}</p>
                      </div>
                      <span className="text-xs bg-gl-nightbloom text-gl-petalmist px-2.5 py-1 rounded-full flex-shrink-0">
                        {challenge.goal_days} days
                      </span>
                    </div>

                    <p className="text-sm text-gl-stone leading-relaxed">
                      {challenge.description}
                    </p>

                    <button
                      onClick={() => !isEnrolled && handleEnroll(challenge.id)}
                      disabled={isEnrolled || isEnrolling}
                      className={`w-full text-sm font-medium py-2.5 rounded-md transition-all ${
                        isEnrolled
                          ? 'bg-gl-petalmist text-gl-stone cursor-not-allowed'
                          : 'bg-gl-moss text-white hover:opacity-90 active:scale-[0.98]'
                      }`}
                    >
                      {isEnrolling ? 'Enrolling...' : isEnrolled ? '✓ Enrolled' : 'Join Challenge'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}