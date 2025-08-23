# Use Case Diagram (Text Form)

## Actors

1. **User** - Regular users who can create service requests and manage their assets
2. **Technician** - Service technicians who handle and complete service requests
3. **Sales** - Sales staff who manage customer relationships and sales pipelines
4. **Admin** - System administrators with full access to all features
5. **CEO/Manager** - Management staff with oversight capabilities

## Use Cases by Actor

### User
- Create service request
- View my service requests
- View my assets
- Update profile information
- View notifications
- Reset password

### Technician
- View assigned service requests
- Accept service requests
- Update service request status
- Mark service requests as complete
- View calendar
- View inventory
- Update profile information
- View notifications
- View activity logs

### Sales
- Manage contacts
- Manage sales pipeline
- View reports
- Manage products
- View calendar
- Update profile information
- View notifications
- View activity logs

### Admin
- Manage users
- Manage staff
- View all service requests
- Manage inventory
- View activity logs
- Manage notifications
- View reports
- Update profile information
- View notifications

### CEO/Manager
- View reports
- Manage staff
- View activity logs
- Update profile information
- View notifications

## Use Case Descriptions

### Create Service Request (User)
1. User navigates to Service Request page
2. User fills in request details (title, description, job type, priority, location)
3. System validates input
4. System creates new service request
5. System sends notification to relevant parties

### View Service Requests (All Roles)
1. User navigates to My Requests or Service Requests page
2. System retrieves relevant service requests based on role
3. System displays requests with filtering options
4. User can view request details

### Manage Assets (User)
1. User navigates to My Assets page
2. System displays user's assets
3. User can add, edit, or view asset details
4. User can upload asset images

### Accept Service Request (Technician)
1. Technician views available service requests
2. Technician selects a request to accept
3. System updates request status to "assigned"
4. System assigns technician to request
5. System sends notification to user

### Update Service Request Status (Technician/Admin)
1. Technician/Admin views service request details
2. Technician/Admin selects new status
3. System updates request status
4. System logs activity
5. System sends notification to relevant parties

### Manage Users (Admin)
1. Admin navigates to User Management page
2. System displays list of users
3. Admin can create, edit, or delete users
4. Admin can assign roles and specialties

### Manage Inventory (Admin/Technician)
1. User navigates to Inventory page
2. System displays inventory items
3. User can add, edit, or delete inventory items
4. System tracks stock levels

### View Reports (Admin/Sales/CEO)
1. User navigates to Reports page
2. System generates relevant reports
3. User can view and export reports

### View Activity Logs (Admin/Technician/Sales)
1. User navigates to Activity page
2. System retrieves activity logs
3. User can filter and search logs
4. System displays logs in chronological order

## System Features

1. **Authentication**
   - Login
   - Logout
   - Password reset
   - Account registration

2. **Profile Management**
   - View profile
   - Edit profile
   - Upload avatar
   - Update contact information

3. **Notifications**
   - View notifications
   - Mark as read
   - Receive real-time updates

4. **Theme Management**
   - Switch between light/dark mode
   - System preference detection

## Relationships

- Users can create service requests
- Technicians can accept and complete service requests
- Admins can manage all aspects of the system
- Sales staff manage customer relationships
- All roles can view their profile and notifications