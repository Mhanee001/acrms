-- Update RLS policies to give CEO and managers same access as admins

-- Update user_roles table - allow CEO and managers to manage all roles like admins
DROP POLICY "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins, CEOs and managers can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Update inventory table - allow CEO and managers to delete inventory like admins
DROP POLICY "Admins can delete inventory" ON public.inventory;
CREATE POLICY "Admins, CEOs and managers can delete inventory" 
ON public.inventory 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Update notifications table - allow CEO and managers to create notifications like admins
DROP POLICY "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins, CEOs and managers can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Update profiles table - allow CEO and managers to create profiles like admins
DROP POLICY "Admins can create profiles" ON public.profiles;
CREATE POLICY "Admins, CEOs and managers can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'ceo'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);