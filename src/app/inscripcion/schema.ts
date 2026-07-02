import { z } from "zod";

export const GENDERS = ["Femenino", "Masculino"] as const;
export const HANDS = ["diestro", "zurdo"] as const;
export const DISTANCES = ["5K", "10K"] as const;
export const CATEGORIES = ["Mayor", "Veterano", "Máster"] as const;
export const SHIRTS = ["S", "M", "L", "XL"] as const;

const oneOf = <T extends readonly string[]>(opts: T, msg: string) =>
  z.string().refine((v): v is T[number] => (opts as readonly string[]).includes(v), msg);

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const inscripcionSchema = z.object({
  first_name: z.string().trim().min(1, "Ingresá tu nombre"),
  last_name: z.string().trim().min(1, "Ingresá tus apellidos"),
  email: z.string().trim().refine((v) => emailRe.test(v), "Correo inválido"),
  phone: z.string().refine((v) => v.replace(/\D/g, "").length === 8, "El teléfono debe tener 8 dígitos"),
  cedula: z.string().refine((v) => v.replace(/\D/g, "").length === 7, "La cédula debe tener 7 dígitos"),
  birthdate: z.string().min(1, "Ingresá tu fecha de nacimiento"),
  gender: oneOf(GENDERS, "Elegí tu género"),
  dominant_hand: oneOf(HANDS, "Indicá si sos zurdo o diestro"),
  beneficiario_nombre: z.string().trim().min(1, "Ingresá el nombre del beneficiario"),
  beneficiario_parentesco: z.string().trim().min(1, "Ingresá el parentesco del beneficiario"),
  distance: oneOf(DISTANCES, "Elegí una distancia"),
  category: oneOf(CATEGORIES, "Elegí una categoría"),
  shirt_size: oneOf(SHIRTS, "Elegí una talla"),
});

export type InscripcionInput = z.input<typeof inscripcionSchema>;
export type InscripcionData = z.output<typeof inscripcionSchema>;
