-- Add specialty field to user_roles table for technician routing
ALTER TABLE public.user_roles 
ADD COLUMN specialty TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.user_roles.specialty IS 'Technician specialty for service request routing (e.g., hardware, software, network)';

-- Update service requests table to include specialty requirement
ALTER TABLE public.service_requests 
ADD COLUMN required_specialty TEXT;

-- Add comment for clarity  
COMMENT ON COLUMN public.service_requests.required_specialty IS 'Required technician specialty for this service request';

-- Update RLS policies to restrict service request creation to users only
DROP POLICY IF EXISTS "Users can create their own service requests" ON public.service_requests;

CREATE POLICY "Only users can create service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'user'::app_role));

-- Update RLS policy for viewing service requests
DROP POLICY IF EXISTS "Users can view their own service requests" ON public.service_requests;

CREATE POLICY "Users can view their own service requests, technicians and admins can view all" 
ON public.service_requests 
FOR SELECT 
USING (
  (has_role(auth.uid(), 'user'::app_role) AND auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'technician'::app_role)) OR 
  (has_role(auth.uid(), 'admin'::app_role))
);