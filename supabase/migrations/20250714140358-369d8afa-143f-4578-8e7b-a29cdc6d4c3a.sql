-- Create the app_role enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'technician', 'sales');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure the user_roles table has the correct role column type
ALTER TABLE public.user_roles ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;

-- Update the handle_new_user function to properly handle the role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_role text;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Get the role from signup data, default to 'user' if not provided
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'user');
  
  -- Ensure the role is valid before inserting
  IF user_role NOT IN ('user', 'admin', 'technician', 'sales') THEN
    user_role := 'user';
  END IF;
  
  -- Assign the selected role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::public.app_role);
  
  RETURN NEW;
END;
$$;