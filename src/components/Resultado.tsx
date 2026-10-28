"use client";

import {
  ArrowCounterClockwise,
  ChartLineUp,
  CheckCircle,
  Hourglass,
  ListChecks,
  Medal,
  Newspaper,
  Rows,
  ShieldCheck,
  WhatsappLogo,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Textos } from "@/conteudo/montar";
import type { Conteudo } from "@/conteudo/tipos";
import type { Recursos } from "@/conteudo/variantes";
import type { Resultado as Res } from "@/lib/diagnostico/calculo";
import { PRESS, RD_SECS, SPECIALIST, WA_URL } from "@/lib/diagnostico/config";
import { track } from "@/lib/diagnostico/envio";
import { fmt, fmtCurto } from "@/lib/diagnostico/valores";
import { Rich, useContagem, useVisto } from "./base";

function Revela({ children, className = "", as: Tag = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" }) {
  const [ref, visto] = useVisto<HTMLElement>();
  return (
    <Tag ref={ref as never} className={`revela ${visto ? "visto" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

const ehCelular = () =>
  window.matchMedia("(max-width:768px)").matches || (window.matchMedia("(pointer:coarse)").matches && window.innerWidth < 900);

function BotaoWa({ rotulo, id, onClick }: { rotulo: string; id?: string; onClick?: () => void }) {
  return (
    <a
      className="btn-wa"
      id={id}
      href={WA_URL}
      target="_blank"
      rel="noopener"
      onClick={() => {
        track("wa_click");
        onClick?.();
      }}
    >
      <WhatsappLogo size={24} weight="fill" />
      <span>{rotulo}</span>
    </a>
  );
}

/* ---------- gráfico: plano vs guardar sem investir ---------- */
function Grafico({ c, res }: { c: Conteudo; res: Res }) {
  const [ref, visto] = useVisto<HTMLDivElement>("0px 0px -20% 0px");
  if (!res.grafico) return null;
  const { plano, guardado } = res.grafico;
  const W = 560, H = 232, padL = 8, padR = 92, padT = 14, padB = 26;
  const iw = W - padL - padR, ih = H - padT - padB, N = res.anosBase;
  const ymax = plano[N] * 1.06 || 1;
  const Xc = (t: number) => padL + (iw * t) / N;
  const Yc = (v: number) => padT + ih * (1 - v / ymax);
  const path = (a: number[]) => a.map((v, t) => (t ? "L" : "M") + Xc(t).toFixed(1) + " " + Yc(v).toFixed(1)).join(" ");
  const area = path(plano) + ` L${Xc(N).toFixed(1)} ${Yc(0).toFixed(1)} L${Xc(0).toFixed(1)} ${Yc(0).toFixed(1)} Z`;
  const k = c.resultado.comparacao;
  return (
    <div ref={ref} className={"grafico" + (visto ? " visto" : "")}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Projeção do patrimônio ao longo do tempo">
        <defs>
          <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gold)" stopOpacity=".32" />
            <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.5, 1].map((g) => {
          const y = Yc(ymax * g);
          return (
            <g key={g}>
              <line x1={padL} x2={padL + iw} y1={y} y2={y} stroke="var(--line)" strokeDasharray="3 5" />
              <text x={padL + iw + 8} y={y + 4} fontSize="12" fill="var(--ink-3)" fontFamily="var(--font-ui)">
                {fmtCurto(ymax * g)}
              </text>
            </g>
          );
        })}
        <line x1={padL} x2={padL + iw} y1={Yc(0)} y2={Yc(0)} stroke="var(--line-2)" />
        <path className="area" d={area} fill="url(#gfill)" />
        <path d={path(guardado)} fill="none" stroke="var(--guardado)" strokeWidth="2" strokeDasharray="5 5" />
        <path className="l-plano" pathLength={1} d={path(plano)} fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <g className="ponto">
          <circle className="halo" cx={Xc(N)} cy={Yc(plano[N])} r="5" fill="var(--gold)" />
          <circle cx={Xc(N)} cy={Yc(plano[N])} r="5.5" fill="var(--gold)" stroke="var(--surface)" strokeWidth="2" />
        </g>
        <text x={padL} y={H - 6} fontSize="12" fill="var(--ink-3)" fontFamily="var(--font-ui)">
          {k.eixoHoje}
        </text>
        <text x={padL + iw} y={H - 6} fontSize="12" fill="var(--ink-3)" textAnchor="end" fontFamily="var(--font-ui)">
          {k.eixoFim(N)}
        </text>
      </svg>
      <div className="legenda">
        <span>
          <i />
          {k.legendaPlano}
        </span>
        <span>
          <i className="tr" />
          {k.legendaGuardado}
        </span>
      </div>
    </div>
  );
}

function Hero({ c, res, t }: { c: Conteudo; res: Res; t: Textos }) {
  const v = useContagem(res.hero.valor);
  const v2 = useContagem(t.segundo?.valor ?? 0, !!t.segundo);
  return (
    <section className="hero escuro">
      <span className="hero-brilho" aria-hidden />
      <span className="perfil">
        <ChartLineUp size={14} weight="bold" />
        {t.perfil}
      </span>
      <div className="rot">{t.heroLabel}</div>
      <div className="grande" aria-label={fmt(res.hero.valor)}>
        {fmt(v)}
      </div>
      {t.segundo && (
        <div className="segundo">
          <div className="rot" style={{ marginTop: 0 }}>
            {t.segundo.label}
          </div>
          <div className="grande">{fmt(v2)}</div>
        </div>
      )}
      <Rich as="p" className="nota" html={t.heroNota} />
      {t.espera && (
        <div className="espera">
          <Hourglass size={18} weight="duotone" />
          <Rich html={t.espera} />
        </div>
      )}
    </section>
  );
}

function Futuros({ c, res, t }: { c: Conteudo; res: Res; t: Textos }) {
  if (!t.comparacao) return null;
  const k = c.resultado.comparacao;
  return (
    <Revela className="card bloco">
      <div className="bloco-h">
        <span className="ic">
          <ChartLineUp size={20} weight="duotone" />
        </span>
        <h2>{t.comparacao.titulo}</h2>
      </div>
      <div className="futuros">
        <div className="futuro com">
          <div className="cab">
            <CheckCircle size={18} weight="fill" /> {k.com}
          </div>
          {t.comparacao.com.map((x) => (
            <div key={x.lbl}>
              <div className="n">{x.num}</div>
              <div className="l">{x.lbl}</div>
            </div>
          ))}
        </div>
        <div className="futuro sem">
          <div className="cab">
            <XCircle size={18} /> {k.sem}
          </div>
          {t.comparacao.sem.map((x) => (
            <div key={x.lbl}>
              <div className="n">{x.num}</div>
              <div className="l">{x.lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <Rich as="p" className="diff" html={t.comparacao.diff} />
      <Grafico c={c} res={res} />
    </Revela>
  );
}

function Plano({ c, t }: { c: Conteudo; t: Textos }) {
  return (
    <Revela className="card bloco">
      <div className="bloco-h">
        <span className="ic">
          <ListChecks size={20} weight="duotone" />
        </span>
        <h2>{c.resultado.planoTitulo}</h2>
      </div>
      <Rich as="p" className="leadin" html={t.leadin} />
      {t.callout && (
        <div className="callout">
          <p className="ct">{t.callout.titulo}</p>
          <p>{t.callout.texto}</p>
        </div>
      )}
      <ol className="passos">
        {t.passos.map((p, i) => (
          <li className="passo-item" key={p.id}>
            <span className="passo-num">{i + 1}</span>
            <span className="tag">{p.tag}</span>
            <h3>{p.titulo}</h3>
            {p.essencia && <p className="ess">{p.essencia}</p>}
            <Rich as="p" className="corpo" html={p.texto} />
            {p.selo && (
              <span className="garantia">
                <ShieldCheck size={15} weight="fill" />
                {c.resultado.seloPasso}
              </span>
            )}
          </li>
        ))}
      </ol>
    </Revela>
  );
}

function Numeros({ c, res, t }: { c: Conteudo; res: Res; t: Textos }) {
  const [ref, visto] = useVisto<HTMLDivElement>();
  const maxIm = res.imovel ? Math.max(res.imovel.aluguel, res.imovel.liquido, res.imovel.investido) || 1 : 1;
  const valoresIm = res.imovel ? [res.imovel.aluguel, res.imovel.liquido, res.imovel.investido] : [];
  return (
    <Revela className="card bloco">
      <div className="bloco-h">
        <span className="ic">
          <Rows size={20} weight="duotone" />
        </span>
        <h2>{c.resultado.numerosTitulo}</h2>
      </div>
      <div ref={ref}>
        {res.split && t.split && (
          <>
            <div className="split" aria-hidden>
              <i className="voce" style={{ width: visto ? res.split.pa + "%" : 0 }} />
              <i className="juros" style={{ width: visto ? res.split.pj + "%" : 0 }} />
            </div>
            <div className="split-lbl">
              <Rich html={t.split[0]} />
              <Rich html={t.split[1]} />
            </div>
          </>
        )}
        <div className="stats">
          {t.stats.map((s) => (
            <div className="stat" key={s.k}>
              <span className="k">{s.k}</span>
              <span className={"v " + (s.tom ?? "")}>{s.v}</span>
            </div>
          ))}
        </div>
        {t.imovel && (
          <>
            <p className="secttl">{c.resultado.imovel.titulo}</p>
            <div className="stats">
              {t.imovel.linhas.map((s, i) => (
                <div key={s.k}>
                  <div className="stat" style={{ borderBottom: 0, paddingBottom: 6 }}>
                    <span className="k">{s.k}</span>
                    <span className={"v " + (s.tom ?? "")}>{s.v}</span>
                  </div>
                  <div className={"barra-im" + (s.tom === "gold" ? " gold" : "")} aria-hidden>
                    <span className="trk">
                      <i style={{ width: visto ? (valoresIm[i] / maxIm) * 100 + "%" : 0 }} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="nota-imovel">{t.imovel.nota}</p>
          </>
        )}
      </div>
    </Revela>
  );
}

/* ---------- página do resultado ---------- */

export function Resultado({
  c,
  recursos,
  res,
  t,
  onRefazer,
  revisao = false,
}: {
  c: Conteudo;
  recursos: Recursos;
  res: Res;
  t: Textos;
  onRefazer: () => void;
  revisao?: boolean;
}) {
  const r = c.resultado;
  const [pronto, setPronto] = useState(false);
  const [fixo, setFixo] = useState(false);
  const [leitura, setLeitura] = useState(0);
  const [saida, setSaida] = useState(false);
  const saidaMostrada = useRef(false);
  const [rd, setRd] = useState<number | null>(null);
  const [convite, setConvite] = useState(false);
  const conviteFechado = useRef(false);
  const pararRef = useRef<() => void>(() => {});

  useEffect(() => {
    setPronto(true);
    window.scrollTo({ top: 0 });
  }, []);

  // barra de leitura + CTA fixo
  useEffect(() => {
    let tick = false;
    const visivel = (el: Element | null) => {
      if (!el) return false;
      const b = el.getBoundingClientRect();
      return b.top < window.innerHeight - 40 && b.bottom > 80;
    };
    const f = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const sc = window.scrollY || document.documentElement.scrollTop || 0;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setLeitura(docH > 0 ? Math.min(1, Math.max(0, sc / docH)) : 0);
        setFixo(sc > 360 && !visivel(document.getElementById("waBtn")));
      });
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    window.addEventListener("resize", f, { passive: true });
    return () => {
      window.removeEventListener("scroll", f);
      window.removeEventListener("resize", f);
    };
  }, []);

  // aviso de saída (computador)
  useEffect(() => {
    if (ehCelular()) return;
    const f = (e: MouseEvent) => {
      if (saidaMostrada.current) return;
      if (e.clientY <= 0 && !e.relatedTarget) {
        saidaMostrada.current = true;
        setSaida(true);
        track("exit_intent_show");
      }
    };
    document.addEventListener("mouseout", f);
    return () => document.removeEventListener("mouseout", f);
  }, []);

  // A: encaminhamento automático em 30 s (celular). Rolar ou tocar reinicia.
  useEffect(() => {
    if (recursos.fechamentoSuave || !ehCelular()) return;
    let left = RD_SECS;
    setRd(left);
    const bump = () => {
      left = RD_SECS;
      setRd((x) => (x === null ? null : RD_SECS));
    };
    const iv = setInterval(() => {
      left--;
      setRd((x) => (x === null ? null : Math.max(0, left)));
      if (left <= 0) {
        clearInterval(iv);
        track("auto_redirect");
        // no modo revisão a contagem aparece, mas não sai da página
        if (revisao) setRd(null);
        else window.location.href = WA_URL;
      }
    }, 1000);
    window.addEventListener("scroll", bump, { passive: true });
    window.addEventListener("touchstart", bump, { passive: true });
    pararRef.current = () => {
      clearInterval(iv);
      setRd(null);
    };
    return () => {
      clearInterval(iv);
      window.removeEventListener("scroll", bump);
      window.removeEventListener("touchstart", bump);
    };
  }, [recursos.fechamentoSuave, revisao]);
  const pararRd = () => pararRef.current();

  // B: convite que não sai da página, depois que a pessoa leu o plano
  useEffect(() => {
    if (!recursos.fechamentoSuave || !ehCelular()) return;
    const alvo = document.getElementById("numerosFim");
    if (!alvo) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting) && !conviteFechado.current) {
        setConvite(true);
        track("convite_show");
        io.disconnect();
      }
    });
    io.observe(alvo);
    return () => io.disconnect();
  }, [recursos.fechamentoSuave]);

  const rdOn = rd !== null;
  useEffect(() => {
    document.body.classList.toggle("rd-on", rdOn || convite);
    return () => document.body.classList.remove("rd-on");
  }, [rdOn, convite]);

  return (
    <div className={"resultado" + (pronto ? " pronto" : "")}>
      <div className="leitura-barra" aria-hidden>
        <i style={{ width: (leitura * 100).toFixed(2) + "%" }} />
      </div>

      <div className="chegada etapa">
        <span className="chegada-selo">
          <span className="ck">
            <CheckCircle size={18} weight="fill" />
          </span>
          {r.selo}
          <span className="faiscas" aria-hidden>
            {[[-60, -34], [64, -30], [-46, 30], [52, 34], [0, -46], [-80, 4], [84, 6]].map(([x, y], i) => (
              <i key={i} style={{ ["--x" as string]: x + "px", ["--y" as string]: y + "px", animationDelay: 0.35 + i * 0.04 + "s" }} />
            ))}
          </span>
        </span>
        <h1>{t.titulo}</h1>
        {r.chegadaSub && <p>{r.chegadaSub}</p>}
      </div>

      <Hero c={c} res={res} t={t} />
      <Futuros c={c} res={res} t={t} />
      <Plano c={c} t={t} />
      <Numeros c={c} res={res} t={t} />
      <span id="numerosFim" />

      {t.perdaFinal && (
        <Revela as="div" className="perda">
          <Hourglass size={20} weight="duotone" />
          <Rich html={t.perdaFinal} />
        </Revela>
      )}

      <Revela className="cta escuro">
        <span className="hero-brilho" aria-hidden />
        <h2>{r.cta.titulo}</h2>
        <p className="ponte">{r.cta.ponte}</p>
        {(SPECIALIST.nome || SPECIALIST.foto) && (
          <div className="espec">
            {SPECIALIST.foto && <img src={SPECIALIST.foto} alt="" />}
            <div>
              <div className="sn">{r.cta.especialista(SPECIALIST.nome)}</div>
              <div className="sr2">{SPECIALIST.cargo}</div>
            </div>
          </div>
        )}
        <BotaoWa id="waBtn" rotulo={r.cta.botao} onClick={pararRd} />
        <Rich as="p" className="wanota" html={r.cta.nota} />
      </Revela>

      <Revela as="div" className="imprensa">
        <p className="secttl">{r.imprensa}</p>
        <div className="imprensa-links">
          {PRESS.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener">
              <Newspaper size={15} /> {p.name}
            </a>
          ))}
        </div>
        <div className="premio">
          <Medal size={22} weight="duotone" />
          <Rich html={r.premio} />
        </div>
      </Revela>

      <p className="aviso">{r.aviso}</p>
      <button type="button" className="refazer" onClick={onRefazer}>
        <ArrowCounterClockwise size={15} /> {r.refazer}
      </button>

      <div className={"fixo" + (fixo ? " on" : "")}>
        <BotaoWa rotulo={r.sticky} onClick={pararRd} />
      </div>

      <div
        className={"saida-ov" + (saida ? " on" : "")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saidaTitulo"
        aria-hidden={!saida}
        onClick={(e) => e.target === e.currentTarget && setSaida(false)}
      >
        <div className="saida escuro">
          <span className="ic">
            <WhatsappLogo size={26} weight="duotone" />
          </span>
          <h3 id="saidaTitulo">{r.saida.titulo}</h3>
          <p>{r.saida.texto}</p>
          <BotaoWa rotulo={r.saida.botao} onClick={() => track("exit_intent_cta")} />
          <button type="button" className="fechar" onClick={() => setSaida(false)}>
            {r.saida.fechar}
          </button>
        </div>
      </div>

      {!recursos.fechamentoSuave && (
        <div className={"rd" + (rdOn ? " on" : "")} aria-hidden={!rdOn}>
          <button
            type="button"
            className="x"
            aria-label={r.redirect.fechar}
            onClick={() => {
              pararRd();
              track("auto_redirect_cancel");
            }}
          >
            <X size={16} weight="bold" />
          </button>
          <svg className="anel" viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--dark-line)" strokeWidth="3" />
            <circle
              className="p"
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="var(--dark-gold)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 15}
              strokeDashoffset={2 * Math.PI * 15 * (1 - (rd ?? 0) / RD_SECS)}
              transform="rotate(-90 18 18)"
            />
          </svg>
          <Rich className="tx" html={r.redirect.texto(rd ?? RD_SECS)} />
          <a className="go" href={WA_URL} target="_blank" rel="noopener" onClick={() => { track("wa_click"); pararRd(); }}>
            {r.redirect.botao}
          </a>
        </div>
      )}

      {recursos.fechamentoSuave && c.extras && (
        <div className={"rd" + (convite ? " on" : "")} aria-hidden={!convite}>
          <button
            type="button"
            className="x"
            aria-label={c.extras.convite.fechar}
            onClick={() => {
              conviteFechado.current = true;
              setConvite(false);
              track("convite_close");
            }}
          >
            <X size={16} weight="bold" />
          </button>
          <span className="tx">{c.extras.convite.texto}</span>
          <a className="go" href={WA_URL} target="_blank" rel="noopener" onClick={() => track("wa_click")}>
            {c.extras.convite.botao}
          </a>
        </div>
      )}
    </div>
  );
}
