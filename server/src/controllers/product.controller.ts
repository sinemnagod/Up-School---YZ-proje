import type { Request, Response } from 'express'
import prisma from '../config/db'

// GET /api/v1/products — get all published products
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: { is_published: true },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        description: true,
        image_url: true,
        skin_type_tags: true,
      },
      orderBy: { created_at: 'desc' }
    })
    res.status(200).json(products)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// GET /api/v1/products/:id — get one product
export async function getProductById(req: Request, res: Response) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        ingredients: {
          include: { ingredient: true },
          orderBy: { order_index: 'asc' }
        }
      }
    })
    if (!product || !product.is_published) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.status(200).json(product)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// POST /api/v1/admin/products — create product (admin only)
export async function createProduct(req: Request, res: Response) {
    try {
      const { name, brand, category, description, image_url, skin_type_tags, is_published, ingredient_ids } = req.body
      if (!name || !brand || !category) {
        res.status(400).json({ error: 'name, brand, and category are required' })
        return
      }
  
      const product = await prisma.product.create({
        data: {
          name,
          brand,
          category,
          description,
          image_url,
          skin_type_tags: skin_type_tags ?? [],
          is_published: is_published ?? false,
          ingredients: {
            create: (ingredient_ids ?? []).map((id: string, index: number) => ({
              ingredient_id: id,
              order_index: index,
            }))
          }
        }
      })
      res.status(201).json(product)
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({ error: 'A product with this name and brand already exists' })
        return
      }
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

// PUT /api/v1/admin/products/:id — update product (admin only)
export async function updateProduct(req: Request, res: Response) {
    try {
      const { name, brand, category, description, image_url, skin_type_tags, is_published, ingredient_ids } = req.body
      const productId = String(req.params.id)
  
      // If ingredient_ids provided, replace all ingredients
      if (ingredient_ids !== undefined) {
        await prisma.productIngredient.deleteMany({ where: { product_id: productId } })
        await prisma.productIngredient.createMany({
          data: ingredient_ids.map((id: string, index: number) => ({
            product_id: productId,
            ingredient_id: id,
            order_index: index,
          }))
        })
      }
  
      const product = await prisma.product.update({
        where: { id: productId },
        data: { name, brand, category, description, image_url, skin_type_tags, is_published }
      })
      res.status(200).json(product)
    } catch (err: any) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'Product not found' })
        return
      }
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

// DELETE /api/v1/admin/products/:id — delete product (admin only)
export async function deleteProduct(req: Request, res: Response) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.status(200).json({ message: 'Product deleted' })
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// GET /api/v1/admin/products — all products including drafts
export async function adminGetProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          brand: true,
          category: true,
          is_published: true,
          image_url: true,
          skin_type_tags: true,
          description: true,
        }
      })
      res.status(200).json(products)
    } catch {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }
  
  // GET /api/v1/admin/products/:id — single product with ingredients
  export async function adminGetProductById(req: Request, res: Response) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: String(req.params.id) },
        include: {
          ingredients: {
            include: { ingredient: true },
            orderBy: { order_index: 'asc' }
          }
        }
      })
      if (!product) {
        res.status(404).json({ error: 'Product not found' })
        return
      }
      res.status(200).json(product)
    } catch {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }