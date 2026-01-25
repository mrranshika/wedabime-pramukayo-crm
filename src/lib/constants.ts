export const CUSTOMER_STATUSES = {
  NOT_CONFIRMED: { 
    value: 'Not Confirmed', 
    color: 'bg-gray-400', 
    textColor: 'text-gray-800',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    description: 'Not yet confirmed'
  },
  QUOTATION_ISSUED: { 
    value: 'Quotation Issued', 
    color: 'bg-orange-500', 
    textColor: 'text-white',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    description: 'Attention needed'
  },
  APPROVED: { 
    value: 'Approved', 
    color: 'bg-blue-500', 
    textColor: 'text-white',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'Ready to proceed'
  },
  PENDING: { 
    value: 'Pending', 
    color: 'bg-yellow-500', 
    textColor: 'text-black',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    description: 'Payments or documentation pending'
  },
  IN_PROGRESS: { 
    value: 'In Progress', 
    color: 'bg-purple-500', 
    textColor: 'text-white',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    description: 'Work in progress'
  },
  COMPLETED: { 
    value: 'Completed', 
    color: 'bg-green-500', 
    textColor: 'text-white',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    description: 'Successfully completed'
  },
  REJECTED: { 
    value: 'Rejected', 
    color: 'bg-red-500', 
    textColor: 'text-white',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    description: 'Cancelled/Rejected'
  }
} as const

export type CustomerStatus = keyof typeof CUSTOMER_STATUSES

export const SERVICE_TYPES = {
  GUTTER: ['Removing', 'New', 'Repair'],
  CEILING: ['Removing', 'New', 'Repair'],
  ROOF: ['Removing', 'New', 'Repair']
} as const

export const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'Online Payment'] as const