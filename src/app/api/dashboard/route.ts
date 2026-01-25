import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalCustomers,
      totalRevenue,
      totalPaid,
      statusStats,
      recentCustomers,
      recentPayments
    ] = await Promise.all([
      db.customer.count(),
      db.customer.aggregate({
        _sum: { totalValue: true }
      }),
      db.customer.aggregate({
        _sum: { paidAmount: true }
      }),
      db.customer.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      db.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerId: true,
          name: true,
          status: true,
          totalValue: true,
          paidAmount: true,
          createdAt: true
        }
      }),
      db.payment.findMany({
        take: 10,
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
    ])

    const statusCounts = statusStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status
      return acc
    }, {} as Record<string, number>)

    const revenue = totalRevenue._sum.totalValue || 0
    const paid = totalPaid._sum.paidAmount || 0
    const outstanding = revenue - paid

    return NextResponse.json({
      overview: {
        totalCustomers,
        totalRevenue: revenue,
        totalPaid: paid,
        outstanding,
        averageProjectValue: totalCustomers > 0 ? revenue / totalCustomers : 0
      },
      statusStats: statusCounts,
      recentCustomers,
      recentPayments
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}