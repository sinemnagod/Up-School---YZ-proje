import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Response } from 'express'
import prisma from '../config/db'

const router = Router()
router.use(requireAuth)

// Dynamic streak calculation from CheckIn records
async function calcStreak(userId: string, slot: 'AM' | 'PM') {
  const checkIns = await prisma.checkIn.findMany({
    where: { user_id: userId, slot },
    orderBy: { checked_at: 'asc' },
    select: { checked_at: true },
  })

  if (checkIns.length === 0) {
    return { current: 0, longest: 0, checkedInToday: false }
  }

  // Deduplicate to one entry per UTC calendar day
  const days: string[] = []
  const seen = new Set<string>()
  for (const ci of checkIns) {
    const dateKey = ci.checked_at.toISOString().slice(0, 10)
    if (!seen.has(dateKey)) {
      seen.add(dateKey)
      days.push(dateKey)
    }
  }

  const todayKey = new Date().toISOString().slice(0, 10)
  const checkedInToday = days[days.length - 1] === todayKey

  // Current streak — walk backwards
  let current = 0
  const checkDate = new Date()
  if (!checkedInToday) checkDate.setUTCDate(checkDate.getUTCDate() - 1)

  for (let i = days.length - 1; i >= 0; i--) {
    const expected = checkDate.toISOString().slice(0, 10)
    if (days[i] === expected) {
      current++
      checkDate.setUTCDate(checkDate.getUTCDate() - 1)
    } else break
  }

  // Longest streak
  let longest = 0
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays === 1) {
      run++
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }
  longest = Math.max(longest, run, current)

  return { current, longest, checkedInToday }
}

// GET /api/v1/streaks
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const [am, pm] = await Promise.all([
      calcStreak(req.user!.userId, 'AM'),
      calcStreak(req.user!.userId, 'PM'),
    ])
    res.json({ AM: am, PM: pm })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// POST /api/v1/checkins
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { slot } = req.body
    const userId = req.user!.userId

    // Enforce one check-in per slot per UTC day
    const startOfToday = new Date()
    startOfToday.setUTCHours(0, 0, 0, 0)

    const existing = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        slot,
        checked_at: { gte: startOfToday }
      }
    })

    if (existing) {
      res.status(409).json({ error: 'Already checked in today for this slot' })
      return
    }

    await prisma.checkIn.create({
      data: { user_id: userId, slot }
    })

    // Check if streak hit a milestone and award badge
    const streak = await calcStreak(userId, slot)
    const milestones = [3, 7, 15, 30, 50, 75, 100]

    if (milestones.includes(streak.current)) {
      const badge = await prisma.badge.findFirst({
        where: { milestone: streak.current, slot }
      })
      if (badge) {
        await prisma.userBadge.upsert({
          where: { user_id_badge_id: { user_id: userId, badge_id: badge.id } },
          create: { user_id: userId, badge_id: badge.id },
          update: {},
        })
      }
    }

    res.status(201).json({ message: 'Checked in', streak })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/v1/badges
router.get('/badges', async (req: AuthRequest, res: Response) => {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: req.user!.userId },
      include: { badge: true },
      orderBy: { earned_at: 'desc' }
    })
    res.json(userBadges.map(ub => ({
      ...ub.badge,
      earned_at: ub.earned_at,
    })))
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router