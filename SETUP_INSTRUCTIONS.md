# Setup Instructions

## NotificationBell Component ✅
- Created and ready to use
- Features: real-time notifications, unread count, popover interface
- Add to Header: `<NotificationBell />`

## Admin Account Restoration

### Quick Fix:
1. Go to Supabase Dashboard > SQL Editor
2. Run this SQL:

```sql
-- Find admin user and fix role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@acrms.com';

INSERT INTO public.user_roles (user_id, role, created_at)
SELECT id, 'admin', NOW()
FROM auth.users 
WHERE email = 'admin@acrms.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### If no admin user exists:
1. Create user in Supabase Auth: admin@acrms.com
2. Run the SQL above

### Verify:
```sql
SELECT p.email, p.role, ur.role as user_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'admin@acrms.com';
``` 