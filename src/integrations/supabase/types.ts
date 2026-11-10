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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      selling_categories: {
        Row: { id: string; name: string; description: string; image_url: string; tagline: string; accent_color: string; types: string[]; preparation: string; intro: string; seo_title: string; seo_description: string; sort_order: number; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id: string; name: string; description: string; image_url: string; tagline?: string; accent_color?: string; types: string[]; preparation: string; intro?: string; seo_title?: string; seo_description?: string; sort_order?: number; is_active?: boolean }
        Update: { name?: string; description?: string; image_url?: string; tagline?: string; accent_color?: string; types?: string[]; preparation?: string; intro?: string; seo_title?: string; seo_description?: string; sort_order?: number; is_active?: boolean }
        Relationships: []
      }
      admin_lead_notes: {
        Row: { lead_id: string; notes: string; updated_at: string }
        Insert: { lead_id: string; notes?: string; updated_at?: string }
        Update: { lead_id?: string; notes?: string; updated_at?: string }
        Relationships: []
      }
      leads: {
        Row: {
          selling_category_id: string | null
          address: string | null
          brand_id: string | null
          brand_name: string | null
          created_at: string
          email: string | null
          fuel_type: string | null
          has_photo: boolean
          id: string
          items: string[]
          km_driven: number | null
          lat: number | null
          lead_type: string
          lng: number | null
          locality: string | null
          manufacture_year: number | null
          message: string | null
          model_id: string | null
          model_name: string | null
          name: string
          notes: string | null
          phone: string
          photo_url: string | null
          pickup_id: string | null
          pincode: string | null
          preferred_date: string | null
          registration_number: string | null
          slot: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
          variant_id: string | null
          variant_name: string | null
          vehicle_brand_id: string | null
          vehicle_brand_name: string | null
          vehicle_model_id: string | null
          vehicle_model_name: string | null
          vehicle_type: string
          vehicle_variant_id: string | null
          vehicle_variant_name: string | null
        }
        Insert: {
          selling_category_id?: string | null
          address?: string | null
          brand_id?: string | null
          brand_name?: string | null
          created_at?: string
          email?: string | null
          fuel_type?: string | null
          has_photo?: boolean
          id?: string
          items?: string[]
          km_driven?: number | null
          lat?: number | null
          lead_type?: string
          lng?: number | null
          locality?: string | null
          manufacture_year?: number | null
          message?: string | null
          model_id?: string | null
          model_name?: string | null
          name: string
          notes?: string | null
          phone: string
          photo_url?: string | null
          pickup_id?: string | null
          pincode?: string | null
          preferred_date?: string | null
          registration_number?: string | null
          slot?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
          variant_name?: string | null
          vehicle_brand_id?: string | null
          vehicle_brand_name?: string | null
          vehicle_model_id?: string | null
          vehicle_model_name?: string | null
          vehicle_type?: string
          vehicle_variant_id?: string | null
          vehicle_variant_name?: string | null
        }
        Update: {
          selling_category_id?: string | null
          address?: string | null
          brand_id?: string | null
          brand_name?: string | null
          created_at?: string
          email?: string | null
          fuel_type?: string | null
          has_photo?: boolean
          id?: string
          items?: string[]
          km_driven?: number | null
          lat?: number | null
          lead_type?: string
          lng?: number | null
          locality?: string | null
          manufacture_year?: number | null
          message?: string | null
          model_id?: string | null
          model_name?: string | null
          name?: string
          notes?: string | null
          phone?: string
          photo_url?: string | null
          pickup_id?: string | null
          pincode?: string | null
          preferred_date?: string | null
          registration_number?: string | null
          slot?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
          variant_name?: string | null
          vehicle_brand_id?: string | null
          vehicle_brand_name?: string | null
          vehicle_model_id?: string | null
          vehicle_model_name?: string | null
          vehicle_type?: string
          vehicle_variant_id?: string | null
          vehicle_variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "vehicle_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "vehicle_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_vehicle_brand_id_fkey"
            columns: ["vehicle_brand_id"]
            isOneToOne: false
            referencedRelation: "vehicle_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_vehicle_model_id_fkey"
            columns: ["vehicle_model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_vehicle_variant_id_fkey"
            columns: ["vehicle_variant_id"]
            isOneToOne: false
            referencedRelation: "vehicle_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_locations: {
        Row: {
          active: boolean
          area: string | null
          created_at: string
          id: string
          location_type: string
          pincode: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          area?: string | null
          created_at?: string
          id?: string
          location_type?: string
          pincode?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          area?: string | null
          created_at?: string
          id?: string
          location_type?: string
          pincode?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          lat: number | null
          lng: number | null
          locality: string | null
          pincode: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          locality?: string | null
          pincode?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          locality?: string | null
          pincode?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_brands: {
        Row: {
          active: boolean
          category_id: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
          subcategory_id: string | null
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
          subcategory_id?: string | null
          updated_at?: string
          vehicle_type?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          subcategory_id?: string | null
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_brands_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_brands_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "vehicle_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_url: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          active: boolean
          body_type: string | null
          brand_id: string
          created_at: string
          fuel_types: string[]
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          body_type?: string | null
          brand_id: string
          created_at?: string
          fuel_types?: string[]
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          body_type?: string | null
          brand_id?: string
          created_at?: string
          fuel_types?: string[]
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "vehicle_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_subcategories: {
        Row: {
          active: boolean
          category_id: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_variants: {
        Row: {
          active: boolean
          created_at: string
          fuel_type: string | null
          id: string
          model_id: string
          name: string
          sort_order: number
          transmission: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          fuel_type?: string | null
          id?: string
          model_id: string
          name: string
          sort_order?: number
          transmission?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          fuel_type?: string | null
          id?: string
          model_id?: string
          name?: string
          sort_order?: number
          transmission?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_variants_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_update_lead: { Args: { p_lead_id: string; p_status: string; p_notes: string }; Returns: undefined }
      admin_exists: { Args: never; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
