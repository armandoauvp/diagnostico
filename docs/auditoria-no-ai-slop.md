# Auditoria dos textos: no-ai-slop

Critério: os padrões de [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) (`SKILL.md` e `eval.md`), no modo **detectar**. Cada achado traz o padrão, o trecho e a correção em poucas palavras. Não reescrevi nada e não dei nota.

> **Status:** os achados foram corrigidos na versão B (veja [versao-b.md](versao-b.md#ajustes-da-auditoria-no-ai-slop)). A versão A continua com a copy de hoje, porque é o controle do teste.

Textos auditados: `src/conteudo/a.ts` (a copy de hoje), `src/conteudo/b.ts` (a proposta) e os rótulos novos do painel. A coluna **Versão** diz onde o problema aparece: **A**, **B** ou **A e B**.

## Visão geral

| Padrão | Quantidade | Comentário |
|---|---|---|
| Travessão | 41 na A, 0 na B | A regra do skill é a mesma do manual: em texto curto, nenhum |
| Contraste binário ("não é X, é Y") | 14 | É o padrão mais repetido. Ele vira o esqueleto de quase todo texto do plano |
| Frase de efeito no fim ("fake-profound kicker") | 13 | Muitos blocos terminam num aforismo |
| Negrito decorativo | 49 `<b>` na A | Bom para números; nos "Você sabia?" e nas linhas de confiança, ele só enfeita |
| Revelação com dois-pontos | 8 | Na B piorou: alguns travessões viraram dois-pontos dramáticos |
| Atribuição vaga ("a maioria", "quase nunca") | 6 | Falta fonte ou dado |
| Coisa fazendo verbo de gente | 6 | "a matemática está do seu lado", "o plano não dá o passo" |
| Metadiscurso (texto falando do próprio texto) | 4 | "Está tudo aqui, em uma página só" |
| Afirmação que pode não ser verdade | 5 | Ver seção própria. É o grupo mais importante |

---

## 1. Afirmações que podem não ser verdade

Isto vai além de estilo. O skill manda "não inventar e, sem fonte, perguntar", e estes trechos prometem algo que o produto talvez não entregue.

| Versão | Trecho | Problema | Correção |
|---|---|---|---|
| A e B | "Ele já é seu, falta só dizer para quem **enviar**." (contato) | Nada é enviado. O plano aparece na tela, e a mensagem do WhatsApp não leva o resultado | Trocar "enviar" pelo que acontece de fato |
| A e B | "Seu especialista já recebe este diagnóstico completo, você não repete nada." (nota do WhatsApp) | Só é verdade se o webhook estiver ligado e o atendimento encontrar o lead pelo telefone | Confirmar com o atendimento antes de manter |
| A e B | "Simulação com premissas **abertas e auditáveis**." (cálculo) | Em produção, a pessoa só vê a Selic. Inflação, aluguel e o desconto de 22% ficam escondidos | Mostrar as premissas ou tirar a frase |
| A e B | "um salário que cai todo mês, para sempre, e não depende de chefe nem de **mercado**" (herói, 40 a 49 anos) | Renda de investimento depende de mercado | Tirar "nem de mercado" |
| A | "Depois dessa, o seu número." (tela 07) | Depois dela ainda podem vir o nível e o contato | Já saiu na B |

## 2. Achados por tela

### 01 · Objetivo
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Frase portável | "Toda boa decisão de dinheiro começa pela vida que você quer." | Serviria a qualquer banco. Dizer o que a pessoa recebe |
| A | Travessão | "até onde o seu caminho leva hoje — e o que muda a rota." | Vírgula ou ponto |
| A | Atribuição vaga | "AUVP é **avaliada** a melhor escola de investimentos do Brasil." | Avaliada por quem? Citar a fonte |

### 02 · Idade
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Coisa fazendo verbo de gente (leve) | "quanto tempo os juros compostos têm para **trabalhar** a seu favor" | É expressão comum do mercado. Pode ficar |
| A e B | Negrito decorativo | "<b>Tempo costuma pesar mais do que o tamanho do aporte.</b>" | Tirar o negrito |

### 03 · Aporte
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Frase de efeito no fim | "um plano honesto vale mais que uma meta inflada" | Cortar e terminar em "Use o número real." |
| A | Travessão | "planejam com fatos — um plano honesto" | — |
| A e B | Revelação com dois-pontos | "Constância vence intensidade: aportes menores e regulares…" | Começar pelo fato ("Aportes menores e regulares…") |

### 04 · Patrimônio
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Fato amaciado | "pode consumir **uma fatia enorme** do patrimônio" | Pôr o número (quanto 2% ao ano come em 20 ou 30 anos) |
| A e B | Frase de efeito no fim | "No longo prazo, custo corrói mais que volatilidade." | Cortar e deixar o número falar |
| A | Travessão | "e cripto — um valor aproximado já basta" | — |

### 05 · Imóveis
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Repetição na mesma tela | Na confiança, "…não só o que está na bolsa"; no Você sabia, "…não só a bolsa" | Tirar de um dos dois |
| A e B | Voz trocando | "**vou** mostrar uma comparação que **nossos** consultores fazem" (e no resultado, "A comparação que **prometi**") | Escolher eu ou nós |
| A | Travessão (2x) | "patrimônio completo — não só", "pouco líquido — contar com ele" | — |
| B | Revelação com dois-pontos | "mas é pouco líquido: contar com ele…" | Ponto |

### 06a · Dores (padrão)
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Contraste binário + revelação com dois-pontos | "quase nunca tem um problema de renda: tem um problema de método e de prioridades" | Dizer só o Y |
| A e B | Atribuição vaga | "quase nunca" | Fonte ou "muitas vezes" |
| A e B | Redundância | No texto, "cada resposta muda a recomendação"; na confiança, "mais precisa a recomendação" | Tirar um |

### 06b · Dores (patrimonial)
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Advérbio vazio + estrangeirismo | "É **exatamente** isso que o seu especialista vai **endereçar** primeiro." | Tirar "exatamente". Trocar "endereçar" por "resolver" (o manual também veta estrangeirismo) |
| A e B | Frase de efeito no fim | "A maior perda costuma ser o que não foi estruturado a tempo." | Cortar ou dar um exemplo concreto |
| A | Travessão | "todos os portes — com a mesma garantia" | — |

### 07 · Quem cuida
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Metadiscurso / exagero | "Uma das respostas mais reveladoras para o seu consultor." | Dizer o que muda com a resposta |
| A e B | Contraste binário | "o primeiro ganho não é render mais, é parar de perder" | "o primeiro ganho costuma ser parar de perder" |

### 08 · Nível
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Advérbio vazio | "isso muda **completamente** o que vamos recomendar" | Tirar |
| A e B | Contraste binário | "Você não precisa virar especialista. Precisa de um método…" | Dizer só o Y |
| A e B | Abstração | "método replicável" | Dizer o que o método faz |
| A | Travessão dramático | "Cada nível recebe um plano diferente — o seu." | — |
| B | Revelação com dois-pontos | "Cada nível recebe um plano diferente: o seu." | Cortar "o seu" ou reescrever |

### 09 · Contato
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Vago | "Seu plano está calculado e **protegido**." | Protegido de quê? Ser concreto ou tirar |
| A | Travessão (2x) | "Ele já é seu — falta…", "Confira o número — parece incompleto." | — |
| A e B | Repetição | "sem custo e sem compromisso" aparece no contato, no aviso de saída e na nota do WhatsApp | Manter em um lugar |

### Cálculo
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Frase portável | "cruzando as suas respostas com o cenário atual" | Dizer o quê: Selic, inflação |

## 3. Resultado

| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Metadiscurso | "Está tudo aqui, em uma página só. Desça no seu ritmo." | Cortar. O título já basta |
| A e B | Frase de efeito no fim | "a liberdade de decidir se ainda *quer* trabalhar" (herói, menos de 40) | Terminar no valor por mês |
| A e B | Lista negativa | "não depende de chefe nem de mercado" (herói, 40 a 49) | Ver a seção 1 |
| A e B | Metáfora fofa | "O plano coloca + R$ X **no seu lado da mesa**." | "O plano rende + R$ X a mais." |
| A e B | Coisa fazendo verbo de gente + frase de efeito | "A matemática está do seu lado. O que falta é método, e método se aprende." | Cortar a primeira frase |
| A e B | Metadiscurso | "Os passos abaixo estão na ordem certa." (perfil privado) | Cortar |
| A e B | Aforismo | "No seu patamar, estrutura preserva mais do que rentabilidade." | Começar pelo concreto (holding, conta fora) |
| A e B | Advérbio vazio | "É **exatamente** essa conversa que ele vai conduzir" | Tirar |

### Passos do plano
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Frase dramática | "O critério para nunca mais depender de ninguém. Nem de nós." | Uma frase só, sem o golpe |
| A e B | Preâmbulo de falso insight | "Pode parecer estranho uma consultoria recomendar que você estude primeiro" (Escola, alto valor) | Ir direto ao motivo |
| A e B | Frase de efeito no fim | "Cliente/Aluno … ninguém engana, e é com ele que fazemos o melhor trabalho." | Cortar |
| A e B | Contraste binário (2x) | "uma habilidade, não um produto que se compra"; "dependa de você, e não de quem te vende" (Escola, renda) | Ficar com um ou nenhum |
| A e B | Atribuição vaga + frase de efeito | "é aqui que **a maioria** estaciona"; "Investidor que para de estudar vira investidor mediano." (Escola, avançado) | Fonte ou cortar; cortar o fecho |
| A e B | Contraste binário | "quase nunca é falta de informação, é falta de método" (Escola, intermediário) | Dizer só o Y |
| A e B | Atribuição vaga | "é o ponto **mais comum**" (Escola, quem travou) | Fonte ou "é comum" |
| A e B | Contraste binário + vago + frase de efeito | "não é pegar mais crédito, é **virar o jogo** do seu dinheiro"; "É a base de tudo." (Escola, dívidas) | Dizer o primeiro passo concreto; cortar o fecho |
| A e B | Clichê | Título "Investir onde você não é o produto" | Título com o benefício (o aluguel das ações) |
| A e B | Vago | "nos bancos digitais elas mal são alugadas" | Número ou cortar |
| A e B | Revelação com dois-pontos | "Na plataforma AUVP é diferente: o aluguel…" | Ponto |
| A e B | Contraste binário + ritmo robótico | "A educação te dá o critério; um consultor dedicado te devolve tempo…"; "respondendo a você, não a um banco…" (Consultoria) | Quebrar a simetria; ficar com um contraste |
| A e B | Revelação com dois-pontos + metáfora | "Concentração é o risco silencioso:" | Começar pelo fato |
| A e B | Revelação com dois-pontos + frase de efeito | "…é uma engenharia:"; "dorme tranquilo" | Cortar o enquadramento e o fecho |
| A e B | Aforismo simétrico | "O patrimônio cresce com tempo; a proteção precisa existir desde o primeiro dia." (Proteção) | Cortar |
| A e B | Contraste binário | "Não é uma ordem de venda; é um número que merece análise." (imóvel) | "Vale analisar." |

### Fechamento
| Versão | Padrão | Trecho | Correção |
|---|---|---|---|
| A e B | Frase de efeito (provérbio) | "O melhor dia para começar já passou. O segundo melhor é hoje." | Cortar. O custo em R$ já faz o trabalho |
| A e B | Repetição | O custo de adiar aparece igual no herói e no fechamento | Variar ou tirar um |
| A e B | Coisa fazendo verbo de gente + frase de efeito | "O único passo que ele (o plano) não dá sozinho é o primeiro, e esse é seu." | Dizer a ação: "Fale com um especialista no WhatsApp." |
| A e B | Pergunta retórica (leve) | "Que tal pegar a opinião de um especialista…" | Pode ficar; é tom de conversa |
| B | Frase portável | "Quando quiser, o seu especialista está a um toque." | Dizer o que acontece no toque |

## 4. O que está bom (manter)

Seguindo o skill, estes trechos não devem ser alisados:

- Os números concretos: "Em 8 semanas", "mais de 36 mil investidores", "mais de 20 bancos", "cerca de 30% do aluguel", o custo de adiar em R$.
- As frases com voz própria: "Sem modéstia e sem vergonha", "e provavelmente está certo", "Casa própria conta."
- As opções de resposta: curtas, na primeira pessoa e específicas ("Cartão, empréstimo, financiamento caro").
- O aviso legal: é texto jurídico e está fora do escopo.

## 5. O que a versão B corrigiu e o que ela piorou

- **Corrigiu:**
  - todos os travessões;
  - "garantia";
  - "cliente";
  - "Última pergunta" e "Depois dessa, o seu número".
- **Piorou:** em 5 pontos, o travessão virou dois-pontos dramático: imóveis (Você sabia), nível (confiança), consultoria, proteção e imóvel ("Não é uma ordem de venda: é um número…"). O problema de ritmo continuou, só mudou o sinal.
- **Não mexeu:** os contrastes binários e as frases de efeito, que são o padrão mais forte do texto.
