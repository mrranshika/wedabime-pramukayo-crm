'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit, 
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Building2,
  Loader2
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const NEON_GREEN = '#39FF14'
const DARK_BG = '#001a00'
const CARD_BG = '#002200'
const BORDER_COLOR = '#004400'

const CUSTOMER_STATUSES = {
  NOT_CONFIRMED: { 
    value: 'Not Confirmed', 
    color: '#6b7280', // Gray
    bgColor: 'bg-gray-500',
    borderColor: 'border-gray-600'
  },
  QUOTATION_ISSUED: { 
    value: 'Quotation Issued', 
    color: '#ff9900', // Orange
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-600'
  },
  APPROVED: { 
    value: 'Approved', 
    color: '#3b82f6', // Blue
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-600'
  },
  PENDING: { 
    value: 'Pending', 
    color: '#ffff00', // Yellow
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-600'
  },
  IN_PROGRESS: { 
    value: 'In Progress', 
    color: '#a855f7', // Purple
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-600'
  },
  COMPLETED: { 
    value: 'Completed', 
    color: '#00cc00', // Green
    bgColor: 'bg-green-500',
    borderColor: 'border-green-600'
  },
  REJECTED: { 
    value: 'Rejected', 
    color: '#ef4444', // Red
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600'
  }
}

const SERVICE_TYPES = {
  GUTTER: ['Removing', 'New', 'Repair'],
  CEILING: ['Removing', 'New', 'Repair'],
  ROOF: ['Removing', 'New', 'Repair']
}

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'Online Payment']

