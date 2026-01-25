# TECH MASTER CRM - Comprehensive Documentation

## Overview

TECH MASTER CRM is a modern, feature-rich Customer Relationship Management system specifically designed for construction and renovation businesses. Built with Next.js 16, TypeScript, and Tailwind CSS, this CRM provides a complete solution for managing customers, projects, payments, and business analytics.

## Features

### 🔐 Authentication System
- Secure JWT-based authentication
- Admin user management
- Session management with HTTP-only cookies
- Auto-logout functionality

### 📊 Dashboard & Analytics
- Real-time business statistics
- Revenue tracking and reporting
- Customer status breakdown
- Recent activity monitoring
- Financial overview (Total Revenue, Paid Amount, Outstanding)

### 👥 Customer Management
- Complete customer profiles with contact information
- Service categorization (Gutter, Ceiling, Roof)
- Advanced status tracking with color-coded system
- Customer search and filtering
- Edit and update customer details

### 💳 Payment Tracking
- Payment recording and management
- Multiple payment methods support
- Automatic status updates based on payments
- Payment history tracking

### 📋 Project Status Management
- 7 distinct project statuses with specific color coding:
  - **Not Confirmed** (Light Gray) - Yet to be confirmed
  - **Quotation Issued** (Orange) - Attention required
  - **Approved** (Blue) - Ready to proceed
  - **Pending** (Yellow) - Payments or documentation pending
  - **In Progress** (Purple) - Work in progress
  - **Completed** (Green) - Successfully completed
  - **Rejected** (Red) - Cancelled/Rejected

### 🎨 Modern UI/UX
- Responsive design for all devices
- Professional dark/light theme support
- Intuitive navigation with tabbed interface
- Loading states and error handling
- Mobile-optimized layout

## Technology Stack

### Frontend
- **Next.js 16** with App Router
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **Lucide React** icons
- **React Hook Form** for form management

### Backend
- **Next.js API Routes** for server-side logic
- **Prisma ORM** for database management
- **SQLite** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database Schema
- **Users** - Authentication and user management
- **Customers** - Customer information and project details
- **Payments** - Payment records and transactions
- **Activity Logs** - System activity tracking

## Getting Started

### Prerequisites
- Node.js 18+ 
- Bun package manager
- Modern web browser

### Installation
1. Clone the repository
2. Install dependencies: `bun install`
3. Set up database: `bun run db:push`
4. Start development server: `bun run dev`

### Default Login Credentials
- **Email**: admin@crm.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - List customers (with search/filter)
- `POST /api/customers` - Create new customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Add new payment

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Status Color System

The CRM uses a comprehensive color-coded status system:

| Status | Color | Meaning |
|--------|-------|---------|
| Not Confirmed | 🔘 Gray | Initial state, awaiting confirmation |
| Quotation Issued | 🟠 Orange | Quote sent, awaiting customer response |
| Approved | 🔵 Blue | Project approved, ready to start |
| Pending | 🟡 Yellow | Awaiting payments or documentation |
| In Progress | 🟣 Purple | Work currently being performed |
| Completed | 🟢 Green | Project successfully finished |
| Rejected | 🔴 Red | Project cancelled or rejected |

## Service Categories

### Gutter Services
- Removing - Existing gutter removal
- New - New gutter installation
- Repair - Gutter maintenance and repair

### Ceiling Services  
- Removing - Ceiling demolition
- New - New ceiling installation
- Repair - Ceiling fixes and maintenance

### Roof Services
- Removing - Roof removal/demolition
- New - New roof installation
- Repair - Roof maintenance and repair

## Payment Methods

- **Cash** - Direct cash payments
- **Bank Transfer** - Electronic bank transfers
- **Cheque** - Check payments
- **Online Payment** - Digital payment platforms

## Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcryptjs
- HTTP-only cookies for session management
- API route protection
- Input validation and sanitization
- SQL injection prevention through Prisma ORM

## Performance Optimizations

- Server-side rendering with Next.js
- Optimized database queries with Prisma
- Component-level code splitting
- Image optimization
- Efficient state management

## Responsive Design

The CRM is fully responsive and works seamlessly on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Planned features for future releases:
- 📈 Advanced reporting and analytics
- 📧 Email notifications and reminders
- 📄 Document upload and management
- 🗓️ Calendar integration
- 📱 Mobile app (React Native)
- 🔄 Data export functionality
- 🌐 Multi-language support
- 📊 Advanced dashboard customization

## Support

For technical support or questions:
- Check the documentation
- Review API endpoints
- Test with demo credentials
- Verify database connection

## License

This project is proprietary to TECH MASTER CRM - Wedabime Pramukayo.

---

**TECH MASTER CRM** - *Wedabime Pramukayo*  
*Comprehensive CRM Solution for Construction Excellence*