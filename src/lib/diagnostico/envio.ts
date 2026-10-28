import { UTM_KEYS, VERSAO } from "./config";
import type { Resultado } from "./calculo";
import { isPatrimonial } from "./fluxo";
import { telefoneE164 } from "./telefone";
import type { Respostas, Variante } from "./tipos";

/** Mesmo payload da v6, com um campo a mais: variante_design (a/b) para o teste. */
export function montaPayload(r: Respostas, res: Resultado, utms: Record<string, string>, variante: Variante) {
  return {
    lead_source: "funil_diagnostico",
    versao: VERSAO,
    variante_design: variante,
    created_at: new Date().toISOString(),
    nome: r.nome.trim(),
    whatsapp: telefoneE164(r.whats, r.pais),
    email: r.email.trim(),
    idade: res.idade,
    aporte_mensal: r.aporte,
    patrimonio_investido: r.patrimonio,
    imoveis: r.imoveis,
    patrimonio_global: res.global,
    objetivo: r.objetivo,
    preocupacoes: r.concerns,
    momento: r.momento,
    conhecimento: r.conhecimento,
    perfil_patrimonial: isPatrimonial(r),
    perfil_label: res.perfilNome,
    patrimonio_projetado: Math.round(res.projetado),
    renda_projetada_mensal: Math.round(res.rendaFinal),
    score: res.score,
    prioridade: res.tier.label,
    tags: res.tags,
    utms,
  };
}

export function lerUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const o: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = p.get(k);
    if (v) o[k] = v;
  });
  return o;
}

/** Vai para /api/lead, que só repassa ao n8n quando LEAD_WEBHOOK_ENABLED=true. */
export function enviarLead(payload: ReturnType<typeof montaPayload>) {
  try {
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {}
}

/* ---- eventos de funil: window.dataLayer (GA4/GTM) e, se configurado, um webhook ---- */

const SID = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const ANALYTICS_WEBHOOK = process.env.NEXT_PUBLIC_ANALYTICS_WEBHOOK || "";
let varianteAtual: Variante = "a";
export const definirVariante = (v: Variante) => (varianteAtual = v);

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(ev: string, extra?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const e = { event: "funil_" + ev, sid: SID, ts: new Date().toISOString(), versao: VERSAO, variante_design: varianteAtual, ...extra };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(e);
  } catch {}
  if (ANALYTICS_WEBHOOK) {
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon(ANALYTICS_WEBHOOK, JSON.stringify(e)))) {
        fetch(ANALYTICS_WEBHOOK, { method: "POST", body: JSON.stringify(e), keepalive: true });
      }
    } catch {}
  }
}
