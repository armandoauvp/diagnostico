import { ALUGUEL_LIQUIDO, PREMISSAS } from "./config";
import { isPatrimonial } from "./fluxo";
import type { Premissas, Respostas } from "./tipos";

/*
 * Porte fiel de compute() e build() da v6. Aqui só ficam números e chaves de
 * variação; os textos que cada chave mostra estão em src/conteudo.
 */

export type FaixaHero = "menos40" | "40a49" | "50mais";
export type PassoId =
  | "escola"
  | "plataforma"
  | "consultoria"
  | "credito"
  | "protecao"
  | "internacional"
  | "estruturacao";
export type VarianteEscola = "padrao" | "altoValor" | "renda" | "avancado" | "intermediario" | "perdido" | "dividas";
export type VarianteConsultoria = "padrao" | "rentabilidade" | "diversificar" | "renda_ativos";
export type Headline = "privado" | "pat" | "acumulo" | "renda" | "caminho";

export interface Passo {
  id: PassoId;
  /** variação do texto (só escola e consultoria têm mais de uma) */
  variante: string;
  /** mostra o selo de 100% do dinheiro de volta */
  selo: boolean;
}

export interface Resultado {
  idade: number;
  global: number;
  anosBase: number;
  iReal: number;
  perfilNome: string;
  headline: Headline;
  hero: {
    faixa: FaixaHero;
    valor: number;
    idadeFim: number;
    /** <40: renda mensal ao fim dos 20 anos. 40–49: patrimônio acumulado em 15 anos. */
    apoio: number;
    segundo: number | null;
  };
  custoEspera: number;
  mostraCustoEspera: boolean;
  projetado: number;
  aportado: number;
  rendaFinal: number;
  mostraComparacao: boolean;
  grafico: { plano: number[]; guardado: number[] } | null;
  split: { pa: number; pj: number } | null;
  imovel: { aluguel: number; liquido: number; investido: number; diferenca: number } | null;
  plano: { leadin: "padrao" | "privado"; callout: boolean; passos: Passo[] };
  score: number;
  tier: { label: "ALTA" | "MÉDIA" | "BASE"; cls: "alta" | "media" | "base" };
  tags: string[];
}

export const PERFIL_NOMES = {
  patrimonial: "Perfil patrimonial",
  construtor: "Construtor de patrimônio",
  transicao: "Em transição para a renda",
  gerador: "Gerador de renda",
};

export function calcular(data: Respostas, p: Premissas = PREMISSAS): Resultado {
  const iNom = Math.pow(1 + p.ret, 1 / 12) - 1;
  const realA = (1 + p.ret) / (1 + p.infl) - 1;
  const iReal = Math.pow(1 + realA, 1 / 12) - 1;
  const idade = data.idade || 40;

  function fv(anos: number) {
    const n = anos * 12;
    const l = data.patrimonio * Math.pow(1 + iNom, n);
    const a = iNom > 0 ? data.aporte * ((Math.pow(1 + iNom, n) - 1) / iNom) : data.aporte * n;
    return l + a;
  }
  const rendaHoje = data.patrimonio * iReal;
  const global = data.patrimonio + data.imoveis;

  let hero: Resultado["hero"];
  let anosBase: number;
  if (idade < 40) {
    anosBase = 20;
    const fv20 = fv(20);
    hero = { faixa: "menos40", valor: fv20, idadeFim: idade + 20, apoio: fv20 * iReal, segundo: null };
  } else if (idade < 50) {
    anosBase = 15;
    const fv15 = fv(15);
    hero = { faixa: "40a49", valor: fv15 * iReal, idadeFim: idade + 15, apoio: fv15, segundo: null };
  } else {
    anosBase = 15;
    const fv15b = fv(15);
    hero = { faixa: "50mais", valor: rendaHoje, idadeFim: idade + 15, apoio: 0, segundo: fv15b * iReal };
  }

  const perfilNome =
    global >= 5_000_000
      ? PERFIL_NOMES.patrimonial
      : idade < 40
        ? PERFIL_NOMES.construtor
        : idade < 50
          ? PERFIL_NOMES.transicao
          : PERFIL_NOMES.gerador;

  const fvBase = fv(anosBase);
  const custoEspera = fvBase - fv(anosBase - 1);
  const mostraCustoEspera = data.aporte > 0 || data.patrimonio > 0;

  const aportado = data.patrimonio + data.aporte * anosBase * 12;

  let grafico: Resultado["grafico"] = null;
  if (fvBase > 1000) {
    const plano: number[] = [];
    const guardado: number[] = [];
    for (let t = 0; t <= anosBase; t++) {
      plano.push(fv(t));
      guardado.push(data.patrimonio + data.aporte * 12 * t);
    }
    grafico = { plano, guardado };
  }

  let split: Resultado["split"] = null;
  if (fvBase > 0 && aportado > 0 && fvBase > aportado) {
    const pj = Math.max(1, Math.min(99, Math.round(((fvBase - aportado) / fvBase) * 100)));
    split = { pa: 100 - pj, pj };
  }

  let imovel: Resultado["imovel"] = null;
  if (data.imoveis > 0) {
    const aluguel = data.imoveis * p.aluguel;
    const liquido = aluguel * ALUGUEL_LIQUIDO;
    const investido = data.imoveis * iReal;
    imovel = { aluguel, liquido, investido, diferenca: investido - liquido };
  }

  const b = build(data, idade, global);

  return {
    idade,
    global,
    anosBase,
    iReal,
    perfilNome,
    headline: b.headline,
    hero,
    custoEspera,
    mostraCustoEspera,
    projetado: fvBase,
    aportado,
    rendaFinal: fvBase * iReal,
    mostraComparacao: fvBase > 1000 && fvBase > aportado,
    grafico,
    split,
    imovel,
    plano: { leadin: b.privado ? "privado" : "padrao", callout: b.privado, passos: b.passos },
    score: b.score,
    tier: b.tier,
    tags: b.tags,
  };
}

