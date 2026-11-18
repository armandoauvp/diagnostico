"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { montarTextos } from "@/conteudo/montar";
import type { Opcao } from "@/conteudo/tipos";
import { VARIANTES } from "@/conteudo/variantes";
import { calcular } from "@/lib/diagnostico/calculo";
import { MODO_REVISAO } from "@/lib/diagnostico/config";
import { definirVariante, enviarLead, lerUtms, montaPayload, track } from "@/lib/diagnostico/envio";
import { alternaPreocupacao, contador, etapaValida, FLOW, mover, RESPOSTAS_INICIAIS, telaReal } from "@/lib/diagnostico/fluxo";
import { PRESETS } from "@/lib/diagnostico/presets";
import type { EtapaId, Preocupacao, Respostas, Variante } from "@/lib/diagnostico/tipos";
import { Calculando } from "./Calculando";
import { Resultado } from "./Resultado";
import { Abaixo, Cabecalho, Destaques, FormContato, Navegacao, Opcoes, SliderDinheiro, SliderIdade } from "./Telas";
import { Topo } from "./Topo";
import { Rich } from "./base";

export function Diagnostico({ variante }: { variante: Variante }) {
  const { conteudo: c, recursos } = VARIANTES[variante];
  const [idx, setIdx] = useState(0);
  const [r, setR] = useState<Respostas>(RESPOSTAS_INICIAIS);
  const [dir, setDir] = useState<1 | -1>(1);
  const [calculando, setCalculando] = useState(false);
  const [revisao, setRevisao] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const etapa = FLOW[idx];
  const tela = telaReal(etapa, r);

  useEffect(() => {
    definirVariante(variante);
  }, [variante]);

  // modo revisão: ?etapa=<id>&perfil=<preset> abre direto numa tela
  useEffect(() => {
    if (!MODO_REVISAO) return;
    const q = new URLSearchParams(window.location.search);
    const e = q.get("etapa") as EtapaId | null;
    const p = PRESETS.find((x) => x.id === q.get("perfil"));
    if (p) atualiza(() => p.r);
    if (e && FLOW.includes(e)) {
      setIdx(FLOW.indexOf(e));
      setRevisao(true);
    }
  }, []);

  // cada tela vista vira evento de funil
  useEffect(() => {
    if (calculando) return;
    track("step_view", { step: etapa });
  }, [etapa, calculando]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx, calculando]);

  const res = useMemo(() => (etapa === "result" ? calcular(r) : null), [etapa, r]);
  const textos = useMemo(() => (res ? montarTextos(res, c, r.nome, r.objetivo) : null), [res, c, r.nome, r.objetivo]);

  const pode = etapaValida(etapa, r);

  // respostas mais recentes, para o avanço automático não ler um estado velho
  const rRef = useRef(r);
  rRef.current = r;
  const atualiza = useCallback((f: (x: Respostas) => Respostas) => {
    rRef.current = f(rRef.current);
    setR(rRef.current);
  }, []);

  const ir = useCallback(
    (d: 1 | -1) => {
      if (autoRef.current) clearTimeout(autoRef.current);
      const atual = rRef.current;
      if (d > 0 && !etapaValida(FLOW[idx], atual)) return;
      if (d > 0) track("step_complete", { step: FLOW[idx] });
      const m = mover(idx, d, atual);
      if (d > 0 && FLOW[idx] === "contato" && FLOW[m.idx] === "result") {
        const resultado = calcular(m.respostas);
        track("result_view", { score: resultado.score, prioridade: resultado.tier.label });
        if (!revisao) enviarLead(montaPayload(m.respostas, resultado, lerUtms(), variante));
        setCalculando(true);
      }
      rRef.current = m.respostas;
      setR(m.respostas);
      setDir(d);
      setIdx(m.idx);
    },
    [idx, revisao, variante],
  );

  // clique na barra de progresso: só volta
  const irPara = useCallback(
    (j: number) => {
      if (autoRef.current) clearTimeout(autoRef.current);
      if (j >= idx) return;
      setDir(-1);
      setIdx(j);
    },
    [idx],
  );
  // quem respondeu "Ninguém ainda" pulou a tela de nível
  const pulado = (i: number) => FLOW[i] === "conhecimento" && r.momento === "comecando";

  // Enter avança (fora do formulário, que trata o próprio Enter)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || calculando || etapa === "result" || etapa === "contato") return;
      const alvo = e.target as HTMLElement;
      if (alvo.tagName === "BUTTON" || alvo.tagName === "A") return;
      ir(1);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [ir, calculando, etapa]);

  function escolheUnica<K extends "objetivo" | "momento" | "conhecimento">(k: K, v: Respostas[K]) {
    atualiza((x) => ({ ...x, [k]: v }));
    if (recursos.autoAvanco) {
      if (autoRef.current) clearTimeout(autoRef.current);
      autoRef.current = setTimeout(() => ir(1), 420);
    }
  }

  function refazer() {
    atualiza(() => RESPOSTAS_INICIAIS);
    setCalculando(false);
    setRevisao(false);
    setDir(-1);
    setIdx(0);
  }

  /* ---------- resultado ---------- */
  if (calculando) {
    return (
      <>
        <Topo nome={c.marca.nome} contador="" idx={idx} calculando />
        <main className="palco">
          <div className="coluna">
            <Calculando c={c} onFim={() => setCalculando(false)} />
          </div>
        </main>
      </>
    );
  }
  if (etapa === "result" && res && textos) {
    return (
      <>
        <Topo nome={c.marca.nome} contador="" idx={idx} />
        <Resultado c={c} recursos={recursos} res={res} t={textos} onRefazer={refazer} revisao={revisao} />
        {revisao && <BadgeVariante variante={variante} />}
      </>
    );
  }

  /* ---------- fluxo ---------- */
  const t = c.telas[tela as Exclude<typeof tela, "result">];
  const voltar = () => ir(-1);
  const avancar = () => ir(1);
  const rotuloBotao = t.botao ?? "Continuar";

  let corpo: React.ReactNode = null;
  if (tela === "objetivo") {
    corpo = (
      <>
        <Opcoes opcoes={c.opcoes.objetivo} selecionados={r.objetivo ? [r.objetivo] : []} rotulo={t.titulo} onEscolha={(v) => escolheUnica("objetivo", v)} />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} mostraVoltar={false} />
        <Destaques itens={c.intro.destaques} />
      </>
    );
  } else if (tela === "idade") {
    const anos = r.idade < 40 ? 20 : 15;
    corpo = (
      <>
        <SliderIdade
          idade={r.idade}
          unidade={c.valores.unidadeIdade}
          onIdade={(n) => atualiza((x) => ({ ...x, idade: n }))}
          extra={
            recursos.horizonteIdade && c.extras ? <Rich className="horizonte" html={c.extras.horizonte(anos, r.idade + anos)} /> : null
          }
        />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} />
      </>
    );
  } else if (tela === "aporte" || tela === "patrimonio" || tela === "imoveis") {
    const campo = tela;
    corpo = (
      <>
        <SliderDinheiro
          key={campo}
          campo={campo}
          valor={r[campo]}
          onValor={(v) => atualiza((x) => ({ ...x, [campo]: v }))}
          pontas={c.valores.pontas[campo]}
          dica={c.valores.dica}
          atalhos={recursos.atalhosValor ? c.extras?.atalhos[campo] : undefined}
          atalhoZero={c.extras?.atalhoZero}
        />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} />
      </>
    );
  } else if (tela === "concerns_padrao" || tela === "concerns_pat") {
    const ops = c.opcoes[tela] as Opcao<Preocupacao>[];
    corpo = (
      <>
        <Opcoes
          opcoes={ops}
          multi
          selecionados={r.concerns}
          rotulo={t.titulo}
          onEscolha={(v) => atualiza((x) => ({ ...x, concerns: alternaPreocupacao(x.concerns, v, ops.map((o) => o.val)) }))}
        />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} />
      </>
    );
  } else if (tela === "momento") {
    corpo = (
      <>
        <Opcoes opcoes={c.opcoes.momento} selecionados={r.momento ? [r.momento] : []} rotulo={t.titulo} onEscolha={(v) => escolheUnica("momento", v)} />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} />
      </>
    );
  } else if (tela === "conhecimento") {
    corpo = (
      <>
        <Opcoes
          opcoes={c.opcoes.conhecimento}
          selecionados={r.conhecimento ? [r.conhecimento] : []}
          rotulo={t.titulo}
          onEscolha={(v) => escolheUnica("conhecimento", v)}
        />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} />
      </>
    );
  } else if (tela === "contato") {
    corpo = (
      <>
        <FormContato
          c={c}
          nome={r.nome}
          whats={r.whats}
          pais={r.pais}
          email={r.email}
          previa={recursos.previaContato ? c.extras?.previa : undefined}
          onCampo={(k, v) => atualiza((x) => ({ ...x, [k]: v }))}
          onEnter={avancar}
        />
        <Navegacao voltar={voltar} avancar={avancar} rotulo={rotuloBotao} pode={pode} />
      </>
    );
  }

  return (
    <>
      <Topo nome={c.marca.nome} contador={contador(idx)} idx={idx} onIr={irPara} pulado={pulado} />
      <main className="palco">
        <div className="coluna">
          <section key={tela} className={"card etapa" + (dir < 0 ? " volta" : "")} aria-labelledby="titulo-etapa">
            <Cabecalho t={t} />
            {corpo}
          </section>
          <Abaixo key={"ab-" + tela} insight={t.insight} confianca={t.confianca} rotulo={c.insightRotulo} />
        </div>
      </main>
      {(revisao || MODO_REVISAO) && <BadgeVariante variante={variante} />}
    </>
  );
}

function BadgeVariante({ variante }: { variante: Variante }) {
  return (
    <a className="badge-variante" href={variante === "a" ? "/b" : "/"} title="Trocar de versão">
      VERSÃO {variante.toUpperCase()}
    </a>
  );
}
