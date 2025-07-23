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
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          department: string | null
          position: string | null
          role: 'admin' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          department?: string | null
          position?: string | null
          role?: 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          department?: string | null
          position?: string | null
          role?: 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          category: 'notice' | 'study' | 'free' | 'photo'
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: 'notice' | 'study' | 'free' | 'photo'
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: 'notice' | 'study' | 'free' | 'photo'
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          content: string
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          content: string
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          author_id?: string
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          post_id: string | null
          file_name: string
          file_url: string
          file_type: string
          size: number
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          file_name: string
          file_url: string
          file_type: string
          size: number
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          file_name?: string
          file_url?: string
          file_type?: string
          size?: number
          uploaded_by?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          created_by?: string
          created_at?: string
        }
      }
      organization: {
        Row: {
          id: string
          user_id: string
          parent_id: string | null
          position: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parent_id?: string | null
          position: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parent_id?: string | null
          position?: string
          order?: number
          created_at?: string
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