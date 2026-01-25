import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password)
  return db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    }
  })
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await db.user.findUnique({
    where: { email }
  })

  if (!user || !await verifyPassword(password, user.password)) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}

export async function initDefaultAdmin() {
  const existingAdmin = await db.user.findFirst({
    where: { role: 'admin' }
  })

  if (!existingAdmin) {
    await createUser('admin@crm.com', 'admin123', 'System Administrator')
  }
}