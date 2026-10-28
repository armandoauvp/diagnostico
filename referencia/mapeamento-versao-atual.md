# Diagnóstico AUVP: mapeamento da versão atual

Scraping de https://diagnostico.auvp.com.br/ feito em 28/10/2026. O HTML original está em [versao-atual.html](versao-atual.html). É uma página única: todo o fluxo, os textos e as regras ficam no JavaScript embutido (versão `v6`).

Não enviei o formulário de contato: em produção, ele manda o lead para o webhook do Salesforce (n8n). As regras do resultado saíram direto do código.

---

## 1. Caminho da pessoa

```
01 Objetivo → 02 Idade → 03 Aporte → 04 Patrimônio → 05 Imóveis
→ 06 Dores (padrão OU patrimonial) → 07 Quem cuida do dinheiro
→ 08 Nível de conhecimento (pulada se "Ninguém ainda")
→ 09 Contato → [Calculando… 2,6 s] → Resultado (página única com rolagem)
```

- No topo aparece o contador `01 / 09` e uma barra de progresso. O resultado não entra na contagem.
- **Pulo:** se a pessoa responde "Ninguém ainda" em 07, a tela 08 some e o nível vira `iniciante`. O contador salta de 07 para 09.
- **Troca da tela 06:** a pessoa vê a versão **patrimonial** quando `patrimônio investido ≥ R$ 1 mi` **ou** `investido + imóveis ≥ R$ 5 mi`. Todas as outras veem a versão **padrão**.
- Cada tela tem, abaixo do card:
  - uma **linha de confiança** (trust), com texto próprio por tela;
  - um bloco **"Você sabia?"** (insight), em todas as telas menos objetivo e contato.
- O botão "Continuar" fica travado em objetivo, quem cuida, nível e contato até a pessoa responder. Nas telas de valor e de dores, dá para avançar sem mexer em nada (os valores ficam em R$ 0, e as dores, vazias).

---

## 2. Telas, textos e opções

### 01 · Objetivo (escolha única)
- Sobretítulo: **Diagnóstico patrimonial AUVP**
- Título: **O que o seu dinheiro precisa fazer por você?**
- Texto: Toda boa decisão de dinheiro começa pela vida que você quer. Responda algumas perguntas e veja, em números, até onde o seu caminho leva hoje — e o que muda a rota.
- Opções:
  - `crescer`: Construir um patrimônio sólido · *Investir com inteligência para o futuro*
  - `renda`: Criar renda passiva · *Novas fontes de renda caindo todo mês*
  - `ambos`: Os dois · *Crescer agora, viver de renda depois*
- Botão: **Começar meu diagnóstico**
- Destaques: **9** etapas rápidas · **~2 min** para concluir · **Seu plano** ao final
- Confiança: AUVP é avaliada a **melhor escola de investimentos do Brasil**.

### 02 · Idade (slider)
- Sobretítulo: Sobre você
- Título: **Quantos anos você tem?**
- Texto: É a variável que mais pesa no seu plano: define quanto tempo os juros compostos têm para trabalhar a seu favor.
- Slider de 16 a 85 anos, começando em 35, com botões − e +.
- Confiança: Cada resposta afina o **seu número**.
- Você sabia? Pelos juros compostos, cada década de antecedência pode mais que dobrar o resultado final. **Tempo costuma pesar mais do que o tamanho do aporte.**

### 03 · Aporte mensal (valor)
- Sobretítulo: Capacidade
- Título: **Quanto você consegue investir por mês?**
- Texto: Use o número real. Nossos consultores planejam com fatos — um plano honesto vale mais que uma meta inflada.
- Slider em escala logarítmica de R$ 0 a R$ 500 mil (no máximo aparece "+"), com − e + de passo proporcional ao valor e campo de digitação. Pontas: "R$ 0" e "sem teto".
- Dica: Arraste, use − e +, ou toque no valor acima para digitar
- Confiança: Eleita **2x a melhor consultoria do Brasil** pelo BTG Pactual.
- Você sabia? Constância vence intensidade: aportes menores e **regulares**, reinvestidos, tendem a superar aportes grandes e esporádicos.

