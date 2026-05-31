import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Response } from 'express'
import prisma from '../config/db'

const router = Router()
router.use(requireAuth)

// GET /api/v1/user/profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: req.user!.userId }
    })
    res.json(profile ?? { skin_type: null })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// PUT /api/v1/user/profile
router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { skin_type } = req.body
    const profile = await prisma.userProfile.upsert({
      where: { user_id: req.user!.userId },
      create: { user_id: req.user!.userId, skin_type },
      update: { skin_type },
    })
    res.json(profile)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/v1/user/triggers
router.get('/triggers', async (req: AuthRequest, res: Response) => {
  try {
    const triggers = await prisma.userTrigger.findMany({
      where: { user_id: req.user!.userId },
      include: { ingredient: true },
    })
    res.json(triggers)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// POST /api/v1/user/triggers
router.post('/triggers', async (req: AuthRequest, res: Response) => {
  try {
    const { ingredient_id, personal_note } = req.body
    const trigger = await prisma.userTrigger.create({
      data: {
        user_id: req.user!.userId,
        ingredient_id,
        personal_note,
      },
      include: { ingredient: true },
    })
    res.status(201).json(trigger)
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Already in your blacklist' })
      return
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// DELETE /api/v1/user/triggers/:id
router.delete('/triggers/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.userTrigger.delete({
      where: { id: req.params.id }
    })
    res.json({ message: 'Removed' })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router