import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import EmptyState from '../components/EmptyState'
import { ChallengeGridSkeleton, DashboardSkeleton } from '../components/skeletons/Skeletons'
import { getApiErrorMessage } from '../utils/apiError'
import { toastError, toastSuccess } from '../store/toastStore'

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

const milestones = [3, 7, 15, 30, 50, 75, 100]

function nextMilestone(current: number) {
  return milestones.find(m => m > current) ?? 100
}

function progressPercent(current: number) {
  const next = nextMilestone(current)
  const prev = milestones.filter(m => m <= current).pop() ?? 0
  return Math.round(((current - prev) / (next - prev)) * 100)
}

export default function ChallengesPage() {
  const { user } = useAuthStore()

  const [amStreak, setAmStreak] = useState<Streak>({ current: 0, longest: 0, checkedInToday: false })
  const [pmStreak, setPmStreak] = useState<Streak>({ current: 0, longest: 0, checkedInToday: false })
  const [badges, setBadges] = useState<Badge[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [enrolled, setEnrolled] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  function fetchData() {
    setLoading(true)
    Promise.all([
      api.get('/streaks'),
      api.get('/streaks/badges'),
      api.get('/challenges'),
      api.get('/challenges/mine'),
    ])
      .then(([streaks, badgesRes, allRes, mineRes]) => {
        setAmStreak(streaks.data.AM)
        setPmStreak(streaks.data.PM)
        setBadges(badgesRes.data)
        setChallenges(Array.isArray(allRes.data) ? allRes.data : [])
        setEnrolled(Array.isArray(mineRes.data) ? mineRes.data : [])
      })
      .catch((err) => toastError(getApiErrorMessage(err, 'Could not load your activity.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  async function handleCheckIn(slot: 'AM' | 'PM') {
    setCheckingIn(slot)
    try {
      await api.post('/streaks', { slot })
      toastSuccess(`${slot} check-in recorded!`)
      fetchData()
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Check-in failed.'))
    } finally {
      setCheckingIn(null)
    }
  }

  async function handleEnroll(challengeId: string) {
    setEnrolling(challengeId)
    try {
      await api.post(`/challenges/${challengeId}/enroll`)
      toastSuccess('Challenge joined!')
      fetchData()
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Could not join challenge.'))
    } finally {
      setEnrolling(null)
    }
  }

  const enrolledIds = new Set(enrolled.map(e => e.id))

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <DashboardSkeleton />
        <div className="mt-10">
          <ChallengeGridSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Welcome back</p>
      <h2 className="font-display text-display-lg text-gl-ink mb-10">
        {user?.email?.split('@')[0]}
      </h2>

      {/* Streaks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {(['AM', 'PM'] as const).map((slot) => {
          const streak = slot === 'AM' ? amStreak : pmStreak
          const next = nextMilestone(streak.current)
          const progress = progressPercent(streak.current)
          const isChecking = checkingIn === slot

          return (
            <div key={slot} className="bg-gl-nightbloom rounded-xl p-6">
              <p className="text-xs font-medium tracking-widest uppercase text-gl-blush mb-1">{slot} Streak</p>
              <p className="font-display text-7xl font-light text-gl-petalmist leading-none mb-1">{streak.current}</p>
              <p className="text-sm text-gl-dustypetal mb-1">days in a row</p>
              <p className="text-xs text-gl-stone mb-4">Longest: {streak.longest} days</p>
              <div className="h-1 bg-white/10 rounded-full mb-1 overflow-hidden">
                <div className="h-full bg-gl-wildrose rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gl-stone mb-5">{streak.current} / {next} days to next badge</p>
              <button
                onClick={() => handleCheckIn(slot)}
                disabled={streak.checkedInToday || isChecking}
                className={`w-full text-sm font-medium py-2.5 rounded-md transition-all ${
                  streak.checkedInToday
                    ? 'bg-white/10 text-gl-stone cursor-not-allowed'
                    : 'bg-gl-moss text-white hover:opacity-90 active:scale-[0.98]'
                }`}
              >
                {isChecking ? 'Checking in...' : streak.checkedInToday ? '✓ Done for today' : `Check In ${slot}`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Badges */}
      <section className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-6 mb-8">
        <h3 className="font-display text-display-md text-gl-ink mb-5">🏅 Badges Earned</h3>
        {badges.length === 0 ? (
          <p className="text-sm text-gl-stone">No badges yet — check in daily to earn your first badge at Day 3!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center bg-gl-petalmist border border-gl-dustypetal rounded-xl px-4 py-3 text-center w-28">
                <span className="text-2xl mb-1">🌸</span>
                <span className="text-xs font-medium text-gl-plum">{badge.name}</span>
                <span className="text-xs text-gl-stone mt-0.5">{badge.slot ?? 'Both'}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enrolled challenges */}
      {enrolled.length > 0 && (
        <section className="mb-10">
          <h3 className="font-display text-display-md text-gl-ink mb-4">🎯 My Challenges</h3>
          <div className="flex flex-col gap-3">
            {enrolled.map(e => (
              <div key={e.id} className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gl-ink">{e.title}</p>
                  {e.completed && (
                    <span className="text-xs bg-gl-moss text-white px-2.5 py-1 rounded-full">✓ Completed</span>
                  )}
                </div>
                <div className="h-2 bg-gl-pebble rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gl-wildrose rounded-full transition-all"
                    style={{ width: `${Math.min((e.current_days / e.goal_days) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gl-stone">{e.current_days} / {e.goal_days} days</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Browse challenges */}
      <section>
        <h3 className="font-display text-display-md text-gl-ink mb-4">
          {enrolled.length > 0 ? '🌿 All Challenges' : '🌿 Available Challenges'}
        </h3>

        {challenges.length === 0 ? (
          <EmptyState
            title="No challenges yet"
            description="Check back soon — new skincare challenges are added regularly."
            actionLabel="Browse products"
            actionTo="/products"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {challenges.map(challenge => {
              const isEnrolled = enrolledIds.has(challenge.id)
              const isEnrolling = enrolling === challenge.id
              const endDate = new Date(challenge.end_date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
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
                      <p className="font-display text-lg text-gl-ink leading-snug">{challenge.title}</p>
                      <p className="text-xs text-gl-stone mt-1">Ends {endDate}</p>
                    </div>
                    <span className="text-xs bg-gl-nightbloom text-gl-petalmist px-2.5 py-1 rounded-full flex-shrink-0">
                      {challenge.goal_days} days
                    </span>
                  </div>
                  <p className="text-sm text-gl-stone leading-relaxed">{challenge.description}</p>
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
    </div>
  )
}
