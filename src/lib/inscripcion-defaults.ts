import type { InscripcionInput } from "@/app/inscripcion/schema";

export const INSCRIPCION_DEFAULTS: InscripcionInput = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  cedula: "",
  birthdate: "",
  gender: "",
  dominant_hand: "",
  beneficiario_nombre: "",
  beneficiario_parentesco: "",
  distance: "5K",
  category: "Mayor",
  shirt_size: "M",
};

function splitName(full: string): [string, string] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["", ""];
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

type UserMeta = {
  given_name?: string;
  family_name?: string;
  full_name?: string;
  name?: string;
};

export type InscripcionProfile = {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  cedula: string | null;
  gender: string | null;
  birthdate: string | null;
  dominant_hand: string | null;
} | null;

export function buildInscripcionValues(
  email: string | null | undefined,
  meta: UserMeta,
  profile: InscripcionProfile,
): InscripcionInput {
  const [metaFirst, metaLast] = splitName(meta.full_name || meta.name || "");
  const [fullFirst, fullLast] = splitName(profile?.full_name ?? "");
  return {
    ...INSCRIPCION_DEFAULTS,
    first_name: profile?.first_name || meta.given_name || fullFirst || metaFirst,
    last_name: profile?.last_name || meta.family_name || fullLast || metaLast,
    email: profile?.email || email || "",
    phone: profile?.phone ?? "",
    cedula: profile?.cedula ?? "",
    birthdate: profile?.birthdate ?? "",
    gender: profile?.gender ?? "",
    dominant_hand: profile?.dominant_hand ?? "",
  };
}