### 04 · Patrimônio investido (valor)
- Sobretítulo: Ponto de partida
- Título: **Quanto você já tem investido hoje?**
- Texto: Some renda fixa, fundos, ações, previdência e cripto — um valor aproximado já basta. Esse dado fica sob sigilo e serve só para calcular o seu plano.
- Slider logarítmico de R$ 0 a R$ 100 mi, com o mesmo controle da tela 03.
- Confiança: Dados criptografados, tratados conforme a **LGPD**.
- Você sabia? Uma taxa de 2% ao ano parece inofensiva, mas em algumas décadas pode consumir uma fatia enorme do patrimônio. **No longo prazo, custo corrói mais que volatilidade.**

### 05 · Imóveis (valor)
- Sobretítulo: Imóveis
- Título: **E em imóveis, quanto você tem?**
- Texto: Casa própria conta. No seu resultado, vou mostrar uma comparação que nossos consultores fazem em toda análise patrimonial.
- Slider logarítmico de R$ 0 a R$ 100 mi. Pontas: "Não tenho" e "sem teto".
- Confiança: Analisamos o **patrimônio completo** — não só o que está na bolsa.
- Você sabia? Imóvel é patrimônio, mas é pouco líquido — contar com ele para imprevistos costuma sair caro. Por isso olhamos o **conjunto**, não só a bolsa.

### 06a · Dores, versão padrão (múltipla escolha)
- Sobretítulo: Seu momento
- Título: **O que tira o seu sono hoje?**
- Texto: Marque com sinceridade — cada resposta muda a recomendação que você recebe no final.
- Opções:
  - `dividas`: Dívidas que não me deixam avançar · *Cartão, empréstimo, financiamento caro*
  - `comprar_imovel`: Quero conquistar um imóvel · *Comprar ou financiar*
  - `proteger_familia`: Medo de faltar para a minha família · *Quero segurança diante de um imprevisto*
  - `nenhum`: Nada disso por enquanto (desmarca as outras)
- Confiança: Quanto mais específico você for, **mais precisa a recomendação**.
- Você sabia? Quem acha que "não consegue investir" quase nunca tem um problema de renda: tem um problema de **método e de prioridades**. Isso dá para resolver.

### 06b · Dores, versão patrimonial (múltipla escolha)
- Sobretítulo: Seu momento
- Título: **O que o seu patrimônio ainda não resolveu?**
- Texto: Marque o que fizer sentido. É exatamente isso que o seu especialista vai endereçar primeiro.
- Opções:
  - `rentabilidade`: Render mais do que rende hoje · *Sinto que meu dinheiro trabalha abaixo do potencial*
  - `diversificar`: Sair da concentração · *Poucos ativos, um banco só, ou tudo em imóveis*
  - `renda_ativos`: Virar renda de verdade · *Fazer o que construí pagar a minha vida*
  - `exterior`: Proteger fora do Brasil · *Dolarizar, conta internacional, offshore*
  - `sucessao`: Impostos e herança · *Holding, sucessão organizada, pagar menos imposto*
  - `nenhum`: Nada disso por enquanto (desmarca as outras)
- Confiança: Patrimônios de todos os portes — **com a mesma garantia**.
- Você sabia? Patrimônio grande traz problemas diferentes: imposto, sucessão e concentração. A maior perda costuma ser **o que não foi estruturado a tempo**.

### 07 · Quem cuida do seu dinheiro (escolha única)
- Sobretítulo: Última pergunta
- Título: **Quem cuida do seu dinheiro hoje?**
- Texto: Uma das respostas mais reveladoras para o seu consultor. Depois dessa, o seu número.
- Opções:
  - `sozinho`: Eu mesmo · *Invisto por conta própria*
  - `consultoria`: Banco ou consultoria · *Alguém investe por mim*
  - `comecando`: Ninguém ainda · *Está parado ou estou começando agora* (pula a tela 08)
