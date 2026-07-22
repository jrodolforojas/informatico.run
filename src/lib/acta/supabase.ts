import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Tablas que agrega la integración con ACTA.
 *
 * Van acá y no en database.types.ts porque ese archivo es generado por el CLI
 * de Supabase y se sobrescribe. Cuando se regenere, estas definiciones siguen
 * siendo válidas: se fusionan con el esquema generado más abajo.
 */
export type ActaTables = {
  acta_issuer_identities: {
    Row: {
      controller: string;
      network: string;
      did: string;
      assertion_public_key_multibase: string;
      assertion_public_key_hex: string;
      assertion_private_key_encrypted: string;
      created_at: string;
    };
    Insert: {
      controller: string;
      network: string;
      did: string;
      assertion_public_key_multibase: string;
      assertion_public_key_hex: string;
      assertion_private_key_encrypted: string;
      created_at?: string;
    };
    Update: Partial<ActaTables["acta_issuer_identities"]["Insert"]>;
    Relationships: [];
  };
  credentials: {
    Row: {
      id: string;
      user_id: string;
      event_id: string;
      inscripcion_id: string | null;
      kind: string;
      vc_id: string;
      vault_owner: string;
      holder_did: string;
      issuer_did: string | null;
      network: string;
      tx_id: string | null;
      status: string;
      error: string | null;
      payload: Record<string, unknown>;
      issued_at: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      event_id: string;
      inscripcion_id?: string | null;
      kind: string;
      vc_id: string;
      vault_owner: string;
      holder_did: string;
      issuer_did?: string | null;
      network: string;
      tx_id?: string | null;
      status?: string;
      error?: string | null;
      payload?: Record<string, unknown>;
      issued_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: Partial<ActaTables["credentials"]["Insert"]>;
    Relationships: [];
  };
};

export type ActaDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & ActaTables;
  };
};

/**
 * Cliente con service role. Se salta RLS, así que solo se usa en el servidor
 * y solo para lo que el usuario no puede hacer por sí mismo: escribir el
 * resultado de una emisión y custodiar la identidad del issuer.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL.");
  if (!key) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY: el servidor la necesita para registrar credenciales.",
    );
  }

  return createSupabaseClient<ActaDatabase>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
