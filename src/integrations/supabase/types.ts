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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          hours_target: number
          id: string
          km_target: number
          month: number
          profit_target: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          hours_target?: number
          id?: string
          km_target?: number
          month: number
          profit_target?: number
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          hours_target?: number
          id?: string
          km_target?: number
          month?: number
          profit_target?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      imported_prints: {
        Row: {
          confidence: number | null
          created_at: string
          entry_date: string | null
          fees: number | null
          gross_earnings: number | null
          id: string
          image_url: string | null
          kilometers: number | null
          notes: string | null
          platform_name: string
          status: string | null
          tips: number | null
          trips_count: number | null
          user_id: string
          worked_hours: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          entry_date?: string | null
          fees?: number | null
          gross_earnings?: number | null
          id?: string
          image_url?: string | null
          kilometers?: number | null
          notes?: string | null
          platform_name: string
          status?: string | null
          tips?: number | null
          trips_count?: number | null
          user_id: string
          worked_hours?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          entry_date?: string | null
          fees?: number | null
          gross_earnings?: number | null
          id?: string
          image_url?: string | null
          kilometers?: number | null
          notes?: string | null
          platform_name?: string
          status?: string | null
          tips?: number | null
          trips_count?: number | null
          user_id?: string
          worked_hours?: number | null
        }
        Relationships: []
      }
      platform_entries: {
        Row: {
          created_at: string
          entry_date: string
          extra_costs: number | null
          fuel_cost: number | null
          gross_earnings: number
          id: string
          imported_print_id: string | null
          kilometers: number | null
          notes: string | null
          platform_name: string
          source: string | null
          trips_count: number | null
          user_id: string
          worked_hours: number | null
        }
        Insert: {
          created_at?: string
          entry_date: string
          extra_costs?: number | null
          fuel_cost?: number | null
          gross_earnings: number
          id?: string
          imported_print_id?: string | null
          kilometers?: number | null
          notes?: string | null
          platform_name: string
          source?: string | null
          trips_count?: number | null
          user_id: string
          worked_hours?: number | null
        }
        Update: {
          created_at?: string
          entry_date?: string
          extra_costs?: number | null
          fuel_cost?: number | null
          gross_earnings?: number
          id?: string
          imported_print_id?: string | null
          kilometers?: number | null
          notes?: string | null
          platform_name?: string
          source?: string | null
          trips_count?: number | null
          user_id?: string
          worked_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_entries_imported_print_id_fkey"
            columns: ["imported_print_id"]
            isOneToOne: false
            referencedRelation: "imported_prints"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          data: Json
          gross_earnings: number
          id: string
          month: number
          net_profit: number
          total_costs: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          data?: Json
          gross_earnings?: number
          id?: string
          month: number
          net_profit?: number
          total_costs?: number
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          data?: Json
          gross_earnings?: number
          id?: string
          month?: number
          net_profit?: number
          total_costs?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      rides: {
        Row: {
          app: string | null
          created_at: string
          date: string
          gross_earnings: number
          hours_worked: number
          id: string
          km_driven: number
          note: string | null
          total_minutes: number
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          app?: string | null
          created_at?: string
          date?: string
          gross_earnings?: number
          hours_worked?: number
          id?: string
          km_driven?: number
          note?: string | null
          total_minutes?: number
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          app?: string | null
          created_at?: string
          date?: string
          gross_earnings?: number
          hours_worked?: number
          id?: string
          km_driven?: number
          note?: string | null
          total_minutes?: number
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          plan: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          plan?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          plan?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          created_at: string
          fuel_price: number
          fuel_type: string
          id: string
          is_active: boolean
          km_per_liter: number
          maintenance_cost_per_km: number
          model: string | null
          monthly_installment: number
          nickname: string
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          fuel_price?: number
          fuel_type?: string
          id?: string
          is_active?: boolean
          km_per_liter?: number
          maintenance_cost_per_km?: number
          model?: string | null
          monthly_installment?: number
          nickname: string
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          fuel_price?: number
          fuel_type?: string
          id?: string
          is_active?: boolean
          km_per_liter?: number
          maintenance_cost_per_km?: number
          model?: string | null
          monthly_installment?: number
          nickname?: string
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
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