- Confiança: **Garantia incondicional**: 100% do dinheiro de volta.
- Você sabia? Quem investe sozinho costuma pagar taxas invisíveis no banco. Muitas vezes o primeiro ganho não é render mais — é **parar de perder**.
- Observação: a tela diz "Última pergunta", mas depois dela ainda podem vir o nível de conhecimento e o contato.

### 08 · Nível de conhecimento (escolha única)
- Sobretítulo: Seu nível
- Título: **Quanto você entende de investimentos hoje?**
- Texto: Sem modéstia e sem vergonha — isso muda completamente o que vamos recomendar.
- Opções:
  - `iniciante`: Sou iniciante e quero aprender · *Sei pouco ou estou começando agora*
  - `perdido`: Já tentei, mas me perdi no caminho · *Comecei e travei em algum ponto*
  - `intermediario`: Já invisto, mas sem consistência ou clareza · *Faço, mas sinto que poderia ser muito melhor*
  - `avancado`: Quero profissionalizar como invisto · *Domino o básico, busco o próximo nível*
- Confiança: Cada nível recebe um plano diferente — **o seu**.
- Você sabia? Você não precisa virar especialista. Precisa de um **método replicável** e de alguém para revisar as decisões que pesam.

### 09 · Contato (formulário)
- Sobretítulo: Diagnóstico concluído
- Título: **Seu plano está calculado e protegido.**
- Texto: Ele já é seu — falta só dizer para quem enviar. Um especialista AUVP revisa o seu caso e orienta os próximos passos, sem custo e sem compromisso.
- Campos:
  - Seu nome (mínimo de 2 caracteres)
  - WhatsApp com DDD, com seletor de país e máscara:
    - países: 🇧🇷 +55, 🇵🇹 +351, 🇺🇸 +1, 🇦🇷 +54, 🇵🇾 +595, 🇺🇾 +598, 🇪🇸 +34, 🇬🇧 +44 e 🌎 Outro;
    - aviso de erro: "Confira o número — parece incompleto.";
  - E-mail
- Selo: Dados criptografados, tratados conforme a **LGPD** e nunca vendidos. E tudo que oferecemos tem **garantia incondicional: 100% do dinheiro de volta** em caso de insatisfação.
- Botão: **Revelar meu plano**
- Confiança: Eleita **2x a melhor consultoria do Brasil** pelo BTG Pactual.

### Calculando (transição de 2,6 s)
- Sobretítulo: Um instante
- Título: **Montando o seu plano…**
- Texto: Estamos cruzando as suas respostas com o cenário atual.
- Três etapas acendem em sequência:
  - Calculando com a Selic vigente (14,25% a.a.)
  - Cruzando com o seu objetivo e horizonte
  - Selecionando os passos para o seu perfil
- Confiança: Simulação com premissas **abertas e auditáveis**.

---

## 3. Resultado (página única, nesta ordem)

> Hoje, os blocos 2 a 5 chegam **borrados**, cada um com uma pílula "Toque para…". Na versão nova, isso sai e os blocos aparecem inteiros.
> Pílulas atuais: "Toque para revelar o seu número", "Toque para comparar os seus dois futuros", "Toque para ver o seu plano, passo a passo" e "Toque para ver os números por trás".

### 3.1 Chegada
- Selo: ✓ Diagnóstico concluído
- Título: **{Primeiro nome}, aqui está o seu plano**. O nome é obrigatório, então esse título sempre aparece.
- Texto: Está tudo aqui, em uma página só. Desça no seu ritmo — cada parte do seu plano aparece quando você chega nela. ⚠️ Esse texto fala do efeito de revelar e precisa mudar quando o efeito sair.

### 3.2 Herói: o número
O rótulo de perfil depende do patrimônio global e da idade:
- `investido + imóveis ≥ R$ 5 mi` → **Perfil patrimonial**
- idade < 40 → **Construtor de patrimônio**
- idade de 40 a 49 → **Em transição para a renda**
- 50 anos ou mais → **Gerador de renda**

