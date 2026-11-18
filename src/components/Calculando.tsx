"use client";

import { Check } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Conteudo } from "@/conteudo/tipos";
import { Rich, useReduzMovimento } from "./base";

/** Transição de 2,6 s entre o contato e o resultado (mesmos tempos da v6). */
export function Calculando({ c, onFim }: { c: Conteudo; onFim: () => void }) {
  const [on, setOn] = useState(0);
  const reduz = useReduzMovimento();
  useEffect(() => {
    if (reduz) {
      setOn(3);
      const t = setTimeout(onFim, 400);
      return () => clearTimeout(t);
    }
    const ts = [setTimeout(() => setOn(1), 250), setTimeout(() => setOn(2), 1050), setTimeout(() => setOn(3), 1850), setTimeout(onFim, 2600)];
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduz]);
  const k = c.calculando;
  return (
    <section className="card escuro calc etapa" aria-live="polite">
      {k.eyebrow && <div className="eyebrow">{k.eyebrow}</div>}
      <h1>{k.titulo}</h1>
      <p className="sub">{k.sub}</p>
      <svg className="calc-graf" viewBox="0 0 560 140" width="100%" aria-hidden>
        <defs>
          <linearGradient id="gcalc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--dark-gold)" stopOpacity=".35" />
            <stop offset="1" stopColor="var(--dark-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 70, 105].map((y) => (
          <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="var(--dark-line)" strokeDasharray="2 6" />
        ))}
        <path className="area" d="M0 132 C 160 128, 300 110, 400 72 S 520 14, 560 8 L560 140 L0 140Z" fill="url(#gcalc)" />
        <path
          className="linha"
          pathLength={1}
          d="M0 132 C 160 128, 300 110, 400 72 S 520 14, 560 8"
          fill="none"
          stroke="var(--dark-gold)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="calc-etapas">
        {k.etapas.map((e, i) => (
          <div key={i} className={"calc-etapa" + (on > i ? " on" : on === i ? " rodando" : "")}>
            <span className="bola">
              <Check size={14} weight="bold" />
            </span>
            <span>{e}</span>
          </div>
        ))}
      </div>
      <Rich as="p" className="confianca" html={k.confianca} />
    </section>
  );
}
