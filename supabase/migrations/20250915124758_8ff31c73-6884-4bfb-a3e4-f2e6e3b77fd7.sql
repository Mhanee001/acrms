-- Create activity logging function for service requests
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