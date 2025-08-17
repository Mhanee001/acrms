-- Add new user roles
ALTER TYPE public.app_role ADD VALUE 'ceo';
ALTER TYPE public.app_role ADD VALUE 'manager';

-- Add separate columns for asset specifications instead of JSON
ALTER TABLE public.assets 
ADD COLUMN cpu TEXT,
ADD COLUMN ram TEXT,
ADD COLUMN storage TEXT,
ADD COLUMN operating_system TEXT,
ADD COLUMN screen_size TEXT,
ADD COLUMN graphics_card TEXT,
ADD COLUMN network_ports TEXT,
ADD COLUMN power_supply TEXT,
ADD COLUMN other_specs TEXT;

-- Update service requests to add automatic technician assignment
CREATE OR REPLACE FUNCTION assign_technician_by_specialty()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for automatic technician assignment
CREATE TRIGGER trigger_assign_technician 
    BEFORE INSERT ON public.service_requests
    FOR EACH ROW 
    EXECUTE FUNCTION assign_technician_by_specialty();