| Idade | Rótulo | Número grande | Nota |
|---|---|---|---|
| < 40 | Patrimônio que você pode construir em 20 anos | patrimônio em 20 anos | Aos {idade+20}, são cerca de **R$ X por mês** sem encostar no principal — a liberdade de decidir se ainda *quer* trabalhar. |
| 40–49 | Renda mensal que você pode ter em 15 anos | renda mensal em 15 anos | Aos {idade+15} — um salário que cai todo mês, para sempre, e não depende de chefe nem de mercado. Sobre cerca de **R$ X** acumulados. |
| ≥ 50 | Renda mensal que seu patrimônio já pode gerar | renda de hoje | Pode virar renda **agora**, sem vender o que você construiu — e crescer ainda mais em 15 anos mantendo os aportes. |

- Só a faixa de 50 anos ou mais ganha um **segundo número**: "E em 15 anos, mantendo os aportes".
- O número sobe animado de 0 até o valor em 0,9 s.
- Custo de adiar, que só aparece se a pessoa tem aporte ou patrimônio maior que zero: Adiar o início em 12 meses custa cerca de **R$ X** do seu resultado final.

### 3.3 Os seus dois futuros
Aparece quando o patrimônio projetado passa de R$ 1.000 e é maior que o total aportado.
- Título: **{Nome}, os seus dois futuros de relance**
- Colunas:
  - "Com um plano": patrimônio em N anos · renda todo mês
  - "Sem um plano": guardado em N anos · "R$ 0 de renda que se sustenta"
- Frase: O plano coloca **+ R$ X** no seu lado da mesa.
- Gráfico de linha: a curva "Seguindo o plano" (verde, com área) contra "Guardando sem investir" (tracejada), de "hoje" até "em N anos".

### 3.4 O plano que recomendamos
- Abertura: **{Nome}**, a matemática está do seu lado. O que falta é *método* — e método se aprende.
  - Perfil privado (global ≥ R$ 5 mi): **{Nome}**, daqui em diante, o jogo é *preservar e transferir*. Os passos abaixo estão na ordem certa.
- Destaque, só para o perfil privado: **No seu patamar, estrutura preserva mais do que rentabilidade.** Com cerca de R$ X em patrimônio global, o que define quanto você mantém é como você se organiza: holding para a renda dos imóveis e a sucessão, conta internacional para investir fora com segurança, e um especialista que conhece o seu caso pelo nome. É exatamente essa conversa que ele vai conduzir com você.
- Passos numerados, na ordem abaixo. Cada um tem título, frase-resumo, texto e, às vezes, um selo de garantia.

| # | Passo | Quando aparece | Selo |
|---|---|---|---|
| 1 | **Aprender a fazer por conta própria** · *O critério para nunca mais depender de ninguém — nem de nós.* | Sempre | Garantia de 100% |
| 2 | **Investir onde você não é o produto** · *O aluguel das suas ações de verdade — e renda fixa sem taxa escondida.* | Nível avançado, ou intermediário + "Eu mesmo" | — |
| 3 | **Um consultor conduzindo com você** · *Execução profissional do plano, respondendo só a você.* | Alto valor: perfil patrimonial, aporte ≥ R$ 10 mil ou investido ≥ R$ 300 mil | Garantia de 100% |
| 4 | **Conquistar o imóvel sem se descapitalizar** · *A melhor taxa entre 20+ bancos, sem gastar o capital.* | Marcou "Quero conquistar um imóvel" | — |
| 5 | **Proteger quem depende de você** · *Um imprevisto não pode desfazer o plano.* | Marcou "Medo de faltar…", ou idade < 40 com investido < R$ 30 mil e fora do perfil patrimonial | — |
| 6 | **Patrimônio com passaporte** · *Parte do patrimônio em moeda forte, com estrutura.* | Marcou "Proteger fora do Brasil" | — |
| 7 | **Pagar menos imposto e organizar a sucessão** · *Menos imposto hoje, herança organizada em vida.* | Imóveis ≥ R$ 2 mi ou marcou "Impostos e herança" | — |

