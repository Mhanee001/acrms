-- Fix search path for existing security definer functions
CREATE OR REPLACE FUNCTION public.assign_technician_by_specialty()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    available_technician uuid;
BEGIN
    -- Only assign if no technician is already assigned and specialty is specified
    IF NEW.assigned_technician_id IS NULL AND NEW.required_specialty IS NOT NULL THEN
        -- Find an available technician with matching specialty
        SELECT ur.user_id INTO available_technician
        FROM user_roles ur
        WHERE ur.role = 'technician'
          AND ur.specialty = NEW.required_specialty
        ORDER BY RANDOM()
        LIMIT 1;
        
        -- Assign the technician if found
        IF available_technician IS NOT NULL THEN
            NEW.assigned_technician_id := available_technician;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_inventory_last_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF OLD.quantity != NEW.quantity THEN
    NEW.last_updated = now();
  END IF;
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_inventory_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $function$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$function$;