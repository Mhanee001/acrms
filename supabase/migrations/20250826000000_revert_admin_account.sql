-- Revert admin account to proper state
-- This migration ensures the admin account has the correct role and permissions

-- First, let's check if we have an admin user and update their role
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Find the admin user (assuming it's the first user or has admin email)
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@acrms.com' 
    LIMIT 1;
    
    -- If admin user exists, ensure they have admin role
    IF admin_user_id IS NOT NULL THEN
        -- Remove any existing roles for this user
        DELETE FROM public.user_roles WHERE user_id = admin_user_id;
        
        -- Add admin role
        INSERT INTO public.user_roles (user_id, role, created_at)
        VALUES (admin_user_id, 'admin', NOW())
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin user role updated for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No admin user found with email admin@acrms.com';
    END IF;
END $$;

-- Ensure the admin user has a profile
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Admin User') as full_name,
    'admin' as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users 
WHERE email = 'admin@acrms.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- Create a default admin user if none exists
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Check if admin user exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@acrms.com';
    
    -- If no admin user exists, create one
    IF admin_user_id IS NULL THEN
        -- Insert into auth.users (this would typically be done through Supabase Auth)
        -- For now, we'll just ensure the profile exists
        RAISE NOTICE 'No admin user found. Please create admin user through Supabase Auth dashboard or signup process.';
    END IF;
END $$;

-- Ensure proper permissions for admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create RLS policies for admin access
DROP POLICY IF EXISTS "Admins can view all data" ON public.profiles;
CREATE POLICY "Admins can view all data" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can view all service requests" ON public.service_requests;
CREATE POLICY "Admins can view all service requests" ON public.service_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Enable RLS on tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY; 