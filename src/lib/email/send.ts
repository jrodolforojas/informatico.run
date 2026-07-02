import { getResend, FROM } from "@/lib/email/resend";
import {
  inscripcionRecibida,
  inscripcionAprobada,
  inscripcionRechazada,
  type RecibidaData,
  type AprobadaData,
  type RechazadaData,
} from "@/lib/email/templates";

async function send(to: string, email: { subject: string; html: string }): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY no configurada; se omite envío.");
    return false;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject: email.subject, html: email.html });
    if (error) {
      console.error("[email] envío falló:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] excepción al enviar:", err);
    return false;
  }
}

export const enviarRecibida = (to: string, d: RecibidaData) => send(to, inscripcionRecibida(d));
export const enviarAprobada = (to: string, d: AprobadaData) => send(to, inscripcionAprobada(d));
export const enviarRechazada = (to: string, d: RechazadaData) => send(to, inscripcionRechazada(d));
