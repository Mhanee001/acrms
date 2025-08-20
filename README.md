# ACRMS - Abelov Customer Relationship Management System

A comprehensive Customer Relationship Management (CRM) and Service Management platform built with React, TypeScript, and Supabase. ACRMS provides role-based access control for different user types including administrators, technicians, sales staff, and customers.

## 🌟 Features

### **Core Functionality**
- **Multi-role Authentication System** - Support for Admin, Technician, Sales, and User roles
- **Service Request Management** - Complete workflow from request creation to completion
- **Asset Management** - Track and manage company and customer assets with image uploads
- **Inventory Management** - Comprehensive inventory tracking with stock alerts
- **Staff Management** - Role-based user management with specialty assignments
- **Calendar Integration** - View and manage all requests by month
- **Activity Logging** - Complete audit trail of all system activities
- **Contact Management** - Comprehensive customer contact management
- **Sales Pipeline** - Track deals and sales opportunities
- **Notification System** - Real-time notifications for all users

### **Role-Based Access Control**

#### **Admin Users**
- Full system access and configuration
- User and staff management
- Complete service request oversight
- Inventory and asset management
- Reports and analytics
- System notifications management
- **Restricted** from: My Assets, My Requests, Job Requests (focused on management)

#### **Technician Users** 
- Technician-specific dashboard
- Job request management
- Asset access for assigned jobs
- Calendar view of assignments
- Activity logging for completed work
- Specialty-based job assignments
- Inventory access

#### **Sales Users**
- CRM functionality access
- Contact and pipeline management
- Product catalog access
- Reports and analytics
- Activity tracking
- **Restricted** from staff management

#### **Regular Users**
- Personal dashboard
- Asset management (own assets only)
- Service request creation and tracking
- Personal notifications
- Request status monitoring

### **Advanced Features**
- **Real-time Updates** - Live data synchronization across all users
- **Image Upload** - Asset image management with Supabase storage
- **Responsive Design** - Full mobile and desktop compatibility
- **Dark/Light Mode** - Complete theme switching with glassmorphism effects
- **Search & Filtering** - Advanced search across all modules
- **Data Export** - Export functionality for reports
- **Currency Support** - Nigerian Naira (₦) formatting
- **Contact Information Collection** - Comprehensive user profile management

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: React Context, Custom Hooks
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner toast library

## 🏗️ System Architecture

The system follows a modern client-server architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │   Supabase API   │    │   PostgreSQL    │
│                 │    │                  │    │    Database     │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ • Components    │◄──►│ • Authentication │◄──►│ • Tables        │
│ • Hooks         │    │ • REST API       │    │ • RLS Policies  │
│ • Context       │    │ • Real-time      │    │ • Functions     │
│ • Utils         │    │ • Storage        │    │ • Triggers      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📊 Database Schema

### **Core Tables**
- `profiles` - User profile information with contact details
- `user_roles` - Role assignments and specialties
- `service_requests` - Service request management with full lifecycle
- `assets` - Asset tracking and management with image support
- `activity_logs` - System audit trail
- `notifications` - User notifications

### **Key Relationships**
- Users have profiles and roles with specialties
- Service requests belong to users and can be assigned to technicians
- Assets belong to users with image storage
- Activity logs track all system changes
- Notifications are user-specific with read status

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Supabase account and project

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - The project is pre-configured with Supabase credentials
   - Database URL: `https://ybsojrimjnczipcghsie.supabase.co`
   - All environment variables are embedded in the client

4. **Database Setup**
   - The database schema is automatically managed through Supabase migrations
   - All tables, RLS policies, and functions are pre-configured
   - Row Level Security (RLS) is enabled for all tables

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the application**
   - Open [http://localhost:5173](http://localhost:5173) in your browser
   - Create an account or sign in with existing credentials

### **Building for Production**
```bash
npm run build
# or
yarn build
```

## 📱 Usage Guide

### **First Time Setup**
1. Register a new account through the authentication system
2. Your role will be automatically assigned (default: user)
3. Admin users can manage roles through Staff Management
4. Complete your profile with contact information

### **Creating Service Requests**
1. Navigate to "Service Request" from the sidebar
2. Fill in request details including title, description, and priority
3. Select appropriate job type and required specialty
4. Submit and track progress through "My Requests"

### **Managing Assets**
1. Go to "My Assets" to view your assets
2. Add new assets with detailed specifications
3. Upload images for better asset identification
4. Track warranty and maintenance information

### **Inventory Management** (Admin/Technician)
1. Access "Inventory" from the sidebar
2. View all company assets and supplies
3. Monitor stock levels and low-stock alerts
4. Add new inventory items as needed

### **Staff Management** (Admin/CEO/Manager)
1. Navigate to "Staff Management"
2. Create new user accounts with role assignments
3. Assign specialties to technicians
4. Manage user permissions and access levels

## 🔧 Configuration

### **Role Management**
- Roles are managed through the `user_roles` table
- Available roles: `admin`, `technician`, `sales`, `user`, `ceo`, `manager`
- Technicians can have specialties for automatic assignment
- RLS policies enforce role-based access control

### **Currency Configuration**
- All prices displayed in Nigerian Naira (₦)
- Currency formatting handled by `formatCurrency` utility
- Supports large number formatting with proper separators

### **Theme System**
- Light/Dark mode support with theme toggle
- Glassmorphism effects in dark mode
- Semantic color system with HSL values
- Responsive design across all breakpoints

## 🔒 Security Features

- **Row Level Security (RLS)** - All database access is secured
- **Role-based Access Control** - Features restricted by user role
- **Secure Authentication** - Supabase Auth integration
- **Data Validation** - Zod schema validation throughout
- **XSS Protection** - Sanitized inputs and outputs
- **Image Upload Security** - Secure file storage with Supabase Storage

## 📈 Monitoring & Analytics

- **Activity Logging** - Complete audit trail of all actions
- **User Activity** - Track user engagement and usage patterns
- **System Performance** - Monitor request completion times
- **Inventory Tracking** - Stock level monitoring and alerts
- **Request Analytics** - Service request lifecycle metrics

## 📊 System Diagrams

The project includes comprehensive system diagrams located in `src/assets/diagrams/`:

- **ERD Diagram** (`erd-diagram.png`) - Database entity relationships
- **System Architecture** (`system-architecture.png`) - Overall system design
- **Use Case Diagram** (`use-case-diagram.png`) - User role interactions
- **Workflow Diagram** (`workflow-diagram.png`) - Service request lifecycle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the component code for implementation details

## 🚀 Deployment

### **Using Lovable**
1. Open [Lovable Project](https://lovable.dev/projects/07fe7391-35f7-4587-a074-678f4fd4605e)
2. Click on Share → Publish
3. Your app will be deployed automatically

### **Custom Domain**
- Navigate to Project > Settings > Domains
- Click Connect Domain
- Follow the setup instructions

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ using React, TypeScript, and Supabase for comprehensive business management.