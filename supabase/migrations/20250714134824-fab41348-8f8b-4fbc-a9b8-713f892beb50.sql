-- Update the handle_new_user function to properly assign the role from signup
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
  
  -- Assign the selected role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::app_role);
  
  RETURN NEW;
END;
$$;