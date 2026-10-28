import { describe, expect, it } from "vitest";
import { conteudoB } from "@/conteudo/b";

/** Percorre todos os textos (chamando as funções com valores de exemplo). */
function textos(v: unknown, caminho = ""): [string, string][] {
  if (typeof v === "string") return [[caminho, v]];
  if (typeof v === "function") return textos((v as (...a: unknown[]) => unknown)(30, "R$ 1.000", 2, "R$ 2.000"), caminho + "()");
  if (Array.isArray(v)) return v.flatMap((x, i) => textos(x, `${caminho}[${i}]`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => textos(x, caminho ? `${caminho}.${k}` : k));
  return [];
}

const todos = textos(conteudoB);
const achados = (re: RegExp) => todos.filter(([, s]) => re.test(s)).map(([c, s]) => `${c}: ${s}`);

describe("copy da versão B segue o manual de tom e voz", () => {
  it("não usa travessão", () => expect(achados(/—/)).toEqual([]));
  it("não usa a palavra garantia", () => expect(achados(/garanti/i)).toEqual([]));
  it("não chama aluno de cliente", () => expect(achados(/\bcliente/i)).toEqual([]));
});

describe("copy da versão B passa na auditoria no-ai-slop", () => {
  // padrões apontados em docs/auditoria-no-ai-slop.md
  const PROIBIDOS: [string, RegExp][] = [
    ["advérbio vazio", /\b(exatamente|completamente|simplesmente|realmente)\b/i],
    ["estrangeirismo", /endereç|\bvs\.\s/i],
    ["provérbio no fim", /segundo melhor é hoje/i],
    ["metáfora vaga", /lado da mesa|virar o jogo|dorme tranquilo|o jogo é/i],
    ["metadiscurso", /em uma página só|na ordem certa\./i],
    ["atribuição vaga", /a maioria|mais comum|quase nunca/i],
    ["promessa que o produto não cumpre", /para quem enviar|abertas e auditáveis|nem de mercado|Depois dessa, o seu número/i],
  ];
  for (const [nome, re] of PROIBIDOS) {
    it(`sem ${nome}`, () => expect(achados(re)).toEqual([]));
  }

  it("confiança e Você sabia sem negrito decorativo", () => {
    const telas = Object.values(conteudoB.telas);
    expect(telas.filter((t) => /<b>/.test(t.confianca + (t.insight ?? ""))).map((t) => t.titulo)).toEqual([]);
  });
});
