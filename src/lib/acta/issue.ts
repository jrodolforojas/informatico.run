import "server-only";

import {
  normalizeError,
  type ActaClient,
  type TxPrepareResponse,
  type TxSubmitResponse,
} from "@acta-team/credentials";
import { getActaEnv } from "./env";
import { getAdminClient, getIssuerClient, hasAdminKey } from "./client";
import { createIssuerSigner } from "./signer";
import { holderDidForUser } from "./did";
import { createServiceClient } from "./supabase";

/**
 * `isTxPrepareResponse` / `isTxSubmitResponse` existen dentro del paquete pero
 * la v1.1.4 no los re-exporta desde el índice, así que van acá.
 */
function isPrepare(r: TxPrepareResponse | TxSubmitResponse): r is TxPrepareResponse {
  return typeof (r as TxPrepareResponse).xdr === "string";
}
function isSubmit(r: TxPrepareResponse | TxSubmitResponse): r is TxSubmitResponse {
  return typeof (r as TxSubmitResponse).tx_id === "string";
}

export type CredentialKind = "inscripcion" | "finisher";

export type IssueResult =
  | { ok: true; vcId: string; txId: string; holderDid: string; issuerDid: string }
  | { ok: true; vcId: string; txId: null; holderDid: string; issuerDid: string; skipped: "disabled" }
  | { ok: false; vcId: string; error: string };

/** Mensaje legible desde cualquier fallo del SDK. */
function describe(err: unknown): string {
  try {
    const normalized = normalizeError(err) as { message?: string; code?: string };
    if (normalized?.message) {
      return normalized.code ? `${normalized.code}: ${normalized.message}` : normalized.message;
    }
  } catch {
    // normalizeError no reconoció la forma; caemos al genérico.
  }
  return err instanceof Error ? err.message : String(err);
}

/** `true` si el error es "esto ya existía", que en create/issue es benigno. */
function isAlreadyExists(err: unknown): boolean {
  const message = describe(err).toLowerCase();
  return (
    message.includes("already exists") ||
    message.includes("vault_already_exists") ||
    message.includes("vc_already_exists")
  );
}

/**
 * did:stellar del emisor. La primera llamada genera el par de claves, registra
 * el DID on-chain con una firma y lo persiste en Supabase; las siguientes lo
 * leen del storage sin tocar la cadena.
 */
export async function ensureIssuerIdentity(): Promise<string> {
  const env = getActaEnv();
  const client = getIssuerClient();

  const identity = await client.getOrCreateIssuerIdentity({
    controller: env.issuerPublic,
    signTransaction: createIssuerSigner(),
  });

  if (env.issuerDid && env.issuerDid !== identity.did) {
    throw new Error(
      `ACTA_ISSUER_DID (${env.issuerDid}) no coincide con la identidad almacenada (${identity.did}). ` +
        "Borrá la variable o alineá el registro antes de emitir.",
    );
  }

  return identity.did;
}

/**
 * Crea el vault de la organización si todavía no existe.
 * Es idempotente: "vault_already_exists" se trata como éxito.
 */
export async function ensureOrgVault(): Promise<void> {
  const env = getActaEnv();
  const client = getIssuerClient();
  const issuerDid = await ensureIssuerIdentity();
  const sign = createIssuerSigner();

  try {
    const prepared = await client.vaultCreate({
      owner: env.issuerPublic,
      didUri: issuerDid,
      sourcePublicKey: env.issuerPublic,
    });
    if (!isPrepare(prepared)) return;

    const signedXdr = await sign(prepared.xdr, { networkPassphrase: prepared.network });
    await client.vaultCreate({ signedXdr });
  } catch (err) {
    if (isAlreadyExists(err)) return;
    throw err;
  }
}

/**
 * Crea un vault para un corredor, pagado por la organización.
 * Solo disponible con admin key (`ACTA_VAULT_MODE=sponsored`).
 */
export async function ensureSponsoredVault(ownerAddress: string): Promise<void> {
  const env = getActaEnv();
  const client = getAdminClient();
  const issuerDid = await ensureIssuerIdentity();
  const sign = createIssuerSigner();

  try {
    const prepared = await client.sponsoredVaultCreate({
      sponsor: env.issuerPublic,
      owner: ownerAddress,
      didUri: issuerDid,
      sourcePublicKey: env.issuerPublic,
    });
    if (!isPrepare(prepared)) return;

    const signedXdr = await sign(prepared.xdr, { networkPassphrase: prepared.network });
    await client.sponsoredVaultCreate({ signedXdr });
  } catch (err) {
    if (isAlreadyExists(err)) return;
    throw err;
  }
}

