import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo, TemaBotao } from "@/components/Topo";
import { calcular } from "@/lib/diagnostico/calculo";
import { MODO_REVISAO } from "@/lib/diagnostico/config";
import { FLOW, telaReal } from "@/lib/diagnostico/fluxo";
import { PRESETS } from "@/lib/diagnostico/presets";
import "./variacoes.css";

export const metadata: Metadata = { title: "Variações · Diagnóstico AUVP", robots: { index: false } };

const NOMES_TELA: Record<string, string> = {
  objetivo: "01 · Objetivo",
  idade: "02 · Idade",
  aporte: "03 · Aporte",
  patrimonio: "04 · Patrimônio",
  imoveis: "05 · Imóveis",
  concerns: "06 · Dores",
  momento: "07 · Quem cuida",
  conhecimento: "08 · Nível",
  contato: "09 · Contato",
};

export default function Variacoes() {
  if (!MODO_REVISAO) notFound();
  const padrao = PRESETS[0];
  const pat = PRESETS.find((p) => p.id === "patrimonial")!;
  return (
    <div className="vr">
      <header className="vr-topo">
        <Logo />
        <span>Revisão de variações</span>
        <TemaBotao />
      </header>
      <p className="vr-intro">
        Atalhos para abrir qualquer tela ou resultado sem preencher o fluxo. Só funciona com <code>NEXT_PUBLIC_MODO_REVISAO=true</code>, e
        nada aqui envia lead.
      </p>

      <h2>Telas do fluxo</h2>
      <div className="vr-grade">
        {FLOW.filter((e) => e !== "result").flatMap((e) => {
          const casos = e === "concerns" ? [padrao, pat] : [padrao];
          return casos.map((p) => (
            <div className="vr-card" key={e + p.id}>
              <b>{NOMES_TELA[e]}</b>
              {e === "concerns" && <small>{telaReal(e, p.r) === "concerns_pat" ? "versão patrimonial" : "versão padrão"}</small>}
              <span>
                <a href={`/?etapa=${e}&perfil=${p.id}`}>A</a>
                <a href={`/b?etapa=${e}&perfil=${p.id}`}>B</a>
              </span>
            </div>
          ));
        })}
      </div>

      <h2>Resultados</h2>
      <div className="vr-lista">
        {PRESETS.map((p) => {
          const res = calcular(p.r);
          return (
            <div className="vr-res" key={p.id}>
              <div>
                <b>{p.nome}</b>
                <p>{p.descricao}</p>
                <small>
                  {res.perfilNome} · {res.plano.passos.length} passo(s): {res.plano.passos.map((x) => x.id).join(", ")} · score {res.score} ({res.tier.label})
                </small>
              </div>
              <span>
                <a href={`/?etapa=result&perfil=${p.id}`}>Ver A</a>
                <a href={`/b?etapa=result&perfil=${p.id}`}>Ver B</a>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
