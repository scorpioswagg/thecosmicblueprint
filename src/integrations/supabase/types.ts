export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      admin_report_audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json
          report_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json
          report_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json
          report_id?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          attempts: number
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json
          pdf_url: string | null
          recipient_email: string
          recipient_name: string | null
          resend_id: string | null
          status: string
          template_name: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json
          pdf_url?: string | null
          recipient_email: string
          recipient_name?: string | null
          resend_id?: string | null
          status?: string
          template_name: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json
          pdf_url?: string | null
          recipient_email?: string
          recipient_name?: string | null
          resend_id?: string | null
          status?: string
          template_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_change_logs: {
        Row: {
          changed_by: string
          created_at: string
          currency: string
          id: string
          new_price_cents: number
          old_price_cents: number | null
          report_id: string | null
        }
        Insert: {
          changed_by: string
          created_at?: string
          currency?: string
          id?: string
          new_price_cents: number
          old_price_cents?: number | null
          report_id?: string | null
        }
        Update: {
          changed_by?: string
          created_at?: string
          currency?: string
          id?: string
          new_price_cents?: number
          old_price_cents?: number | null
          report_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          adult_consent: boolean
          created_at: string
          id: string
          updated_at: string
          welcome_message_seen: boolean
        }
        Insert: {
          adult_consent?: boolean
          created_at?: string
          id: string
          updated_at?: string
          welcome_message_seen?: boolean
        }
        Update: {
          adult_consent?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          welcome_message_seen?: boolean
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_cents: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          updated_at: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_cents?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_cents?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
          uses_count?: number
        }
        Relationships: []
      }
      purchase_events: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          event_type: string
          id: string
          is_free: boolean
          metadata: Json
          report_id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          event_type: string
          id?: string
          is_free?: boolean
          metadata?: Json
          report_id: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          event_type?: string
          id?: string
          is_free?: boolean
          metadata?: Json
          report_id?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      report_catalog: {
        Row: {
          adult: boolean
          category: string
          cover_image_url: string | null
          created_at: string
          currency: string
          description: string | null
          estimated_delivery: string
          features: string[]
          icon: string | null
          id: string
          is_active: boolean
          metadata: Json
          price_cents: number
          prompt_module: string | null
          sale_price_cents: number | null
          sections: string[]
          seo_description: string | null
          seo_keywords: string[]
          seo_title: string | null
          short_description: string | null
          sort_order: number
          stripe_price_id: string | null
          stripe_product_id: string | null
          system_framing: string | null
          target_words: number
          title: string
          updated_at: string
        }
        Insert: {
          adult?: boolean
          category?: string
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          estimated_delivery?: string
          features?: string[]
          icon?: string | null
          id: string
          is_active?: boolean
          metadata?: Json
          price_cents?: number
          prompt_module?: string | null
          sale_price_cents?: number | null
          sections?: string[]
          seo_description?: string | null
          seo_keywords?: string[]
          seo_title?: string | null
          short_description?: string | null
          sort_order?: number
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          system_framing?: string | null
          target_words?: number
          title: string
          updated_at?: string
        }
        Update: {
          adult?: boolean
          category?: string
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          estimated_delivery?: string
          features?: string[]
          icon?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          price_cents?: number
          prompt_module?: string | null
          sale_price_cents?: number | null
          sections?: string[]
          seo_description?: string | null
          seo_keywords?: string[]
          seo_title?: string | null
          short_description?: string | null
          sort_order?: number
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          system_framing?: string | null
          target_words?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      report_prices: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          is_default: boolean
          price_cents: number
          report_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          price_cents?: number
          report_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          price_cents?: number
          report_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      report_purchases: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          is_free: boolean
          paid_at: string | null
          promo_code_id: string | null
          report_id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          is_free?: boolean
          paid_at?: string | null
          promo_code_id?: string | null
          report_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          is_free?: boolean
          paid_at?: string | null
          promo_code_id?: string | null
          report_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_purchases_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      synastry_sessions: {
        Row: {
          chart_a: Json
          chart_b: Json
          created_at: string
          id: string
          person_a_name: string
          person_b_name: string
          qa: Json
          reports: Json
          synastry: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chart_a?: Json
          chart_b?: Json
          created_at?: string
          id?: string
          person_a_name: string
          person_b_name: string
          qa?: Json
          reports?: Json
          synastry?: Json
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chart_a?: Json
          chart_b?: Json
          created_at?: string
          id?: string
          person_a_name?: string
          person_b_name?: string
          qa?: Json
          reports?: Json
          synastry?: Json
          title?: string
          updated_at?: string
          user_id?: string
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
    }
    Views: { [_ in never]: never }
    Functions: {
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
    CompositeTypes: { [_ in never]: never }
  }
}
