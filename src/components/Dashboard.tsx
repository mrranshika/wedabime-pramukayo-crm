'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Building2,
  Loader2
} from 'lucide-react'
import { CUSTOMER_STATUSES, SERVICE_TYPES, PAYMENT_METHODS } from '@/lib/constants'
import { Customer, Payment } from '@/types'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Form states
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

  const [payment, setPayment] = useState({
    customerId: '',
    amount: '',
    method: 'Cash',
    notes: ''
  })

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchDashboardStats()
    fetchCustomers()
  }, [])

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
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await fetch(`/api/customers?${params}`)
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
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

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return

    try {
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCustomer)
      })

      if (response.ok) {
        setEditingCustomer(null)
        fetchCustomers()
        fetchDashboardStats()
      }
    } catch (error) {
      console.error('Failed to update customer:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const statusConfig = Object.values(CUSTOMER_STATUSES).find(s => s.value === status)
    return statusConfig || CUSTOMER_STATUSES.NOT_CONFIRMED
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TECH MASTER CRM</h1>
                <p className="text-xs text-gray-500">Wedabime Pramukayo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {dashboardStats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.overview.totalCustomers}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">LKR {dashboardStats.overview.totalRevenue.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">LKR {dashboardStats.overview.totalPaid.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">LKR {dashboardStats.overview.outstanding.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(dashboardStats.statusStats).map(([status, count]) => {
                          const statusConfig = getStatusColor(status)
                          return (
                            <div key={status} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
                                <span className="text-sm">{status}</span>
                              </div>
                              <Badge variant="secondary">{count as number}</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dashboardStats.recentCustomers.map((customer: any) => (
                          <div key={customer.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium text-sm">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.customerId}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(customer.status).bgColor}>
                                {customer.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">LKR {customer.totalValue.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <CardTitle>New Customer Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Customer Name *</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        placeholder="Enter customer name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                        placeholder="Enter customer address"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Services Required</Label>
                      <div className="space-y-3 mt-2">
                        {Object.entries(SERVICE_TYPES).map(([category, services]) => (
                          <div key={category} className="border rounded p-3">
                            <p className="font-medium text-sm mb-2 capitalize">{category}</p>
                            <div className="space-y-2">
                              {services.map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${category}-${service}`}
                                    checked={newCustomer[category.toLowerCase() as keyof typeof newCustomer]?.includes(service)}
                                    onCheckedChange={(checked) => {
                                      const current = newCustomer[category.toLowerCase() as keyof typeof newCustomer] as string || 'None'
                                      const services = current === 'None' ? [] : current.split(', ')
                                      if (checked) {
                                        services.push(service)
                                      } else {
                                        const index = services.indexOf(service)
                                        if (index > -1) services.splice(index, 1)
                                      }
                                      newCustomer[category.toLowerCase() as keyof typeof newCustomer] = services.length > 0 ? services.join(', ') : 'None'
                                      setNewCustomer({...newCustomer})
                                    }}
                                  />
                                  <Label htmlFor={`${category}-${service}`} className="text-sm">{service}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="totalValue">Total Project Value (LKR) *</Label>
                      <Input
                        id="totalValue"
                        type="number"
                        value={newCustomer.totalValue}
                        onChange={(e) => setNewCustomer({...newCustomer, totalValue: e.target.value})}
                        placeholder="Enter total value"
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Initial Status</Label>
                      <Select value={newCustomer.status} onValueChange={(value) => setNewCustomer({...newCustomer, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(CUSTOMER_STATUSES).map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newCustomer.notes}
                        onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleCreateCustomer} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Register Customer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.values(CUSTOMER_STATUSES).map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Grid */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer) => (
                    <Card key={customer.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{customer.name}</CardTitle>
                            <p className="text-sm text-gray-500">{customer.customerId}</p>
                          </div>
                          <Badge className={getStatusColor(customer.status).bgColor}>
                            {customer.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {customer.email}
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {customer.address}
                          </div>
                        </div>

                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Project Value:</span>
                            <span className="font-bold">LKR {customer.totalValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Paid:</span>
                            <span className="font-bold text-green-600">LKR {customer.paidAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Balance:</span>
                            <span className="font-bold text-red-600">
                              LKR {(customer.totalValue - customer.paidAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingCustomer(customer)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Customer</DialogTitle>
                              </DialogHeader>
                              {editingCustomer && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <Input
                                        value={editingCustomer.name}
                                        onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <Input
                                        value={editingCustomer.phone}
                                        onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Address</Label>
                                    <Textarea
                                      value={editingCustomer.address}
                                      onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Email</Label>
                                      <Input
                                        type="email"
                                        value={editingCustomer.email || ''}
                                        onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label>Total Value</Label>
                                      <Input
                                        type="number"
                                        value={editingCustomer.totalValue}
                                        onChange={(e) => setEditingCustomer({...editingCustomer, totalValue: parseFloat(e.target.value)})}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <Select 
                                      value={editingCustomer.status} 
                                      onValueChange={(value) => setEditingCustomer({...editingCustomer, status: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.values(CUSTOMER_STATUSES).map((status) => (
                                          <SelectItem key={status.value} value={status.value}>
                                            {status.value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Notes</Label>
                                    <Textarea
                                      value={editingCustomer.notes || ''}
                                      onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleUpdateCustomer}>Save Changes</Button>
                                    <Button variant="outline" onClick={() => setEditingCustomer(null)}>Cancel</Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Add Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payCustomer">Customer</Label>
                    <Select value={payment.customerId} onValueChange={(value) => setPayment({...payment, customerId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.customerId} - {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payAmount">Amount (LKR)</Label>
                    <Input
                      id="payAmount"
                      type="number"
                      value={payment.amount}
                      onChange={(e) => setPayment({...payment, amount: e.target.value})}
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="payMethod">Payment Method</Label>
                    <Select value={payment.method} onValueChange={(value) => setPayment({...payment, method: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payNotes">Notes</Label>
                    <Input
                      id="payNotes"
                      value={payment.notes}
                      onChange={(e) => setPayment({...payment, notes: e.target.value})}
                      placeholder="Payment notes (optional)"
                    />
                  </div>
                </div>

                <Button onClick={handleAddPayment} className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            {dashboardStats?.recentPayments && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardStats.recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{payment.customer.name}</p>
                          <p className="text-sm text-gray-500">{payment.method} • {new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">LKR {payment.amount.toLocaleString()}</p>
                          {payment.notes && <p className="text-xs text-gray-500">{payment.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}