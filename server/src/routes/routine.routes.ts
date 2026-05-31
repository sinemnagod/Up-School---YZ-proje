import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Response } from 'express'
import prisma from '../config/db'

const router = Router()
router.use(requireAuth)

// GET /api/v1/routine
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const slots = await prisma.routineSlot.findMany({
      where: { user_id: req.user!.userId },
      include: {
        product: {
          include: {
            ingredients: {
              include: { ingredient: true },
              orderBy: { order_index: 'asc' }
            }
          }
        }
      },
      orderBy: { step_order: 'asc' }
    })
    res.json(slots)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// PUT /api/v1/routine
router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const { slots } = req.body
    const userId = req.user!.userId

    // Delete existing routine
    await prisma.routineSlot.deleteMany({ where: { user_id: userId } })

    // Insert new slots
    if (slots && slots.length > 0) {
      await prisma.routineSlot.createMany({
        data: slots.map((s: any) => ({
          user_id: userId,
          product_id: s.product_id,
          slot: s.slot,
          step_order: s.step_order,
        }))
      })
    }

    res.json({ message: 'Routine saved' })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/v1/routine/conflicts
router.get('/conflicts', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId

    // Get all products in routine with their ingredients
    const routineSlots = await prisma.routineSlot.findMany({
      where: { user_id: userId },
      include: {
        product: {
          include: {
            ingredients: { select: { ingredient_id: true } }
          }
        }
      }
    })

    // Build ingredient → slots map
    const ingredientSlots: Record<string, string[]> = {}
    const allIngredientIds: string[] = []

    for (const slot of routineSlots) {
      for (const pi of slot.product.ingredients) {
        if (!ingredientSlots[pi.ingredient_id]) {
          ingredientSlots[pi.ingredient_id] = []
        }
        ingredientSlots[pi.ingredient_id].push(slot.slot)
        allIngredientIds.push(pi.ingredient_id)
      }
    }

    // Check conflict rules
    const rules = await prisma.conflictRule.findMany({
      where: { is_active: true },
      include: {
        ingredientA: { select: { inci_name: true } },
        ingredientB: { select: { inci_name: true } },
      }
    })

    const firedConflicts = []

    for (const rule of rules) {
      const aSlots = ingredientSlots[rule.ingredient_a_id] ?? []
      const bSlots = ingredientSlots[rule.ingredient_b_id] ?? []

      if (aSlots.length === 0 || bSlots.length === 0) continue

      let fires = false

      if (rule.conflict_scope === 'ANY_SLOT') {
        fires = true
      } else {
        // SAME_SLOT — check if both appear in AM or both in PM
        fires = (aSlots.includes('AM') && bSlots.includes('AM')) ||
                (aSlots.includes('PM') && bSlots.includes('PM'))
      }

      if (fires) {
        firedConflicts.push({
          rule_id: rule.id,
          rule_name: rule.rule_name,
          alert_type: rule.alert_type,
          severity: rule.severity,
          explanation: rule.explanation,
          safe_to_override: rule.safe_to_override,
        })
      }
    }

    // Detect ingredient overloads (3+ products with same ingredient)
    const overloadedIngredients: string[] = []
    const countMap: Record<string, number> = {}

    for (const id of allIngredientIds) {
      countMap[id] = (countMap[id] ?? 0) + 1
    }

    const overloadIds = Object.entries(countMap)
      .filter(([, count]) => count >= 3)
      .map(([id]) => id)

    if (overloadIds.length > 0) {
      const ings = await prisma.ingredient.findMany({
        where: { id: { in: overloadIds } },
        select: { inci_name: true }
      })
      overloadedIngredients.push(...ings.map(i => i.inci_name))
    }

    res.json({
      conflicts: firedConflicts,
      overloads: overloadedIngredients,
    })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router