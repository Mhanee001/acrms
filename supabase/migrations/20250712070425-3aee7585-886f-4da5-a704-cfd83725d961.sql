-- Add foreign key constraints to establish table relationships

-- Add foreign key from activity_logs.user_id to profiles.id
ALTER TABLE public.activity_logs 
ADD CONSTRAINT fk_activity_logs_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from service_requests.user_id to profiles.id  
ALTER TABLE public.service_requests 
ADD CONSTRAINT fk_service_requests_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from service_requests.assigned_technician_id to profiles.id
ALTER TABLE public.service_requests 
ADD CONSTRAINT fk_service_requests_assigned_technician_id 
FOREIGN KEY (assigned_technician_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add foreign key from user_roles.user_id to profiles.id
ALTER TABLE public.user_roles 
ADD CONSTRAINT fk_user_roles_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;