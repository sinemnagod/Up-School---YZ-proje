import type { Request, Response } from 'express'
import { registerUser, loginUser, logoutUser } from '../services/auth.service'
import type { AuthRequest } from '../middleware/auth'

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' })
      return
    }
    const user = await registerUser(email, password)
    res.status(201).json({ message: 'Account created', user })
  } catch (err: any) {
    if (err.message === 'EMAIL_TAKEN') {
      res.status(409).json({ error: 'Email already in use' })
      return
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }
    const result = await loginUser(email, password)
    res.status(200).json(result)
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function logout(req: AuthRequest, res: Response) {
  try {
    await logoutUser(req.user!.userId)
    res.status(200).json({ message: 'Logged out' })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
}