/** Emite una credencial: prepare -> firma local -> submit. Devuelve el tx_id. */
async function submitIssuance(
  client: ActaClient,
  args: { owner: string; vcId: string; vcData: string; issuerDid: string },
): Promise<string> {
  const env = getActaEnv();
  const sign = createIssuerSigner();

  const prepared = await client.vcIssue({
    owner: args.owner,
    vcId: args.vcId,
    vcData: args.vcData,
    issuer: env.issuerPublic,
    issuerDid: args.issuerDid,
    sourcePublicKey: env.issuerPublic,
  });

  if (!isPrepare(prepared)) {
    throw new Error("La API devolvió una respuesta inesperada al preparar la emisión.");
  }

  const signedXdr = await sign(prepared.xdr, { networkPassphrase: prepared.network });
  const submitted = await client.vcIssue({ signedXdr });

  if (!isSubmit(submitted)) {
    throw new Error("La API no devolvió tx_id al enviar la emisión firmada.");
  }
  return submitted.tx_id;
}

// ─────────────────────────────────────────────────────────────
// Construcción de los Verifiable Credentials
// ─────────────────────────────────────────────────────────────

const VC_CONTEXT = ["https://www.w3.org/ns/credentials/v2"];

export type InscripcionClaims = {
  userId: string;
  nombre: string;
  dorsal: number;
  distancia: string;
  categoria: string | null;
  edicion: number | null;
  eventoNombre: string;
  fechaEvento: string | null;
};

export type FinisherClaims = InscripcionClaims & {
  tiempoOficial: string;
  ritmo: string | null;
  posicion: number | null;
  posicionCategoria: number | null;
};

/**
 * Los claims se mantienen deliberadamente mínimos.
 *
 * `vcData` viaja cifrado a la cadena (AES-256-GCM), pero ACTA lo ve en claro
 * en el momento de emitir. Cédula, fecha de nacimiento, teléfono y correo
 * están en `profiles` y NO entran acá: nombre, dorsal, distancia y tiempo
 * alcanzan para que la constancia sirva. Límite duro de la API: 10.000 chars.
 */
function buildInscripcionVc(claims: InscripcionClaims, holderDid: string) {
  return {
    "@context": VC_CONTEXT,
    type: ["VerifiableCredential", "RaceRegistrationCredential"],
    credentialSubject: {
      id: holderDid,
      nombre: claims.nombre,
      dorsal: claims.dorsal,
      distancia: claims.distancia,
      ...(claims.categoria ? { categoria: claims.categoria } : {}),
    },
    evento: {
      nombre: claims.eventoNombre,
      ...(claims.edicion != null ? { edicion: claims.edicion } : {}),
      ...(claims.fechaEvento ? { fecha: claims.fechaEvento } : {}),
      organizador: "informatico.run()",
    },
  };
}

function buildFinisherVc(claims: FinisherClaims, holderDid: string) {
  return {
    "@context": VC_CONTEXT,
    type: ["VerifiableCredential", "RaceResultCredential"],
    credentialSubject: {
      id: holderDid,
      nombre: claims.nombre,
      dorsal: claims.dorsal,
      distancia: claims.distancia,
      ...(claims.categoria ? { categoria: claims.categoria } : {}),
      tiempoOficial: claims.tiempoOficial,
      ...(claims.ritmo ? { ritmo: claims.ritmo } : {}),
      ...(claims.posicion != null ? { posicionGeneral: claims.posicion } : {}),
      ...(claims.posicionCategoria != null
        ? { posicionCategoria: claims.posicionCategoria }
        : {}),
    },
    evento: {
      nombre: claims.eventoNombre,
      ...(claims.edicion != null ? { edicion: claims.edicion } : {}),
      ...(claims.fechaEvento ? { fecha: claims.fechaEvento } : {}),
      organizador: "informatico.run()",
      cronometraje: "chip",
    },
  };
}

/**
 * `vcId` determinista, máximo 64 chars. Determinista a propósito: si una
 * emisión se reintenta, choca contra el mismo id y la API responde
 * `vc_already_exists` en vez de cobrar una segunda tarifa.
 */
export function buildVcId(
  kind: CredentialKind,
  edicion: number | null,
  distancia: string,
  dorsal: number,
): string {
  const ed = edicion != null ? String(edicion) : "x";
  const dist = distancia.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `infrun-${ed}-${dist}-d${dorsal}-${kind}`.slice(0, 64);
}

// ─────────────────────────────────────────────────────────────
// Emisión + registro en base de datos
// ─────────────────────────────────────────────────────────────

type IssueArgs = {
  kind: CredentialKind;
  userId: string;
  eventId: string;
  inscripcionId: string | null;
  vcId: string;
  vc: Record<string, unknown>;
  /** Dirección Stellar del corredor, solo en modo sponsored. */
  runnerAddress?: string | null;
};

