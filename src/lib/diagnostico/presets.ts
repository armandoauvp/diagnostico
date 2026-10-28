import { RESPOSTAS_INICIAIS } from "./fluxo";
import type { Respostas } from "./tipos";

/** Perfis de exemplo para revisar as variações do resultado sem preencher o fluxo. */
export const PRESETS: { id: string; nome: string; descricao: string; r: Respostas }[] = [
  {
    id: "jovem-iniciante",
    nome: "Jovem começando",
    descricao: "28 anos, R$ 500/mês, nada investido. Escola + Proteção (regra de idade < 40 e < R$ 30 mil).",
    r: { ...RESPOSTAS_INICIAIS, nome: "Marina Souza", idade: 28, aporte: 500, patrimonio: 0, imoveis: 0, objetivo: "crescer", concerns: ["nenhum"], momento: "comecando", conhecimento: "iniciante" },
  },
  {
    id: "dividas",
    nome: "Com dívidas e casa própria",
    descricao: "34 anos, marcou dívidas e imóvel. Texto da Escola para dívidas + Crédito + Proteção + comparação do imóvel.",
    r: { ...RESPOSTAS_INICIAIS, nome: "Carlos", idade: 34, aporte: 800, patrimonio: 5000, imoveis: 350000, objetivo: "ambos", concerns: ["dividas", "comprar_imovel"], momento: "sozinho", conhecimento: "perdido" },
  },
  {
    id: "transicao",
    nome: "45 anos, investe sozinho",
    descricao: "Faixa 40–49 (renda em 15 anos), intermediário + sozinho: Plataforma AUVP aparece.",
    r: { ...RESPOSTAS_INICIAIS, nome: "Patrícia Lima", idade: 45, aporte: 3000, patrimonio: 150000, imoveis: 600000, objetivo: "renda", concerns: ["proteger_familia"], momento: "sozinho", conhecimento: "intermediario" },
  },
  {
    id: "alto-valor",
    nome: "Alto valor sem ser patrimonial",
    descricao: "38 anos, R$ 12 mil/mês: Consultoria aparece mesmo nas dores da versão padrão.",
    r: { ...RESPOSTAS_INICIAIS, nome: "Rafael", idade: 38, aporte: 12000, patrimonio: 250000, imoveis: 0, objetivo: "crescer", concerns: [], momento: "consultoria", conhecimento: "avancado" },
  },
  {
    id: "gerador-renda",
    nome: "55 anos, renda agora",
    descricao: "Faixa 50+: dois números (renda hoje e em 15 anos).",
    r: { ...RESPOSTAS_INICIAIS, nome: "Helena", idade: 55, aporte: 5000, patrimonio: 800000, imoveis: 900000, objetivo: "renda", concerns: ["proteger_familia"], momento: "consultoria", conhecimento: "intermediario" },
  },
  {
    id: "patrimonial",
    nome: "Patrimonial (≥ R$ 1 mi investido)",
    descricao: "Vê as dores patrimoniais. Consultoria com texto de rentabilidade + Internacional.",
    r: { ...RESPOSTAS_INICIAIS, nome: "Eduardo Martins", idade: 48, aporte: 20000, patrimonio: 2500000, imoveis: 1500000, objetivo: "ambos", concerns: ["rentabilidade", "exterior"], momento: "sozinho", conhecimento: "avancado" },
  },
  {
    id: "privado",
    nome: "Privado (≥ R$ 5 mi global)",
    descricao: "Abertura 'preservar e transferir', destaque de patamar, holding e o plano mais longo.",
    r: { ...RESPOSTAS_INICIAIS, nome: "Beatriz", idade: 61, aporte: 30000, patrimonio: 6000000, imoveis: 4000000, objetivo: "renda", concerns: ["renda_ativos", "exterior", "sucessao", "diversificar"], momento: "consultoria", conhecimento: "intermediario" },
  },
  {
    id: "zerado",
    nome: "Tudo zerado",
    descricao: "Avançou sem mexer nos valores: sem comparação, sem gráfico, sem custo de adiar.",
    r: { ...RESPOSTAS_INICIAIS, nome: "Teste", idade: 42, aporte: 0, patrimonio: 0, imoveis: 0, objetivo: "crescer", concerns: [], momento: "comecando", conhecimento: "iniciante" },
  },
];
