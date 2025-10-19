export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string
          user_id: string
          idea_name: string
          description: string
          industry: string
          tone: 'formal' | 'fun' | 'creative'
          language: 'en' | 'ur'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_name: string
          description: string
          industry: string
          tone: 'formal' | 'fun' | 'creative'
          language: 'en' | 'ur'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_name?: string
          description?: string
          industry?: string
          tone?: 'formal' | 'fun' | 'creative'
          language?: 'en' | 'ur'
          created_at?: string
          updated_at?: string
        }
      }
      pitches: {
        Row: {
          id: string
          user_id: string
          idea_id: string
          startup_name: string
          tagline: string
          pitch: string
          problem: string
          solution: string
          target_audience: string
          landing_copy: string
          color_palette: string | null
          logo_concept: string | null
          website_html: string | null
          language: 'en' | 'ur'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id: string
          startup_name: string
          tagline: string
          pitch: string
          problem: string
          solution: string
          target_audience: string
          landing_copy: string
          color_palette?: string | null
          logo_concept?: string | null
          website_html?: string | null
          language: 'en' | 'ur'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string
          startup_name?: string
          tagline?: string
          pitch?: string
          problem?: string
          solution?: string
          target_audience?: string
          landing_copy?: string
          color_palette?: string | null
          logo_concept?: string | null
          website_html?: string | null
          language?: 'en' | 'ur'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