async function issueAndRecord(args: IssueArgs): Promise<IssueResult> {
  const env = getActaEnv();
  const supabase = createServiceClient();
  const holderDid = holderDidForUser(args.userId);

  // El owner del vault define dónde vive la constancia. En modo "org" todo cae
  // en el vault de la organización; en "sponsored" cada corredor tiene el suyo
  // y hace falta admin key para emitir ahí.
  const sponsored = env.vaultMode === "sponsored" && Boolean(args.runnerAddress);
  const vaultOwner = sponsored ? args.runnerAddress! : env.issuerPublic;

  // Marcamos la intención antes de tocar la cadena. El índice único sobre
  // vc_id convierte un doble click del admin en un no-op en vez de una
  // segunda tarifa on-chain.
  const { data: existing } = await supabase
    .from("credentials")
    .select("id, status, tx_id")
    .eq("vc_id", args.vcId)
    .maybeSingle();

  if (existing?.status === "issued" && existing.tx_id) {
    return {
      ok: true,
      vcId: args.vcId,
      txId: existing.tx_id,
      holderDid,
      issuerDid: env.issuerDid ?? "",
    };
  }

  if (!env.issuanceEnabled) {
    await supabase.from("credentials").upsert(
      {
        user_id: args.userId,
        event_id: args.eventId,
        inscripcion_id: args.inscripcionId,
        kind: args.kind,
        vc_id: args.vcId,
        vault_owner: vaultOwner,
        holder_did: holderDid,
        network: env.network,
        status: "simulated",
        payload: args.vc,
      },
      { onConflict: "vc_id" },
    );
    return {
      ok: true,
      vcId: args.vcId,
      txId: null,
      holderDid,
      issuerDid: "",
      skipped: "disabled",
    };
  }

  try {
    const issuerDid = await ensureIssuerIdentity();

    if (sponsored) {
      await ensureSponsoredVault(vaultOwner);
    } else {
      await ensureOrgVault();
    }

    const client = sponsored && hasAdminKey() ? getAdminClient() : getIssuerClient();

    const txId = await submitIssuance(client, {
      owner: vaultOwner,
      vcId: args.vcId,
      vcData: JSON.stringify(args.vc),
      issuerDid,
    });

    await supabase.from("credentials").upsert(
      {
        user_id: args.userId,
        event_id: args.eventId,
        inscripcion_id: args.inscripcionId,
        kind: args.kind,
        vc_id: args.vcId,
        vault_owner: vaultOwner,
        holder_did: holderDid,
        issuer_did: issuerDid,
        network: env.network,
        tx_id: txId,
        status: "issued",
        error: null,
        payload: args.vc,
        issued_at: new Date().toISOString(),
      },
      { onConflict: "vc_id" },
    );

    return { ok: true, vcId: args.vcId, txId, holderDid, issuerDid };
  } catch (err) {
    const message = describe(err);

    // La credencial ya estaba anclada (reintento tras timeout): no es un fallo.
    if (isAlreadyExists(err)) {
      await supabase
        .from("credentials")
        .upsert(
          {
            user_id: args.userId,
            event_id: args.eventId,
            inscripcion_id: args.inscripcionId,
            kind: args.kind,
            vc_id: args.vcId,
            vault_owner: vaultOwner,
            holder_did: holderDid,
            network: env.network,
            status: "issued",
            payload: args.vc,
          },
          { onConflict: "vc_id" },
        );
      return { ok: true, vcId: args.vcId, txId: "", holderDid, issuerDid: "" };
    }

    await supabase.from("credentials").upsert(
      {
        user_id: args.userId,
        event_id: args.eventId,
        inscripcion_id: args.inscripcionId,
        kind: args.kind,
        vc_id: args.vcId,
        vault_owner: vaultOwner,
        holder_did: holderDid,
        network: env.network,
        status: "failed",
        error: message,
        payload: args.vc,
      },
      { onConflict: "vc_id" },
    );

    return { ok: false, vcId: args.vcId, error: message };
  }
}

/** Constancia de inscripción: se emite cuando el admin confirma el pago. */
export async function issueInscripcionCredential(args: {
  userId: string;
  eventId: string;
  inscripcionId: string;
  claims: InscripcionClaims;
  runnerAddress?: string | null;
}): Promise<IssueResult> {
  const vcId = buildVcId(
    "inscripcion",
    args.claims.edicion,
    args.claims.distancia,
    args.claims.dorsal,
  );
  const holderDid = holderDidForUser(args.userId);

  return issueAndRecord({
    kind: "inscripcion",
    userId: args.userId,
    eventId: args.eventId,
    inscripcionId: args.inscripcionId,
    vcId,
    vc: buildInscripcionVc(args.claims, holderDid),
    runnerAddress: args.runnerAddress,
  });
}

/** Constancia de finisher: se emite con el tiempo oficial tras la carrera. */
export async function issueFinisherCredential(args: {
  userId: string;
  eventId: string;
  inscripcionId: string;
  claims: FinisherClaims;
  runnerAddress?: string | null;
}): Promise<IssueResult> {
  const vcId = buildVcId(
    "finisher",
    args.claims.edicion,
    args.claims.distancia,
    args.claims.dorsal,
  );
  const holderDid = holderDidForUser(args.userId);

  return issueAndRecord({
    kind: "finisher",
    userId: args.userId,
    eventId: args.eventId,
    inscripcionId: args.inscripcionId,
    vcId,
    vc: buildFinisherVc(args.claims, holderDid),
    runnerAddress: args.runnerAddress,
  });
}
