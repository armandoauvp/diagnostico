import { primeiroNome, type Resultado } from "@/lib/diagnostico/calculo";
import type { Objetivo } from "@/lib/diagnostico/tipos";
import { fmt } from "@/lib/diagnostico/valores";
import { selicTxt } from "./a";
import type { Conteudo } from "./tipos";

export const escHtml = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type LinhaStat = { k: string; v: string; tom?: "gold" | "loss" };

/** Junta o resultado (números e chaves) com os textos da variante. */
export function montarTextos(res: Resultado, c: Conteudo, nome: string, objetivo: Objetivo | null) {
  const r = c.resultado;
  const primeiro = primeiroNome(nome);
  const faixa = r.hero[res.hero.faixa];
  const leadinBase = r.leadin[res.plano.leadin];

  const passos = res.plano.passos.map((p) => {
    const t = r.passos[p.id];
    const bruto = t.textos[p.variante];
    const texto = typeof bruto === "function" ? bruto(r.objTexto[objetivo ?? "ambos"] ?? "") : bruto;
    return { id: p.id, titulo: t.titulo, essencia: t.essencia, tag: t.tag, texto, selo: p.selo };
  });

  const stats: LinhaStat[] = [
    { k: r.stats.horizonte, v: r.stats.anos(res.anosBase) },
    { k: r.stats.aportar, v: fmt(res.aportado) },
    { k: r.stats.projetado, v: fmt(res.projetado), tom: "gold" },
    { k: r.stats.juros, v: fmt(res.projetado - res.aportado) },
    { k: r.stats.renda, v: fmt(res.rendaFinal) + r.stats.porMes, tom: "gold" },
    { k: r.stats.adiar, v: "− " + fmt(res.custoEspera), tom: "loss" },
  ];

  const imovel = res.imovel && {
    linhas: [
      { k: r.imovel.bruto, v: fmt(res.imovel.aluguel) + r.stats.porMes },
      { k: r.imovel.liquido, v: fmt(res.imovel.liquido) + r.stats.porMes },
      { k: r.imovel.investido, v: fmt(res.imovel.investido) + r.stats.porMes, tom: "gold" },
    ] as LinhaStat[],
    nota: res.imovel.diferenca > 0 ? r.imovel.notaMelhor(selicTxt, fmt(res.imovel.diferenca)) : r.imovel.notaDefende,
  };

  return {
    titulo: primeiro ? r.tituloComNome(primeiro) : r.headline[res.headline],
    perfil: res.perfilNome,
    heroLabel: faixa.label,
    heroNota: faixa.nota(res.hero.idadeFim, fmt(res.hero.apoio)),
    segundo: res.hero.segundo !== null ? { label: r.segundoLabel, valor: res.hero.segundo } : null,
    espera: res.mostraCustoEspera ? r.espera(fmt(res.custoEspera)) : "",
    perdaFinal: res.mostraCustoEspera ? r.perdaFinal(fmt(res.custoEspera)) : "",
    leadin: primeiro
      ? `<em>${escHtml(primeiro)}</em>, ` + leadinBase.charAt(0).toLowerCase() + leadinBase.slice(1)
      : leadinBase,
    callout: res.plano.callout ? { titulo: r.callout.titulo, texto: r.callout.texto(fmt(res.global)) } : null,
    passos,
    stats,
    imovel,
    split: res.split && r.split(fmt(res.aportado), res.split.pa, fmt(res.projetado - res.aportado), res.split.pj),
    comparacao: res.mostraComparacao
      ? {
          titulo: r.comparacao.titulo(primeiro),
          com: [
            { num: fmt(res.projetado), lbl: r.comparacao.comPatrimonio(res.anosBase) },
            { num: fmt(res.rendaFinal), lbl: r.comparacao.comRenda },
          ],
          sem: [
            { num: fmt(res.aportado), lbl: r.comparacao.semGuardado(res.anosBase) },
            { num: "R$ 0", lbl: r.comparacao.semRenda },
          ],
          diff: r.comparacao.diff(fmt(res.projetado - res.aportado)),
        }
      : null,
  };
}

export type Textos = ReturnType<typeof montarTextos>;
