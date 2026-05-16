import { Router } from 'express'
import {
  adminGetProducts,
  adminGetProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller'
import { requireAuth, requireAdmin } from '../middleware/auth'
import prisma from '../config/db'
import type { Request, Response } from 'express'

const router = Router()

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin)

// Stats for dashboard
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [products, ingredients, users] = await Promise.all([
      prisma.product.count(),
      prisma.ingredient.count(),
      prisma.user.count(),
    ])
    res.json({ products, ingredients, users })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Products
router.get('/products',      adminGetProducts)
router.get('/products/:id',  adminGetProductById)
router.post('/products',     createProduct)
router.put('/products/:id',  updateProduct)
router.delete('/products/:id', deleteProduct)

// Ingredients
router.get('/ingredients', async (_req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { inci_name: 'asc' },
    })
    res.json(ingredients)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router