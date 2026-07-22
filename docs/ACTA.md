# ACTA — constancias verificables en Stellar

Las constancias de informatico.run se anclan en Stellar con
[ACTA](https://docs.acta.build). Lo que la landing promete ("tu récord queda
verificado, imposible de falsificar") lo cumple este módulo.

## Qué se emite

| Credencial | Cuándo | Dónde se dispara |
|---|---|---|
| `RaceRegistrationCredential` | Al confirmar el pago | `aprobarInscripcion` en [actions.ts](../src/app/admin/actions.ts) |
| `RaceResultCredential` | Al cargar el tiempo oficial | `registrarResultado`, botón **Tiempo** en el panel de admin |

Cada una queda en `credentials` con su `vc_id`, su `tx_id` y su estado, y se
puede comprobar en `/verificar/{vcId}` sin cuenta ni permisos.

## Puesta en marcha

### 1. Wallet emisora

Creá una cuenta Stellar para la organización. Es la que firma cada emisión y
paga la tarifa on-chain.

- **Testnet**: fondeala en <https://friendbot.stellar.org>. Cada credencial
  cuesta 5 XLM de prueba.
- **Mainnet**: necesita **trustline de USDC con saldo**. Cada credencial cuesta
  1 USDC real. Presupuestá `1 × cantidad de credenciales`.

Poné el secret en `ACTA_ISSUER_SECRET` y la pública en `ACTA_ISSUER_PUBLIC`
(opcional, pero atrapa el error de mezclar claves entre redes al arrancar).

### 2. API key

En <https://dapp.acta.build>, con esa misma wallet conectada, generá la key de
la red que corresponda y ponela en `ACTA_API_KEY_TESTNET` /
`ACTA_API_KEY_MAINNET`.

> La key estándar está **ligada a su wallet**: solo puede emitir en el vault de
> esa wallet. Si el `owner` de la petición no coincide, la API responde
> `403 ownership violation`.

### 3. Admin key (opcional)

`ACTA_ADMIN_KEY_TESTNET` / `ACTA_ADMIN_KEY_MAINNET` habilitan lo que la key
estándar no puede:

- emitir en vaults que no son de nuestra wallet,
- `POST /contracts/sponsored-vault/create`, o sea darle a cada corredor su
  propio vault pagado por la organización,
- leer `get-vc` / `list-vc-ids` de cualquier owner.

Solo hace falta si vas a `ACTA_VAULT_MODE=sponsored`. En `org` (default) la app
funciona sin ella.

### 4. Clave de cifrado

```bash
openssl rand -hex 32
```

Va en `ACTA_IDENTITY_ENCRYPTION_KEY`. Cifra la llave privada de aserción del
`did:stellar` antes de guardarla en Supabase. **Si la perdés, perdés la
identidad del emisor** y hay que registrar un DID nuevo: las constancias viejas
siguen siendo válidas, pero pasan a resolver a un emisor distinto.

### 5. Migración

```bash
supabase db push
```

Crea `credentials` y `acta_issuer_identities`
([migración](../supabase/migrations/20260721000000_acta_credentials.sql)).

### 6. Primera emisión

No hay comando de bootstrap: la primera aprobación hace todo sola, en orden.

1. `getOrCreateIssuerIdentity` genera el par de claves, registra el
   `did:stellar` on-chain con una firma y lo guarda cifrado.
2. `ensureOrgVault` despliega el vault de la organización. Si ya existía,
   `vault_already_exists` se trata como éxito.
3. `vcIssue` prepara el XDR, se firma local y se envía.

Los pasos 1 y 2 corren una sola vez. Verificá que el DID quedó guardado:

```sql
select did, network from acta_issuer_identities;
```

## Modos de vault

`ACTA_VAULT_MODE=org` (default)
: Un solo vault de la organización guarda todas las constancias. El corredor
  aparece como `credentialSubject.id`. No necesita wallet ni admin key.

`ACTA_VAULT_MODE=sponsored`
: Cada corredor tiene su vault, pagado por la organización. Exige admin key y
  que el corredor tenga dirección Stellar. Más caro y más trabajo, pero el
  corredor es dueño real de sus credenciales.

## Identidad del corredor

`credentialSubject.id` usa **did:web**, no did:stellar: los corredores no tienen
wallet y registrarles un DID on-chain costaría una transacción por persona.

El identificador es `did:web:{host}:corredor:{userId}` y se resuelve de verdad
en `/corredor/{userId}/did.json` — no es un identificador colgante. La ruta solo
responde para corredores con al menos una constancia emitida, así no sirve para
enumerar usuarios.

El emisor sí usa `did:stellar`, que ACTA valida on-chain: exige que el
controller del DID sea la wallet que firma.

## Privacidad

`vcData` viaja cifrado (AES-256-GCM) antes de anclarse, pero **ACTA lo ve en
claro al emitir**. Por eso los claims son mínimos: nombre, dorsal, distancia,
categoría y tiempo. Cédula, fecha de nacimiento, teléfono y correo están en
`profiles` y **no entran** a la credencial. Límite de la API: 10.000 caracteres.

Si alguna vez hace falta meter algo más sensible, hay que cifrarlo del lado
nuestro antes de mandarlo; ACTA lo trata como opaco.

## Costos y doble emisión

`vc_id` es determinista (`infrun-{edición}-{distancia}-d{dorsal}-{tipo}`) y tiene
índice único en la base. Un doble click del admin, o un reintento tras timeout,
choca contra el mismo id y no cobra una segunda tarifa.

Para probar el flujo completo sin gastar nada, poné `ACTA_ISSUANCE_ENABLED=false`:
se registra todo con estado `simulated` y no se toca la cadena.

## Qué NO hace

La copia vieja de la constancia mencionaba una "medalla NFT soulbound acuñada".
ACTA emite Verifiable Credentials, no NFTs, así que esa línea se reemplazó por
la prueba real: el `vc_id`, la transacción y el enlace de verificación. Si se
quiere una medalla NFT es otro contrato y otro trabajo.
