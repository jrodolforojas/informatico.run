import { C } from "@/lib/tokens";

type Email = { subject: string; html: string };

const DISPLAY = "'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

const markSvg = `<svg width="30" height="30" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <rect x="3" y="3" width="66" height="66" rx="18" fill="${C.tealBright}" />
  <path d="M22 26 L31 36 L22 46" fill="none" stroke="${C.navy}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M38 28 L51 36 L38 44 Z" fill="${C.navy}" stroke="${C.navy}" stroke-width="2.5" stroke-linejoin="round" />
</svg>`;

function shell(opts: { eyebrow: string; title: string; body: string }): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:24px;background:${C.paper};font-family:${DISPLAY};color:${C.ink};">
  <div style="max-width:520px;margin:0 auto;">
    <div style="background:${C.ink};border-radius:18px 18px 0 0;padding:16px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:10px;vertical-align:middle;">${markSvg}</td>
        <td style="vertical-align:middle;color:${C.white};font-family:${DISPLAY};font-weight:700;font-size:17px;letter-spacing:-0.035em;">informático<span style="color:${C.tealBright};">.run()</span></td>
      </tr></table>
    </div>
    <div style="background:${C.white};border:1px solid ${C.line};border-top:none;border-radius:0 0 18px 18px;padding:28px 24px;">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:0.16em;color:${C.tealDeep};text-transform:uppercase;">/// ${opts.eyebrow}</div>
      <h1 style="margin:10px 0 14px;font-family:${DISPLAY};font-size:24px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};">${opts.title}</h1>
      ${opts.body}
    </div>
    <p style="text-align:center;color:${C.mut};font-size:12px;margin:18px 0 0;font-family:${MONO};letter-spacing:0.04em;">Carrera del Informático · informático.run()</p>
  </div>
</body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-family:${MONO};font-size:11px;letter-spacing:0.1em;color:${C.mut};text-transform:uppercase;">${label}</td>
    <td style="padding:8px 0;text-align:right;font-family:${DISPLAY};font-weight:600;font-size:15px;color:${C.ink};">${value}</td>
  </tr>`;
}

function detailsTable(rows: [string, string][]): string {
  return `<table style="width:100%;border-collapse:collapse;border-top:1px solid ${C.line};margin-top:18px;">
    ${rows.map(([l, v]) => detailRow(l, v)).join("")}
  </table>`;
}

const colones = (n: number) => `₡${n.toLocaleString("es-CR")}`;

export type RecibidaData = {
  firstName: string;
  distance: string;
  shirtSize: string;
  category: string;
  amount: number;
  sinpePhone: string;
  sinpeName: string;
};

export function inscripcionRecibida(d: RecibidaData): Email {
  const body = `
    <p style="font-size:15px;line-height:1.6;color:${C.ink80};margin:0;">
      Recibimos tu inscripción, ${d.firstName}. Estamos verificando tu pago por SINPE; en cuanto lo confirmemos te asignamos el dorsal y te llega el comprobante.
    </p>
    ${detailsTable([
      ["Distancia", d.distance],
      ["Talla", d.shirtSize],
      ["Categoría", d.category],
      ["Monto", colones(d.amount)],
    ])}
    <div style="margin-top:18px;padding:14px;border:1px solid ${C.line};border-radius:12px;background:${C.mint2};">
      <p style="margin:0;font-size:13px;color:${C.ink80};">¿No transferiste aún? SINPE móvil ${colones(d.amount)} al <b>${d.sinpePhone}</b>${d.sinpeName ? ` · ${d.sinpeName}` : ""}.</p>
    </div>`;
  return { subject: "Recibimos tu inscripción — verificando tu pago", html: shell({ eyebrow: "Inscripción recibida", title: "Estamos verificando tu pago.", body }) };
}

export type AprobadaData = {
  firstName: string;
  dorsal: number;
  distance: string;
  shirtSize: string;
  category: string;
  eventDate: string | null;
};

export function inscripcionAprobada(d: AprobadaData): Email {
  const body = `
    <p style="font-size:15px;line-height:1.6;color:${C.ink80};margin:0;">
      ¡Confirmamos tu pago, ${d.firstName}! Ya estás dentro${d.eventDate ? ` para el ${d.eventDate}` : ""}. Este es tu dorsal:
    </p>
    <div style="margin:20px 0;text-align:center;padding:24px;border:1px solid ${C.line};border-radius:16px;background:${C.white};">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:0.16em;color:${C.mut};text-transform:uppercase;">Tu dorsal</div>
      <div style="font-family:${MONO};font-size:56px;font-weight:700;line-height:1;color:${C.ink};letter-spacing:-0.04em;margin-top:6px;">#${d.dorsal}</div>
    </div>
    ${detailsTable([
      ["Distancia", d.distance],
      ["Talla", d.shirtSize],
      ["Categoría", d.category],
    ])}`;
  return { subject: `¡Estás dentro! Tu dorsal es #${d.dorsal}`, html: shell({ eyebrow: "Inscripción confirmada", title: "Le diste a Run.", body }) };
}

export type RechazadaData = {
  firstName: string;
  motivo: string | null;
  amount: number;
  sinpePhone: string;
  sinpeName: string;
};

export function inscripcionRechazada(d: RechazadaData): Email {
  const body = `
    <p style="font-size:15px;line-height:1.6;color:${C.ink80};margin:0;">
      Hola ${d.firstName}, no pudimos verificar tu pago para la inscripción.${d.motivo ? "" : " Revisá que el SINPE se haya completado correctamente."}
    </p>
    ${d.motivo ? `<div style="margin-top:16px;padding:14px;border:1px solid ${C.line};border-radius:12px;background:${C.paper};">
      <div style="font-family:${MONO};font-size:10px;letter-spacing:0.14em;color:${C.mut};text-transform:uppercase;">Motivo</div>
      <p style="margin:6px 0 0;font-size:14px;color:${C.ink};">${d.motivo}</p>
    </div>` : ""}
    <div style="margin-top:18px;padding:14px;border:1px solid ${C.line};border-radius:12px;background:${C.mint2};">
      <p style="margin:0;font-size:13px;color:${C.ink80};">Para reintentar: SINPE móvil ${colones(d.amount)} al <b>${d.sinpePhone}</b>${d.sinpeName ? ` · ${d.sinpeName}` : ""} y volvé a inscribirte con el comprobante.</p>
    </div>`;
  return { subject: "No pudimos verificar tu pago", html: shell({ eyebrow: "Pago no verificado", title: "Necesitamos revisar tu pago.", body }) };
}
