import "server-only";

import { getReadClient } from "./client";
import { createServiceClient } from "./supabase";

export type VerificationStatus = "valid" | "revoked" | "invalid" | "unknown";

export type Verification = {
  status: VerificationStatus;
  since: string | null;
  vcId: string;
  kind: string | null;
  network: string | null;
  txId: string | null;
  issuerDid: string | null;
  holderDid: string | null;
  issuedAt: string | null;
  /** Claims públicos guardados al emitir. No se leen de la cadena. */
  claims: Record<string, unknown> | null;
  /** Motivo por el que no se pudo consultar la cadena, si aplica. */
  error: string | null;
};

/**
 * Verifica una constancia contra la cadena.
 *
 * `verify-vc` es lectura pura y solo devuelve el estado — nunca el contenido.
 * Los datos que se muestran (nombre, tiempo, dorsal) salen de nuestra base;
 * lo que la cadena aporta es la garantía de que esa credencial existe, quién
 * la emitió y que no fue revocada. Por eso el estado on-chain manda: si la
 * cadena dice "revoked", da igual lo que diga la base.
 */
export async function verifyCredential(vcId: string): Promise<Verification | null> {
  const supabase = createServiceClient();

  const { data: row } = await supabase
    .from("credentials")
    .select("vc_id, kind, vault_owner, network, tx_id, issuer_did, holder_did, issued_at, payload, status")
    .eq("vc_id", vcId)
    .maybeSingle();

  if (!row) return null;

  const base: Verification = {
    status: "unknown",
    since: null,
    vcId: row.vc_id,
    kind: row.kind,
    network: row.network,
    txId: row.tx_id,
    issuerDid: row.issuer_did,
    holderDid: row.holder_did,
    issuedAt: row.issued_at,
    claims: extractPublicClaims(row.payload),
    error: null,
  };

  // Nunca llegó a la cadena: no hay nada que verificar.
  if (row.status !== "issued") {
    return { ...base, status: "invalid", error: null };
  }

  try {
    const client = getReadClient();
    const result = await client.vaultVerify({ owner: row.vault_owner, vcId });
    const status = result.status as VerificationStatus;
    return {
      ...base,
      status: status === "valid" || status === "revoked" ? status : "invalid",
      since: result.since ?? null,
    };
  } catch (err) {
    // La cadena no respondió. No afirmamos que sea válida: lo decimos.
    return {
      ...base,
      status: "unknown",
      error: err instanceof Error ? err.message : "No pudimos consultar la cadena.",
    };
  }
}

/** Claims mostrables. Excluye el `id` del holder y metadatos del contexto. */
function extractPublicClaims(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const vc = payload as Record<string, unknown>;
  const subject = vc.credentialSubject;
  if (!subject || typeof subject !== "object") return null;

  const rest = { ...(subject as Record<string, unknown>) };
  delete rest.id; // el DID del holder se muestra aparte, no como un claim más
  const evento = vc.evento && typeof vc.evento === "object" ? vc.evento : null;

  return { ...rest, ...(evento ? { evento } : {}) };
}