**Texto do passo 1, Escola.** São 7 variações. Quando mais de uma regra vale, ganha a que está mais abaixo na lista:
1. Padrão: Em 8 semanas, você sai do zero e aprende a **investir por conta própria**, no Brasil e no exterior: montar carteira, escolher ativos, declarar imposto e nunca mais depender de gerente de banco. Método que já formou mais de 36 mil investidores.
2. Alto valor: Pode parecer estranho uma consultoria recomendar que você estude primeiro — é proposital. Quanto maior o patrimônio, mais caro sai cada decisão delegada às cegas. Na Escola você aprende a **avaliar qualquer recomendação que receber — inclusive as nossas**. Cliente educado ninguém engana, e é com ele que fazemos o melhor trabalho.
3. Objetivo renda, sem ser alto valor: Viver de renda é uma habilidade, não um produto que se compra. Na Escola você aprende a **construir e gerir a própria carteira de renda** — escolher pagadores, reinvestir e declarar — para que a renda dependa de você, e não de quem te vende.
4. Nível avançado: Você quer profissionalizar como investe — e é aqui que a maioria estaciona. Para o seu nível, o valor está nos **módulos avançados e nas lives semanais**: internacional, proteção de carteira, otimização tributária. Investidor que para de estudar vira investidor mediano.
5. Nível intermediário: Você já investe, mas sente falta de **consistência e clareza** — e isso quase nunca é falta de informação, é falta de método. A Escola organiza o que você já faz num processo só, do aporte à declaração, para o resultado parar de depender de sorte.
6. Nível perdido: Você já tentou e travou no caminho — é o ponto mais comum, e o mais resolvível. A Escola te dá **um passo a passo do zero ao avançado**, na ordem certa, para você não se perder de novo e finalmente seguir sozinho.
7. Marcou dívidas: Você marcou dívidas — e o primeiro passo não é pegar mais crédito, é **virar o jogo do seu dinheiro**: na Escola você reorganiza o orçamento, monta a estratégia para sair dos juros e aprende a investir o que libera. É a base de tudo.

**Texto do passo 2, Plataforma:** Nas corretoras tradicionais, você fica com cerca de **30% do aluguel das suas próprias ações** — e nos bancos digitais elas mal são alugadas. Na renda fixa, o spread embutido no preço corrói o retorno sem aparecer em extrato nenhum. Na plataforma AUVP é diferente: **o aluguel das suas ações trabalha para você**, e o preço da renda fixa é o que você vê — sem taxa escondida.

**Texto do passo 3, Consultoria.** São 4 variações; também ganha a mais abaixo:
1. Padrão: A educação te dá o critério; um consultor dedicado te devolve **tempo e execução**: monta e acompanha sua carteira, define a alocação certa para {objetivo}, rebalanceia quando o mercado muda e corta custos e impostos escondidos — respondendo a você, não a um banco que ganha comissão sobre o que te vende.
   - O {objetivo} vira um destes textos: "a renda que você quer", "o patrimônio que você projeta" ou "crescer agora e viver de renda no destino".
2. Rentabilidade: Você sente que seu dinheiro rende menos do que poderia — e provavelmente está certo. Com o critério que a Escola te dá, um consultor dedicado **audita sua carteira atual**, encontra as taxas e produtos que corroem seu retorno, e remonta a alocação para extrair mais do mesmo patrimônio, com risco sob controle.
3. Diversificar: Concentração é o risco silencioso: poucos ativos, um banco só, ou tudo em imóveis. Um consultor dedicado **redistribui seu patrimônio** entre classes, moedas e geografias — e você, educado, entende e valida cada movimento.
4. Renda com o que já tem: Transformar patrimônio em renda é uma engenharia: ativos pagadores certos, vencimentos escalonados, imposto otimizado em cada real recebido. Um consultor dedicado **desenha esse fluxo de renda** para a sua vida — e você, sabendo avaliar, dorme tranquilo.

