import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerId, amount, method, notes } = await request.json()

    if (!customerId || !amount) {
      return NextResponse.json(
        { error: 'Customer ID and amount are required' },
        { status: 400 }
      )
    }

    const customer = await db.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const payment = await db.payment.create({
      data: {
        customerId,
        amount: parseFloat(amount),
        method: method || 'Cash',
        notes: notes || null
      }
    })

    const newPaidAmount = customer.paidAmount + parseFloat(amount)
    const newStatus = newPaidAmount >= customer.totalValue ? 'Completed' : 
                     newPaidAmount > 0 ? 'Pending' : customer.status

    await db.customer.update({
      where: { id: customerId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
        logs: {
          create: {
            action: 'Payment Added',
            details: `Payment of LKR ${amount} added via ${method || 'Cash'}`
          }
        }
      }
    })

    const updatedCustomer = await db.customer.findUnique({
      where: { id: customerId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    return NextResponse.json({
      payment,
      customer: updatedCustomer
    })
  } catch (error) {
    console.error('Add payment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    const where: any = {}
    if (customerId) {
      where.customerId = customerId
    }

    const payments = await db.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            customerId: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}