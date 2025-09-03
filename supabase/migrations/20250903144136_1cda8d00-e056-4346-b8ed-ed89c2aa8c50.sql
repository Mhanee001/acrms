-- Create inventory table for managing company assets and supplies
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory access
-- Admins, managers, and CEOs can view all inventory
CREATE POLICY "Management can view all inventory"
ON public.inventory
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role)
);

-- Technicians can view inventory for maintenance purposes
CREATE POLICY "Technicians can view inventory"
ON public.inventory
FOR SELECT
USING (has_role(auth.uid(), 'technician'::app_role));

-- Users can view inventory (read-only for general staff)
CREATE POLICY "Users can view inventory"
ON public.inventory
FOR SELECT
USING (has_role(auth.uid(), 'user'::app_role));

-- Sales can view inventory for sales purposes
CREATE POLICY "Sales can view inventory"
ON public.inventory
FOR SELECT
USING (has_role(auth.uid(), 'sales'::app_role));

-- Only admins, managers, and CEOs can insert new inventory items
CREATE POLICY "Management can add inventory"
ON public.inventory
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role)
);

-- Only admins, managers, and CEOs can update inventory
CREATE POLICY "Management can update inventory"
ON public.inventory
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role)
);

-- Only admins can delete inventory items
CREATE POLICY "Admins can delete inventory"
ON public.inventory
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update last_updated when quantity changes
CREATE OR REPLACE FUNCTION public.update_inventory_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.quantity != NEW.quantity THEN
    NEW.last_updated = now();
  END IF;
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_last_updated_trigger
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_last_updated();

-- Set created_by on insert
CREATE OR REPLACE FUNCTION public.set_inventory_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_inventory_created_by_trigger
BEFORE INSERT ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.set_inventory_created_by();