**Textos dos passos 4 a 7:**
- Crédito: Nossa equipe **disputa sua taxa em mais de 20 bancos** e traz a melhor condição de financiamento — assim seu capital continua investido e rendendo, em vez de sair de uma vez. Você compara as propostas e escolhe; a negociação é por nossa conta.
- Proteção: Mapeamos o que sua família precisaria se você faltasse e **estruturamos o seguro certo** — cobertura na medida, sem pagar por excesso. O patrimônio cresce com tempo; a proteção precisa existir desde o primeiro dia.
- Internacional: Abrimos sua **conta internacional de investimentos** e estruturamos a dolarização de parte do patrimônio: acesso aos mercados globais, proteção contra o risco Brasil e, quando faz sentido, estrutura offshore eficiente em imposto e sucessão.
- Estruturação: Estruturamos sua **holding patrimonial**: a renda dos imóveis passa a ser tributada como empresa (em geral bem menos que na pessoa física) e a herança fica organizada em vida — sem inventário longo, caro e público para a sua família.

> Na prática, o plano tem de **1 a 7 passos**. O menor caso é só a Escola: alguém de 40 anos ou mais, sem dores marcadas e de baixo valor. O maior caso é alguém do perfil patrimonial que marcou várias dores.

### 3.5 Os números por trás do plano
- Barra dividida, que só aparece se o projetado é maior que o aportado: "Você aporta **R$ X** (a%)" | "Os juros constroem **R$ Y** (j%)".
- Tabela:
  - Horizonte considerado: N anos
  - Total que você vai aportar
  - Patrimônio projetado (dourado)
  - Ganho de juros sobre juros
  - Renda passiva ao final, por mês (dourado)
  - O custo de adiar 12 meses (vermelho)
- **Comparação do imóvel**, que só aparece se imóveis > 0:
  - Título: "A comparação que prometi: seu imóvel vs. investido"
  - Linhas:
    - Aluguel bruto estimado, por mês
    - Aluguel líquido (após IR, vacância, custos), por mês
    - Mesmo valor investido, por mês (dourado)
  - Nota com duas versões:
    - Se investir rende mais: "Com a Selic em 14,25%, o mesmo valor investido renderia cerca de R$ X a mais por mês — com liquidez e sem inquilino. Não é uma ordem de venda; é um número que merece análise."
    - Se não rende: "Nesse cenário, o imóvel se defende bem. Vale análise para decidir entre manter, rentabilizar melhor ou diversificar."

### 3.6 Fechamento
- Linha de perda, se aporte ou patrimônio > 0: Cada 12 meses de espera custam cerca de **R$ X** do seu resultado final. O melhor dia para começar já passou — o segundo melhor é hoje.
- **Bloco escuro "O passo de hoje":**
  - Texto: O plano está pronto. O único passo que ele não dá sozinho é o primeiro — e esse é seu.
  - Cartão do especialista, com foto, "Quem te recebe: {nome}" e cargo. Hoje está escondido, porque a configuração está vazia.
  - Botão do WhatsApp: **Seguir o plano com um especialista**
  - Nota: Seu especialista já recebe este diagnóstico completo — você não repete nada. Conversa sem compromisso, com **garantia de 100% do dinheiro de volta** no que decidir contratar.
- **AUVP na imprensa**, com 4 links: Correio Braziliense, Estado de Minas, Jornal de Brasília, Economia S/A.
- Prêmio: Eleita **2 vezes a melhor consultoria de investimentos do Brasil** pelo BTG Pactual.
- Aviso legal: Simulação ilustrativa com base na Selic vigente (14,25% a.a.). Não constitui promessa de rentabilidade, recomendação de investimento ou aconselhamento jurídico ou tributário. A renda passiva é estimada de modo a preservar o patrimônio da inflação.
- Link: Refazer diagnóstico

