"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Label } from "@/components/ui/Label";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GoogleG } from "@/components/ui/BrandMarks";
import { signInWithGoogle, signInWithEmail } from "@/lib/supabase/auth-actions";
import { crearInscripcion } from "@/app/inscripcion/actions";
import { INSCRIPCION_DEFAULTS } from "@/lib/inscripcion-defaults";
import {
  inscripcionSchema,
  type InscripcionInput,
  type InscripcionData,
  GENDERS,
  HANDS,
  DISTANCES,
  CATEGORIES,
  SHIRTS,
} from "@/app/inscripcion/schema";

const NEXT = "/inscripcion";
const HAND_LABELS: Record<string, string> = { diestro: "Diestro(a)", zurdo: "Zurdo(a)" };
const DISTANCE_LABELS: Record<string, string> = { "5K": "5km (recreativo)", "10K": "10km (competitivo)" };
const CATEGORY_LABELS: Record<string, string> = {
  Mayor: "Mayor (hasta 34)",
  Veterano: "Veterano (35–50)",
  Máster: "Máster (51+)",
};

const fieldClass =
  "mt-2 block w-full rounded-xl border border-line bg-white px-[14px] py-3 font-display text-[15px] text-ink outline-none focus:border-teal";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.14em] text-mut";

function formatColones(n: number) {
  return `₡${n.toLocaleString("es-CR")}`;
}

function formatCedula(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  return [digits.slice(0, 1), digits.slice(1, 4), digits.slice(4, 7)]
    .filter(Boolean)
    .join(" ");
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 8)].filter(Boolean).join(" ");
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 font-display text-[12px] text-danger">{msg}</p>;
}

type InscripcionInitial =
  | { loggedIn: false }
  | {
      loggedIn: true;
      values: InscripcionInput;
      price: number;
      sinpe: { phone: string; name: string };
    };

