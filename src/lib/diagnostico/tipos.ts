export type Objetivo = "crescer" | "renda" | "ambos";
export type Momento = "sozinho" | "consultoria" | "comecando";
export type Conhecimento = "iniciante" | "perdido" | "intermediario" | "avancado";
export type Preocupacao =
  | "dividas"
  | "comprar_imovel"
  | "proteger_familia"
  | "rentabilidade"
  | "diversificar"
  | "renda_ativos"
  | "exterior"
  | "sucessao"
  | "nenhum";

/** Passos lógicos do fluxo (FLOW da v6). "concerns" vira padrão ou patrimonial na hora de exibir. */
export type EtapaId =
  | "objetivo"
  | "idade"
  | "aporte"
  | "patrimonio"
  | "imoveis"
  | "concerns"
  | "momento"
  | "conhecimento"
  | "contato"
  | "result";

/** Tela que realmente aparece. */
export type TelaId = Exclude<EtapaId, "concerns"> | "concerns_padrao" | "concerns_pat";

export interface Respostas {
  objetivo: Objetivo | null;
  idade: number;
  aporte: number;
  patrimonio: number;
  imoveis: number;
  concerns: Preocupacao[];
  momento: Momento | null;
  conhecimento: Conhecimento | null;
  nome: string;
  whats: string;
  /** índice em PAISES */
  pais: number;
  email: string;
}

export interface Premissas {
  /** rentabilidade ao ano, em fração (0.1425 = 14,25%) */
  ret: number;
  infl: number;
  /** aluguel bruto ao mês, em fração do valor do imóvel */
  aluguel: number;
}

export type Variante = "a" | "b";
