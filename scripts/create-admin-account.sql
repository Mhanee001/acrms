-- Manual script to create admin account
-- Run this in Supabase SQL Editor if you need to create an admin account

-- Step 1: Create the admin user in auth.users (this should be done through Supabase Auth)
-- You can do this by:
-- 1. Going to Authentication > Users in Supabase Dashboard
-- 2. Click "Add User"
-- 3. Enter email: admin@acrms.com
-- 4. Set password
-- 5. Or sign up through your app with admin@acrms.com

-- Step 2: Once the user exists, run this to set up their role and profile
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Find the admin user
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@acrms.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Create profile for admin user
        INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (
            admin_user_id,
            'admin@acrms.com',
            'Admin User',
            'admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            updated_at = NOW();
        
        -- Add admin role
        INSERT INTO public.user_roles (user_id, role, created_at)
        VALUES (admin_user_id, 'admin', NOW())
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin account created successfully for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No user found with email admin@acrms.com. Please create the user first through Supabase Auth.';
    END IF;
END $$;

-- Step 3: Verify the admin account was created
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    ur.role as user_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'admin@acrms.com'; 