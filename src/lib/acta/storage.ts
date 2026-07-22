import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { IssuerIdentity, IssuerIdentityStorage } from "@acta-team/credentials";
import { getActaEnv } from "./env";
import { createServiceClient } from "./supabase";

/**
 * Persistencia de la identidad del issuer en Supabase.
 *
 * El storage por defecto del SDK en Node es en memoria: en Vercel cada cold
 * start acuñaría un did:stellar nuevo, y cada uno cuesta una transacción y
 * rompe la continuidad del emisor (los verificadores resolverían un DID
 * distinto por edición). Esto lo evita.
 *
 * `assertionPrivateKeyHex` es la pieza sensible: se guarda cifrada con
 * AES-256-GCM bajo ACTA_IDENTITY_ENCRYPTION_KEY, con el controller y la red
 * ligados como AAD para que un registro no se pueda reusar en otra red.
 */

const AAD_VERSION = "acta-issuer-identity-v1";

function encrypt(plaintext: string, aad: string): string {
  const { identityEncryptionKey } = getActaEnv();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", identityEncryptionKey, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), ciphertext.toString("hex")].join(".");
}

function decrypt(payload: string, aad: string): string {
  const { identityEncryptionKey } = getActaEnv();
  const [ivHex, tagHex, dataHex] = payload.split(".");
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error("Registro de identidad del issuer corrupto: formato inesperado.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    identityEncryptionKey,
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}

function aadFor(controller: string, network: string): string {
  return `${AAD_VERSION}:${network}:${controller}`;
}

export class SupabaseIssuerIdentityStorage implements IssuerIdentityStorage {
  async get(
    controller: string,
    network: "mainnet" | "testnet",
  ): Promise<IssuerIdentity | null> {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("acta_issuer_identities")
      .select("did, controller, assertion_public_key_multibase, assertion_public_key_hex, assertion_private_key_encrypted")
      .eq("controller", controller)
      .eq("network", network)
      .maybeSingle();

    if (error) {
      throw new Error(`No pudimos leer la identidad del issuer: ${error.message}`);
    }
    if (!data) return null;

    return {
      did: data.did,
      controller: data.controller,
      assertionPublicKeyMultibase: data.assertion_public_key_multibase,
      assertionPublicKeyHex: data.assertion_public_key_hex,
      assertionPrivateKeyHex: decrypt(
        data.assertion_private_key_encrypted,
        aadFor(controller, network),
      ),
    };
  }

  async set(identity: IssuerIdentity, network: "mainnet" | "testnet"): Promise<void> {
    const supabase = createServiceClient();
    const { error } = await supabase.from("acta_issuer_identities").upsert(
      {
        controller: identity.controller,
        network,
        did: identity.did,
        assertion_public_key_multibase: identity.assertionPublicKeyMultibase,
        assertion_public_key_hex: identity.assertionPublicKeyHex,
        assertion_private_key_encrypted: encrypt(
          identity.assertionPrivateKeyHex,
          aadFor(identity.controller, network),
        ),
      },
      { onConflict: "controller,network" },
    );

    if (error) {
      throw new Error(`No pudimos guardar la identidad del issuer: ${error.message}`);
    }
  }
}
