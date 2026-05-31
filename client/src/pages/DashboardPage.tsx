import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

interface Streak {
  current: number
  longest: number
  checkedInToday: boolean
}

interface Badge {
  id: string
  name: string
  description: string
  milestone: number
  slot: string | null
  earned_at: string
}

interface Challenge {
  id: string
  title: string
  description: string
  goal_days: number
  end_date: string
  current_days: number
  completed: boolean
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const [amStreak, setAmStreak] = useState<Streak>({ current: 0, longest: 0, checkedInToday: false })
  const [pmStreak, setPmStreak] = useState<Streak>({ current: 0, longest: 0, checkedInToday: false })
  const [badges, setBadges] = useState<Badge[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [checkingIn, setCheckingIn] = useState<string | null>(null)

  function fetchData() {
    api.get('/streaks').then(({ data }) => {
      setAmStreak(data.AM)
      setPmStreak(data.PM)
    }).catch(() => {})

    api.get('/streaks/badges').then(({ data }) => setBadges(data)).catch(() => {})
    api.get('/challenges/mine').then(({ data }) => setChallenges(data)).catch(() => {})
  }

  useEffect(() => { fetchData() }, [])

  async function handleCheckIn(slot: 'AM' | 'PM') {
    setCheckingIn(slot)
    try {
      await api.post('/streaks', { slot })
      fetchData()
    } catch {}
    finally { setCheckingIn(null) }
  }

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  const milestones = [3, 7, 15, 30, 50, 75, 100]

  function nextMilestone(current: number) {
    return milestones.find(m => m > current) ?? 100
  }

  function progressPercent(current: number) {
    const next = nextMilestone(current)
    const prev = milestones.filter(m => m <= current).pop() ?? 0
    return Math.round(((current - prev) / (next - prev)) * 100)
  }

  return (
    <div className="min-h-screen bg-gl-parchment">

      {/* Header */}
      <header className="bg-gl-plum px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-gl-petalmist">GlowLogic</h1>
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-gl-blush text-sm hover:text-gl-petalmist transition-colors">
            Products
          </Link>
          <Link to="/routine" className="text-gl-blush text-sm hover:text-gl-petalmist transition-colors">
            My Routine
          </Link>
          <Link to="/profile" className="text-gl-blush text-sm hover:text-gl-petalmist transition-colors">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gl-lavender text-gl-nightbloom text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Welcome back</p>
        <h2 className="font-display text-display-lg text-gl-ink mb-10">
          {user?.email?.split('@')[0]}
        </h2>

        {/* Streak Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {(['AM', 'PM'] as const).map((slot) => {
            const streak = slot === 'AM' ? amStreak : pmStreak
            const next = nextMilestone(streak.current)
            const progress = progressPercent(streak.current)
            const isChecking = checkingIn === slot

            return (
              <div key={slot} className="bg-gl-nightbloom rounded-xl p-6">
                <p className="text-xs font-medium tracking-widest uppercase text-gl-blush mb-1">
                  {slot} Streak
                </p>
                <p className="font-display text-7xl font-light text-gl-petalmist leading-none mb-1">
                  {streak.current}
                </p>
                <p className="text-sm text-gl-dustypetal mb-1">days in a row</p>
                <p className="text-xs text-gl-stone mb-4">
                  Longest: {streak.longest} days
                </p>

                {/* Progress bar */}
                <div className="h-1 bg-white/10 rounded-full mb-1 overflow-hidden">
                  <div
                    className="h-full bg-gl-wildrose rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gl-stone mb-5">
                  {streak.current} / {next} days to next badge
                </p>

                {/* Check-in button */}
                <button
                  onClick={() => handleCheckIn(slot)}
                  disabled={streak.checkedInToday || isChecking}
                  className={`w-full text-sm font-medium py-2.5 rounded-md transition-all ${
                    streak.checkedInToday
                      ? 'bg-white/10 text-gl-stone cursor-not-allowed'
                      : 'bg-gl-moss text-white hover:opacity-90 active:scale-[0.98]'
                  }`}
                >
                  {isChecking
                    ? 'Checking in...'
                    : streak.checkedInToday
                    ? '✓ Done for today'
                    : `Check In ${slot}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* Badges */}
        <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6 mb-6">
          <h3 className="font-display text-display-md text-gl-ink mb-5">Badges Earned</h3>
          {badges.length === 0 ? (
            <p className="text-sm text-gl-stone">
              No badges yet — check in daily to earn your first badge at Day 3!
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center bg-gl-petalmist border border-gl-dustypetal rounded-xl px-4 py-3 text-center w-28"
                >
                  <span className="text-2xl mb-1">🌸</span>
                  <span className="text-xs font-medium text-gl-plum">{badge.name}</span>
                  <span className="text-xs text-gl-stone mt-0.5">{badge.slot ?? 'Both'}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Challenges */}
        <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6">
          <h3 className="font-display text-display-md text-gl-ink mb-5">My Challenges</h3>
          {challenges.length === 0 ? (
            <p className="text-sm text-gl-stone">
              No active challenges.{' '}
              <Link to="/challenges" className="text-gl-wildrose hover:underline">
                Browse challenges →
              </Link>
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {challenges.map(c => (
                <div key={c.id} className="bg-gl-petalmist border border-gl-pebble rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gl-ink">{c.title}</p>
                    {c.completed && (
                      <span className="text-xs bg-gl-moss text-white px-2.5 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-gl-pebble rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gl-wildrose rounded-full transition-all"
                      style={{ width: `${Math.min((c.current_days / c.goal_days) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gl-stone mt-1.5">
                    {c.current_days} / {c.goal_days} days
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}