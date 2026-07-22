import "server-only";

import { ActaClient } from "@acta-team/credentials";
import { getActaEnv, getActaReadEnv } from "./env";
import { SupabaseIssuerIdentityStorage } from "./storage";

let issuerClient: ActaClient | null = null;
let adminClient: ActaClient | null = null;
let readClient: ActaClient | null = null;

/**
 * Cliente con la key estándar, ligada a la wallet emisora.
 * Es el que se usa para emitir en el vault de la organización.
 */
export function getIssuerClient(): ActaClient {
  if (issuerClient) return issuerClient;
  const env = getActaEnv();
  issuerClient = new ActaClient(env.baseUrl, env.apiKey, {
    storage: new SupabaseIssuerIdentityStorage(),
  });
  return issuerClient;
}

/**
 * Cliente con la key admin. Exento del ownership binding, así que es el único
 * que puede emitir en vaults ajenos, crear sponsored vaults y leer get-vc de
 * cualquier owner.
 *
 * Lanza si no hay admin key configurada — quien la llame debe haber verificado
 * `hasAdminKey()` antes, porque la app funciona sin ella en modo "org".
 */
export function getAdminClient(): ActaClient {
  if (adminClient) return adminClient;
  const env = getActaEnv();
  if (!env.adminKey) {
    throw new Error(
      `Esta operación exige una admin key de ACTA. Definí ACTA_ADMIN_KEY_${env.network.toUpperCase()}.`,
    );
  }
  adminClient = new ActaClient(env.baseUrl, env.adminKey, {
    storage: new SupabaseIssuerIdentityStorage(),
  });
  return adminClient;
}

export function hasAdminKey(): boolean {
  try {
    return getActaEnv().adminKey !== null;
  } catch {
    return false;
  }
}

/**
 * Cliente mínimo para verificación pública. `verify-vc` acepta cualquier key
 * válida y no firma nada, así que esta ruta no necesita wallet ni cifrado.
 */
export function getReadClient(): ActaClient {
  if (readClient) return readClient;
  const env = getActaReadEnv();
  readClient = new ActaClient(env.baseUrl, env.apiKey);
  return readClient;
}
