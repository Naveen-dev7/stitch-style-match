-- Modify the handle_new_user function to not create profiles for users who will be tailors
-- We'll add metadata to distinguish between regular users and tailors

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new function that only creates profiles for regular users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create profile if user_type is not 'tailor' in metadata
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'regular') != 'tailor' THEN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger again
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();