interface Customer {
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
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gutter: 'None',
    ceiling: 'None',
    roof: 'None',
    totalValue: '',
    status: 'Not Confirmed',
    notes: ''
  })

  // Payment form
  const [payment, setPayment] = useState({
    customerId: '',
    amount: '',
    method: 'Cash',
    notes: ''
  })

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        setIsAuthenticated(true)
        fetchDashboardStats()
        fetchCustomers()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        fetchDashboardStats()
        fetchCustomers()
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch (error) {
      setLoginError('Network error')
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setDashboardStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await fetch(`/api/customers?${params}`)
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      })

      if (response.ok) {
        setNewCustomer({
          name: '',
          address: '',
          phone: '',
          email: '',
          gutter: 'None',
          ceiling: 'None',
          roof: 'None',
          totalValue: '',
          status: 'Not Confirmed',
          notes: ''
        })
        fetchCustomers()
        fetchDashboardStats()
        setActiveTab('customers')
      }
    } catch (error) {
      console.error('Failed to create customer:', error)
    }
  }

  const handleAddPayment = async () => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      })

      if (response.ok) {
        setPayment({ customerId: '', amount: '', method: 'Cash', notes: '' })
        fetchCustomers()
        fetchDashboardStats()
      }
    } catch (error) {
      console.error('Failed to add payment:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const statusConfig = Object.values(CUSTOMER_STATUSES).find(s => s.value === status)
    return statusConfig || CUSTOMER_STATUSES.NOT_CONFIRMED
  }

  // Prepare pie chart data
  const preparePieChartData = () => {
    if (!dashboardStats?.statusStats) return []
    
    return Object.entries(dashboardStats.statusStats).map(([status, count]) => ({
      name: status,
      value: count as number,
      color: getStatusColor(status).color
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: DARK_BG }}>
        <Loader2 className="animate-spin" style={{ color: NEON_GREEN, height: '32px', width: '32px' }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: DARK_BG }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 style={{ color: NEON_GREEN, height: '48px', width: '48px' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider" style={{ color: NEON_GREEN }}>TECH MASTER CRM</h1>
            <p className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Wedabime Pramukayo</p>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER_COLOR}` }}>
            <h2 className="text-xl font-bold mb-6 text-center uppercase tracking-wider" style={{ color: NEON_GREEN }}>SYSTEM ACCESS</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="admin@crm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-center"
                  style={{ 
                    backgroundColor: '#000b00', 
                    border: `1px solid ${BORDER_COLOR}`, 
                    color: 'white',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="ENTER PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-center"
                  style={{ 
                    backgroundColor: '#000b00', 
                    border: `1px solid ${BORDER_COLOR}`, 
                    color: 'white',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {loginError && (
                <Alert className="bg-red-900 border-red-700">
                  <AlertDescription className="text-red-200">{loginError}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full font-bold py-3 uppercase tracking-wider"
                style={{ backgroundColor: NEON_GREEN, color: 'black' }}
              >
                LOGIN
              </Button>
            </form>

            <div className="mt-6 p-4 rounded" style={{ backgroundColor: '#001100' }}>
              <p className="text-xs text-center" style={{ color: NEON_GREEN, opacity: 0.7 }}>
                <strong>Demo Credentials:</strong><br />
                Email: admin@crm.com<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK_BG, color: NEON_GREEN, fontFamily: 'monospace' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: BORDER_COLOR, backgroundColor: '#000800' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 style={{ color: NEON_GREEN, height: '32px', width: '32px' }} />
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider" style={{ color: NEON_GREEN }}>TECH MASTER CRM</h1>
                <p className="text-xs uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.7 }}>Wedabime Pramukayo</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              style={{ 
                borderColor: NEON_GREEN, 
                color: NEON_GREEN,
                backgroundColor: 'transparent'
              }}
              className="hover:bg-green-900 hover:text-green-400"
            >
              <LogOut className="mr-2" style={{ color: NEON_GREEN, height: '16px', width: '16px' }} />
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 border-b" style={{ borderColor: BORDER_COLOR, backgroundColor: 'transparent' }}>
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 text-green-400 data-[state=active]:text-green-300 uppercase tracking-wider text-xs"
              style={{ color: NEON_GREEN, opacity: 0.8 }}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="registration" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 text-green-400 data-[state=active]:text-green-300 uppercase tracking-wider text-xs"
              style={{ color: NEON_GREEN, opacity: 0.8 }}
            >
              Registration
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 text-green-400 data-[state=active]:text-green-300 uppercase tracking-wider text-xs"
              style={{ color: NEON_GREEN, opacity: 0.8 }}
            >
              Customers
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 text-green-400 data-[state=active]:text-green-300 uppercase tracking-wider text-xs"
              style={{ color: NEON_GREEN, opacity: 0.8 }}
            >
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {dashboardStats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Total Customers</span>
                      <Users style={{ color: NEON_GREEN, height: '16px', width: '16px' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: NEON_GREEN }}>{dashboardStats.overview.totalCustomers}</div>
                  </div>
                  
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Total Revenue</span>
                      <DollarSign style={{ color: NEON_GREEN, height: '16px', width: '16px' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: NEON_GREEN }}>LKR {dashboardStats.overview.totalRevenue.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Paid Amount</span>
                      <CreditCard style={{ color: NEON_GREEN, height: '16px', width: '16px' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: NEON_GREEN }}>LKR {dashboardStats.overview.totalPaid.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Outstanding</span>
                      <TrendingUp style={{ color: '#ff6b6b', height: '16px', width: '16px' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: '#ff6b6b' }}>LKR {dashboardStats.overview.outstanding.toLocaleString()}</div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                    <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-l-4 pl-2" style={{ color: NEON_GREEN, borderColor: NEON_GREEN }}>Project Status Distribution</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={preparePieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {preparePieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: CARD_BG, 
                              border: `1px solid ${BORDER_COLOR}`,
                              color: NEON_GREEN
                            }} 
                          />
                          <Legend 
                            wrapperStyle={{ color: NEON_GREEN }}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Breakdown */}
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                    <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-l-4 pl-2" style={{ color: NEON_GREEN, borderColor: NEON_GREEN }}>Status Breakdown</h2>
                    <div className="space-y-3">
                      {Object.entries(dashboardStats.statusStats).map(([status, count]) => {
                        const statusConfig = getStatusColor(status)
                        return (
                          <div key={status} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#001100' }}>
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: statusConfig.color }}></div>
                              <span className="text-sm uppercase tracking-wider">{status}</span>
                            </div>
                            <span className="font-bold text-lg" style={{ color: NEON_GREEN }}>{count as number}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Customers */}
                <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                  <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-l-4 pl-2" style={{ color: NEON_GREEN, borderColor: NEON_GREEN }}>Recent Customers</h2>
                  <div className="space-y-3">
                    {dashboardStats.recentCustomers.map((customer: any) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 rounded border" style={{ borderColor: BORDER_COLOR, backgroundColor: '#001100' }}>
                        <div>
                          <p className="font-medium uppercase tracking-wider" style={{ color: NEON_GREEN }}>{customer.name}</p>
                          <p className="text-xs uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.6 }}>{customer.customerId}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ 
                              backgroundColor: getStatusColor(customer.status).color + '20',
                              color: getStatusColor(customer.status).color,
                              border: `1px solid ${getStatusColor(customer.status).color}`
                            }}
                          >
                            {customer.status}
                          </Badge>
                          <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>LKR {customer.totalValue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="registration">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wider border-l-4 pl-2" style={{ color: NEON_GREEN, borderColor: NEON_GREEN }}>New Customer Registration</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Customer Name *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      placeholder="Enter customer name"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Address</Label>
                    <Textarea
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                      placeholder="Enter customer address"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      placeholder="Enter phone number"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      placeholder="Enter email address"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Services Required</Label>
                    <div className="space-y-3 mt-2">
                      {Object.entries(SERVICE_TYPES).map(([category, services]) => (
                        <div key={category} className="p-4 rounded border" style={{ borderColor: BORDER_COLOR, backgroundColor: '#001100' }}>
                          <p className="font-medium text-sm mb-2 uppercase tracking-wider" style={{ color: NEON_GREEN }}>{category}</p>
                          <div className="space-y-2">
                            {services.map((service) => (
                              <div key={service} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${category}-${service}`}
                                  checked={newCustomer[category.toLowerCase() as keyof typeof newCustomer]?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    const current = newCustomer[category.toLowerCase() as keyof typeof newCustomer] as string || 'None'
                                    const serviceList = current === 'None' ? [] : current.split(', ')
                                    if (checked) {
                                      serviceList.push(service)
                                    } else {
                                      const index = serviceList.indexOf(service)
                                      if (index > -1) serviceList.splice(index, 1)
                                    }
                                    newCustomer[category.toLowerCase() as keyof typeof newCustomer] = serviceList.length > 0 ? serviceList.join(', ') : 'None'
                                    setNewCustomer({...newCustomer})
                                  }}
                                  style={{ borderColor: NEON_GREEN }}
                                />
                                <Label htmlFor={`${category}-${service}`} className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>{service}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="totalValue" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Total Project Value (LKR) *</Label>
                    <Input
                      id="totalValue"
                      type="number"
                      value={newCustomer.totalValue}
                      onChange={(e) => setNewCustomer({...newCustomer, totalValue: e.target.value})}
                      placeholder="Enter total value"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Initial Status</Label>
                    <Select value={newCustomer.status} onValueChange={(value) => setNewCustomer({...newCustomer, status: value})}>
                      <SelectTrigger style={{ backgroundColor: '#000b00', border: `1px solid ${BORDER_COLOR}`, color: 'white', fontFamily: 'monospace' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER_COLOR}` }}>
                        {Object.values(CUSTOMER_STATUSES).map((status) => (
                          <SelectItem key={status.value} value={status.value} style={{ color: NEON_GREEN }}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Notes</Label>
                    <Textarea
                      id="notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                      placeholder="Additional notes"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCreateCustomer} 
                className="w-full font-bold py-3 uppercase tracking-wider mt-6"
                style={{ backgroundColor: NEON_GREEN, color: 'black' }}
              >
                <Plus className="mr-2" style={{ color: 'black', height: '16px', width: '16px' }} />
                Register Customer
              </Button>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: NEON_GREEN, opacity: 0.6, height: '16px', width: '16px' }} />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      style={{ 
                        backgroundColor: '#000b00', 
                        border: `1px solid ${BORDER_COLOR}`, 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48" style={{ backgroundColor: '#000b00', border: `1px solid ${BORDER_COLOR}`, color: 'white', fontFamily: 'monospace' }}>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER_COLOR}` }}>
                      <SelectItem value="all" style={{ color: NEON_GREEN }}>All Statuses</SelectItem>
                      {Object.values(CUSTOMER_STATUSES).map((status) => (
                        <SelectItem key={status.value} value={status.value} style={{ color: NEON_GREEN }}>
                          {status.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Customer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="p-6 rounded-lg border border-l-4" style={{ 
                    backgroundColor: CARD_BG, 
                    borderColor: BORDER_COLOR,
                    borderLeftColor: getStatusColor(customer.status).color
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: NEON_GREEN }}>{customer.name}</h3>
                        <p className="text-xs uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.6 }}>{customer.customerId}</p>
                      </div>
                      <Badge 
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ 
                          backgroundColor: getStatusColor(customer.status).color + '20',
                          color: getStatusColor(customer.status).color,
                          border: `1px solid ${getStatusColor(customer.status).color}`
                        }}
                      >
                        {customer.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center" style={{ color: NEON_GREEN, opacity: 0.8 }}>
                        <Phone className="mr-2" style={{ color: NEON_GREEN, opacity: 0.8, height: '16px', width: '16px' }} />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center" style={{ color: NEON_GREEN, opacity: 0.8 }}>
                          <Mail className="mr-2" style={{ color: NEON_GREEN, opacity: 0.8, height: '16px', width: '16px' }} />
                          {customer.email}
                        </div>
                      )}
                      <div className="flex items-center" style={{ color: NEON_GREEN, opacity: 0.8 }}>
                        <MapPin className="mr-2" style={{ color: NEON_GREEN, opacity: 0.8, height: '16px', width: '16px' }} />
                        {customer.address}
                      </div>
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: BORDER_COLOR }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Project Value:</span>
                        <span className="font-bold uppercase tracking-wider" style={{ color: NEON_GREEN }}>LKR {customer.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Paid:</span>
                        <span className="font-bold uppercase tracking-wider" style={{ color: '#00cc00' }}>LKR {customer.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.8 }}>Balance:</span>
                        <span className="font-bold uppercase tracking-wider" style={{ color: '#ff6b6b' }}>
                          LKR {(customer.totalValue - customer.paidAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wider border-l-4 pl-2" style={{ color: '#ffff00', borderColor: '#ffff00' }}>Add Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="payCustomer" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Customer</Label>
                  <Select value={payment.customerId} onValueChange={(value) => setPayment({...payment, customerId: value})}>
                    <SelectTrigger style={{ backgroundColor: '#000b00', border: `1px solid ${BORDER_COLOR}`, color: 'white', fontFamily: 'monospace' }}>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER_COLOR}` }}>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id} style={{ color: NEON_GREEN }}>
                          {customer.customerId} - {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="payAmount" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Amount (LKR)</Label>
                  <Input
                    id="payAmount"
                    type="number"
                    value={payment.amount}
                    onChange={(e) => setPayment({...payment, amount: e.target.value})}
                    placeholder="Enter amount"
                    style={{ 
                      backgroundColor: '#000b00', 
                      border: `1px solid ${BORDER_COLOR}`, 
                      color: 'white',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payMethod" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Payment Method</Label>
                  <Select value={payment.method} onValueChange={(value) => setPayment({...payment, method: value})}>
                    <SelectTrigger style={{ backgroundColor: '#000b00', border: `1px solid ${BORDER_COLOR}`, color: 'white', fontFamily: 'monospace' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER_COLOR}` }}>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method} style={{ color: NEON_GREEN }}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="payNotes" className="text-sm uppercase tracking-wider" style={{ color: NEON_GREEN }}>Notes</Label>
                  <Input
                    id="payNotes"
                    value={payment.notes}
                    onChange={(e) => setPayment({...payment, notes: e.target.value})}
                    placeholder="Payment notes (optional)"
                    style={{ 
                      backgroundColor: '#000b00', 
                      border: `1px solid ${BORDER_COLOR}`, 
                      color: 'white',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddPayment} 
                className="w-full font-bold py-3 uppercase tracking-wider mt-6"
                style={{ backgroundColor: '#ffff00', color: 'black' }}
              >
                <DollarSign className="mr-2" style={{ color: 'black', height: '16px', width: '16px' }} />
                Add Payment
              </Button>
            </div>

            {/* Recent Payments */}
            {dashboardStats?.recentPayments && (
              <div className="p-6 rounded-lg border mt-6" style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}>
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider border-l-4 pl-2" style={{ color: NEON_GREEN, borderColor: NEON_GREEN }}>Recent Payments</h2>
                <div className="space-y-3">
                  {dashboardStats.recentPayments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded border" style={{ borderColor: BORDER_COLOR, backgroundColor: '#001100' }}>
                      <div>
                        <p className="font-medium uppercase tracking-wider" style={{ color: NEON_GREEN }}>{payment.customer.name}</p>
                        <p className="text-xs uppercase tracking-wider" style={{ color: NEON_GREEN, opacity: 0.6 }}>{payment.method} • {new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold uppercase tracking-wider" style={{ color: '#00cc00' }}>LKR {payment.amount.toLocaleString()}</p>
                        {payment.notes && <p className="text-xs uppercase tracking-wider mt-1" style={{ color: NEON_GREEN, opacity: 0.6 }}>{payment.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}