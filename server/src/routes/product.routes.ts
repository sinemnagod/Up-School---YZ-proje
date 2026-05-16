import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller'
import { requireAuth, requireAdmin } from '../middleware/auth'

const router = Router()

// Public
router.get('/',    getProducts)
router.get('/:id', getProductById)

// Admin only
router.post('/',    requireAuth, requireAdmin, createProduct)
router.put('/:id',  requireAuth, requireAdmin, updateProduct)
router.delete('/:id', requireAuth, requireAdmin, deleteProduct)

export default router