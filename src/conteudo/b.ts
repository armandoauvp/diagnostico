import { PREMISSAS } from "@/lib/diagnostico/config";
import { conteudoA, selicTxt } from "./a";
import type { Conteudo, TelaTexto } from "./tipos";

/*
 * Versão B: proposta. Parte dos textos da A e ajusta:
 *  1. o que bate de frente com o manual de tom e voz (Central › Tom e Voz):
 *     travessão, "garantia", "cliente", autoridade como o manual escreve;
 *  2. os padrões da auditoria no-ai-slop (docs/auditoria-no-ai-slop.md):
 *     contraste binário, frase de efeito no fim, dois-pontos dramático,
 *     metadiscurso, atribuição vaga, negrito decorativo e promessas que o
 *     produto não cumpre.
 * Cada mudança está em docs/versao-b.md.
 */

const A = conteudoA;
const r = A.resultado;
const inflTxt = (Math.round(PREMISSAS.infl * 1000) / 10).toString().replace(".", ",");

/** Linhas de confiança e "Você sabia?" sem negrito (era decorativo). */
const semNegrito = (s?: string) => s?.replace(/<\/?b>/g, "");

type Telas = Conteudo["telas"];
const telas: Telas = {
  objetivo: {
    ...A.telas.objetivo,
    sub: "Responda algumas perguntas e veja, em números, quanto patrimônio e quanta renda o seu dinheiro pode gerar.",
    confianca: "A AUVP é a maior escola de investimento do país.",
  },
  idade: { ...A.telas.idade },
  aporte: {
    ...A.telas.aporte,
    sub: "Use o número real. Nossos consultores planejam com fatos.",
    insight: "Aportes menores e regulares, reinvestidos, tendem a render mais que aportes grandes e esporádicos.",
  },
  patrimonio: {
    ...A.telas.patrimonio,
    sub: "Some renda fixa, fundos, ações, previdência e cripto. Um valor aproximado já basta. Esse dado fica sob sigilo e serve só para calcular o seu plano.",
    // 2% a.a. sobre a carteira deste diagnóstico (Selic 14,25%) por 30 anos: ~41% a menos no final
    insight: "Uma taxa de 2% ao ano parece pouco, mas em 30 anos pode levar cerca de 40% do patrimônio final.",
  },
  imoveis: {
    ...A.telas.imoveis,
    sub: "Casa própria conta. No resultado, mostramos uma comparação que nossos consultores fazem em toda análise patrimonial.",
    confianca: "Analisamos o patrimônio completo, com os imóveis.",
    insight: "Imóvel é patrimônio, mas é pouco líquido. Contar com ele para imprevistos costuma sair caro.",
  },
  concerns_padrao: {
    ...A.telas.concerns_padrao,
    sub: "Marque com sinceridade. Cada resposta muda a recomendação que você recebe no final.",
    // a linha de confiança repetia o texto acima
    confianca: "",
    insight: 'Quem acha que "não consegue investir" muitas vezes tem um problema de método e de prioridades. Isso dá para resolver.',
  },
  concerns_pat: {
    ...A.telas.concerns_pat,
    sub: "Marque o que fizer sentido. É isso que o seu especialista vai resolver primeiro.",
    confianca: "Patrimônios de todos os portes, com o mesmo cuidado.",
    insight: "Patrimônio grande traz problemas próprios: imposto, sucessão e concentração.",
  },
  momento: {
    ...A.telas.momento,
    sub: "Essa resposta muda os passos do seu plano.",
    confianca: "Se não fizer sentido para você, devolvemos 100% do seu dinheiro.",
    insight: "Quem investe sozinho costuma pagar taxas invisíveis no banco. Muitas vezes, o primeiro ganho é parar de perder.",
  },
  conhecimento: {
    ...A.telas.conhecimento,
    sub: "Sem modéstia e sem vergonha. Sua resposta muda o que vamos recomendar.",
    confianca: "Cada nível recebe um plano diferente.",
    insight: "Para investir bem, basta um método que você repete todo mês e alguém para revisar as decisões grandes.",
  },
  contato: {
    ...A.telas.contato,
    titulo: "Seu plano está pronto.",
    sub: "Diga quem é você para ver o plano. Um especialista AUVP revisa o seu caso e orienta os próximos passos, sem custo e sem compromisso.",
    botao: "Ver meu plano",
  },
};
for (const k of Object.keys(telas) as (keyof Telas)[]) {
  const t: TelaTexto = telas[k];
  telas[k] = { ...t, confianca: semNegrito(t.confianca) ?? "", insight: semNegrito(t.insight) };
}

