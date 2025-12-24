export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string | null
          category_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image: string | null
          slug: string
          title: string
          updated_at: string | null
          archived: boolean | null
          tags: string[] | null
        }
        Insert: {
          author?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          slug: string
          title: string
          updated_at?: string | null
          archived?: boolean | null
          tags?: string[] | null
        }
        Update: {
          author?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          archived?: boolean | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          avatar_color: string | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          avatar_color?: string | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          avatar_color?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          is_new: boolean | null
          status: string
          tags: string[] | null
          title: string
          slug: string | null
          updated_at: string | null
          project_info: Json | null
          quote: string | null
          quote_author: string | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_new?: boolean | null
          status?: string
          tags?: string[] | null
          title: string
          slug?: string | null
          updated_at?: string | null
          project_info?: Json | null
          quote?: string | null
          quote_author?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_new?: boolean | null
          status?: string
          tags?: string[] | null
          title?: string
          slug?: string | null
          updated_at?: string | null
          project_info?: Json | null
          quote?: string | null
          quote_author?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      project_gallery_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          display_order: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          display_order?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          display_order?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_gallery_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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

// Convenience types
export type Blog = Database["public"]["Tables"]["blogs"]["Row"]
export type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"]
export type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"]

export type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"]
export type BlogCategoryInsert = Database["public"]["Tables"]["blog_categories"]["Insert"]
export type BlogCategoryUpdate = Database["public"]["Tables"]["blog_categories"]["Update"]

export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"]

export type ProjectGalleryImage = Database["public"]["Tables"]["project_gallery_images"]["Row"]
export type ProjectGalleryImageInsert = Database["public"]["Tables"]["project_gallery_images"]["Insert"]
export type ProjectGalleryImageUpdate = Database["public"]["Tables"]["project_gallery_images"]["Update"]

// Blog with category relation
export type BlogWithCategory = Blog & {
  blog_categories: BlogCategory | null
}

// Project with category relation
export type ProjectWithCategory = Project & {
  blog_categories: BlogCategory | null
}

// Project with gallery images
export type ProjectWithGallery = Project & {
  project_gallery_images: ProjectGalleryImage[] | null
}

