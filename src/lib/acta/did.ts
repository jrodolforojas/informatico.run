import "server-only";

import { getActaEnv } from "./env";

/**
 * Identidad del corredor.
 *
 * `credentialSubject.id` tiene que ser un DID. El emisor usa did:stellar
 * (obligatorio y validado on-chain por ACTA), pero los corredores no tienen
 * wallet Stellar: registrarles un did:stellar costaría una transacción por
 * persona y les exigiría custodiar llaves que no pidieron.
 *
 * Por eso el holder usa did:web, que es método W3C estándar y se resuelve por
 * HTTPS contra este mismo deploy (ver src/app/corredor/[userId]/did.json).
 * No es un identificador inventado: cualquiera puede resolverlo y comprobar a
 * qué corredor apunta.
 *
 * Cuando un corredor quiera autocustodia, se le registra un did:stellar y se
 * migra su identificador; las constancias ya emitidas siguen siendo válidas
 * porque su holder queda registrado en `credentials.holder_did`.
 */

/** did:web:{host}:corredor:{userId} — resoluble en /corredor/{userId}/did.json */
export function holderDidForUser(userId: string): string {
  const { siteHost } = getActaEnv();
  // did:web codifica el path con ":" y percent-encodea el host si trae puerto.
  return `did:web:${encodeURIComponent(siteHost)}:corredor:${userId}`;
}

/** Extrae el userId de un did:web nuestro. `null` si no es de este dominio. */
export function userIdFromHolderDid(did: string): string | null {
  const { siteHost } = getActaEnv();
  const prefix = `did:web:${encodeURIComponent(siteHost)}:corredor:`;
  if (!did.startsWith(prefix)) return null;
  const userId = did.slice(prefix.length);
  return userId.length > 0 ? userId : null;
}

/**
 * Documento DID mínimo para un corredor. Solo declara el identificador y el
 * servicio que lo respalda: el corredor no firma nada, así que no publica
 * claves de verificación. Sirve para que un verificador confirme que el DID
 * existe, a qué edición pertenece y quién lo respalda.
 */
export function holderDidDocument(userId: string) {
  const did = holderDidForUser(userId);
  const { siteHost } = getActaEnv();
  return {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: did,
    service: [
      {
        id: `${did}#constancias`,
        type: "LinkedDomains",
        serviceEndpoint: `https://${siteHost}/verificar`,
      },
    ],
  };
}
