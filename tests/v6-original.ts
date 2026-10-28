// @ts-nocheck
/*
 * Transcrição de compute() e build() de referencia/versao-atual.html (v6).
 * As linhas de DOM viraram atribuições num objeto `out`; a lógica e os textos
 * estão como no original. Serve só de gabarito para o teste de paridade.
 */

export function v6(data) {
  var out = {};
  var p = { ret: 0.1425, infl: 0.045, aluguel: 0.004 };
  function fmt(n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function isPatrimonial() { return (data.patrimonio + data.imoveis) >= 5000000 || data.patrimonio >= 1000000; }

  var iNom = Math.pow(1 + p.ret, 1 / 12) - 1;
  var realA = (1 + p.ret) / (1 + p.infl) - 1, iReal = Math.pow(1 + realA, 1 / 12) - 1;
  var idade = data.idade || 40;
  function fv(anos) { var n = anos * 12, l = data.patrimonio * Math.pow(1 + iNom, n), a = iNom > 0 ? data.aporte * ((Math.pow(1 + iNom, n) - 1) / iNom) : data.aporte * n; return l + a; }
  var rendaHoje = data.patrimonio * iReal;
  var global = data.patrimonio + data.imoveis;

  var heroLabel, heroBig, note, second = null, anosBase;
  if (idade < 40) { anosBase = 20; var fv20 = fv(20);
    heroLabel = 'Patrimônio que você pode construir em 20 anos'; heroBig = fv20;
    note = 'Aos ' + (idade + 20) + ', são cerca de <b>' + fmt(fv20 * iReal) + ' por mês</b> sem encostar no principal — a liberdade de decidir se ainda <i>quer</i> trabalhar.';
  } else if (idade < 50) { anosBase = 15; var fv15 = fv(15);
    heroLabel = 'Renda mensal que você pode ter em 15 anos'; heroBig = fv15 * iReal;
    note = 'Aos ' + (idade + 15) + ' — um salário que cai todo mês, para sempre, e não depende de chefe nem de mercado. Sobre cerca de <b>' + fmt(fv15) + '</b> acumulados.';
  } else { anosBase = 15; var fv15b = fv(15);
    heroLabel = 'Renda mensal que seu patrimônio já pode gerar'; heroBig = rendaHoje;
    second = { label: 'E em 15 anos, mantendo os aportes', value: fv15b * iReal };
    note = 'Pode virar renda <b>agora</b>, sem vender o que você construiu — e crescer ainda mais em 15 anos mantendo os aportes.';
  }
  var perfilNome = (global >= 5000000) ? 'Perfil patrimonial' : (idade < 40 ? 'Construtor de patrimônio' : (idade < 50 ? 'Em transição para a renda' : 'Gerador de renda'));
  out.plabel = perfilNome; out.heroLabel = heroLabel; out.heroNote = note; out.heroBig = heroBig; out.second = second;

  var fvBase = fv(anosBase);
  var custoEspera = fvBase - fv(anosBase - 1);
  out.waitLine = (data.aporte > 0 || data.patrimonio > 0) ? 'Adiar o início em 12 meses custa cerca de <b>' + fmt(custoEspera) + '</b> do seu resultado final.' : '';
  out.closingLoss = (data.aporte > 0 || data.patrimonio > 0) ? 'Cada 12 meses de espera custam cerca de <b>' + fmt(custoEspera) + '</b> do seu resultado final. O melhor dia para começar já passou — o segundo melhor é hoje.' : '';

  var r = build(idade, global, anosBase);
  var primeiro = (data.nome || '').split(' ')[0];
  out.leadin = primeiro ? '<em>' + esc(primeiro) + '</em>, ' + r.leadin.charAt(0).toLowerCase() + r.leadin.slice(1) : r.leadin;
  out.callout = r.callout || '';
  out.paths = r.paths.map(function (x) { return { name: x.name, essence: x.essence, copy: x.copy, guar: x.guar, tag: x.tag }; });

  out.imovel = null;
  if (data.imoveis > 0) {
    var aluguel = data.imoveis * p.aluguel, liq = aluguel * 0.78, invest = data.imoveis * iReal, dif = invest - liq;
    out.imovel = {
      rows: [['Aluguel bruto estimado', fmt(aluguel) + '/mês'], ['Aluguel líquido (após IR, vacância, custos)', fmt(liq) + '/mês'], ['Mesmo valor investido', fmt(invest) + '/mês']],
      note: dif > 0
        ? 'Com a Selic em ' + (Math.round(p.ret * 10000) / 100).toString().replace('.', ',') + '%, o mesmo valor investido renderia cerca de ' + fmt(dif) + ' a mais por mês — com liquidez e sem inquilino. Não é uma ordem de venda; é um número que merece análise.'
        : 'Nesse cenário, o imóvel se defende bem. Vale análise para decidir entre manter, rentabilizar melhor ou diversificar.',
    };
  }

  var aportado = data.patrimonio + data.aporte * anosBase * 12;
  out.stats = [
    ['Horizonte considerado', anosBase + ' anos'],
    ['Total que você vai aportar', fmt(aportado)],
    ['Patrimônio projetado', fmt(fvBase)],
    ['Ganho de juros sobre juros', fmt(fvBase - aportado)],
    ['Renda passiva ao final', fmt(fvBase * iReal) + '/mês'],
    ['O custo de adiar 12 meses', '− ' + fmt(custoEspera)],
  ];
  out.chart = fvBase > 1000;

  out.split = null;
  if (fvBase > 0 && aportado > 0 && fvBase > aportado) {
    var pj = Math.max(1, Math.min(99, Math.round((fvBase - aportado) / fvBase * 100)));
    var pa = 100 - pj;
    out.split = ['Você aporta <b>' + fmt(aportado) + '</b> (' + pa + '%)', 'Os juros constroem <b>' + fmt(fvBase - aportado) + '</b> (' + pj + '%)'];
  }

  out.cmp = null;
  if (fvBase > 1000 && fvBase > aportado) {
    var primeiroNome = (data.nome || '').split(' ')[0];
    out.cmp = {
      title: primeiroNome ? (primeiroNome + ', os seus dois futuros de relance') : 'Os seus dois futuros, de relance',
      com: [fmt(fvBase), 'patrimônio em ' + anosBase + ' anos', fmt(fvBase * iReal), 'de renda, todo mês'],
      sem: [fmt(aportado), 'guardado em ' + anosBase + ' anos', 'R$ 0', 'de renda que se sustenta'],
      diff: 'O plano coloca <b>+ ' + fmt(fvBase - aportado) + '</b> no seu lado da mesa.',
    };
  }
  out.rTitle = primeiro ? (primeiro + ', aqui está o seu plano') : r.headline;
  out.score = r.score; out.tier = r.tier.label; out.tags = r.tags;
  out.renda_projetada_mensal = Math.round(fvBase * iReal); out.patrimonio_projetado = Math.round(fvBase);
  return out;

  function build(idade, global, anos) {
    var P = data.patrimonio, A = data.aporte, C = data.concerns;
    var pat = isPatrimonial(), privado = global >= 5000000, holding = data.imoveis >= 2000000 || C.indexOf('sucessao') >= 0;
    var objTxt = data.objetivo === 'renda' ? 'a renda que você quer' : (data.objetivo === 'crescer' ? 'o patrimônio que você projeta' : 'crescer agora e viver de renda no destino');
    var paths = [], tags = ['alvo:escola'], callout = '';
    var leadin = 'A matemática está do seu lado. O que falta é <em>método</em> — e método se aprende.';
    var altoValor = pat || A >= 10000 || P >= 300000;
    var escolaCopy = 'Em 8 semanas, você sai do zero e aprende a <b>investir por conta própria</b>, no Brasil e no exterior: montar carteira, escolher ativos, declarar imposto e nunca mais depender de gerente de banco. Método que já formou mais de 36 mil investidores.';
    if (altoValor) escolaCopy = 'Pode parecer estranho uma consultoria recomendar que você estude primeiro — é proposital. Quanto maior o patrimônio, mais caro sai cada decisão delegada às cegas. Na Escola você aprende a <b>avaliar qualquer recomendação que receber — inclusive as nossas</b>. Cliente educado ninguém engana, e é com ele que fazemos o melhor trabalho.';
    if (data.objetivo === 'renda' && !altoValor) escolaCopy = 'Viver de renda é uma habilidade, não um produto que se compra. Na Escola você aprende a <b>construir e gerir a própria carteira de renda</b> — escolher pagadores, reinvestir e declarar — para que a renda dependa de você, e não de quem te vende.';
    if (data.conhecimento === 'avancado') escolaCopy = 'Você quer profissionalizar como investe — e é aqui que a maioria estaciona. Para o seu nível, o valor está nos <b>módulos avançados e nas lives semanais</b>: internacional, proteção de carteira, otimização tributária. Investidor que para de estudar vira investidor mediano.';
    if (data.conhecimento === 'intermediario') escolaCopy = 'Você já investe, mas sente falta de <b>consistência e clareza</b> — e isso quase nunca é falta de informação, é falta de método. A Escola organiza o que você já faz num processo só, do aporte à declaração, para o resultado parar de depender de sorte.';
    if (data.conhecimento === 'perdido') escolaCopy = 'Você já tentou e travou no caminho — é o ponto mais comum, e o mais resolvível. A Escola te dá <b>um passo a passo do zero ao avançado</b>, na ordem certa, para você não se perder de novo e finalmente seguir sozinho.';
    if (C.indexOf('dividas') >= 0) { escolaCopy = 'Você marcou dívidas — e o primeiro passo não é pegar mais crédito, é <b>virar o jogo do seu dinheiro</b>: na Escola você reorganiza o orçamento, monta a estratégia para sair dos juros e aprende a investir o que libera. É a base de tudo.'; tags.push('tem:dividas'); }
    paths.push({ name: 'Aprender a fazer por conta própria', tag: 'Escola', essence: 'O critério para nunca mais depender de ninguém — nem de nós.', copy: escolaCopy, guar: true });
    var experiente = data.conhecimento === 'avancado' || (data.conhecimento === 'intermediario' && data.momento === 'sozinho');
    if (experiente) {
      paths.push({ name: 'Investir onde você não é o produto', tag: 'Plataforma AUVP', essence: 'O aluguel das suas ações de verdade — e renda fixa sem taxa escondida.', copy: 'Nas corretoras tradicionais, você fica com cerca de <b>30% do aluguel das suas próprias ações</b> — e nos bancos digitais elas mal são alugadas. Na renda fixa, o spread embutido no preço corrói o retorno sem aparecer em extrato nenhum. Na plataforma AUVP é diferente: <b>o aluguel das suas ações trabalha para você</b>, e o preço da renda fixa é o que você vê — sem taxa escondida.', guar: false });
      tags.push('alvo:plataforma', 'perfil:experiente');
    }
    if (altoValor) {
      var consCopy = 'A educação te dá o critério; um consultor dedicado te devolve <b>tempo e execução</b>: monta e acompanha sua carteira, define a alocação certa para ' + objTxt + ', rebalanceia quando o mercado muda e corta custos e impostos escondidos — respondendo a você, não a um banco que ganha comissão sobre o que te vende.';
      if (C.indexOf('rentabilidade') >= 0) consCopy = 'Você sente que seu dinheiro rende menos do que poderia — e provavelmente está certo. Com o critério que a Escola te dá, um consultor dedicado <b>audita sua carteira atual</b>, encontra as taxas e produtos que corroem seu retorno, e remonta a alocação para extrair mais do mesmo patrimônio, com risco sob controle.';
      if (C.indexOf('diversificar') >= 0) consCopy = 'Concentração é o risco silencioso: poucos ativos, um banco só, ou tudo em imóveis. Um consultor dedicado <b>redistribui seu patrimônio</b> entre classes, moedas e geografias — e você, educado, entende e valida cada movimento.';
      if (C.indexOf('renda_ativos') >= 0) consCopy = 'Transformar patrimônio em renda é uma engenharia: ativos pagadores certos, vencimentos escalonados, imposto otimizado em cada real recebido. Um consultor dedicado <b>desenha esse fluxo de renda</b> para a sua vida — e você, sabendo avaliar, dorme tranquilo.';
      paths.push({ name: 'Um consultor conduzindo com você', tag: 'Consultoria', essence: 'Execução profissional do plano, respondendo só a você.', copy: consCopy, guar: true });
      tags.push('alvo:consultoria', 'prioridade:alta');
    }
    if (C.indexOf('comprar_imovel') >= 0) {
      paths.push({ name: 'Conquistar o imóvel sem se descapitalizar', tag: 'Crédito', essence: 'A melhor taxa entre 20+ bancos, sem gastar o capital.', copy: 'Nossa equipe <b>disputa sua taxa em mais de 20 bancos</b> e traz a melhor condição de financiamento — assim seu capital continua investido e rendendo, em vez de sair de uma vez. Você compara as propostas e escolhe; a negociação é por nossa conta.', guar: false });
      tags.push('quer:imovel');
    }
    if (C.indexOf('proteger_familia') >= 0 || (idade < 40 && P < 30000 && !pat)) {
      paths.push({ name: 'Proteger quem depende de você', tag: 'Proteção', essence: 'Um imprevisto não pode desfazer o plano.', copy: 'Mapeamos o que sua família precisaria se você faltasse e <b>estruturamos o seguro certo</b> — cobertura na medida, sem pagar por excesso. O patrimônio cresce com tempo; a proteção precisa existir desde o primeiro dia.', guar: false });
      tags.push('quer:protecao');
    }
    if (C.indexOf('exterior') >= 0) {
      paths.push({ name: 'Patrimônio com passaporte', tag: 'Internacional', essence: 'Parte do patrimônio em moeda forte, com estrutura.', copy: 'Abrimos sua <b>conta internacional de investimentos</b> e estruturamos a dolarização de parte do patrimônio: acesso aos mercados globais, proteção contra o risco Brasil e, quando faz sentido, estrutura offshore eficiente em imposto e sucessão.', guar: false });
      tags.push('elig:offshore');
    }
    if (holding) {
      paths.push({ name: 'Pagar menos imposto e organizar a sucessão', tag: 'Estruturação', essence: 'Menos imposto hoje, herança organizada em vida.', copy: 'Estruturamos sua <b>holding patrimonial</b>: a renda dos imóveis passa a ser tributada como empresa (em geral bem menos que na pessoa física) e a herança fica organizada em vida — sem inventário longo, caro e público para a sua família.', guar: false });
      tags.push('elig:holding');
    }
    if (privado) {
      callout = 'No seu patamar, estrutura preserva mais do que rentabilidade.|Com cerca de ' + fmt(global) + ' em patrimônio global, o que define quanto você mantém é como você se organiza: holding para a renda dos imóveis e a sucessão, conta internacional para investir fora com segurança, e um especialista que conhece o seu caso pelo nome. É exatamente essa conversa que ele vai conduzir com você.';
      tags.push('perfil:patrimonial', 'elig:offshore', 'elig:holding', 'elig:cartao');
      leadin = 'Daqui em diante, o jogo é <em>preservar e transferir</em>. Os passos abaixo estão na ordem certa.';
    }
    var s = 0;
    s += global >= 10000000 ? 40 : global >= 5000000 ? 36 : P >= 1000000 ? 32 : P >= 500000 ? 29 : P >= 300000 ? 26 : P >= 150000 ? 22 : P >= 100000 ? 19 : P >= 70000 ? 16 : P >= 30000 ? 12 : P >= 10000 ? 8 : 5;
    s += A >= 25000 ? 30 : A >= 10000 ? 26 : A >= 5000 ? 21 : A >= 2500 ? 17 : A >= 1000 ? 12 : A >= 500 ? 8 : A >= 300 ? 5 : 2;
    var avista = A >= 1500 || P >= 50000 || global >= 300000;
    if (avista) { s += 8; tags.push('capacidade:avista'); }
    if (global >= 1000000) s += 4;
    if (holding) s += 8; if (C.indexOf('exterior') >= 0) s += 6; if (C.indexOf('comprar_imovel') >= 0) s += 4;
    s += (data.objetivo === 'crescer') ? 10 : (data.objetivo === 'ambos') ? 8 : (data.objetivo === 'renda') ? 6 : 0;
    if (C.indexOf('dividas') >= 0) s -= 5;
    s += (data.conhecimento === 'intermediario') ? 10 : (data.conhecimento === 'avancado') ? 9 : (data.conhecimento === 'perdido') ? 3 : 0;
    if (data.momento === 'consultoria') s += 6; if ((data.objetivo === 'renda' || data.objetivo === 'ambos') && idade >= 50) s += 5;
    var s100 = Math.max(0, Math.min(100, s));
    s = Math.round(s100 * 1.19);
    var tier = s >= 81 ? { label: 'ALTA', cls: 'alta' } : s >= 48 ? { label: 'MÉDIA', cls: 'media' } : { label: 'BASE', cls: 'base' };
    tags.push('objetivo:' + data.objetivo, 'versao:v6', 'contato:ok');
    var headline = privado ? 'Seu retrato patrimonial' : (pat ? 'Seu plano' : (idade < 40 ? 'Sua fase de acúmulo' : (idade >= 50 ? 'Seu retrato de renda' : 'Seu caminho até a renda')));
    return { leadin: leadin, callout: callout, paths: paths, score: s, tier: tier, tags: tags, headline: headline };
  }
}
