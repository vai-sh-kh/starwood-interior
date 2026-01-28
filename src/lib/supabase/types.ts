export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          archived: boolean | null
          author: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          archived?: boolean | null
          author?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          archived?: boolean | null
          author?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
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
          chatbot_metadata: Json | null
          chat_id: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          service_interest: string[] | null
          source: string | null
          status: string
          updated_at: string
          file_path: string | null
        }
        Insert: {
          avatar_color?: string | null
          chatbot_metadata?: Json | null
          chat_id?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service_interest?: string[] | null
          source?: string | null
          status?: string
          updated_at?: string
          file_path?: string | null
        }
        Update: {
          avatar_color?: string | null
          chatbot_metadata?: Json | null
          chat_id?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service_interest?: string[] | null
          source?: string | null
          status?: string
          updated_at?: string
          file_path?: string | null
        }
        Relationships: []
      }
      project_gallery_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          project_id?: string
          updated_at?: string
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
      projects: {
        Row: {
          category_id: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          image: string
          is_new: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          banner_title: string | null
          client_name: string | null
          sarea: string | null
          project_type: string | null
          completion_date: string | null
          project_info: Json | null
          quote: string | null
          quote_author: string | null
          slug: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          image: string
          is_new?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          banner_title?: string | null
          client_name?: string | null
          sarea?: string | null
          project_type?: string | null
          completion_date?: string | null
          project_info?: Json | null
          quote?: string | null
          quote_author?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          is_new?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          banner_title?: string | null
          client_name?: string | null
          sarea?: string | null
          project_type?: string | null
          completion_date?: string | null
          project_info?: Json | null
          quote?: string | null
          quote_author?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
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
      service_gallery_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_gallery_images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_subservices: {
        Row: {
          created_at: string
          display_order: number
          id: string
          service_id: string
          subservice_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          service_id: string
          subservice_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          service_id?: string
          subservice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_subservices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_subservices_subservice_id_fkey"
            columns: ["subservice_id"]
            isOneToOne: false
            referencedRelation: "subservices"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_new: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_new?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_new?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subservice_gallery_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          subservice_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          subservice_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          subservice_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subservice_gallery_images_subservice_id_fkey"
            columns: ["subservice_id"]
            isOneToOne: false
            referencedRelation: "subservices"
            referencedColumns: ["id"]
          },
        ]
      }
      subservices: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          faq: Json | null
          id: string
          image: string | null
          is_new: boolean
          meta_description: string | null
          meta_title: string | null
          parent_service_id: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          faq?: Json | null
          id?: string
          image?: string | null
          is_new?: boolean
          meta_description?: string | null
          meta_title?: string | null
          parent_service_id: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          faq?: Json | null
          id?: string
          image?: string | null
          is_new?: boolean
          meta_description?: string | null
          meta_title?: string | null
          parent_service_id?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subservices_parent_service_id_fkey"
            columns: ["parent_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_avatar_color: { Args: { name_text: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Type aliases for convenience
export type Blog = Tables<"blogs">
export type BlogInsert = TablesInsert<"blogs">
export type BlogUpdate = TablesUpdate<"blogs">
export type BlogCategory = Tables<"blog_categories">
export type BlogCategoryInsert = TablesInsert<"blog_categories">
export type BlogCategoryUpdate = TablesUpdate<"blog_categories">
export type Lead = Tables<"leads">
export type LeadInsert = TablesInsert<"leads">
export type LeadUpdate = TablesUpdate<"leads">
export type Project = Tables<"projects">
export type ProjectInsert = TablesInsert<"projects">
export type ProjectUpdate = TablesUpdate<"projects">
export type Service = Tables<"services">
export type ServiceInsert = TablesInsert<"services">
export type ServiceUpdate = TablesUpdate<"services">
export type Subservice = Tables<"subservices">
export type SubserviceInsert = TablesInsert<"subservices">
export type SubserviceUpdate = TablesUpdate<"subservices">
export type ServiceGalleryImage = Tables<"service_gallery_images">
export type ServiceGalleryImageInsert = TablesInsert<"service_gallery_images">
export type ServiceGalleryImageUpdate = TablesUpdate<"service_gallery_images">
export type ProjectGalleryImage = Tables<"project_gallery_images">
export type ProjectGalleryImageInsert = TablesInsert<"project_gallery_images">
export type ProjectGalleryImageUpdate = TablesUpdate<"project_gallery_images">

// Composite types with relations
export type ServiceWithCategory = Service & {
  blog_categories: BlogCategory | null;
};
export type ProjectWithCategory = Project & {
  blog_categories: BlogCategory | null;
};
export type ServiceWithGallery = Service & {
  service_gallery_images: ServiceGalleryImage[];
  blog_categories: BlogCategory | null;
};
