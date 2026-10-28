import { NextResponse } from "next/server";

/* Repassa o lead ao n8n (Salesforce). Desligado até LEAD_WEBHOOK_ENABLED=true. */
export async function POST(req: Request) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (process.env.LEAD_WEBHOOK_ENABLED !== "true" || !url) {
    return NextResponse.json({ enviado: false, motivo: "webhook desligado" });
  }
  const body = await req.text();
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    return NextResponse.json({ enviado: r.ok }, { status: r.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ enviado: false }, { status: 502 });
  }
}
