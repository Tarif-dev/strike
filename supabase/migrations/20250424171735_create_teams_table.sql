-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    match_id TEXT NOT NULL,
    players JSONB NOT NULL,
    captain_id TEXT NOT NULL,
    vice_captain_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    total_points NUMERIC DEFAULT 0,
    match_details JSONB NOT NULL
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own teams
CREATE POLICY "Users can view their own teams" 
ON public.teams 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to create their own teams
CREATE POLICY "Users can create their own teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own teams
CREATE POLICY "Users can update their own teams" 
ON public.teams 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own teams
CREATE POLICY "Users can delete their own teams" 
ON public.teams 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS teams_user_id_idx ON public.teams (user_id);
CREATE INDEX IF NOT EXISTS teams_match_id_idx ON public.teams (match_id);