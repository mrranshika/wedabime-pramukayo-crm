export interface Customer {
  id: string
  customerId: string
  name: string
  address: string
  phone: string
  email: string | null
  gutter: string
  ceiling: string
  roof: string
  totalValue: number
  paidAmount: number
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  payments: Payment[]
  logs: ActivityLog[]
}

export interface Payment {
  id: string
  customerId: string
  amount: number
  method: string
  notes: string | null
  createdAt: string
  customer: {
    customerId: string
    name: string
  }
}

export interface ActivityLog {
  id: string
  customerId: string
  action: string
  details: string | null
  createdAt: string
}