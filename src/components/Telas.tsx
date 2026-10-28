"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  EnvelopeSimple,
  Lightbulb,
  ListNumbers,
  LockSimple,
  Minus,
  Plus,
  ShieldCheck,
  Target,
  Timer,
  User,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Conteudo, ExtrasB, Opcao, TelaTexto } from "@/conteudo/tipos";
import { emailOk, nomeOk } from "@/lib/diagnostico/fluxo";
import { formataTelefone, PAISES, telefoneOk } from "@/lib/diagnostico/telefone";
import {
  aplicaPasso,
  arredonda,
  digitos,
  fmtCurto,
  fmtNum,
  IDADE,
  LIMITES,
  paraPosicao,
  paraValor,
  type CampoValor,
} from "@/lib/diagnostico/valores";
import { Rich } from "./base";
import { ICONES_OPCAO } from "./icones";

export function Cabecalho({ t }: { t: TelaTexto }) {
  return (
    <>
      {t.eyebrow && <div className="eyebrow">{t.eyebrow}</div>}
      <h1 id="titulo-etapa">{t.titulo}</h1>
      <p className="sub">{t.sub}</p>
    </>
  );
}

export function Navegacao({
  voltar,
  avancar,
  rotulo,
  pode,
  mostraVoltar = true,
}: {
  voltar: () => void;
  avancar: () => void;
  rotulo: string;
  pode: boolean;
  mostraVoltar?: boolean;
}) {
  return (
    <div className="nav">
      {mostraVoltar && (
        <button type="button" className="btn btn-fantasma" onClick={voltar}>
          <ArrowLeft size={18} weight="bold" /> Voltar
        </button>
      )}
      <button type="button" className="btn btn-primario" onClick={avancar} disabled={!pode}>
        {rotulo} <ArrowRight size={18} weight="bold" />
      </button>
    </div>
  );
}

export function Abaixo({ insight, confianca, rotulo }: { insight?: string; confianca?: string; rotulo: string }) {
  return (
    <>
      {insight && (
        <div className="insight" role="note">
          <span className="lamp">
            <Lightbulb size={19} weight="duotone" />
          </span>
          <p>
            <span className="rot">{rotulo}</span>
            <Rich html={insight} />
          </p>
        </div>
      )}
      {confianca && (
        <p className="confianca">
          <i />
          <Rich html={confianca} />
        </p>
      )}
    </>
  );
}

/* ---------- escolha única e múltipla ---------- */

