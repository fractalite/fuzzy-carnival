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
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          due_date: string | null
          assigned_to: string | null
          project_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          due_date?: string | null
          assigned_to?: string | null
          project_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          due_date?: string | null
          assigned_to?: string | null
          project_id?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          status: 'active' | 'completed' | 'on_hold'
          start_date: string | null
          end_date: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          status?: 'active' | 'completed' | 'on_hold'
          start_date?: string | null
          end_date?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          status?: 'active' | 'completed' | 'on_hold'
          start_date?: string | null
          end_date?: string | null
          owner_id?: string
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string | null
          type: 'document' | 'spreadsheet' | 'presentation'
          owner_id: string
          project_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content?: string | null
          type?: 'document' | 'spreadsheet' | 'presentation'
          owner_id: string
          project_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string | null
          type?: 'document' | 'spreadsheet' | 'presentation'
          owner_id?: string
          project_id?: string | null
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          all_day: boolean
          owner_id: string
          project_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          all_day?: boolean
          owner_id: string
          project_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          all_day?: boolean
          owner_id?: string
          project_id?: string | null
        }
      }
    }
  }
}