export function InscripcionForm({ initial }: { initial: InscripcionInitial }) {
  const price = initial.loggedIn ? initial.price : 12000;
  const sinpe = initial.loggedIn ? initial.sinpe : { phone: "8671 7767", name: "" };

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  const [serverState, formAction, pending] = useActionState(crearInscripcion, {});
  const router = useRouter();

  useEffect(() => {
    if (serverState.ok) router.push("/inscripcion/listo");
  }, [serverState, router]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InscripcionInput, unknown, InscripcionData>({
    resolver: zodResolver(inscripcionSchema),
    mode: "onTouched",
    defaultValues: initial.loggedIn ? initial.values : INSCRIPCION_DEFAULTS,
  });

  async function onSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail) return;
    setSendingLink(true);
    const { error } = await signInWithEmail(loginEmail, NEXT);
    setSendingLink(false);
    if (!error) setLinkSent(true);
  }

  function onValid(data: InscripcionData) {
    if (!file) {
      setFileError("Adjuntá el comprobante de pago.");
      return;
    }
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    fd.append("comprobante", file);
    startTransition(() => formAction(fd));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFileError(f ? "" : "Adjuntá el comprobante de pago.");
  }

  const genderVal = useWatch({ control, name: "gender" });
  const handVal = useWatch({ control, name: "dominant_hand" });
  const distanceVal = useWatch({ control, name: "distance" });
  const categoryVal = useWatch({ control, name: "category" });
  const shirtVal = useWatch({ control, name: "shirt_size" });

  return (
    <div className="mx-auto max-w-[720px] px-5 py-10 lg:px-10 lg:py-12">
      <Eyebrow>Inscripción · 5ª edición</Eyebrow>
      <h1 className="mt-4 mb-1.5 font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[34px]">
        Asegurá tu dorsal
      </h1>
      <p className="mb-6 font-display text-[15.5px] text-mut">
        Entrá con tu cuenta para asegurar tu dorsal. Te llega el comprobante al correo.
      </p>

      {!initial.loggedIn && (
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)] lg:p-7">
          <p className="font-display text-[15px] text-ink-80">
            Iniciá sesión para asegurar tu dorsal.
          </p>
          <button
            type="button"
            onClick={() => signInWithGoogle(NEXT)}
            className="flex items-center justify-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 font-display text-[14px] font-semibold text-ink transition hover:border-mut"
          >
            <GoogleG size={18} />
            Continuar con Google
          </button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mut">
              o con tu correo
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>
          {linkSent ? (
            <p className="font-display text-[14px] text-teal-deep">
              Te enviamos un enlace a {loginEmail}. Abrilo para entrar.
            </p>
          ) : (
            <form onSubmit={onSendLink} className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-full border border-line bg-white px-5 py-3 font-display text-[14px] text-ink outline-none focus:border-teal"
              />
              <button
                type="submit"
                disabled={sendingLink}
                className="whitespace-nowrap rounded-full bg-ink px-5 py-3 font-display text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {sendingLink ? "Enviando…" : "Enviarme un enlace"}
              </button>
            </form>
          )}
        </div>
      )}

      {initial.loggedIn && (
        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)] lg:p-7"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Nombre</span>
              <input {...register("first_name")} className={fieldClass} />
              <FieldError msg={errors.first_name?.message} />
            </label>
            <label className="block">
              <span className={labelClass}>Apellidos</span>
              <input {...register("last_name")} className={fieldClass} />
              <FieldError msg={errors.last_name?.message} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Correo electrónico</span>
              <input type="email" {...register("email")} className={fieldClass} />
              <FieldError msg={errors.email?.message} />
            </label>
            <label className="block">
              <span className={labelClass}>Teléfono</span>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    value={field.value}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    onBlur={field.onBlur}
                    placeholder="8888 8888"
                    inputMode="numeric"
                    className={fieldClass}
                  />
                )}
              />
              <FieldError msg={errors.phone?.message} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Cédula</span>
              <Controller
                name="cedula"
                control={control}
                render={({ field }) => (
                  <input
                    value={field.value}
                    onChange={(e) => field.onChange(formatCedula(e.target.value))}
                    onBlur={field.onBlur}
                    placeholder="0 000 000"
                    inputMode="numeric"
                    className={fieldClass}
                  />
                )}
              />
              <FieldError msg={errors.cedula?.message} />
            </label>
            <label className="block">
              <span className={labelClass}>Fecha de nacimiento</span>
              <input type="date" {...register("birthdate")} className={fieldClass} />
              <FieldError msg={errors.birthdate?.message} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>Género</Label>
              <div className="mt-2.5 flex gap-2.5">
                {GENDERS.map((g) => (
                  <Chip key={g} active={genderVal === g} onClick={() => setValue("gender", g, { shouldValidate: true })}>
                    {g}
                  </Chip>
                ))}
              </div>
              <FieldError msg={errors.gender?.message} />
            </div>
            <div>
              <Label>¿Zurdo(a) o diestro(a)?</Label>
              <div className="mt-2.5 flex gap-2.5">
                {HANDS.map((h) => (
                  <Chip key={h} active={handVal === h} onClick={() => setValue("dominant_hand", h, { shouldValidate: true })}>
                    {HAND_LABELS[h]}
                  </Chip>
                ))}
              </div>
              <FieldError msg={errors.dominant_hand?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Beneficiario (póliza)</span>
              <input {...register("beneficiario_nombre")} className={fieldClass} />
              <FieldError msg={errors.beneficiario_nombre?.message} />
            </label>
            <label className="block">
              <span className={labelClass}>Parentesco del beneficiario</span>
              <input {...register("beneficiario_parentesco")} className={fieldClass} />
              <FieldError msg={errors.beneficiario_parentesco?.message} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>Distancia</Label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {DISTANCES.map((d) => (
                  <Chip key={d} active={distanceVal === d} onClick={() => setValue("distance", d, { shouldValidate: true })}>
                    {DISTANCE_LABELS[d]}
                  </Chip>
                ))}
              </div>
              <FieldError msg={errors.distance?.message} />
            </div>
            <div>
              <Label>Categoría</Label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip key={c} active={categoryVal === c} onClick={() => setValue("category", c, { shouldValidate: true })}>
                    {CATEGORY_LABELS[c]}
                  </Chip>
                ))}
              </div>
              <FieldError msg={errors.category?.message} />
            </div>
          </div>

          <div>
            <Label>Talla camiseta</Label>
            <div className="mt-2.5 flex gap-2.5">
              {SHIRTS.map((t) => {
                const active = shirtVal === t;
                return (
                  <button type="button" key={t} onClick={() => setValue("shirt_size", t, { shouldValidate: true })}
                    className={`flex-1 rounded-xl border py-3 text-center ${active ? "border-ink bg-ink" : "border-line bg-white"}`}>
                    <div className={`font-display text-[16px] font-bold ${active ? "text-white" : "text-ink"}`}>{t}</div>
                  </button>
                );
              })}
            </div>
            <FieldError msg={errors.shirt_size?.message} />
          </div>

          <div className="rounded-xl border border-line bg-paper/60 p-4">
            <Label>Pago · SINPE móvil</Label>
            <p className="mt-1.5 font-display text-[14px] text-ink-80">
              Transferí <span className="font-semibold text-ink">{formatColones(price)}</span> por SINPE móvil al{" "}
              <span className="font-mono font-semibold text-ink">{sinpe.phone}</span>
              {sinpe.name ? ` · ${sinpe.name}` : ""} y adjuntá el comprobante.
            </p>
            <label className="mt-3 block">
              <span className={labelClass}>Comprobante de pago</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={onFileChange}
                className="mt-2 block w-full font-display text-[13px] text-mut file:mr-3 file:rounded-full file:border file:border-line file:bg-white file:px-4 file:py-2 file:font-display file:text-[13px] file:font-semibold file:text-ink hover:file:border-mut"
              />
            </label>
            {file && <p className="mt-1.5 font-mono text-[11px] text-teal-deep">{file.name}</p>}
            <FieldError msg={fileError} />
          </div>

          {serverState.error && (
            <p className="font-display text-[13.5px] text-danger">{serverState.error}</p>
          )}

          <div className="h-px bg-line" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Label>Total</Label>
              <div className="mt-1 font-mono text-[28px] font-bold text-ink">{formatColones(price)}</div>
            </div>
            <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
              <Icon name="bolt" size={18} color="#ffffff" />
              {pending ? "Enviando…" : "Enviar inscripción"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
