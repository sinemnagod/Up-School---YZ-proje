import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'access-secret'

export interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next()
    return
  }

  const token = header.split(' ')[1]
  if (!token) {
    next()
    return
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as unknown as { userId: string; role: string }
    req.user = payload
  } catch {
    // ignore invalid tokens — route can still serve guest requests
  }
  next()
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = header.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as unknown as { userId: string; role: string }
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin only' })
    return
  }
  next()
}