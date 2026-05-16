import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  ?? 'access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'refresh-secret'
const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES  ?? '15m'
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES ?? '7d'

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('EMAIL_TAKEN')

  const password_hash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, password_hash },
    select: { id: true, email: true, role: true }
  })
  return user
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) throw new Error('INVALID_CREDENTIALS')

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES } as any
  )

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES } as any
  )

  const token_hash = await bcrypt.hash(refreshToken, 10)
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.deleteMany({ where: { user_id: user.id } })
  await prisma.refreshToken.create({
    data: { user_id: user.id, token_hash, expires_at }
  })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role }
  }
}

export async function logoutUser(userId: string) {
  await prisma.refreshToken.deleteMany({ where: { user_id: userId } })
}