-- Fix RLS policies to allow customers to see their requests and admins to add staff

-- Update service_requests policy to allow users to see their own requests
DROP POLICY IF EXISTS "Users can view their own service requests, technicians and admi" ON public.service_requests;

CREATE POLICY "Users can view service requests" 
ON public.service_requests 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  has_role(auth.uid(), 'technician'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure user_roles table allows proper staff creation by admins
DROP POLICY IF EXISTS "Admins can create user roles for staff" ON public.user_roles;

CREATE POLICY "Staff management access" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Add policy to allow admins to update user roles
CREATE POLICY "Staff role updates" 
ON public.user_roles 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Add policy to allow admins to delete user roles  
CREATE POLICY "Staff role deletion" 
ON public.user_roles 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);