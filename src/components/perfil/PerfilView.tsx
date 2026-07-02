import Image from "next/image";
import { Container } from "@/components/landing/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Check";
import { StravaMark } from "@/components/ui/BrandMarks";
import { connectStravaUrl } from "@/lib/supabase/auth-actions";
import { C } from "@/lib/tokens";

export type PerfilData = {
  fullName: string;
  email: string;
  cedula: string;
  phone: string;
  gender: string;
  birthdate: string;
  dominantHand: string;
};

export type PerfilInscripcion = {
  status: string;
  dorsal: number | null;
  distance: string;
  shirtSize: string;
  category: string;
  amount: number | null;
  beneficiarioNombre: string;
  beneficiarioParentesco: string;
};

type Props = {
  profile: PerfilData;
  inscripcion: PerfilInscripcion | null;
  avatarUrl: string | null;
  strava: { name: string } | null;
};

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]).join("").toUpperCase() || "?";
}

function Avatar({ url, name }: { url: string | null; name: string }) {
  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={64}
        height={64}
        className="h-16 w-16 rounded-full border border-line object-cover"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-[20px] font-bold text-white">
      {initials(name)}
    </div>
  );
}

function StravaBlock({ strava }: { strava: { name: string } | null }) {
  if (strava) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
        <StravaMark size={22} color="#FC4C02" />
        <div>
          <div className="font-display text-[14px] font-semibold text-ink">Conectado con Strava</div>
          {strava.name && <div className="font-mono text-[11px] text-mut">{strava.name}</div>}
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-verified">
          <Check size={12} bg={C.verified} color="#ffffff" />
          CONECTADO
        </span>
      </div>
    );
  }
  return (
    <a
      href={connectStravaUrl("/perfil")}
      className="flex items-center justify-center gap-2.5 rounded-2xl px-5 py-4 font-display text-[14px] font-semibold text-white transition hover:opacity-90"
      style={{ background: "#FC4C02" }}
    >
      <StravaMark size={20} />
      Conectar con Strava
    </a>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "PENDIENTE", cls: "border-amber-300 bg-amber-50 text-amber-700" },
  paid: { label: "PAGADO", cls: "border-teal bg-mint-2 text-verified" },
  cancelled: { label: "CANCELADO", cls: "border-line bg-white text-mut" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-mut">{label}</span>
      <span className="text-right font-display text-[14px] font-medium text-ink">{value || "—"}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)] lg:p-7">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-teal-deep">{title}</div>
      {children}
    </div>
  );
}

export function PerfilView({ profile, inscripcion, avatarUrl, strava }: Props) {
  const st = inscripcion ? STATUS[inscripcion.status] ?? STATUS.pending : null;
  const colones = (n: number | null) => (n == null ? "—" : `₡${n.toLocaleString("es-CR")}`);

  return (
    <Container className="py-10 lg:py-12">
      <div className="flex items-center gap-4">
        <Avatar url={avatarUrl} name={profile.fullName} />
        <div>
          <Eyebrow>Mi perfil</Eyebrow>
          <h1 className="mt-2 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[34px]">
            {profile.fullName || "Tu perfil"}
          </h1>
        </div>
      </div>

      <div className="mt-6 sm:max-w-[420px]">
        <StravaBlock strava={strava} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Datos personales">
          <Row label="Nombre" value={profile.fullName} />
          <Row label="Cédula" value={profile.cedula} />
          <Row label="Correo" value={profile.email} />
          <Row label="Teléfono" value={profile.phone} />
          <Row label="Género" value={profile.gender} />
          <Row label="Nacimiento" value={profile.birthdate} />
          <Row label="Mano dominante" value={profile.dominantHand} />
        </Card>

        <Card title="Mi inscripción">
          {inscripcion ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[40px] font-bold leading-none tracking-[-0.04em] text-ink">
                  {inscripcion.dorsal != null ? `#${inscripcion.dorsal}` : <span className="text-mut">#--</span>}
                </span>
                {st && (
                  <span className={`inline-flex rounded-full border px-[9px] py-0.5 font-mono text-[10px] tracking-[0.1em] ${st.cls}`}>
                    {st.label}
                  </span>
                )}
              </div>
              <Row label="Distancia" value={inscripcion.distance} />
              <Row label="Talla" value={inscripcion.shirtSize} />
              <Row label="Categoría" value={inscripcion.category} />
              <Row label="Monto" value={colones(inscripcion.amount)} />
              <Row label="Beneficiario" value={inscripcion.beneficiarioNombre} />
              <Row label="Parentesco" value={inscripcion.beneficiarioParentesco} />
              <div className="mt-4">
                <Button href="/mi-constancia" variant="ghost" size="sm">
                  Ver mi constancia
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3 py-2">
              <p className="font-display text-[14.5px] text-ink-80">Todavía no estás inscrito en la carrera.</p>
              <Button href="/inscripcion" size="sm">
                Inscribite
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}
