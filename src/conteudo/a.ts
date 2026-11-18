import { PREMISSAS } from "@/lib/diagnostico/config";
import type { Conteudo } from "./tipos";

/*
 * Versão A: os textos de hoje (v6).
 * Exceções: resultado.chegadaSub, que citava o "toque para revelar", e as
 * correções de 16/11/2026 (PDF "Correções Diagnóstico Financeiro"), que valem
 * para as duas versões: confiança das telas 1 e 2, "financeiro", "investindo",
 * frase do perfil e texto da devolução.
 */

export const selicTxt = (Math.round(PREMISSAS.ret * 10000) / 100).toString().replace(".", ",");

export const conteudoA: Conteudo = {
  // nome: era o sobretítulo da abertura ("Diagnóstico patrimonial AUVP"); foi para o topo, ao lado da logo
  marca: { titulo: "AUVP — Diagnóstico patrimonial", nome: "Diagnóstico patrimonial" },

  // Camada nova do design (não existe na v6): rótulos do painel que acompanha as respostas.
  painel: {
    titulo: "Seu plano",
    status: "em construção",
    statusPronto: "pronto",
    linhas: {
      objetivo: "Objetivo",
      idade: "Idade",
      aporte: "Por mês",
      patrimonio: "Investido",
      imoveis: "Imóveis",
      concerns: "Seu momento",
      momento: "Quem cuida",
      conhecimento: "Seu nível",
      numero: "Seu número",
    },
    porMes: "/mês",
    anos: "anos",
    marcadas: (n) => (n === 1 ? "1 marcada" : `${n} marcadas`),
    aoFinal: "ao final",
  },

  intro: {
    destaques: [
      ["9", "etapas rápidas"],
      ["~2 min", "para concluir"],
      ["Seu plano financeiro", "ao final"],
    ],
  },

  // Sobretítulos removidos por serem redundantes (título, contador ou selo do resultado já dizem o mesmo):
  // "Sobre você", "Capacidade", "Ponto de partida", "Imóveis", "Seu momento" (2x), "Última pergunta",
  // "Seu nível", "Diagnóstico concluído" (contato), "Um instante" (cálculo) e "Diagnóstico patrimonial AUVP"
  // (abertura), que virou o nome no topo.
  telas: {
    objetivo: {
      titulo: "O que o seu dinheiro precisa fazer por você?",
      sub: "Toda boa decisão de dinheiro começa pela vida que você quer. Responda algumas perguntas e veja, em números, até onde o seu caminho leva hoje — e o que muda a rota.",
      confianca: "",
      botao: "Começar meu diagnóstico",
    },
    idade: {
      titulo: "Quantos anos você tem?",
      sub: "É a variável que mais pesa no seu plano: define quanto tempo os juros compostos têm para trabalhar a seu favor.",
      confianca: "",
      insight:
        "Pelos juros compostos, cada década de antecedência pode mais que dobrar o resultado final. <b>Tempo costuma pesar mais do que o tamanho do aporte.</b>",
    },
    aporte: {
      titulo: "Quanto você consegue investir por mês?",
      sub: "Use o número real. Nossos consultores planejam com fatos — um plano honesto vale mais que uma meta inflada.",
      confianca: "Eleita <b>2x a melhor consultoria do Brasil</b> pelo BTG Pactual.",
      insight:
        "Constância vence intensidade: aportes menores e <b>regulares</b>, reinvestidos, tendem a superar aportes grandes e esporádicos.",
    },
    patrimonio: {
      titulo: "Quanto você já tem investido hoje?",
      sub: "Some renda fixa, fundos, ações, previdência e cripto — um valor aproximado já basta. Esse dado fica sob sigilo e serve só para calcular o seu plano.",
      confianca: "Dados criptografados, tratados conforme a <b>LGPD</b>.",
      insight:
        "Uma taxa de 2% ao ano parece inofensiva, mas em algumas décadas pode consumir uma fatia enorme do patrimônio. <b>No longo prazo, custo corrói mais que volatilidade.</b>",
    },
    imoveis: {
      titulo: "E em imóveis, quanto você tem?",
      sub: "Casa própria conta. No seu resultado, vou mostrar uma comparação que nossos consultores fazem em toda análise patrimonial.",
      confianca: "Analisamos o <b>patrimônio completo</b> — não só o que está na bolsa.",
      insight:
        "Imóvel é patrimônio, mas é pouco líquido — contar com ele para imprevistos costuma sair caro. Por isso olhamos o <b>conjunto</b>, não só a bolsa.",
    },
    concerns_padrao: {
      titulo: "O que tira o seu sono hoje?",
      sub: "Marque com sinceridade — cada resposta muda a recomendação que você recebe no final.",
      confianca: "Quanto mais específico você for, <b>mais precisa a recomendação</b>.",
      insight:
        'Quem acha que "não consegue investir" quase nunca tem um problema de renda: tem um problema de <b>método e de prioridades</b>. Isso dá para resolver.',
    },
    concerns_pat: {
      titulo: "O que o seu patrimônio ainda não resolveu?",
      sub: "Marque o que fizer sentido. É exatamente isso que o seu especialista vai endereçar primeiro.",
      confianca: "Patrimônios de todos os portes — <b>com a mesma garantia</b>.",
      insight:
        "Patrimônio grande traz problemas diferentes: imposto, sucessão e concentração. A maior perda costuma ser <b>o que não foi estruturado a tempo</b>.",
    },
    momento: {
      titulo: "Quem cuida do seu dinheiro hoje?",
      sub: "Uma das respostas mais reveladoras para o seu consultor. Depois dessa, o seu número.",
      confianca: "<b>Garantia incondicional</b>: 100% do dinheiro de volta.",
      insight:
        "Quem investe sozinho costuma pagar taxas invisíveis no banco. Muitas vezes o primeiro ganho não é render mais — é <b>parar de perder</b>.",
    },
    conhecimento: {
      titulo: "Quanto você entende de investimentos hoje?",
      sub: "Sem modéstia e sem vergonha — isso muda completamente o que vamos recomendar.",
      confianca: "Cada nível recebe um plano diferente — <b>o seu</b>.",
      insight:
        "Você não precisa virar especialista. Precisa de um <b>método replicável</b> e de alguém para revisar as decisões que pesam.",
    },
    contato: {
      titulo: "Seu plano está calculado e protegido.",
      sub: "Ele já é seu — falta só dizer para quem enviar. Um especialista AUVP revisa o seu caso e orienta os próximos passos, sem custo e sem compromisso.",
      confianca: "Eleita <b>2x a melhor consultoria do Brasil</b> pelo BTG Pactual.",
      botao: "Revelar meu plano",
    },
  },

  opcoes: {
    objetivo: [
      { val: "crescer", titulo: "Construir um patrimônio sólido", apoio: "Investir com inteligência para o futuro" },
      { val: "renda", titulo: "Criar renda passiva", apoio: "Novas fontes de renda caindo todo mês" },
      { val: "ambos", titulo: "Os dois", apoio: "Crescer agora, viver de renda depois" },
    ],
    concerns_padrao: [
      { val: "dividas", titulo: "Dívidas que não me deixam avançar", apoio: "Cartão, empréstimo, financiamento caro" },
      { val: "comprar_imovel", titulo: "Quero conquistar um imóvel", apoio: "Comprar ou financiar" },
      { val: "proteger_familia", titulo: "Medo de faltar para a minha família", apoio: "Quero segurança diante de um imprevisto" },
      { val: "nenhum", titulo: "Nada disso por enquanto", apoio: "" },
    ],
    concerns_pat: [
      { val: "rentabilidade", titulo: "Render mais do que rende hoje", apoio: "Sinto que meu dinheiro trabalha abaixo do potencial" },
      { val: "diversificar", titulo: "Sair da concentração", apoio: "Poucos ativos, um banco só, ou tudo em imóveis" },
      { val: "renda_ativos", titulo: "Virar renda de verdade", apoio: "Fazer o que construí pagar a minha vida" },
      { val: "exterior", titulo: "Proteger fora do Brasil", apoio: "Dolarizar, conta internacional, offshore" },
      { val: "sucessao", titulo: "Impostos e herança", apoio: "Holding, sucessão organizada, pagar menos imposto" },
      { val: "nenhum", titulo: "Nada disso por enquanto", apoio: "" },
    ],
    momento: [
      { val: "sozinho", titulo: "Eu mesmo", apoio: "Invisto por conta própria" },
      { val: "consultoria", titulo: "Banco ou consultoria", apoio: "Alguém investe por mim" },
      { val: "comecando", titulo: "Ninguém ainda", apoio: "Está parado ou estou começando agora" },
    ],
    conhecimento: [
      { val: "iniciante", titulo: "Sou iniciante e quero aprender", apoio: "Sei pouco ou estou começando agora" },
      { val: "perdido", titulo: "Já tentei, mas me perdi no caminho", apoio: "Comecei e travei em algum ponto" },
      { val: "intermediario", titulo: "Já invisto, mas sem consistência ou clareza", apoio: "Faço, mas sinto que poderia ser muito melhor" },
      { val: "avancado", titulo: "Quero profissionalizar como invisto", apoio: "Domino o básico, busco o próximo nível" },
    ],
  },

  valores: {
    dica: "Arraste, use − e +, ou toque no valor acima para digitar",
    pontas: {
      aporte: ["R$ 0", "sem teto"],
      patrimonio: ["R$ 0", "sem teto"],
      imoveis: ["Não tenho", "sem teto"],
    },
    unidadeIdade: "anos",
  },

  contato: {
    nome: "Seu nome",
    whats: "WhatsApp com DDD",
    email: "E-mail",
    erroWhats: "Confira o número — parece incompleto.",
    selo: "Dados criptografados, tratados conforme a <b>LGPD</b> e nunca vendidos. Se você não ficar satisfeito, nós devolvemos <b>100% do seu dinheiro</b> após a emissão do certificado!",
    paisOutro: "Outro",
  },

  calculando: {
    titulo: "Montando o seu plano…",
    sub: "Estamos cruzando as suas respostas com o cenário atual.",
    etapas: [
      `Calculando com a Selic vigente (${selicTxt}% a.a.)`,
      "Cruzando com o seu objetivo e horizonte",
      "Selecionando os passos para o seu perfil",
    ],
    confianca: "Simulação com premissas <b>abertas e auditáveis</b>.",
  },

  insightRotulo: "Você sabia?",

  resultado: {
    selo: "Diagnóstico concluído",
    perfilFrase: {
      patrimonial: "Você tem um <b>perfil patrimonial</b>",
      construtor: "Você é um <b>construtor de patrimônio</b>",
      transicao: "Você está <b>em transição para a renda</b>",
      gerador: "Você é um <b>gerador de renda</b>",
    },
    tituloComNome: (nome) => `${nome}, aqui está o seu plano`,
    headline: {
      privado: "Seu retrato patrimonial",
      pat: "Seu plano",
      acumulo: "Sua fase de acúmulo",
      renda: "Seu retrato de renda",
      caminho: "Seu caminho até a renda",
    },
    // era: "...Desça no seu ritmo — cada parte do seu plano aparece quando você chega nela."
    chegadaSub: "Está tudo aqui, em uma página só. Desça no seu ritmo.",
    hero: {
      menos40: {
        label: "Patrimônio que você pode construir em 20 anos investindo",
        nota: (idadeFim, renda) =>
          `Aos ${idadeFim}, são cerca de <b>${renda} por mês</b> sem encostar no principal — a liberdade de decidir se ainda <i>quer</i> trabalhar.`,
      },
      "40a49": {
        label: "Renda mensal que você pode ter em 15 anos",
        nota: (idadeFim, acumulado) =>
          `Aos ${idadeFim} — um salário que cai todo mês, para sempre, e não depende de chefe nem de mercado. Sobre cerca de <b>${acumulado}</b> acumulados.`,
      },
      "50mais": {
        label: "Renda mensal que seu patrimônio já pode gerar",
        nota: () =>
          "Pode virar renda <b>agora</b>, sem vender o que você construiu — e crescer ainda mais em 15 anos mantendo os aportes.",
      },
    },
    segundoLabel: "E em 15 anos, mantendo os aportes",
    espera: (custo) => `Adiar o início em 12 meses custa cerca de <b>${custo}</b> do seu resultado final.`,
    comparacao: {
      titulo: (nome) => (nome ? `${nome}, os seus dois futuros de relance` : "Os seus dois futuros, de relance"),
      com: "Com um plano",
      sem: "Sem um plano",
      comPatrimonio: (anos) => `patrimônio em ${anos} anos`,
      comRenda: "de renda, todo mês",
      semGuardado: (anos) => `guardado em ${anos} anos`,
      semRenda: "de renda que se sustenta",
      diff: (valor) => `O plano coloca <b>+ ${valor}</b> no seu lado da mesa.`,
      legendaPlano: "Seguindo o plano",
      legendaGuardado: "Guardando sem investir",
      eixoHoje: "hoje",
      eixoFim: (anos) => `em ${anos} anos`,
    },
    planoTitulo: "O plano que recomendamos",
    leadin: {
      padrao: "A matemática está do seu lado. O que falta é <em>método</em> — e método se aprende.",
      privado: "Daqui em diante, o jogo é <em>preservar e transferir</em>. Os passos abaixo estão na ordem certa.",
    },
    callout: {
      titulo: "No seu patamar, estrutura preserva mais do que rentabilidade.",
      texto: (global) =>
        `Com cerca de ${global} em patrimônio global, o que define quanto você mantém é como você se organiza: holding para a renda dos imóveis e a sucessão, conta internacional para investir fora com segurança, e um especialista que conhece o seu caso pelo nome. É exatamente essa conversa que ele vai conduzir com você.`,
    },
    objTexto: {
      renda: "a renda que você quer",
      crescer: "o patrimônio que você projeta",
      ambos: "crescer agora e viver de renda no destino",
    },
    passos: {
      escola: {
        titulo: "Aprender a fazer por conta própria",
        tag: "Escola",
        essencia: "O critério para nunca mais depender de ninguém — nem de nós.",
        textos: {
          padrao:
            "Em 8 semanas, você sai do zero e aprende a <b>investir por conta própria</b>, no Brasil e no exterior: montar carteira, escolher ativos, declarar imposto e nunca mais depender de gerente de banco. Método que já formou mais de 36 mil investidores.",
          altoValor:
            "Pode parecer estranho uma consultoria recomendar que você estude primeiro — é proposital. Quanto maior o patrimônio, mais caro sai cada decisão delegada às cegas. Na Escola você aprende a <b>avaliar qualquer recomendação que receber — inclusive as nossas</b>. Cliente educado ninguém engana, e é com ele que fazemos o melhor trabalho.",
          renda:
            "Viver de renda é uma habilidade, não um produto que se compra. Na Escola você aprende a <b>construir e gerir a própria carteira de renda</b> — escolher pagadores, reinvestir e declarar — para que a renda dependa de você, e não de quem te vende.",
          avancado:
            "Você quer profissionalizar como investe — e é aqui que a maioria estaciona. Para o seu nível, o valor está nos <b>módulos avançados e nas lives semanais</b>: internacional, proteção de carteira, otimização tributária. Investidor que para de estudar vira investidor mediano.",
          intermediario:
            "Você já investe, mas sente falta de <b>consistência e clareza</b> — e isso quase nunca é falta de informação, é falta de método. A Escola organiza o que você já faz num processo só, do aporte à declaração, para o resultado parar de depender de sorte.",
          perdido:
            "Você já tentou e travou no caminho — é o ponto mais comum, e o mais resolvível. A Escola te dá <b>um passo a passo do zero ao avançado</b>, na ordem certa, para você não se perder de novo e finalmente seguir sozinho.",
          dividas:
            "Você marcou dívidas — e o primeiro passo não é pegar mais crédito, é <b>virar o jogo do seu dinheiro</b>: na Escola você reorganiza o orçamento, monta a estratégia para sair dos juros e aprende a investir o que libera. É a base de tudo.",
        },
      },
      plataforma: {
        titulo: "Investir onde você não é o produto",
        tag: "Plataforma AUVP",
        essencia: "O aluguel das suas ações de verdade — e renda fixa sem taxa escondida.",
        textos: {
          padrao:
            "Nas corretoras tradicionais, você fica com cerca de <b>30% do aluguel das suas próprias ações</b> — e nos bancos digitais elas mal são alugadas. Na renda fixa, o spread embutido no preço corrói o retorno sem aparecer em extrato nenhum. Na plataforma AUVP é diferente: <b>o aluguel das suas ações trabalha para você</b>, e o preço da renda fixa é o que você vê — sem taxa escondida.",
        },
      },
      consultoria: {
        titulo: "Um consultor conduzindo com você",
        tag: "Consultoria",
        essencia: "Execução profissional do plano, respondendo só a você.",
        textos: {
          padrao: (objTxt) =>
            `A educação te dá o critério; um consultor dedicado te devolve <b>tempo e execução</b>: monta e acompanha sua carteira, define a alocação certa para ${objTxt}, rebalanceia quando o mercado muda e corta custos e impostos escondidos — respondendo a você, não a um banco que ganha comissão sobre o que te vende.`,
          rentabilidade:
            "Você sente que seu dinheiro rende menos do que poderia — e provavelmente está certo. Com o critério que a Escola te dá, um consultor dedicado <b>audita sua carteira atual</b>, encontra as taxas e produtos que corroem seu retorno, e remonta a alocação para extrair mais do mesmo patrimônio, com risco sob controle.",
          diversificar:
            "Concentração é o risco silencioso: poucos ativos, um banco só, ou tudo em imóveis. Um consultor dedicado <b>redistribui seu patrimônio</b> entre classes, moedas e geografias — e você, educado, entende e valida cada movimento.",
          renda_ativos:
            "Transformar patrimônio em renda é uma engenharia: ativos pagadores certos, vencimentos escalonados, imposto otimizado em cada real recebido. Um consultor dedicado <b>desenha esse fluxo de renda</b> para a sua vida — e você, sabendo avaliar, dorme tranquilo.",
        },
      },
      credito: {
        titulo: "Conquistar o imóvel sem se descapitalizar",
        tag: "Crédito",
        essencia: "A melhor taxa entre 20+ bancos, sem gastar o capital.",
        textos: {
          padrao:
            "Nossa equipe <b>disputa sua taxa em mais de 20 bancos</b> e traz a melhor condição de financiamento — assim seu capital continua investido e rendendo, em vez de sair de uma vez. Você compara as propostas e escolhe; a negociação é por nossa conta.",
        },
      },
      protecao: {
        titulo: "Proteger quem depende de você",
        tag: "Proteção",
        essencia: "Um imprevisto não pode desfazer o plano.",
        textos: {
          padrao:
            "Mapeamos o que sua família precisaria se você faltasse e <b>estruturamos o seguro certo</b> — cobertura na medida, sem pagar por excesso. O patrimônio cresce com tempo; a proteção precisa existir desde o primeiro dia.",
        },
      },
      internacional: {
        titulo: "Patrimônio com passaporte",
        tag: "Internacional",
        essencia: "Parte do patrimônio em moeda forte, com estrutura.",
        textos: {
          padrao:
            "Abrimos sua <b>conta internacional de investimentos</b> e estruturamos a dolarização de parte do patrimônio: acesso aos mercados globais, proteção contra o risco Brasil e, quando faz sentido, estrutura offshore eficiente em imposto e sucessão.",
        },
      },
      estruturacao: {
        titulo: "Pagar menos imposto e organizar a sucessão",
        tag: "Estruturação",
        essencia: "Menos imposto hoje, herança organizada em vida.",
        textos: {
          padrao:
            "Estruturamos sua <b>holding patrimonial</b>: a renda dos imóveis passa a ser tributada como empresa (em geral bem menos que na pessoa física) e a herança fica organizada em vida — sem inventário longo, caro e público para a sua família.",
        },
      },
    },
    seloPasso: "Garantia de 100% do dinheiro de volta",
    numerosTitulo: "Os números por trás do plano",
    split: (aportado, pa, juros, pj) => [
      `Você aporta <b>${aportado}</b> (${pa}%)`,
      `Os juros constroem <b>${juros}</b> (${pj}%)`,
    ],
    stats: {
      horizonte: "Horizonte considerado",
      aportar: "Total que você vai aportar",
      projetado: "Patrimônio projetado",
      juros: "Ganho de juros sobre juros",
      renda: "Renda passiva ao final",
      adiar: "O custo de adiar 12 meses",
      anos: (n) => `${n} anos`,
      porMes: "/mês",
    },
    imovel: {
      titulo: "A comparação que prometi: seu imóvel vs. investido",
      bruto: "Aluguel bruto estimado",
      liquido: "Aluguel líquido (após IR, vacância, custos)",
      investido: "Mesmo valor investido",
      notaMelhor: (selic, dif) =>
        `Com a Selic em ${selic}%, o mesmo valor investido renderia cerca de ${dif} a mais por mês — com liquidez e sem inquilino. Não é uma ordem de venda; é um número que merece análise.`,
      notaDefende:
        "Nesse cenário, o imóvel se defende bem. Vale análise para decidir entre manter, rentabilizar melhor ou diversificar.",
    },
    perdaFinal: (custo) =>
      `Cada 12 meses de espera custam cerca de <b>${custo}</b> do seu resultado final. O melhor dia para começar já passou — o segundo melhor é hoje.`,
    cta: {
      titulo: "O passo de hoje",
      ponte: "O plano está pronto. O único passo que ele não dá sozinho é o primeiro — e esse é seu.",
      especialista: (nome) => `Quem te recebe: ${nome}`,
      botao: "Seguir o plano com um especialista",
      nota: "Seu especialista já recebe este diagnóstico completo — você não repete nada. Conversa sem compromisso. Se você não ficar satisfeito, nós devolvemos <b>100% do seu dinheiro</b> após a emissão do certificado!",
    },
    imprensa: "AUVP na imprensa",
    premio: "Eleita <b>2 vezes a melhor consultoria de investimentos do Brasil</b> pelo BTG Pactual.",
    aviso: `Simulação ilustrativa com base na Selic vigente (${selicTxt}% a.a.). Não constitui promessa de rentabilidade, recomendação de investimento ou aconselhamento jurídico ou tributário. A renda passiva é estimada de modo a preservar o patrimônio da inflação.`,
    refazer: "Refazer diagnóstico",
    sticky: "Falar com um especialista",
    saida: {
      titulo: "Antes de você sair…",
      texto: "Que tal pegar a opinião de um especialista em investimentos sobre o seu resultado? Leva poucos minutos, é sem custo e sem compromisso.",
      botao: "Pegar a opinião de um especialista",
      fechar: "Quero continuar lendo",
    },
    redirect: {
      texto: (s) => `Sem resposta, levamos você a um especialista em <b>${s}s</b>`,
      botao: "Falar agora",
      fechar: "Continuar lendo",
    },
  },
};
