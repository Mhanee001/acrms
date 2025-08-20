-- Fix RLS policy for user_roles to allow admin user creation
CREATE POLICY "Admins can create user roles for staff"
ON public.user_roles
FOR INSERT
WITH CHECK (
  -- Allow admins, CEOs, and managers to create user roles when creating staff
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);