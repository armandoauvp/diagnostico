import type { EtapaId, Respostas, TelaId } from "./tipos";
import { telefoneOk } from "./telefone";
import { IDADE } from "./valores";

export const FLOW: EtapaId[] = [
  "objetivo",
  "idade",
  "aporte",
  "patrimonio",
  "imoveis",
  "concerns",
  "momento",
  "conhecimento",
  "contato",
  "result",
];

export const RESPOSTAS_INICIAIS: Respostas = {
  objetivo: null,
  idade: IDADE.inicial,
  aporte: 0,
  patrimonio: 0,
  imoveis: 0,
  concerns: [],
  momento: null,
  conhecimento: null,
  nome: "",
  whats: "",
  pais: 0,
  email: "",
};

/** Quem vê as dores da versão patrimonial. */
export function isPatrimonial(r: Pick<Respostas, "patrimonio" | "imoveis">) {
  return r.patrimonio + r.imoveis >= 5_000_000 || r.patrimonio >= 1_000_000;
}

export function telaReal(etapa: EtapaId, r: Respostas): TelaId {
  if (etapa === "concerns") return isPatrimonial(r) ? "concerns_pat" : "concerns_padrao";
  return etapa;
}

/** "03 / 09". O resultado não entra na contagem. */
export function contador(idx: number) {
  const last = FLOW.length - 1;
  if (FLOW[idx] === "result") return "";
  const pad = (n: number) => (n < 10 ? "0" : "") + n;
  return pad(idx + 1) + " / " + pad(last);
}

export function progresso(idx: number) {
  return idx / (FLOW.length - 1);
}

/**
 * Avança (dir 1) ou volta (dir -1). Quem respondeu "Ninguém ainda" pula a
 * tela de conhecimento nos dois sentidos e fica marcado como iniciante.
 */
export function mover(idx: number, dir: 1 | -1, r: Respostas): { idx: number; respostas: Respostas } {
  const clamp = (n: number) => Math.max(0, Math.min(FLOW.length - 1, n));
  let i = clamp(idx + dir);
  let respostas = r;
  while (FLOW[i] === "conhecimento" && respostas.momento === "comecando") {
    respostas = { ...respostas, conhecimento: "iniciante" };
    i = clamp(i + dir);
  }
  return { idx: i, respostas };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const nomeOk = (nome: string) => nome.trim().length >= 2;
export const emailOk = (email: string) => EMAIL_RE.test(email.trim());

/** Só objetivo, quem cuida, nível e contato exigem resposta. */
export function etapaValida(etapa: EtapaId, r: Respostas) {
  switch (etapa) {
    case "objetivo":
      return !!r.objetivo;
    case "momento":
      return !!r.momento;
    case "conhecimento":
      return !!r.conhecimento;
    case "contato":
      return nomeOk(r.nome) && telefoneOk(r.whats, r.pais) && emailOk(r.email);
    default:
      return true;
  }
}

/**
 * Clique numa opção de múltipla escolha. "nenhum" é exclusivo. Como na v6, o
 * resultado só guarda o que está marcado na tela atual: se a pessoa trocou de
 * versão (padrão ↔ patrimonial), as marcações da outra caem no primeiro clique.
 */
export function alternaPreocupacao(
  atual: Respostas["concerns"],
  valor: Respostas["concerns"][number],
  opcoesDaTela: readonly Respostas["concerns"][number][],
) {
  if (valor === "nenhum") return ["nenhum"] as Respostas["concerns"];
  const sem = atual.filter((x) => x !== "nenhum" && opcoesDaTela.includes(x));
  return sem.includes(valor) ? sem.filter((x) => x !== valor) : [...sem, valor];
}
