"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { FLOW } from "@/lib/diagnostico/fluxo";
import { LOGO_PATHS } from "./logo-paths";

export function Logo() {
  return (
    <svg className="logo" viewBox="18 45 374 62" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AUVP">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

export function TemaBotao() {
  const [escuro, setEscuro] = useState<boolean | null>(null);
  useEffect(() => {
    const forcado = document.documentElement.dataset.tema;
    setEscuro(forcado ? forcado === "escuro" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  function alterna() {
    const novo = !escuro;
    setEscuro(novo);
    const t = novo ? "escuro" : "claro";
    document.documentElement.dataset.tema = t;
    try {
      localStorage.setItem("auvp-diag-tema", t);
    } catch {}
  }
  return (
    <button type="button" className="btn-tema" onClick={alterna} aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}>
      {escuro ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </button>
  );
}

export function Topo({ contador, idx, calculando, nome }: { contador: string; idx: number; calculando?: boolean; nome: string }) {
  const total = FLOW.length - 1;
  const [a, b] = contador.split(" / ");
  return (
    <header className="topo">
      <div className="topo-in">
        <div className="marca-topo">
          <Logo />
          <span className="nome-ferramenta">{nome}</span>
        </div>
        <div className="topo-dir">
          {contador && (
            <span className="contador" aria-label={`Etapa ${Number(a)} de ${Number(b)}`}>
              <b>{a}</b> / {b}
            </span>
          )}
          <TemaBotao />
        </div>
      </div>
      {FLOW[idx] !== "result" && (
        <div className={"trilho" + (calculando ? " cheio" : "")} aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <i key={i} className={i < idx ? "feito" : i === idx ? "atual" : ""} />
          ))}
        </div>
      )}
    </header>
  );
}
