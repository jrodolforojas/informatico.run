import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check } from "@/components/ui/Check";
import { C } from "@/lib/tokens";
import { verifyCredential, type Verification } from "@/lib/acta/verify";
import { explorerUrl, shortTx } from "@/lib/acta/read";

// El estado se lee de la cadena en cada visita: una constancia revocada tiene
// que dejar de dar "válida" de inmediato, así que nada de cachear la página.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificar constancia — informático.run()",
  robots: { index: false },
};

const KIND_LABEL: Record<string, string> = {
  inscripcion: "Constancia de inscripción",
  finisher: "Constancia de finisher",
};

const CLAIM_LABEL: Record<string, string> = {
  nombre: "Nombre",
  dorsal: "Dorsal",
  distancia: "Distancia",
  categoria: "Categoría",
  tiempoOficial: "Tiempo oficial",
  ritmo: "Ritmo",
  posicionGeneral: "Posición general",
  posicionCategoria: "Posición de categoría",
};

export default async function Page({ params }: { params: Promise<{ vcId: string }> }) {
  const { vcId } = await params;
  const result = await verifyCredential(decodeURIComponent(vcId));

  if (!result) notFound();

  return (
    <Container className="py-10 lg:py-14">
      <Eyebrow>Verificación on-chain</Eyebrow>
      <h1 className="mt-3.5 mb-1 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[32px]">
        {KIND_LABEL[result.kind ?? ""] ?? "Constancia"}
      </h1>
      <p className="mb-7 max-w-[560px] font-display text-[15.5px] text-mut">
        El estado se consulta directamente en Stellar cada vez que se abre esta
        página. No depende de que informatico.run diga que es válida.
      </p>

      <div className="max-w-[620px] overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
        <StatusHeader result={result} />

        <dl className="divide-y divide-line">
          {Object.entries(result.claims ?? {})
            .filter(([key]) => key !== "evento")
            .map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-4 px-5 py-3.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-mut">
                  {CLAIM_LABEL[key] ?? key}
                </dt>
                <dd className="text-right font-display text-[14.5px] font-semibold">
                  {String(value)}
                </dd>
              </div>
            ))}
        </dl>

        <div className="border-t border-line bg-paper px-5 py-4">
          <div className="font-mono text-[9.5px] leading-[1.9] break-all text-mut">
            <div>
              <span className="text-ink-80">ID</span> {result.vcId}
            </div>
            {result.issuerDid && (
              <div>
                <span className="text-ink-80">EMISOR</span> {result.issuerDid}
              </div>
            )}
            {result.holderDid && (
              <div>
                <span className="text-ink-80">TITULAR</span> {result.holderDid}
              </div>
            )}
            {result.txId && result.network && (
              <div>
                <span className="text-ink-80">TX</span> {shortTx(result.txId)}{" "}
                <a
                  href={explorerUrl(result.txId, result.network)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal underline-offset-2 hover:underline"
                >
                  ver en explorer →
                </a>
              </div>
            )}
            {result.network && result.network !== "mainnet" && (
              <div className="mt-1 text-amber-700">
                Emitida en TESTNET — red de pruebas, sin valor oficial.
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-[560px] font-display text-[13px] leading-[1.6] text-mut">
        Verificar comprueba que esta constancia existe en el vault del emisor y
        cuál es su estado actual. Para confirmar <em>quién</em> la emitió,
        resolvé el DID del emisor en{" "}
        <a
          href="https://did.acta.build"
          target="_blank"
          rel="noreferrer"
          className="text-teal-deep underline-offset-2 hover:underline"
        >
          did.acta.build
        </a>
        .
      </p>
    </Container>
  );
}

function StatusHeader({ result }: { result: Verification }) {
  if (result.status === "valid") {
    return (
      <div className="flex items-center gap-3 border-b border-line bg-mint px-5 py-5">
        <Check size={22} bg={C.verified} color="#ffffff" />
        <div>
          <div className="font-display text-[17px] font-bold text-verified">
            Constancia válida
          </div>
          <div className="font-mono text-[10px] tracking-[0.08em] text-teal-deep">
            {result.issuedAt
              ? `EMITIDA ${new Date(result.issuedAt).toLocaleDateString("es-CR")}`
              : "ANCLADA EN STELLAR"}
          </div>
        </div>
      </div>
    );
  }

  if (result.status === "revoked") {
    return (
      <div className="border-b border-line bg-red-50 px-5 py-5">
        <div className="font-display text-[17px] font-bold text-[#b03a28]">
          Constancia revocada
        </div>
        <div className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-[#b03a28]">
          {result.since
            ? `REVOCADA ${new Date(result.since).toLocaleDateString("es-CR")}`
            : "YA NO ES VÁLIDA"}
        </div>
      </div>
    );
  }

  if (result.status === "unknown") {
    return (
      <div className="border-b border-line bg-amber-50 px-5 py-5">
        <div className="font-display text-[17px] font-bold text-amber-800">
          No pudimos consultar la cadena
        </div>
        <div className="mt-0.5 font-display text-[13px] text-amber-700">
          Volvé a intentar en un momento. No estamos afirmando que sea válida.
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-line bg-paper px-5 py-5">
      <div className="font-display text-[17px] font-bold text-ink">
        Sin anclaje on-chain
      </div>
      <div className="mt-0.5 font-display text-[13px] text-mut">
        Esta constancia existe en nuestros registros pero nunca llegó a Stellar.
      </div>
    </div>
  );
}
