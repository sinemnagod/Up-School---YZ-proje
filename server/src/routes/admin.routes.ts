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

// Ingredients CRUD
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

router.get('/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: req.params.id }
    })
    if (!ingredient) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(ingredient)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/ingredients', async (req: Request, res: Response) => {
  try {
    const ingredient = await prisma.ingredient.create({ data: req.body })
    res.status(201).json(ingredient)
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Ingredient already exists' })
      return
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.put('/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const ingredient = await prisma.ingredient.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(ingredient)
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.delete('/ingredients/:id', async (req: Request, res: Response) => {
  try {
    await prisma.ingredient.update({
      where: { id: req.params.id },
      data: { is_active: false }
    })
    res.json({ message: 'Ingredient deactivated' })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Conflict Rules CRUD
router.get('/conflict-rules', async (_req: Request, res: Response) => {
  try {
    const rules = await prisma.conflictRule.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        ingredientA: { select: { inci_name: true } },
        ingredientB: { select: { inci_name: true } },
      }
    })
    res.json(rules)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.get('/conflict-rules/:id', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.conflictRule.findUnique({
      where: { id: req.params.id }
    })
    if (!rule) { res.status(404).json({ error: 'Not found' }); return }
    res.json(rule)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/conflict-rules', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.conflictRule.create({ data: req.body })
    res.status(201).json(rule)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.put('/conflict-rules/:id', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.conflictRule.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(rule)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.patch('/conflict-rules/:id/toggle', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.conflictRule.findUnique({ where: { id: req.params.id } })
    if (!rule) { res.status(404).json({ error: 'Not found' }); return }
    const updated = await prisma.conflictRule.update({
      where: { id: req.params.id },
      data: { is_active: !rule.is_active }
    })
    res.json(updated)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.delete('/conflict-rules/:id', async (req: Request, res: Response) => {
  try {
    await prisma.conflictRule.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router