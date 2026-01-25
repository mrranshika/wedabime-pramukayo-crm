// Update this file: src/app/api/customers/route.ts
// Modified to use Google Sheets as primary database

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { googleSheetsAPI } from '@/lib/google-sheets'
import { db } from '@/lib/db'

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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    try {
      // Try Google Sheets first
      const customers = await googleSheetsAPI.getAllCustomers()
      
      let filteredCustomers = customers
      
      // Apply filters
      if (search) {
        filteredCustomers = customers.filter((customer: any) => 
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.customerId.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone.includes(search) ||
          (customer.email && customer.email.toLowerCase().includes(search.toLowerCase()))
        )
      }

      if (status) {
        filteredCustomers = filteredCustomers.filter((customer: any) => customer.status === status)
      }

      return NextResponse.json(filteredCustomers)
    } catch (sheetsError) {
      console.warn('Google Sheets unavailable, falling back to local database:', sheetsError)
      
      // Fallback to local database
      const where: any = {}
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { customerId: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
      if (status) where.status = status

      const customers = await db.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          payments: { orderBy: { createdAt: 'desc' } },
          logs: { orderBy: { createdAt: 'desc' }, take: 5 }
        }
      })

      return NextResponse.json(customers)
    }
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    try {
      // Try Google Sheets first
      const customer = await googleSheetsAPI.createCustomer(data)
      return NextResponse.json(customer)
    } catch (sheetsError) {
      console.warn('Google Sheets unavailable, falling back to local database:', sheetsError)
      
      // Fallback to local database
      const lastCustomer = await db.customer.findFirst({
        orderBy: { createdAt: 'desc' }
      })

      const lastNumber = lastCustomer ? parseInt(lastCustomer.customerId.split('-')[1]) : 0
      const customerId = `CUST-${lastNumber + 1}`

      const customer = await db.customer.create({
        data: {
          customerId,
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email || null,
          gutter: data.gutter || 'None',
          ceiling: data.ceiling || 'None',
          roof: data.roof || 'None',
          totalValue: parseFloat(data.totalValue),
          status: data.status || 'Not Confirmed',
          notes: data.notes || null,
          logs: {
            create: {
              action: 'Customer Created',
              details: `New customer ${data.name} registered with ID ${customerId}`
            }
          }
        },
        include: {
          payments: true,
          logs: true
        }
      })

      return NextResponse.json(customer)
    }
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}