# NotificationBell Component Setup & Admin Account Restoration

## NotificationBell Component

The NotificationBell component has been created and includes the following features:

### Features:
- **Real-time notifications**: Uses Supabase real-time subscriptions to show new notifications instantly
- **Unread count badge**: Shows the number of unread notifications
- **Popover interface**: Click to view recent notifications
- **Mark as read**: Individual and bulk mark as read functionality
- **Time formatting**: Shows relative time (e.g., "2h ago", "Just now")
- **Notification types**: Different icons and colors for success, warning, error, and info notifications
- **Responsive design**: Works well on mobile and desktop

### Usage:
The NotificationBell component is ready to be used in your Header component. It will automatically:
- Fetch notifications for the current user
- Show unread count
- Handle real-time updates
- Provide a clean interface for viewing notifications

### Integration:
Add the NotificationBell to your Header component:

```tsx
import { NotificationBell } from "@/components/NotificationBell";

// In your Header component
<NotificationBell />
```

## Admin Account Restoration

### Option 1: Using the Migration (Recommended)
1. Run the new migration: `20250826000000_revert_admin_account.sql`
2. This will automatically set up the admin account with proper permissions

### Option 2: Manual Setup
If you need to manually create the admin account:

1. **Create the user in Supabase Auth:**
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add User"
   - Email: `admin@acrms.com`
   - Set a password

2. **Run the SQL script:**
   - Go to Supabase Dashboard > SQL Editor
   - Run the contents of `scripts/create-admin-account.sql`

### Admin Account Details:
- **Email**: admin@acrms.com
- **Role**: admin
- **Permissions**: Full access to all tables and notifications

### Verification:
After setup, you can verify the admin account by running:

```sql
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    ur.role as user_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'admin@acrms.com';
```

## Database Tables Required

The NotificationBell component requires these tables to be set up:

1. **notifications** - Stores user notifications
2. **user_roles** - Stores user role assignments
3. **profiles** - Stores user profile information

Make sure these tables exist and have the proper RLS policies enabled.

## Testing the NotificationBell

1. Log in as admin
2. Create a new service request (this should trigger a notification)
3. Check that the notification appears in the NotificationBell
4. Test marking notifications as read
5. Test the "View all notifications" link

## Troubleshooting

### No notifications showing:
- Check that the user has the correct role in `user_roles` table
- Verify RLS policies are properly configured
- Check browser console for any errors

### Admin account not working:
- Verify the user exists in `auth.users`
- Check that the user has an entry in `profiles` table
- Ensure the user has 'admin' role in `user_roles` table
- Verify RLS policies allow admin access 