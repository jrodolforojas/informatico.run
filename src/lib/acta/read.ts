import "server-only";

import { createServiceClient } from "./supabase";

export type CredentialRow = {
  vcId: string;
  kind: "inscripcion" | "finisher";
  status: "pending" | "issued" | "failed" | "simulated";
  txId: string | null;
  network: string;
  issuerDid: string | null;
  holderDid: string;
  issuedAt: string | null;
  claims: Record<string, unknown>;
};

export type ConstanciaChain = {
  inscripcion: CredentialRow | null;
  finisher: CredentialRow | null;
};

/**
 * Constancias de un corredor para un evento.
 *
 * Usa la service role y filtra por user_id explícitamente. El llamador ya
 * autenticó al usuario; la RLS de `credentials` cubre el acceso directo desde
 * el cliente, que es donde importa.
 */
export async function getConstanciaChain(
  userId: string,
  eventId: string,
): Promise<ConstanciaChain> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("credentials")
    .select("vc_id, kind, status, tx_id, network, issuer_did, holder_did, issued_at, payload")
    .eq("user_id", userId)
    .eq("event_id", eventId);

  const rows = (data ?? []).map(
    (r): CredentialRow => ({
      vcId: r.vc_id,
      kind: r.kind as CredentialRow["kind"],
      status: r.status as CredentialRow["status"],
      txId: r.tx_id,
      network: r.network,
      issuerDid: r.issuer_did,
      holderDid: r.holder_did,
      issuedAt: r.issued_at,
      claims: extractSubject(r.payload),
    }),
  );

  return {
    inscripcion: rows.find((r) => r.kind === "inscripcion") ?? null,
    finisher: rows.find((r) => r.kind === "finisher") ?? null,
  };
}

function extractSubject(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const subject = (payload as Record<string, unknown>).credentialSubject;
  return subject && typeof subject === "object" ? (subject as Record<string, unknown>) : {};
}

/** Acorta un tx hash para mostrarlo: 7a3f1c…d29c */
export function shortTx(txId: string): string {
  if (txId.length <= 12) return txId;
  return `${txId.slice(0, 6)}…${txId.slice(-4)}`;
}

/** URL del explorer de Stellar para una transacción. */
export function explorerUrl(txId: string, network: string): string {
  const net = network === "mainnet" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${net}/tx/${txId}`;
}
