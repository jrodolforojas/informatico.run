import "server-only";

import { Keypair } from "@stellar/stellar-sdk";
import type { baseURL } from "@acta-team/credentials/types";

/**
 * Las URLs van literales y no importadas de `@acta-team/credentials`: el índice
 * del paquete exporta `ActaConfig`, un componente cliente que llama a
 * `React.createContext` al evaluarse. Importarlo desde un módulo de servidor
 * (por ejemplo la ruta did.json) rompe el build, porque bajo la condición
 * `react-server` ese API no existe. Acá solo necesitamos dos strings.
 */
const ACTA_MAINNET_URL = "https://api.mainnet.acta.build";
const ACTA_TESTNET_URL = "https://api.testnet.acta.build";

export type ActaNetwork = "mainnet" | "testnet";
export type VaultMode = "org" | "sponsored";

/**
 * Configuración de ACTA resuelta desde el entorno.
 *
 * Se resuelve perezosamente (no al importar el módulo) para que el build de
 * Next no explote en máquinas sin las variables, y para que una ruta pública
 * como /verificar pueda funcionar con solo la API key de lectura.
 */
export type ActaEnv = {
  network: ActaNetwork;
  baseUrl: baseURL;
  /** Key estándar: ligada a la wallet emisora, sujeta al ownership binding. */
  apiKey: string;
  /** Key admin: exenta del ownership binding. `null` si no está configurada. */
  adminKey: string | null;
  issuerSecret: string;
  issuerPublic: string;
  vaultMode: VaultMode;
  identityEncryptionKey: Buffer;
  /** did:stellar preconfigurado del emisor; `null` dispara auto-onboarding. */
  issuerDid: string | null;
  siteHost: string;
  issuanceEnabled: boolean;
};

function readNetwork(): ActaNetwork {
  const raw = (process.env.ACTA_NETWORK ?? "testnet").trim().toLowerCase();
  if (raw !== "mainnet" && raw !== "testnet") {
    throw new Error(`ACTA_NETWORK debe ser "mainnet" o "testnet", no "${raw}".`);
  }
  return raw;
}

/** Resuelve una key por red con fallback al nombre genérico, igual que el SDK. */
function readKey(prefix: string, network: ActaNetwork): string | null {
  const specific = process.env[`${prefix}_${network.toUpperCase()}`];
  if (specific && specific.trim()) return specific.trim();
  const generic = process.env[prefix];
  if (generic && generic.trim()) return generic.trim();
  return null;
}

function readEncryptionKey(): Buffer {
  const raw = process.env.ACTA_IDENTITY_ENCRYPTION_KEY?.trim();
  if (!raw) {
    throw new Error(
      "Falta ACTA_IDENTITY_ENCRYPTION_KEY. Generala con: openssl rand -hex 32",
    );
  }
  if (!/^[0-9a-fA-F]{64}$/.test(raw)) {
    throw new Error(
      "ACTA_IDENTITY_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres).",
    );
  }
  return Buffer.from(raw, "hex");
}

let cached: ActaEnv | null = null;

export function getActaEnv(): ActaEnv {
  if (cached) return cached;

  const network = readNetwork();

  const apiKey = readKey("ACTA_API_KEY", network);
  if (!apiKey) {
    throw new Error(
      `Falta la API key de ACTA para ${network}. Definí ACTA_API_KEY_${network.toUpperCase()} (o ACTA_API_KEY).`,
    );
  }

  const issuerSecret = process.env.ACTA_ISSUER_SECRET?.trim();
  if (!issuerSecret) {
    throw new Error("Falta ACTA_ISSUER_SECRET (secret key S... de la wallet emisora).");
  }

  let issuerPublic: string;
  try {
    issuerPublic = Keypair.fromSecret(issuerSecret).publicKey();
  } catch {
    throw new Error("ACTA_ISSUER_SECRET no es una secret key Stellar válida (debe empezar con S).");
  }

  // Si el operador declaró la pública, verificamos que sea la misma cuenta.
  // Barato acá, carísimo de diagnosticar después: mezclar claves entre redes
  // se manifiesta como un 403 ownership violation al emitir.
  const declaredPublic = process.env.ACTA_ISSUER_PUBLIC?.trim();
  if (declaredPublic && declaredPublic !== issuerPublic) {
    throw new Error(
      `ACTA_ISSUER_PUBLIC (${declaredPublic}) no corresponde a ACTA_ISSUER_SECRET (${issuerPublic}).`,
    );
  }

  const vaultModeRaw = (process.env.ACTA_VAULT_MODE ?? "org").trim().toLowerCase();
  if (vaultModeRaw !== "org" && vaultModeRaw !== "sponsored") {
    throw new Error(`ACTA_VAULT_MODE debe ser "org" o "sponsored", no "${vaultModeRaw}".`);
  }
  const vaultMode = vaultModeRaw as VaultMode;

  const adminKey = readKey("ACTA_ADMIN_KEY", network);
  if (vaultMode === "sponsored" && !adminKey) {
    throw new Error(
      `ACTA_VAULT_MODE="sponsored" exige una admin key: definí ACTA_ADMIN_KEY_${network.toUpperCase()} (o ACTA_ADMIN_KEY).`,
    );
  }

  const issuerDid = process.env.ACTA_ISSUER_DID?.trim() || null;
  if (issuerDid && !new RegExp(`^did:stellar:${network}:[a-z2-7]{26}$`).test(issuerDid)) {
    throw new Error(
      `ACTA_ISSUER_DID no es un did:stellar válido para ${network}: "${issuerDid}".`,
    );
  }

  cached = {
    network,
    baseUrl: network === "mainnet" ? ACTA_MAINNET_URL : ACTA_TESTNET_URL,
    apiKey,
    adminKey,
    issuerSecret,
    issuerPublic,
    vaultMode,
    identityEncryptionKey: readEncryptionKey(),
    issuerDid,
    siteHost: (process.env.NEXT_PUBLIC_SITE_HOST ?? "informatico.run").trim(),
    issuanceEnabled: (process.env.ACTA_ISSUANCE_ENABLED ?? "true").trim() !== "false",
  };

  return cached;
}

/** Solo lo necesario para verificar (lectura). No exige wallet ni cifrado. */
export function getActaReadEnv(): { network: ActaNetwork; baseUrl: baseURL; apiKey: string } {
  const network = readNetwork();
  const apiKey = readKey("ACTA_API_KEY", network) ?? readKey("ACTA_ADMIN_KEY", network);
  if (!apiKey) {
    throw new Error(
      `Falta la API key de ACTA para ${network}. verify-vc acepta cualquier key válida.`,
    );
  }
  return { network, baseUrl: network === "mainnet" ? ACTA_MAINNET_URL : ACTA_TESTNET_URL, apiKey };
}

/** `true` si ACTA está configurado lo suficiente para emitir. Nunca lanza. */
export function isActaConfigured(): boolean {
  try {
    getActaEnv();
    return true;
  } catch {
    return false;
  }
}
