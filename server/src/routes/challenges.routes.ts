import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import type { AuthRequest } from '../middleware/auth.js'
import type { Response } from 'express'
import prisma from '../config/db.js'

const router = Router()
router.use(requireAuth)

// GET /api/v1/challenges
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { is_active: true },
      orderBy: { start_date: 'desc' }
    })
    res.json(challenges)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/v1/challenges/mine
router.get('/mine', async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await prisma.challengeEnrollment.findMany({
      where: { user_id: req.user!.userId },
      include: { challenge: true },
      orderBy: { enrolled_at: 'desc' }
    })
    res.json(enrollments.map(e => ({
      ...e.challenge,
      current_days: e.current_days,
      completed: e.completed,
      enrolled_at: e.enrolled_at,
    })))
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// POST /api/v1/challenges/:id/enroll
router.post('/:id/enroll', async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await prisma.challengeEnrollment.upsert({
      where: {
        user_id_challenge_id: {
          user_id: req.user!.userId,
          challenge_id: req.params.id,
        }
      },
      create: {
        user_id: req.user!.userId,
        challenge_id: req.params.id,
      },
      update: {},
    })
    res.status(201).json(enrollment)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router