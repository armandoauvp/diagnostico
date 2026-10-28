"use client";

import {
  Bank,
  Buildings,
  CalendarBlank,
  ChartLineUp,
  Coins,
  GraduationCap,
  Heartbeat,
  LockSimple,
  Target,
  Vault,
  type Icon,
} from "@phosphor-icons/react";
import { useId } from "react";
import type { Conteudo } from "@/conteudo/tipos";
import { serieParcial } from "@/lib/diagnostico/calculo";
import type { EtapaId, Respostas } from "@/lib/diagnostico/tipos";
import { fmtCurto } from "@/lib/diagnostico/valores";
import { useTween } from "./base";

/** Teto "redondo" (1, 2, 5 × 10^k): a curva sobe dentro da faixa e só reescala de vez em quando. */
function teto(v: number) {
  if (v <= 0) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 5, 10]) if (v <= m * e) return m * e;
  return 10 * e;
}

export function MiniCurva({ r, w = 300, h = 120, className = "curva" }: { r: Respostas; w?: number; h?: number; className?: string }) {
  const s = serieParcial(r);
  // sem nenhum valor ainda, desenha uma curva de exemplo bem baixinha
  const vazio = s.plano[s.plano.length - 1] <= 0;
  const base = vazio ? s.plano.map((_, t) => Math.pow(t / s.anos, 2.2) * 0.12) : s.plano;
  const max = vazio ? 1 : teto(base[base.length - 1] * 1.08);
  const plano = useTween(base.map((v) => v / max));
  const guard = useTween((vazio ? base.map(() => 0) : s.guardado).map((v) => v / max));
  const id = useId().replace(/:/g, "");
  const pad = 8;
  const X = (i: number, n: number) => pad + ((w - pad * 2) * i) / (n - 1);
  const Y = (v: number) => h - pad - (h - pad * 2) * Math.min(1, Math.max(0, v));
  const linha = (a: number[]) => a.map((v, i) => (i ? "L" : "M") + X(i, a.length).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  const area = linha(plano) + ` L${X(plano.length - 1, plano.length)} ${h - pad} L${pad} ${h - pad} Z`;
  const ult = plano[plano.length - 1] ?? 0;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold)" stopOpacity={vazio ? 0.12 : 0.35} />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${id})`} />
      {!vazio && <path d={linha(guard)} fill="none" stroke="var(--guardado)" strokeWidth="1.6" strokeDasharray="4 4" />}
      <path d={linha(plano)} fill="none" stroke="var(--gold)" strokeWidth={vazio ? 1.5 : 2.6} strokeLinecap="round" opacity={vazio ? 0.5 : 1} />
      {!vazio && <circle cx={X(plano.length - 1, plano.length)} cy={Y(ult)} r="4" fill="var(--gold)" />}
    </svg>
  );
}

type Linha = { k: keyof Conteudo["painel"]["linhas"]; icon: Icon; etapa: EtapaId };
const LINHAS: Linha[] = [
  { k: "objetivo", icon: Target, etapa: "objetivo" },
  { k: "idade", icon: CalendarBlank, etapa: "idade" },
  { k: "aporte", icon: Coins, etapa: "aporte" },
  { k: "patrimonio", icon: Vault, etapa: "patrimonio" },
  { k: "imoveis", icon: Buildings, etapa: "imoveis" },
  { k: "concerns", icon: Heartbeat, etapa: "concerns" },
  { k: "momento", icon: Bank, etapa: "momento" },
  { k: "conhecimento", icon: GraduationCap, etapa: "conhecimento" },
];

/** Painel lateral "Seu plano": ecoa as respostas e mostra a curva reagindo. O número fica trancado até o fim. */
export function Painel({ c, r, respondidas }: { c: Conteudo; r: Respostas; respondidas: Set<EtapaId> }) {
  const p = c.painel;
  const ops = c.opcoes;
  const valor = (k: Linha["k"]): string | null => {
    switch (k) {
      case "objetivo":
        return r.objetivo ? ops.objetivo.find((o) => o.val === r.objetivo)?.titulo ?? null : null;
      case "idade":
        return `${r.idade} ${p.anos}`;
      case "aporte":
        return fmtCurto(r.aporte) + p.porMes;
      case "patrimonio":
        return fmtCurto(r.patrimonio);
      case "imoveis":
        return r.imoveis > 0 ? fmtCurto(r.imoveis) : c.valores.pontas.imoveis[0];
      case "concerns": {
        if (!r.concerns.length) return null;
        if (r.concerns.includes("nenhum")) return ops.concerns_padrao.find((o) => o.val === "nenhum")!.titulo;
        return p.marcadas(r.concerns.length);
      }
      case "momento":
        return r.momento ? ops.momento.find((o) => o.val === r.momento)?.titulo ?? null : null;
      case "conhecimento":
        return r.conhecimento ? ops.conhecimento.find((o) => o.val === r.conhecimento)?.titulo ?? null : null;
    }
    return null;
  };
  return (
    <aside className="painel" aria-label={p.titulo}>
      <div className="painel-card">
        <div className="painel-h">
          <span className="t">{p.titulo}</span>
          <span className="chip">
            <span className="pulso" />
            {p.status}
          </span>
        </div>
        <MiniCurva r={r} />
        <ul className="respostas">
          {LINHAS.map((l) => {
            const ok = respondidas.has(l.etapa);
            const v = ok ? valor(l.k) : null;
            const I = l.icon;
            return (
              <li key={l.k} className={v ? "ok" : ""}>
                <span className="ri">
                  <I size={15} weight="duotone" />
                </span>
                <span className="rk">{p.linhas[l.k]}</span>
                {v ? (
                  <span className="rv" title={v}>
                    {v}
                  </span>
                ) : (
                  <span className="vazio" />
                )}
              </li>
            );
          })}
          <li>
            <span className="ri">
              <ChartLineUp size={15} weight="duotone" />
            </span>
            <span className="rk">{p.linhas.numero}</span>
            <span className="trancado">
              <span className="borrado" aria-hidden>
                R$ 0.000.000
              </span>
              <LockSimple size={14} /> {p.aoFinal}
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export function FaixaMovel({ c, r }: { c: Conteudo; r: Respostas }) {
  return (
    <div className="faixa-movel" aria-hidden>
      <MiniCurva r={r} w={120} h={40} />
      <div>
        <div className="t">{c.painel.movelTitulo}</div>
        <div className="s">{c.painel.movelSub}</div>
      </div>
    </div>
  );
}
