import type { Premissas } from "./tipos";

/* Mesmos valores da v6 (bloco CONFIG do site atual). */

export const WHATSAPP_NUMBER = "556234139882";
export const WA_MSG = "Terminei de preencher o meu questionário da AUVP. Quero receber o meu resultado.";
export const WA_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(WA_MSG)}`;

/** Versão do payload e dos eventos. Mantida em v6 para não quebrar o mapeamento do n8n. */
export const VERSAO = "v6";

export const PREMISSAS: Premissas = { ret: 0.1425, infl: 0.045, aluguel: 0.004 };
/** Fração do aluguel bruto que sobra após IR, vacância e custos. */
export const ALUGUEL_LIQUIDO = 0.78;

export const SPECIALIST = { nome: "", cargo: "Especialista patrimonial AUVP", foto: "" };

export const PRESS = [
  {
    name: "Correio Braziliense",
    url: "https://www.correiobraziliense.com.br/colunistas/fabiano-moraes/2024/10/6967228-auvp-capital-proxima-da-lideranca-nacional-no-segmento-de-consultorias-financeiras-no-ranking-do-btg-pactual-auvp-capital-comemora.html",
  },
  {
    name: "Estado de Minas",
    url: "https://www.em.com.br/colunistas/fabiano-moraes/2024/10/6967224-auvp-capital-se-aproxima-da-lideranca-nacional-no-segmento-de-consultorias.html",
  },
  {
    name: "Jornal de Brasília",
    url: "https://jornaldebrasilia.com.br/entretenimento/katia-flavia/pelo-segundo-ano-seguido-auvp-conquista-premio-de-consultoria-no-1-do-ranking-btg-pactual/",
  },
  {
    name: "Economia S/A",
    url: "https://economiasa.com.br/blog/auvp-capital-e-eleita-a-melhor-consultoria-de-investimentos-do-brasil-pelo-btg-pactual/",
  },
];

/** Segundos até o celular abrir o WhatsApp sozinho no resultado. */
export const RD_SECS = 30;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export const MODO_REVISAO =
  process.env.NEXT_PUBLIC_MODO_REVISAO === "true" || process.env.NODE_ENV === "development";
