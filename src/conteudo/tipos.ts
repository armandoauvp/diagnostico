import type { FaixaHero, Headline, PassoId } from "@/lib/diagnostico/calculo";
import type { Conhecimento, Momento, Objetivo, Preocupacao, TelaId } from "@/lib/diagnostico/tipos";

/*
 * Formato dos textos. Negrito e itálico ficam como HTML simples (<b>, <em>,
 * <i>) para bater 1:1 com o site atual. Funções recebem valores já formatados.
 */

export interface Opcao<V extends string> {
  val: V;
  titulo: string;
  apoio: string;
}

export interface TelaTexto {
  /** sobretítulo; só aparece quando acrescenta algo ao título */
  eyebrow?: string;
  titulo: string;
  sub: string;
  confianca: string;
  insight?: string;
  botao?: string;
}

/** Textos que só existem na versão B (recursos novos). */
export interface ExtrasB {
  atalhos: { aporte: number[]; patrimonio: number[]; imoveis: number[] };
  atalhoZero: string;
  horizonte: (anos: number, idadeFim: number) => string;
  previa: { titulo: string; itens: string[]; trancado: string };
  convite: { texto: string; botao: string; fechar: string };
}

export interface Conteudo {
  /** titulo: aba do navegador. nome: ao lado da logo, no topo */
  marca: { titulo: string; nome: string };
  extras?: ExtrasB;
  /** rótulos do painel "Seu plano" (camada visual nova, nas duas versões) */
  painel: {
    titulo: string;
    status: string;
    statusPronto: string;
    linhas: { objetivo: string; idade: string; aporte: string; patrimonio: string; imoveis: string; concerns: string; momento: string; conhecimento: string; numero: string };
    porMes: string;
    anos: string;
    marcadas: (n: number) => string;
    aoFinal: string;
    movelTitulo: string;
    movelSub: string;
  };
  telas: Record<Exclude<TelaId, "result">, TelaTexto>;
  intro: { destaques: [string, string][] };
  opcoes: {
    objetivo: Opcao<Objetivo>[];
    concerns_padrao: Opcao<Preocupacao>[];
    concerns_pat: Opcao<Preocupacao>[];
    momento: Opcao<Momento>[];
    conhecimento: Opcao<Conhecimento>[];
  };
  valores: {
    dica: string;
    pontas: { aporte: [string, string]; patrimonio: [string, string]; imoveis: [string, string] };
    unidadeIdade: string;
  };
  contato: {
    nome: string;
    whats: string;
    email: string;
    erroWhats: string;
    selo: string;
    paisOutro: string;
  };
  calculando: { eyebrow?: string; titulo: string; sub: string; etapas: string[]; confianca: string };
  insightRotulo: string;
  resultado: {
    selo: string;
    tituloComNome: (nome: string) => string;
    headline: Record<Headline, string>;
    chegadaSub: string;
    hero: Record<FaixaHero, { label: string; nota: (idadeFim: number, apoio: string) => string }>;
    segundoLabel: string;
    espera: (custo: string) => string;
    comparacao: {
      titulo: (nome: string) => string;
      com: string;
      sem: string;
      comPatrimonio: (anos: number) => string;
      comRenda: string;
      semGuardado: (anos: number) => string;
      semRenda: string;
      diff: (valor: string) => string;
      legendaPlano: string;
      legendaGuardado: string;
      eixoHoje: string;
      eixoFim: (anos: number) => string;
    };
    planoTitulo: string;
    leadin: { padrao: string; privado: string };
    callout: { titulo: string; texto: (global: string) => string };
    objTexto: Record<Objetivo, string>;
    passos: Record<PassoId, { titulo: string; essencia: string; tag: string; textos: Record<string, string | ((objTxt: string) => string)> }>;
    seloPasso: string;
    numerosTitulo: string;
    split: (aportado: string, pa: number, juros: string, pj: number) => [string, string];
    stats: { horizonte: string; aportar: string; projetado: string; juros: string; renda: string; adiar: string; anos: (n: number) => string; porMes: string };
    imovel: {
      titulo: string;
      bruto: string;
      liquido: string;
      investido: string;
      notaMelhor: (selic: string, dif: string) => string;
      notaDefende: string;
    };
    perdaFinal: (custo: string) => string;
    cta: {
      titulo: string;
      ponte: string;
      especialista: (nome: string) => string;
      botao: string;
      nota: string;
    };
    imprensa: string;
    premio: string;
    aviso: string;
    refazer: string;
    sticky: string;
    saida: { titulo: string; texto: string; botao: string; fechar: string };
    redirect: { texto: (s: number) => string; botao: string; fechar: string };
  };
}
