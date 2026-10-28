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
import type { Conteudo } from "@/conteudo/tipos";
import type { EtapaId, Respostas } from "@/lib/diagnostico/tipos";
import { fmtCurto } from "@/lib/diagnostico/valores";

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

/** Painel lateral "Seu plano": ecoa as respostas. O número e a curva só aparecem no resultado. */
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