export const conteudoB: Conteudo = {
  ...A,
  marca: { titulo: "AUVP · Diagnóstico patrimonial", nome: "Diagnóstico patrimonial" },

  extras: {
    atalhos: {
      aporte: [500, 1000, 2000, 5000, 10000],
      patrimonio: [10000, 50000, 100000, 500000, 1000000],
      imoveis: [0, 300000, 500000, 1000000, 3000000],
    },
    atalhoZero: "Não tenho",
    horizonte: (anos, idadeFim) => `Seu plano vai olhar para os próximos <b>${anos} anos</b>, até os ${idadeFim}.`,
    previa: {
      titulo: "Já está pronto no seu plano",
      itens: ["O seu número", "Os seus dois futuros", "O plano, passo a passo", "Os números por trás"],
      trancado: "abre quando você continuar",
    },
    convite: {
      texto: "Fale com um especialista sobre o seu plano pelo WhatsApp.",
      botao: "Falar agora",
      fechar: "Agora não",
    },
  },

  telas,

  contato: {
    ...A.contato,
    erroWhats: "Confira o número, parece incompleto.",
    selo: "Dados criptografados, tratados conforme a LGPD e nunca vendidos. E se o que você contratar com a gente não fizer sentido, devolvemos 100% do seu dinheiro.",
  },

  calculando: {
    ...A.calculando,
    sub: "Estamos cruzando as suas respostas com a Selic de hoje e a inflação estimada.",
    confianca: `Simulação com Selic de ${selicTxt}% e inflação de ${inflTxt}% ao ano.`,
  },

  resultado: {
    ...r,
    chegadaSub: "",
    hero: {
      menos40: {
        label: r.hero.menos40.label,
        nota: (idadeFim, renda) => `Aos ${idadeFim}, são cerca de <b>${renda} por mês</b> sem encostar no principal.`,
      },
      "40a49": {
        label: r.hero["40a49"].label,
        nota: (idadeFim, acumulado) =>
          `Aos ${idadeFim}, um salário que cai todo mês, para sempre, sem depender de chefe. Sobre cerca de <b>${acumulado}</b> acumulados.`,
      },
      "50mais": {
        label: r.hero["50mais"].label,
        nota: () => "Pode virar renda <b>agora</b>, sem vender o que você construiu, e cresce mais em 15 anos mantendo os aportes.",
      },
    },
    comparacao: {
      ...r.comparacao,
      diff: (valor) => `Com o plano, você termina com <b>${valor}</b> a mais.`,
    },
    leadin: {
      padrao: "O que falta é <em>método</em>, e método se aprende.",
      privado: "Daqui em diante, o foco é <em>preservar e transferir</em>.",
    },
    callout: {
      titulo: "Três estruturas para o seu patamar",
      texto: (global) =>
        `Com cerca de ${global} em patrimônio global, o que define quanto você mantém é como você se organiza: holding para a renda dos imóveis e a sucessão, conta internacional para investir fora com segurança, e um especialista que conhece o seu caso pelo nome. É essa a conversa que ele vai conduzir com você.`,
    },
    passos: {
      escola: {
        ...r.passos.escola,
        essencia: "O critério para decidir sem depender de ninguém, nem de nós.",
        textos: {
          padrao: r.passos.escola.textos.padrao,
          altoValor:
            "Quanto maior o patrimônio, mais caro sai cada decisão delegada às cegas. Por isso recomendamos estudar primeiro. Na Escola você aprende a <b>avaliar qualquer recomendação que receber, inclusive as nossas</b>.",
          renda:
            "Viver de renda é uma habilidade. Na Escola você aprende a <b>construir e gerir a própria carteira de renda</b>: escolher pagadores, reinvestir e declarar. Assim a renda depende de você, e não de quem te vende.",
          avancado:
            "Você quer profissionalizar como investe. Para o seu nível, o valor está nos <b>módulos avançados e nas lives semanais</b>: internacional, proteção de carteira, otimização tributária.",
          intermediario:
            "Você já investe, mas sente falta de <b>consistência e clareza</b>, e isso costuma ser falta de método. A Escola organiza o que você já faz num processo só, do aporte à declaração, para o resultado parar de depender de sorte.",
          perdido:
            "Você já tentou e travou no caminho. É comum, e dá para resolver. A Escola te dá <b>um passo a passo do zero ao avançado</b>, na ordem certa, para você não se perder de novo e seguir sozinho.",
          dividas:
            "Você marcou dívidas, então o primeiro passo é sair dos juros. Na Escola você <b>reorganiza o orçamento</b>, monta a estratégia para quitar o que é caro e aprende a investir o que sobra.",
        },
      },
      plataforma: {
        ...r.passos.plataforma,
        titulo: "Ficar com o aluguel das suas ações",
        essencia: "Aluguel das ações de verdade e renda fixa sem taxa escondida.",
        textos: {
          padrao:
            "Nas corretoras tradicionais, você fica com cerca de <b>30% do aluguel das suas próprias ações</b>. Na renda fixa, o spread embutido no preço corrói o retorno sem aparecer em extrato nenhum. Na plataforma AUVP, <b>você recebe o aluguel das suas ações</b>, e o preço da renda fixa é o que você vê, sem taxa escondida.",
        },
      },
      consultoria: {
        ...r.passos.consultoria,
        textos: {
          padrao: (objTxt: string) =>
            `Com o critério da Escola, um consultor dedicado te devolve <b>tempo e execução</b>: monta e acompanha sua carteira, define a alocação certa para ${objTxt}, rebalanceia quando o mercado muda e corta custos e impostos escondidos. Ele responde a você, não a um banco que ganha comissão sobre o que te vende.`,
          rentabilidade:
            "Você sente que seu dinheiro rende menos do que poderia, e provavelmente está certo. Com o critério que a Escola te dá, um consultor dedicado <b>audita sua carteira atual</b>, encontra as taxas e produtos que corroem seu retorno e remonta a alocação para extrair mais do mesmo patrimônio, com risco sob controle.",
          diversificar:
            "Concentrar o patrimônio em poucos ativos, num banco só ou em imóveis aumenta o risco. Um consultor dedicado <b>redistribui seu patrimônio</b> entre classes, moedas e geografias, e você valida cada movimento.",
          renda_ativos:
            "Para transformar patrimônio em renda, um consultor dedicado <b>desenha esse fluxo</b> para a sua vida: ativos pagadores certos, vencimentos escalonados e imposto otimizado em cada real recebido.",
        },
      },
      credito: {
        ...r.passos.credito,
        textos: {
          padrao:
            "Nossa equipe <b>disputa sua taxa em mais de 20 bancos</b> e traz a melhor condição de financiamento. Assim seu capital continua investido e rendendo, em vez de sair de uma vez. Você compara as propostas e escolhe; a negociação é por nossa conta.",
        },
      },
      protecao: {
        ...r.passos.protecao,
        textos: {
          padrao:
            "Mapeamos o que sua família precisaria se você faltasse e <b>estruturamos o seguro certo</b>: cobertura na medida, sem pagar por excesso.",
        },
      },
      internacional: r.passos.internacional,
      estruturacao: {
        ...r.passos.estruturacao,
        textos: {
          padrao:
            "Estruturamos sua <b>holding patrimonial</b>. A renda dos imóveis passa a ser tributada como empresa (em geral bem menos que na pessoa física), e a herança fica organizada em vida, sem inventário longo, caro e público para a sua família.",
        },
      },
    },
    seloPasso: "100% do dinheiro de volta se não fizer sentido",
    imovel: {
      ...r.imovel,
      titulo: "Seu imóvel comparado ao mesmo valor investido",
      notaMelhor: (selic, dif) =>
        `Com a Selic em ${selic}%, o mesmo valor investido renderia cerca de ${dif} a mais por mês, com liquidez e sem inquilino. Não é uma recomendação de venda. Vale analisar com um especialista.`,
    },
    perdaFinal: (custo) => `Cada ano de espera tira cerca de <b>${custo}</b> do seu resultado final.`,
    cta: {
      ...r.cta,
      ponte: "Fale com um especialista pelo WhatsApp para colocar o plano em prática.",
      nota: "Seu especialista já recebe este diagnóstico completo, então você não repete nada. E se o que você contratar não fizer sentido, <b>devolvemos 100% do seu dinheiro</b>.",
    },
    saida: {
      ...r.saida,
      texto: "Que tal pegar a opinião de um especialista sobre o seu resultado? Leva poucos minutos.",
    },
  },
};
