import { NextResponse } from "next/server";
import { holderDidDocument } from "@/lib/acta/did";
import { createServiceClient } from "@/lib/acta/supabase";

/**
 * Documento DID del corredor (did:web).
 *
 * `credentialSubject.id` de cada constancia apunta acá. Si esta ruta no
 * resolviera, el holder sería un identificador colgante y la credencial no
 * sería verificable de punta a punta.
 *
 * Solo responde para corredores que tienen al menos una constancia emitida:
 * así el endpoint no se puede usar para enumerar usuarios de la base.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!/^[0-9a-fA-F-]{36}$/.test(userId)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let hasCredential = false;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("credentials")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "issued")
      .limit(1)
      .maybeSingle();
    hasCredential = Boolean(data);
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  if (!hasCredential) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(holderDidDocument(userId), {
    headers: {
      "Content-Type": "application/did+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
