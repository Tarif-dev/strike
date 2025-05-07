-- Add a foreign key relationship between teams.user_id and auth.users.id
-- This allows proper joining between teams and user data

-- Create a function to help find profile by user_id
CREATE OR REPLACE FUNCTION get_profile_for_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at, username, avatar_url, full_name)
  VALUES (NEW.id, now(), now(), NEW.email, NULL, NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for new users to create profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION get_profile_for_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read profiles
CREATE POLICY "Everyone can view profiles"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

-- Create policy for users to update their own profiles
CREATE POLICY "Users can update their own profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Ensure proper indexes for joins
CREATE INDEX IF NOT EXISTS teams_user_id_index 
ON public.teams(user_id);

CREATE INDEX IF NOT EXISTS profiles_id_index 
ON public.profiles(id);