import { Router } from 'express'
import type { Response } from 'express'
import prisma from '../config/db'

const router = Router()

// Public ingredient list for profile search & glossary (Wave 2)
router.get('/', async (_req, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { inci_name: 'asc' },
      select: {
        id: true,
        inci_name: true,
        common_name: true,
      },
    })
    res.json(ingredients)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router
