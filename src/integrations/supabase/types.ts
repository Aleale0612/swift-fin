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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      balance_changes: {
        Row: {
          amount: number
          balance_type: string
          created_at: string
          id: string
          new_balance: Json
          previous_balance: Json
          trade_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          balance_type: string
          created_at?: string
          id?: string
          new_balance: Json
          previous_balance: Json
          trade_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          balance_type?: string
          created_at?: string
          id?: string
          new_balance?: Json
          previous_balance?: Json
          trade_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balance_changes_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_bot: boolean
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_bot?: boolean
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_bot?: boolean
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_notes: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: string | null
          notes: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      debts: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      instruments: {
        Row: {
          contract_size: number
          pip_size: number
          symbol: string
        }
        Insert: {
          contract_size: number
          pip_size: number
          symbol: string
        }
        Update: {
          contract_size?: number
          pip_size?: number
          symbol?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          idr_balance: number | null
          updated_at: string
          usd_balance: number | null
          usd_cent_balance: number | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          idr_balance?: number | null
          updated_at?: string
          usd_balance?: number | null
          usd_cent_balance?: number | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          idr_balance?: number | null
          updated_at?: string
          usd_balance?: number | null
          usd_cent_balance?: number | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          balance_type: string
          commission: number | null
          confidence_level: number | null
          contract_size: number
          created_at: string
          direction: Database["public"]["Enums"]["trade_direction"]
          emotional_psychology: string | null
          entry_price: number
          exit_price: number
          id: string
          lot_size: number
          notes: string | null
          pair: string
          pnl_idr: number | null
          pnl_percent: number
          pnl_usd_cent: number | null
          result_balance: number | null
          result_usd: number
          risk_percent: number | null
          risk_reward: number | null
          screenshot_url: string | null
          session: string | null
          sl: number | null
          stop_loss: number | null
          strategy_tag: string | null
          swap: number | null
          take_profit: number | null
          tp: number | null
          user_id: string | null
        }
        Insert: {
          balance_type?: string
          commission?: number | null
          confidence_level?: number | null
          contract_size: number
          created_at?: string
          direction?: Database["public"]["Enums"]["trade_direction"]
          emotional_psychology?: string | null
          entry_price: number
          exit_price: number
          id?: string
          lot_size: number
          notes?: string | null
          pair: string
          pnl_idr?: number | null
          pnl_percent: number
          pnl_usd_cent?: number | null
          result_balance?: number | null
          result_usd: number
          risk_percent?: number | null
          risk_reward?: number | null
          screenshot_url?: string | null
          session?: string | null
          sl?: number | null
          stop_loss?: number | null
          strategy_tag?: string | null
          swap?: number | null
          take_profit?: number | null
          tp?: number | null
          user_id?: string | null
        }
        Update: {
          balance_type?: string
          commission?: number | null
          confidence_level?: number | null
          contract_size?: number
          created_at?: string
          direction?: Database["public"]["Enums"]["trade_direction"]
          emotional_psychology?: string | null
          entry_price?: number
          exit_price?: number
          id?: string
          lot_size?: number
          notes?: string | null
          pair?: string
          pnl_idr?: number | null
          pnl_percent?: number
          pnl_usd_cent?: number | null
          result_balance?: number | null
          result_usd?: number
          risk_percent?: number | null
          risk_reward?: number | null
          screenshot_url?: string | null
          session?: string | null
          sl?: number | null
          stop_loss?: number | null
          strategy_tag?: string | null
          swap?: number | null
          take_profit?: number | null
          tp?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_trade: {
        Args: {
          p_balance_type: string
          p_contract_size: number
          p_direction: string
          p_emotional_psychology: string
          p_entry_price: number
          p_exit_price: number
          p_lot_size: number
          p_notes: string
          p_pair: string
          p_pnl_idr: number
          p_pnl_percent: number
          p_pnl_usd_cent: number
          p_result_balance: number
          p_result_usd: number
          p_risk_percent: number
          p_risk_reward: number
          p_stop_loss: number
          p_take_profit: number
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      trade_direction: "buy" | "sell"
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
      trade_direction: ["buy", "sell"],
    },
  },
} as const
