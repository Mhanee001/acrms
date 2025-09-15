-- Fix notifications and activity logging by creating database triggers

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

-- Create trigger for service request notifications
DROP TRIGGER IF EXISTS trigger_notify_service_request_created ON public.service_requests;
CREATE TRIGGER trigger_notify_service_request_created
  AFTER INSERT ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_service_request_created();

-- Create a function to automatically log service request activities
CREATE OR REPLACE FUNCTION public.log_service_request_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.user_id,
      'CREATE',
      'Created service request: ' || NEW.title,
      'service_request',
      NEW.id,
      jsonb_build_object(
        'job_type', NEW.job_type,
        'priority', NEW.priority,
        'status', NEW.status
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM public.log_activity(
        COALESCE(NEW.assigned_technician_id, NEW.user_id),
        'UPDATE',
        'Updated service request status from ' || OLD.status || ' to ' || NEW.status || ' for: ' || NEW.title,
        'service_request',
        NEW.id,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
    
    -- Log assignment changes
    IF OLD.assigned_technician_id IS DISTINCT FROM NEW.assigned_technician_id THEN
      PERFORM public.log_activity(
        COALESCE(NEW.assigned_technician_id, NEW.user_id),
        'UPDATE',
        'Service request assigned to technician for: ' || NEW.title,
        'service_request',
        NEW.id,
        jsonb_build_object(
          'assigned_technician_id', NEW.assigned_technician_id
        )
      );
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for service request activity logging
DROP TRIGGER IF EXISTS trigger_log_service_request_activity ON public.service_requests;
CREATE TRIGGER trigger_log_service_request_activity
  AFTER INSERT OR UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.log_service_request_activity();

-- Create activity logging for asset operations
CREATE OR REPLACE FUNCTION public.log_asset_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.user_id,
      'CREATE',
      'Created asset: ' || NEW.name,
      'asset',
      NEW.id,
      jsonb_build_object(
        'asset_type', NEW.asset_type,
        'status', NEW.status
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM public.log_activity(
        NEW.user_id,
        'UPDATE',
        'Updated asset status from ' || OLD.status || ' to ' || NEW.status || ' for: ' || NEW.name,
        'asset',
        NEW.id,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for asset activity logging
DROP TRIGGER IF EXISTS trigger_log_asset_activity ON public.assets;
CREATE TRIGGER trigger_log_asset_activity
  AFTER INSERT OR UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.log_asset_activity();

-- Create activity logging for inventory operations
CREATE OR REPLACE FUNCTION public.log_inventory_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.created_by,
      'CREATE',
      'Added inventory item: ' || NEW.name,
      'inventory',
      NEW.id,
      jsonb_build_object(
        'quantity', NEW.quantity,
        'category', NEW.category
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.quantity IS DISTINCT FROM NEW.quantity THEN
      PERFORM public.log_activity(
        NEW.updated_by,
        'UPDATE',
        'Updated inventory quantity for ' || NEW.name || ' from ' || OLD.quantity || ' to ' || NEW.quantity,
        'inventory',
        NEW.id,
        jsonb_build_object(
          'old_quantity', OLD.quantity,
          'new_quantity', NEW.quantity
        )
      );
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for inventory activity logging
DROP TRIGGER IF EXISTS trigger_log_inventory_activity ON public.inventory;
CREATE TRIGGER trigger_log_inventory_activity
  AFTER INSERT OR UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.log_inventory_activity();

-- Update RLS policies to allow the trigger functions to work
-- Allow the notification function to insert notifications
CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Allow the activity logging function to insert logs
CREATE POLICY "System can create activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (true);