// src/app.d.ts
import { SupabaseClient, Session } from '@supabase/supabase-js'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient
      user: any
      session: Session | null
    }
    interface PageData {
      session: Session | null
    }
  }
}

export {};
