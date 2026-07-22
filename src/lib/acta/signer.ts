import "server-only";

import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";
import type { Signer } from "@acta-team/credentials";
import { getActaEnv } from "./env";

/**
 * Firmante del lado del servidor para la wallet de la organización.
 *
 * ACTA es no-custodial: la API arma un XDR sin firmar, acá se firma
 * localmente y se devuelve firmado. La secret key nunca sale del proceso
 * ni viaja a ACTA — la única diferencia con Freighter es que el "wallet"
 * es nuestro propio servidor, porque el emisor es la organización y no
 * una persona con extensión de navegador.
 */
export function createIssuerSigner(): Signer {
  const { issuerSecret } = getActaEnv();
  const keypair = Keypair.fromSecret(issuerSecret);

  return async (unsignedXdr, { networkPassphrase }) => {
    const tx = TransactionBuilder.fromXDR(unsignedXdr, networkPassphrase);
    tx.sign(keypair);
    return tx.toXDR();
  };
}
