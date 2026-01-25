// Create this file: src/lib/google-sheets.ts
// Google Sheets API integration

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec";

export interface GoogleSheetsCustomer {
  id: string;
  customerId: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  gutter: string;
  ceiling: string;
  roof: string;
  status: string;
  notes: string | null;
  paidAmount: number;
  totalValue: number;
  services: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleSheetsStats {
  overview: {
    totalCustomers: number;
    totalRevenue: number;
    totalPaid: number;
    outstanding: number;
    averageProjectValue: number;
  };
  statusStats: Record<string, number>;
  recentCustomers: any[];
  recentPayments: any[];
}

class GoogleSheetsAPI {
  private baseURL: string;

  constructor(url: string) {
    this.baseURL = url;
  }

  private async makeRequest(action: string, data: any = {}): Promise<any> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.result === 'error') {
        throw new Error(result.message || 'Unknown error');
      }

      return result;
    } catch (error) {
      console.error('Google Sheets API Error:', error);
      throw error;
    }
  }

  // Customer operations
  async createCustomer(customerData: any): Promise<GoogleSheetsCustomer> {
    return this.makeRequest('create', customerData);
  }

  async getAllCustomers(): Promise<GoogleSheetsCustomer[]> {
    return this.makeRequest('getAll');
  }

  async updateCustomer(customerId: string, updateData: any): Promise<any> {
    return this.makeRequest('edit', { customerId, ...updateData });
  }

  async deleteCustomer(customerId: string): Promise<any> {
    return this.makeRequest('delete', { customerId });
  }

  // Payment operations
  async addPayment(customerId: string, paymentData: any): Promise<any> {
    return this.makeRequest('update', { customerId, ...paymentData });
  }

  // Dashboard operations
  async getDashboardStats(): Promise<GoogleSheetsStats> {
    return this.makeRequest('getStats');
  }
}

export const googleSheetsAPI = new GoogleSheetsAPI(GOOGLE_SHEETS_URL);

// Backup local functions in case Google Sheets is down
export const fallbackToLocal = true;