export function Opcoes<V extends string>({
  opcoes,
  selecionados,
  multi,
  tiles,
  onEscolha,
  rotulo,
}: {
  opcoes: Opcao<V>[];
  selecionados: V[];
  multi?: boolean;
  tiles?: boolean;
  onEscolha: (v: V) => void;
  rotulo: string;
}) {
  const [pop, setPop] = useState<V | null>(null);
  return (
    <div
      className={"opcoes" + (tiles ? " tiles" : "") + (opcoes.length >= 6 ? " duas" : "")}
      role={multi ? "group" : "radiogroup"}
      aria-label={rotulo}
    >
      {opcoes.map((o) => {
        const Ico = ICONES_OPCAO[o.val];
        const sel = selecionados.includes(o.val);
        return (
          <button
            key={o.val}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={sel}
            className={"opcao" + (multi ? " multi" : "") + (sel ? " sel" : "") + (pop === o.val ? " pop" : "")}
            onClick={() => {
              setPop(o.val);
              onEscolha(o.val);
            }}
            onAnimationEnd={() => setPop(null)}
          >
            <span className="ico">{Ico && <Ico size={tiles ? 26 : 22} weight={sel ? "fill" : "duotone"} />}</span>
            <span className="txt">
              <span className="tt">{o.titulo}</span>
              {o.apoio && <span className="ap">{o.apoio}</span>}
            </span>
            <span className="marca">
              <Check size={14} weight="bold" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Destaques({ itens }: { itens: [string, string][] }) {
  const icones = [ListNumbers, Timer, Target];
  return (
    <div className="destaques">
      {itens.map(([b, s], i) => {
        const I = icones[i] ?? Target;
        return (
          <span key={i}>
            <I size={18} weight="duotone" />
            <b>{b}</b> {s}
          </span>
        );
      })}
    </div>
  );
}

/* ---------- sliders ---------- */

function Faixa({
  valor01,
  onChange,
  rotulo,
  menos,
  mais,
}: {
  valor01: number;
  onChange: (t: number) => void;
  rotulo: string;
  menos: () => void;
  mais: () => void;
}) {
  return (
    <div className="srow">
      <button type="button" className="passo" onClick={menos} aria-label={`Diminuir ${rotulo}`}>
        <Minus size={18} weight="bold" />
      </button>
      <input
        type="range"
        className="faixa"
        min={0}
        max={1000}
        value={Math.round(valor01 * 1000)}
        onChange={(e) => onChange(Number(e.target.value) / 1000)}
        style={{ ["--fill" as string]: (valor01 * 100).toFixed(1) + "%" }}
        aria-label={rotulo}
      />
      <button type="button" className="passo" onClick={mais} aria-label={`Aumentar ${rotulo}`}>
        <Plus size={18} weight="bold" />
      </button>
    </div>
  );
}

/** Dá um pulinho no número a cada mudança. */
function useBump(dep: unknown) {
  const [b, setB] = useState(false);
  const primeiro = useRef(true);
  useEffect(() => {
    if (primeiro.current) {
      primeiro.current = false;
      return;
    }
    setB(true);
    const t = setTimeout(() => setB(false), 270);
    return () => clearTimeout(t);
  }, [dep]);
  return b;
}

export function SliderIdade({ idade, onIdade, unidade, extra }: { idade: number; onIdade: (n: number) => void; unidade: string; extra?: ReactNode }) {
  const t = (idade - IDADE.min) / (IDADE.max - IDADE.min);
  const bump = useBump(idade);
  const set = (n: number) => onIdade(Math.max(IDADE.min, Math.min(IDADE.max, Math.round(n))));
  return (
    <div className="valor">
      <div className={"leitura" + (bump ? " bump" : "")} aria-live="polite">
        <span className="num" style={{ width: "auto" }}>
          {idade}
        </span>
        <span className="un">{unidade}</span>
      </div>
      <Faixa
        valor01={t}
        onChange={(x) => set(IDADE.min + x * (IDADE.max - IDADE.min))}
        rotulo="idade"
        menos={() => set(idade - 1)}
        mais={() => set(idade + 1)}
      />
      <div className="pontas">
        <span>{IDADE.min}</span>
        <span>{IDADE.max}</span>
      </div>
      {extra}
    </div>
  );
}

export function SliderDinheiro({
  campo,
  valor,
  onValor,
  pontas,
  dica,
  atalhos,
  atalhoZero,
}: {
  campo: CampoValor;
  valor: number;
  onValor: (v: number) => void;
  pontas: [string, string];
  dica: string;
  atalhos?: number[];
  atalhoZero?: string;
}) {
  const max = LIMITES[campo].max;
  const [texto, setTexto] = useState<string | null>(null);
  const [t, setT] = useState(() => paraPosicao(campo, valor));
  const bump = useBump(valor);

  // quando o valor muda por fora (atalho, −/+), a posição acompanha
  const ultimo = useRef(valor);
  useEffect(() => {
    if (valor !== ultimo.current) {
      ultimo.current = valor;
      setT(paraPosicao(campo, valor));
    }
  }, [valor, campo]);
  const muda = (v: number, pos?: number) => {
    ultimo.current = v;
    setT(pos ?? paraPosicao(campo, v));
    onValor(v);
  };

  const exibido = texto ?? fmtNum(valor);
  return (
    <div className="valor">
      <div className={"leitura" + (bump && texto === null ? " bump" : "")}>
        <span className="cur">R$</span>
        <input
          className="num"
          inputMode="numeric"
          value={exibido}
          aria-label="Valor em reais"
          style={{ ["--w" as string]: `calc(${Math.max(1, exibido.length) * 0.92}ch + 4px)` }}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            const v = Math.min(max, Number(digitos(e.target.value)) || 0);
            setTexto(v ? fmtNum(v) : "");
            muda(v);
          }}
          onBlur={() => setTexto(null)}
        />
        {valor >= max * 0.985 && <span className="mais">+</span>}
      </div>
      <Faixa
        valor01={t}
        onChange={(x) => muda(arredonda(paraValor(campo, x)), x)}
        rotulo="valor"
        menos={() => muda(aplicaPasso(campo, valor, -1))}
        mais={() => muda(aplicaPasso(campo, valor, 1))}
      />
      <div className="pontas">
        <span>{pontas[0]}</span>
        <span>{pontas[1]}</span>
      </div>
      {atalhos ? (
        <div className="atalhos">
          {atalhos.map((a) => (
            <button key={a} type="button" className={valor === a ? "on" : ""} onClick={() => muda(a)}>
              {a === 0 ? atalhoZero : fmtCurto(a)}
            </button>
          ))}
        </div>
      ) : (
        <div className="dica">{dica}</div>
      )}
    </div>
  );
}

/* ---------- contato ---------- */

export function FormContato({
  c,
  nome,
  whats,
  pais,
  email,
  onCampo,
  onEnter,
  previa,
}: {
  c: Conteudo;
  nome: string;
  whats: string;
  pais: number;
  email: string;
  onCampo: (k: "nome" | "whats" | "pais" | "email", v: string | number) => void;
  onEnter: () => void;
  previa?: ExtrasB["previa"];
}) {
  const nomeRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => nomeRef.current?.focus({ preventScroll: true }), 160);
    return () => clearTimeout(t);
  }, []);
  const temWhats = digitos(whats).length > 0;
  const whatsOk = telefoneOk(whats, pais);
  const enter = (e: React.KeyboardEvent) => e.key === "Enter" && onEnter();

  return (
    <div>
      {previa && (
        <div className="previa" aria-label={previa.titulo}>
          <div className="eyebrow" style={{ margin: 0 }}>
            {previa.titulo}
          </div>
          {previa.itens.map((it) => (
            <div className="previa-linha" key={it}>
              <CheckCircle size={18} weight="fill" />
              <span>{it}</span>
              <span className="bl" />
              <LockSimple size={15} />
            </div>
          ))}
        </div>
      )}
      <div className="campo">
        <label className={"entrada" + (nomeOk(nome) ? " ok" : "")}>
          <User size={20} />
          <span className="sr">{c.contato.nome}</span>
          <input
            ref={nomeRef}
            type="text"
            placeholder={c.contato.nome}
            autoComplete="name"
            maxLength={120}
            value={nome}
            onChange={(e) => onCampo("nome", e.target.value)}
            onKeyDown={enter}
          />
          {nomeOk(nome) && <CheckCircle className="okv" size={20} weight="fill" />}
        </label>
      </div>
      <div className="campo">
        <label className={"entrada" + (whatsOk ? " ok" : temWhats ? " err" : "")}>
          <WhatsappLogo size={20} />
          <select
            className="ddi"
            aria-label="País"
            value={pais}
            onChange={(e) => {
              const p = Number(e.target.value);
              onCampo("pais", p);
              onCampo("whats", formataTelefone(whats, p));
            }}
          >
            {PAISES.map((p, i) => (
              <option key={i} value={i}>
                {p.f} {p.d ? "+" + p.d : c.contato.paisOutro}
              </option>
            ))}
          </select>
          <span className="sr">{c.contato.whats}</span>
          <input
            type="tel"
            inputMode="tel"
            placeholder={c.contato.whats}
            autoComplete="tel-national"
            value={whats}
            onChange={(e) => onCampo("whats", formataTelefone(e.target.value, pais))}
            onKeyDown={enter}
          />
          {whatsOk && <CheckCircle className="okv" size={20} weight="fill" />}
        </label>
        {temWhats && !whatsOk && <p className="nota-campo">{c.contato.erroWhats}</p>}
      </div>
      <div className="campo">
        <label className={"entrada" + (emailOk(email) ? " ok" : "")}>
          <EnvelopeSimple size={20} />
          <span className="sr">{c.contato.email}</span>
          <input
            type="email"
            placeholder={c.contato.email}
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => onCampo("email", e.target.value)}
            onKeyDown={enter}
          />
          {emailOk(email) && <CheckCircle className="okv" size={20} weight="fill" />}
        </label>
      </div>
      <div className="selo">
        <ShieldCheck size={20} weight="duotone" />
        <Rich html={c.contato.selo} />
      </div>
    </div>
  );
}
