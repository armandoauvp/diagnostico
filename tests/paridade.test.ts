import { describe, expect, it } from "vitest";
import { calcular } from "@/lib/diagnostico/calculo";
import { alternaPreocupacao, FLOW, isPatrimonial, mover, RESPOSTAS_INICIAIS, telaReal } from "@/lib/diagnostico/fluxo";
import type { Conhecimento, Momento, Objetivo, Preocupacao, Respostas } from "@/lib/diagnostico/tipos";
import { aplicaPasso, arredonda, paraValor } from "@/lib/diagnostico/valores";
import { conteudoA } from "@/conteudo/a";
import { montarTextos } from "@/conteudo/montar";
import { v6 } from "./v6-original";

/* Gera respostas pseudoaleatórias cobrindo as faixas que mudam regras. */
function rng(seed: number) {
  return () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
}
const pick = <T,>(r: () => number, xs: readonly T[]) => xs[Math.floor(r() * xs.length)];

const IDADES = [16, 25, 39, 40, 45, 49, 50, 62, 85];
const APORTES = [0, 100, 300, 500, 1000, 1500, 2500, 5000, 10000, 25000, 500000];
const PATRIMONIOS = [0, 5000, 10000, 29999, 30000, 50000, 70000, 100000, 150000, 300000, 500000, 999999, 1000000, 4000000, 6000000, 12000000];
const IMOVEIS = [0, 200000, 1999999, 2000000, 4000000, 5000000, 20000000];
const OBJ: (Objetivo | null)[] = ["crescer", "renda", "ambos", null];
const MOM: (Momento | null)[] = ["sozinho", "consultoria", "comecando", null];
const CON: (Conhecimento | null)[] = ["iniciante", "perdido", "intermediario", "avancado", null];
const PREOC: Preocupacao[] = ["dividas", "comprar_imovel", "proteger_familia", "rentabilidade", "diversificar", "renda_ativos", "exterior", "sucessao"];
const NOMES = ["", "Ana", "José da Silva", "<b>x</b> & y"];

function amostra(r: () => number): Respostas {
  const concerns = r() < 0.15 ? (["nenhum"] as Preocupacao[]) : PREOC.filter(() => r() < 0.3);
  return {
    ...RESPOSTAS_INICIAIS,
    idade: pick(r, IDADES),
    aporte: pick(r, APORTES),
    patrimonio: pick(r, PATRIMONIOS),
    imoveis: pick(r, IMOVEIS),
    objetivo: pick(r, OBJ),
    momento: pick(r, MOM),
    conhecimento: pick(r, CON),
    concerns,
    nome: pick(r, NOMES),
  };
}

describe("paridade com a v6", () => {
  it("resultado, textos, score e tags batem em 5.000 combinações", () => {
    const r = rng(42);
    for (let i = 0; i < 5000; i++) {
      const d = amostra(r);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const o = v6({ ...d }) as any;
      const res = calcular(d);
      const t = montarTextos(res, conteudoA, d.nome, d.objetivo);
      const ctx = JSON.stringify(d);

      // a classificação e o rótulo do número mudaram de texto nas correções de 16/11; a regra continua a da v6
      expect(res.perfilNome, ctx).toBe(o.plabel);
      expect(t.heroLabel, ctx).toBe(o.heroLabel.replace(/ em 20 anos$/, " em 20 anos investindo"));
      expect(t.heroNota, ctx).toBe(o.heroNote);
      expect(res.hero.valor, ctx).toBeCloseTo(o.heroBig, 6);
      expect(t.segundo?.valor ?? null, ctx).toBe(o.second?.value ?? null);
      expect(t.espera, ctx).toBe(o.waitLine);
      expect(t.perdaFinal, ctx).toBe(o.closingLoss);
      expect(t.leadin, ctx).toBe(o.leadin);
      expect(t.callout ? `${t.callout.titulo}|${t.callout.texto}` : "", ctx).toBe(o.callout);
      expect(
        t.passos.map((p) => ({ name: p.titulo, essence: p.essencia, copy: p.texto, guar: p.selo, tag: p.tag })),
        ctx,
      ).toEqual(o.paths);
      expect(t.stats.map((s) => [s.k, s.v]), ctx).toEqual(o.stats);
      expect(t.imovel ? { rows: t.imovel.linhas.map((l) => [l.k, l.v]), note: t.imovel.nota } : null, ctx).toEqual(o.imovel);
      expect(t.split, ctx).toEqual(o.split);
      expect(!!res.grafico, ctx).toBe(o.chart);
      expect(
        t.comparacao
          ? {
              title: t.comparacao.titulo,
              com: t.comparacao.com.flatMap((x) => [x.num, x.lbl]),
              sem: t.comparacao.sem.flatMap((x) => [x.num, x.lbl]),
              diff: t.comparacao.diff,
            }
          : null,
        ctx,
      ).toEqual(o.cmp);
      expect(t.titulo, ctx).toBe(o.rTitle);
      expect(res.score, ctx).toBe(o.score);
      expect(res.tier.label, ctx).toBe(o.tier);
      expect(res.tags, ctx).toEqual(o.tags);
      expect(Math.round(res.projetado), ctx).toBe(o.patrimonio_projetado);
      expect(Math.round(res.rendaFinal), ctx).toBe(o.renda_projetada_mensal);
    }
  });
});

describe("fluxo", () => {
  it("pula conhecimento para quem está começando, nos dois sentidos", () => {
    const r = { ...RESPOSTAS_INICIAIS, momento: "comecando" as const };
    const idxMomento = FLOW.indexOf("momento");
    const ida = mover(idxMomento, 1, r);
    expect(FLOW[ida.idx]).toBe("contato");
    expect(ida.respostas.conhecimento).toBe("iniciante");
    expect(FLOW[mover(FLOW.indexOf("contato"), -1, r).idx]).toBe("momento");
  });

  it("escolhe a versão das dores pelo patrimônio", () => {
    const base = RESPOSTAS_INICIAIS;
    expect(telaReal("concerns", { ...base, patrimonio: 999_999 })).toBe("concerns_padrao");
    expect(telaReal("concerns", { ...base, patrimonio: 1_000_000 })).toBe("concerns_pat");
    expect(telaReal("concerns", { ...base, patrimonio: 100_000, imoveis: 4_900_000 })).toBe("concerns_pat");
    expect(isPatrimonial({ patrimonio: 0, imoveis: 4_999_999 })).toBe(false);
  });

  it("'nada disso' é exclusivo", () => {
    const opts = ["dividas", "comprar_imovel", "proteger_familia", "nenhum"] as const;
    expect(alternaPreocupacao(["dividas"], "nenhum", opts)).toEqual(["nenhum"]);
    expect(alternaPreocupacao(["nenhum"], "dividas", opts)).toEqual(["dividas"]);
    expect(alternaPreocupacao(["dividas", "comprar_imovel"], "dividas", opts)).toEqual(["comprar_imovel"]);
  });

  it("sliders seguem a mesma escala", () => {
    expect(arredonda(paraValor("aporte", 1))).toBe(500_000);
    expect(arredonda(paraValor("aporte", 0))).toBe(0);
    expect(aplicaPasso("aporte", 0, 1)).toBe(500);
    expect(aplicaPasso("aporte", 10_000, -1)).toBe(9500);
    expect(aplicaPasso("aporte", 10_000, 1)).toBe(15_000);
  });
});
