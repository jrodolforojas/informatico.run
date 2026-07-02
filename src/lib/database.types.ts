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
      events: {
        Row: {
          capacity: number | null
          created_at: string
          edition: number | null
          event_date: string | null
          id: string
          name: string
          next_dorsal: number
          price_colones: number
          registration_open: boolean
          sinpe_name: string | null
          sinpe_phone: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          edition?: number | null
          event_date?: string | null
          id?: string
          name: string
          next_dorsal?: number
          price_colones?: number
          registration_open?: boolean
          sinpe_name?: string | null
          sinpe_phone?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          edition?: number | null
          event_date?: string | null
          id?: string
          name?: string
          next_dorsal?: number
          price_colones?: number
          registration_open?: boolean
          sinpe_name?: string | null
          sinpe_phone?: string | null
        }
        Relationships: []
      }
      inscripciones: {
        Row: {
          amount: number | null
          beneficiario_nombre: string | null
          beneficiario_parentesco: string | null
          category: string | null
          comprobante_path: string | null
          created_at: string
          distance: string
          dorsal: number | null
          event_id: string
          id: string
          payment_method: string
          payment_ref: string | null
          payment_reference: string | null
          payment_verified_at: string | null
          payment_verified_by: string | null
          shirt_size: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          beneficiario_nombre?: string | null
          beneficiario_parentesco?: string | null
          category?: string | null
          comprobante_path?: string | null
          created_at?: string
          distance: string
          dorsal?: number | null
          event_id: string
          id?: string
          payment_method?: string
          payment_ref?: string | null
          payment_reference?: string | null
          payment_verified_at?: string | null
          payment_verified_by?: string | null
          shirt_size?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          beneficiario_nombre?: string | null
          beneficiario_parentesco?: string | null
          category?: string | null
          comprobante_path?: string | null
          created_at?: string
          distance?: string
          dorsal?: number | null
          event_id?: string
          id?: string
          payment_method?: string
          payment_ref?: string | null
          payment_reference?: string | null
          payment_verified_at?: string | null
          payment_verified_by?: string | null
          shirt_size?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inscripciones_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birthdate: string | null
          cedula: string | null
          created_at: string
          dominant_hand: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_admin: boolean
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          birthdate?: string | null
          cedula?: string | null
          created_at?: string
          dominant_hand?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_admin?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          birthdate?: string | null
          cedula?: string | null
          created_at?: string
          dominant_hand?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_admin?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      strava_credentials: {
        Row: {
          access_token: string
          athlete: Json
          athlete_id: number
          created_at: string
          expires_at: string
          refresh_token: string
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          athlete?: Json
          athlete_id: number
          created_at?: string
          expires_at: string
          refresh_token: string
          scope?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          athlete?: Json
          athlete_id?: number
          created_at?: string
          expires_at?: string
          refresh_token?: string
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      event_social_proof: {
        Args: never
        Returns: {
          capacity: number
          event_date: string
          event_id: string
          registered: number
        }[]
      }
      is_admin: { Args: { uid: string }; Returns: boolean }
      reject_inscripcion: {
        Args: { p_id: string; p_reason?: string }
        Returns: undefined
      }
      verify_inscripcion: {
        Args: { p_id: string; p_method?: string; p_reference?: string }
        Returns: number
      }
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
