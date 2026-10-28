import type { Variante } from "@/lib/diagnostico/tipos";
import { conteudoA } from "./a";
import { conteudoB } from "./b";
import type { Conteudo } from "./tipos";

/** O que muda de comportamento entre A e B. A versão A reproduz a v6. */
export interface Recursos {
  /** escolha única avança sozinha depois de marcar */
  autoAvanco: boolean;
  /** atalhos de valor (R$ 500, R$ 1 mil…) nas telas de dinheiro */
  atalhosValor: boolean;
  /** mostra o horizonte do plano (20 ou 15 anos) na tela de idade */
  horizonteIdade: boolean;
  /** prévia trancada do plano na tela de contato */
  previaContato: boolean;
  /** troca o encaminhamento automático de 30 s por um convite que não sai da página */
  fechamentoSuave: boolean;
}

export const VARIANTES: Record<Variante, { conteudo: Conteudo; recursos: Recursos }> = {
  a: {
    conteudo: conteudoA,
    recursos: { autoAvanco: false, atalhosValor: false, horizonteIdade: false, previaContato: false, fechamentoSuave: false },
  },
  b: {
    conteudo: conteudoB,
    recursos: { autoAvanco: true, atalhosValor: true, horizonteIdade: true, previaContato: true, fechamentoSuave: true },
  },
};