function build(data: Respostas, idade: number, global: number) {
  const P = data.patrimonio;
  const A = data.aporte;
  const C = data.concerns;
  const pat = isPatrimonial(data);
  const privado = global >= 5_000_000;
  const holding = data.imoveis >= 2_000_000 || C.includes("sucessao");
  const passos: Passo[] = [];
  const tags = ["alvo:escola"];

  const altoValor = pat || A >= 10_000 || P >= 300_000;

  // 1º passo é sempre a Escola. Quando várias regras valem, a última ganha.
  let escola: VarianteEscola = "padrao";
  if (altoValor) escola = "altoValor";
  if (data.objetivo === "renda" && !altoValor) escola = "renda";
  if (data.conhecimento === "avancado") escola = "avancado";
  if (data.conhecimento === "intermediario") escola = "intermediario";
  if (data.conhecimento === "perdido") escola = "perdido";
  if (C.includes("dividas")) {
    escola = "dividas";
    tags.push("tem:dividas");
  }
  passos.push({ id: "escola", variante: escola, selo: true });

  const experiente =
    data.conhecimento === "avancado" || (data.conhecimento === "intermediario" && data.momento === "sozinho");
  if (experiente) {
    passos.push({ id: "plataforma", variante: "padrao", selo: false });
    tags.push("alvo:plataforma", "perfil:experiente");
  }

  if (altoValor) {
    let cons: VarianteConsultoria = "padrao";
    if (C.includes("rentabilidade")) cons = "rentabilidade";
    if (C.includes("diversificar")) cons = "diversificar";
    if (C.includes("renda_ativos")) cons = "renda_ativos";
    passos.push({ id: "consultoria", variante: cons, selo: true });
    tags.push("alvo:consultoria", "prioridade:alta");
  }

  if (C.includes("comprar_imovel")) {
    passos.push({ id: "credito", variante: "padrao", selo: false });
    tags.push("quer:imovel");
  }
  if (C.includes("proteger_familia") || (idade < 40 && P < 30_000 && !pat)) {
    passos.push({ id: "protecao", variante: "padrao", selo: false });
    tags.push("quer:protecao");
  }
  if (C.includes("exterior")) {
    passos.push({ id: "internacional", variante: "padrao", selo: false });
    tags.push("elig:offshore");
  }
  if (holding) {
    passos.push({ id: "estruturacao", variante: "padrao", selo: false });
    tags.push("elig:holding");
  }
  if (privado) tags.push("perfil:patrimonial", "elig:offshore", "elig:holding", "elig:cartao");

  let s = 0;
  // patrimônio — faixas finas
  s +=
    global >= 10_000_000 ? 40
    : global >= 5_000_000 ? 36
    : P >= 1_000_000 ? 32
    : P >= 500_000 ? 29
    : P >= 300_000 ? 26
    : P >= 150_000 ? 22
    : P >= 100_000 ? 19
    : P >= 70_000 ? 16
    : P >= 30_000 ? 12
    : P >= 10_000 ? 8
    : 5;
  // aporte — faixas finas
  s += A >= 25_000 ? 30 : A >= 10_000 ? 26 : A >= 5000 ? 21 : A >= 2500 ? 17 : A >= 1000 ? 12 : A >= 500 ? 8 : A >= 300 ? 5 : 2;
  // capacidade de pagar à vista
  const avista = A >= 1500 || P >= 50_000 || global >= 300_000;
  if (avista) {
    s += 8;
    tags.push("capacidade:avista");
  }
  if (global >= 1_000_000) s += 4;
  if (holding) s += 8;
  if (C.includes("exterior")) s += 6;
  if (C.includes("comprar_imovel")) s += 4;
  s += data.objetivo === "crescer" ? 10 : data.objetivo === "ambos" ? 8 : data.objetivo === "renda" ? 6 : 0;
  if (C.includes("dividas")) s -= 5;
  s +=
    data.conhecimento === "intermediario" ? 10
    : data.conhecimento === "avancado" ? 9
    : data.conhecimento === "perdido" ? 3
    : 0;
  if (data.momento === "consultoria") s += 6;
  if ((data.objetivo === "renda" || data.objetivo === "ambos") && idade >= 50) s += 5;
  // mesma régua do score anterior (0–119)
  s = Math.round(Math.max(0, Math.min(100, s)) * 1.19);
  const tier: Resultado["tier"] =
    s >= 81 ? { label: "ALTA", cls: "alta" } : s >= 48 ? { label: "MÉDIA", cls: "media" } : { label: "BASE", cls: "base" };
  tags.push("objetivo:" + data.objetivo, "versao:v6", "contato:ok");

  const headline: Headline = privado ? "privado" : pat ? "pat" : idade < 40 ? "acumulo" : idade >= 50 ? "renda" : "caminho";

  return { passos, tags, score: s, tier, headline, privado };
}

export const primeiroNome =(nome: string) => (nome || "").trim().split(" ")[0];
