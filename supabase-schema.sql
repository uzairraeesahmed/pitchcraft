-- PitchCraft Database Schema
-- Run this SQL in your Supabase SQL editor to set up the database

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_name TEXT NOT NULL,
  description TEXT NOT NULL,
  industry TEXT NOT NULL,
  tone TEXT CHECK (tone IN ('formal', 'fun', 'creative')) NOT NULL,
  language TEXT CHECK (language IN ('en', 'ur')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pitches table
CREATE TABLE IF NOT EXISTS pitches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  startup_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  pitch TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  landing_copy TEXT NOT NULL,
  color_palette TEXT,
  logo_concept TEXT,
  website_html TEXT,
  language TEXT CHECK (language IN ('en', 'ur')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ideas table
CREATE POLICY "Users can view their own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for pitches table
CREATE POLICY "Users can view their own pitches" ON pitches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pitches" ON pitches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitches" ON pitches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitches" ON pitches
  FOR DELETE USING (auth.uid() = user_id);

-- Allow public access to pitches for sharing (read-only)
CREATE POLICY "Public can view pitches for sharing" ON pitches
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at);
CREATE INDEX IF NOT EXISTS idx_pitches_user_id ON pitches(user_id);
CREATE INDEX IF NOT EXISTS idx_pitches_idea_id ON pitches(idea_id);
CREATE INDEX IF NOT EXISTS idx_pitches_created_at ON pitches(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pitches_updated_at BEFORE UPDATE ON pitches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for dashboard stats
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT i.id) as total_ideas,
  COUNT(DISTINCT p.id) as total_pitches,
  MAX(p.created_at) as last_pitch_date
FROM auth.users u
LEFT JOIN ideas i ON u.id = i.user_id
LEFT JOIN pitches p ON u.id = p.user_id
GROUP BY u.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ideas TO anon, authenticated;
GRANT ALL ON pitches TO anon, authenticated;
GRANT SELECT ON user_dashboard_stats TO anon, authenticated;

