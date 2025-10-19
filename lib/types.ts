export interface User {
  id: string;
  email: string | undefined;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  idea_name: string;
  description: string;
  industry: string;
  tone: 'formal' | 'fun' | 'creative';
  language: 'en' | 'ur';
  created_at: string;
  updated_at: string;
}

export interface Pitch {
  id: string;
  user_id: string;
  idea_id: string;
  startup_name: string;
  tagline: string;
  pitch: string;
  problem: string;
  solution: string;
  target_audience: string;
  landing_copy: string;
  color_palette?: string;
  logo_concept?: string;
  website_html?: string;
  language: 'en' | 'ur';
  created_at: string;
  updated_at: string;
}

export interface GeminiResponse {
  startup_name: string;
  tagline: string;
  pitch: string;
  problem: string;
  solution: string;
  target_audience: string;
  landing_copy: string;
  color_palette?: string;
  logo_concept?: string;
}

export interface IdeaFormData {
  idea_name: string;
  description: string;
  industry: string;
  tone: 'formal' | 'fun' | 'creative';
  language: 'en' | 'ur';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface DashboardStats {
  total_ideas: number;
  total_pitches: number;
  recent_pitches: Pitch[];
}