### 3.7 Mecânicas em volta do resultado
- **Barra de leitura** fina, que acompanha a rolagem.
- **Botão fixo** "Falar com um especialista": aparece depois de 360 px de rolagem, quando o botão principal do WhatsApp sai da tela.
- **Aviso de saída** (computador, quando o mouse sai pela borda de cima):
  - Título: "Antes de você sair…"
  - Texto: "Que tal pegar a opinião de um especialista em investimentos sobre o seu resultado? Leva poucos minutos, é sem custo e sem compromisso."
  - Botões: "Pegar a opinião de um especialista" e "Quero continuar lendo"
- **Encaminhamento automático** (celular):
  - Barra: "Sem resposta, levamos você a um especialista em **30s**", com um ✕ e o botão "Falar agora".
  - Rolar ou tocar na tela reinicia a contagem.
  - Quando zera, a página abre o WhatsApp sozinha.
- **WhatsApp:**
  - Número: 55 62 3413-9882
  - Mensagem fixa: "Terminei de preencher o meu questionário da AUVP. Quero receber o meu resultado." A mensagem não leva nenhum dado do resultado.

---

## 4. Cálculo

- Premissas fixas no código:
  - Selic de 14,25% a.a.
  - Inflação de 4,5% a.a.
  - Aluguel bruto de 0,4% do valor do imóvel ao mês
  - Aluguel líquido = 78% do bruto
- Taxa mensal nominal = (1+Selic)^(1/12) − 1. A taxa real desconta a inflação.
- Patrimônio futuro = patrimônio × (1+i)^n + aporte × ((1+i)^n − 1)/i.
- Renda passiva = patrimônio × taxa real mensal, para preservar o principal contra a inflação.
- Horizonte de 20 anos para quem tem menos de 40, e de 15 anos para os demais.
- Custo de adiar = projetado(N) − projetado(N−1).

## 5. O que acontece por trás (não aparece para a pessoa)

- Ao chegar no resultado, a página envia o lead para o webhook do n8n, que leva ao Salesforce.
- Dados enviados:
  - nome, WhatsApp no formato E.164 e e-mail;
  - todas as respostas e o patrimônio global;
  - perfil, valores projetados, score (0 a 119), prioridade (ALTA ≥ 81, MÉDIA ≥ 48, BASE) e tags;
  - UTMs.
- Eventos de funil vão para o `dataLayer` (GA4/GTM): `step_view`, `step_complete`, `result_view`, `result_unlock`, `wa_click`, `exit_intent_show`, `exit_intent_cta`, `auto_redirect` e `auto_redirect_cancel`.
- Os painéis internos ("Painel comercial", "Premissas da simulação") só aparecem fora de produção.

## 6. Visual atual (referência)

- Fundo creme (#F7F4EC), card branco de 600 px de largura e faixa preta no topo com o logo AUVP em dourado.
- Dourado #EFBF4F / #8F7427, verde #1E7F4F para o que é positivo e vermelho #A33B2E para perda.
- Títulos em serifa do sistema (Iowan/Palatino/Georgia) e texto em fonte do sistema. Não usa as fontes do DS (Anek Latin, Roboto, Sora).

## 7. Pontos da copy atual que batem com o manual de tom de voz

Só registro. Não mudei nada.

| Ponto | Onde aparece | O que o manual diz |
|---|---|---|
| "Garantia" e variações | Selo do contato, confiança da 06b e da 07, selo dos passos, nota do WhatsApp | Produto e Cx: "Garantia" e qualquer variação está na coluna do que não usamos |
| Travessão (—) | Em quase todos os textos | Sites: evitar travessão e tudo que pareça feito com IA |
| "Cliente educado ninguém engana" | Texto 2 da Escola | Escola: "Cliente" → use aluno/membro |
| "melhor escola de investimentos do Brasil" | Confiança da 01 | O manual traz como autoridade "maior escola de investimento do país" |
| "Diagnóstico patrimonial" | Sobretítulo e título da aba | A demanda chama de "Diagnóstico Financeiro" |
| "Última pergunta" na tela 07 | Sobretítulo | Depois dela ainda podem vir mais duas telas |
| "cada parte do seu plano aparece quando você chega nela" | Chegada do resultado | Deixa de fazer sentido quando o "Toque para revelar" sair |
