-- Create secure functions for notifications and activity logging

-- Create a secure function to create notifications for service requests
CREATE OR REPLACE FUNCTION public.notify_service_request_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create notifications for admins, technicians, and managers
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    ur.user_id,
    'New Service Request',
    'A new service request "' || NEW.title || '" has been created and requires attention.',
    'info'
  FROM public.user_roles ur
  WHERE ur.role IN ('admin', 'technician', 'manager');
  
  RETURN NEW;
END;
$$;

-- Create a secure function to create activity logs
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid,
  p_action text,
  p_description text,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    description,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_user_id,
    p_action,
    p_description,
    p_entity_type,
    p_entity_id,
    p_metadata
  );
END;
$$;