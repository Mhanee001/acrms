# Workflow Diagram (Text Form)

## Service Request Lifecycle

### 1. Request Creation
1. User navigates to Service Request page
2. User fills in request details:
   - Title
   - Description
   - Job type
   - Priority
   - Location
   - Required specialty
3. User submits request
4. System creates service request with "pending" status
5. System logs activity
6. System sends notification to relevant parties

### 2. Request Assignment
1. Technician views available requests
2. Technician selects request to accept
3. System updates status to "assigned"
4. System assigns technician to request
5. System logs activity
6. System sends notification to user

### 3. Work in Progress
1. Technician starts work on request
2. Technician updates status to "in_progress"
3. System logs activity
4. System sends notification to user

### 4. Request Completion
1. Technician completes work
2. Technician updates status to "completed"
3. Technician adds completion notes
4. System sets completed_at timestamp
5. System logs activity
6. System sends notification to user

### 5. Review Process
1. User receives completion notification
2. User reviews completed work
3. User can provide feedback
4. System logs feedback
5. System updates request with feedback

## User Authentication Workflow

### Login Process
1. User navigates to Auth page
2. User enters email and password
3. System validates credentials with Supabase Auth
4. If valid:
   - System retrieves user profile
   - System retrieves user role
   - System redirects based on role
5. If invalid:
   - System shows error message
   - User can try again

### Registration Process
1. User navigates to Auth page with signup mode
2. User fills in registration details:
   - First name
   - Last name
   - Email
   - Password
3. System validates input
4. System creates account with Supabase Auth
5. System creates profile record
6. System assigns default "user" role
7. System sends confirmation email
8. User receives confirmation message

### Password Reset Process
1. User navigates to Auth page with forgot password mode
2. User enters email address
3. System validates email exists
4. System sends password reset email
5. User clicks reset link
6. User enters new password
7. System updates password
8. User receives confirmation

## Asset Management Workflow

### Adding New Asset
1. User navigates to My Assets page
2. User clicks "Add Asset"
3. User fills in asset details:
   - Name
   - Asset type
   - Manufacturer
   - Model
   - Serial number
   - Purchase date
   - Warranty expiration
   - Location
   - Specifications
4. User can upload asset image
5. User saves asset
6. System creates asset record
7. System associates asset with user

### Updating Asset
1. User views asset details
2. User clicks "Edit"
3. User modifies asset information
4. User saves changes
5. System updates asset record
6. System logs activity

### Viewing Assets
1. User navigates to My Assets page
2. System retrieves user's assets
3. System displays assets in grid or list view
4. User can filter and search assets
5. User can view asset details

## Inventory Management Workflow

### Adding Inventory Item
1. Admin/Technician navigates to Inventory page
2. User clicks "Add Item"
3. User fills in item details:
   - Name
   - Description
   - Category
   - Quantity
   - Unit price
   - Supplier information
4. User saves item
5. System creates inventory record

### Updating Inventory
1. User views inventory item
2. User clicks "Edit"
3. User modifies item information
4. User can adjust quantity
5. User saves changes
6. System updates inventory record
7. System checks for low stock alerts

### Low Stock Alert
1. System checks inventory levels
2. If item quantity below threshold:
   - System creates notification
   - System sends alert to relevant staff
3. Staff receives notification
4. Staff can reorder items

## Notification Workflow

### Receiving Notifications
1. System generates notification for events:
   - Request status changes
   - Assignment updates
   - System alerts
2. System creates notification record
3. System displays notification in UI
4. User receives real-time notification (if enabled)

### Viewing Notifications
1. User clicks notification icon
2. System retrieves user's notifications
3. System displays notifications in chronological order
4. User can mark notifications as read
5. User can view notification details

### Notification Settings
1. User navigates to profile settings
2. User can enable/disable notification types
3. User can set notification preferences
4. System saves preferences
5. System applies preferences to future notifications

## Activity Logging Workflow

### Logging Activities
1. System detects user actions:
   - Creating requests
   - Updating status
   - Managing assets
   - Profile changes
2. System creates activity log entry
3. System stores:
   - User ID
   - Action type
   - Description
   - Entity type
   - Entity ID
   - Timestamp
4. System saves log entry

### Viewing Activity Logs
1. User navigates to Activity page
2. System retrieves relevant activity logs
3. System displays logs with filtering options
4. User can search and sort logs
5. User can view log details

## Role Management Workflow

### Assigning Roles
1. Admin navigates to Staff Management page
2. Admin selects user to modify
3. Admin assigns role from available options:
   - User
   - Technician
   - Sales
   - Admin
   - CEO
   - Manager
4. Admin can assign specialty (for technicians)
5. System updates user role
6. System logs activity

### Role-Based Access
1. User logs in
2. System retrieves user role
3. System determines accessible features
4. System renders appropriate UI elements
5. System enforces RLS policies
6. User can only access permitted features

## Data Flow Summary

### Frontend to Backend
1. User interacts with UI components
2. React components make requests to Supabase API
3. Supabase client handles authentication
4. Supabase client performs CRUD operations
5. Database enforces RLS policies
6. Database returns requested data
7. Frontend updates UI with new data

### Real-time Updates
1. Frontend subscribes to real-time channels
2. Database triggers send updates
3. Supabase API broadcasts changes
4. Frontend receives real-time updates
5. UI automatically refreshes with new data
6. User sees live updates without page refresh

### File Upload Process
1. User selects file to upload
2. Frontend validates file type and size
3. Frontend uploads file to Supabase Storage
4. Supabase Storage processes and stores file
5. System receives public URL for file
6. System updates relevant record with file URL
7. User can view uploaded file