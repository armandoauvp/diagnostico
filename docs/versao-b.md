# Versão B: o que muda e por quê

A versão B parte da A e muda só o que está aqui. As regras de exibição continuam as mesmas: perguntas, opções, ordem, pulos, passos do plano e score. Os textos estão em `src/conteudo/b.ts`, e as chaves de comportamento em `src/conteudo/variantes.ts`. Cada recurso pode ser ligado ou desligado ali.

As referências entre aspas vêm do manual de Tom e Voz no Central.

## Copy

| O que mudou | Onde | Por quê |
|---|---|---|
| Os travessões viraram ponto, vírgula ou dois-pontos | Todas as telas e o resultado | Sites: "evitamos letras maiúsculas em todas as palavras de um título, travessão e tudo que possa dar a entender que a copy foi feita com I.A." |
| "Garantia incondicional: 100% do dinheiro de volta" → "devolvemos 100% do seu dinheiro" | Selo do contato, confiança da 07, nota do WhatsApp | Produto e Cx: "Garantia" e qualquer variação estão na coluna do que não usamos. A promessa continua, mas sem a palavra |
| Selo dos passos: "Garantia de 100%…" → "100% do dinheiro de volta se não fizer sentido" | Passos Escola e Consultoria | Mesmo motivo |
| "com a mesma garantia" → "com o mesmo cuidado" | Confiança da 06b | Mesmo motivo |
| "Cliente educado ninguém engana" → "Aluno que sabe avaliar ninguém engana" | Texto da Escola para alto valor | Escola: "Cliente" está nos termos proibidos (use aluno/membro) |
| "melhor escola de investimentos do Brasil" → "maior escola de investimento do país" | Confiança da 01 | O manual usa essa frase como autoridade da AUVP (Produto e Cx) |
| Saiu "Depois dessa, o seu número." | Texto da 07 | Pelo mesmo motivo: depois dessa ainda tem pergunta |
| "o mais resolvível" → "o mais fácil de resolver" | Texto da Escola para quem travou | Linguagem simples ("se idosos e crianças entenderem, todos entendem") |
| "é proposital" → "É de propósito." | Texto da Escola para alto valor | Mesmo motivo: fala de conversa |
| "investir o que libera" → "investir o que sobra" | Texto da Escola para dívidas | Mais concreto |
| "e você, educado, entende e valida" → "E você, que entende do assunto, valida" | Consultoria (diversificar) | "Educado" pode soar como "bem-comportado" |
| "AUVP — Diagnóstico patrimonial" → "AUVP · Diagnóstico patrimonial" | Título da aba | Travessão |

### Ajustes da auditoria no-ai-slop

Depois da revisão pelo manual, a B passou pela auditoria em [auditoria-no-ai-slop.md](auditoria-no-ai-slop.md). Tudo o que ela apontou foi corrigido na B, com estas regras:

- **Promessas:**
  - "falta só dizer para quem enviar" → "Diga quem é você para ver o plano."
  - "premissas abertas e auditáveis" → a Selic e a inflação usadas, com os números.
  - Saiu "nem de mercado".
- **Contrastes binários** ("não é X, é Y"): ficou só o Y. Dois foram mantidos de propósito, porque carregam o posicionamento anti-bancão: "e não de quem te vende" e "não a um banco que ganha comissão".
- **Frases de efeito no fim:** cortadas, sem trocar por outra metáfora. Exemplos: "um plano honesto vale mais que uma meta inflada", "custo corrói mais que volatilidade", "vira investidor mediano", "dorme tranquilo", "O segundo melhor é hoje".
- **Metadiscurso:** saíram "Está tudo aqui, em uma página só" e "Os passos abaixo estão na ordem certa".
- **Atribuição vaga:** "a maioria", "o mais comum" e "quase nunca" viraram "costuma" e "é comum", ou foram cortados.
- **Fato amaciado:** "uma fatia enorme do patrimônio" → "cerca de 40% do patrimônio final em 30 anos". A conta usa as premissas do próprio diagnóstico.
- **Negrito:** saiu das linhas de confiança e dos "Você sabia?". Ficou nos números do resultado.
- **Repetições:**
  - A linha de confiança da 06a, que repetia o texto, saiu.
  - "não só a bolsa" ficou só na confiança dos imóveis.
  - "sem custo e sem compromisso" ficou só no contato.
- **Outros:**
  - "endereçar" → "resolver"; "vs." → "comparado ao"; "vou mostrar" → "mostramos", para não trocar de voz.
  - Botão do contato: "Revelar meu plano" → "Ver meu plano", porque o efeito de revelar saiu.
  - Título do passo da Plataforma: "Investir onde você não é o produto" → "Ficar com o aluguel das suas ações".
  - Título do destaque do perfil privado: "Três estruturas para o seu patamar".

O teste `tests/copy-b.test.ts` trava esses padrões, para eles não voltarem quando a copy for editada.

**Continua pendente:** "Seu especialista já recebe este diagnóstico completo". Só é verdade se o lead chegar ao atendimento antes da conversa, e isso precisa ser confirmado com o time.

Ficou de fora de propósito: as menções ao BTG ("Eleita 2x a melhor consultoria do Brasil pelo BTG Pactual"). O manual permite usar o ranking como autoridade ("Top 1 no ranking BTG"); o que ele veta é usar o BTG para atacar ou comparar.

## Fluxo e interação

| Recurso | O que faz | Por quê |
|---|---|---|
| ~~Avanço automático~~ | Desligado nas correções de 16/11 | A pessoa às vezes clicava antes de ler ou escolher e a tela já avançava. Agora só o Continuar avança |
| ~~Atalhos de valor~~ | Desligados nas correções de 16/11 | Voltou a instrução "Arraste, use − e +, ou toque no valor acima para digitar", como na A |
| Horizonte na idade | "Seu plano vai olhar para os próximos 20 anos, até os 55." | Mostra na hora o efeito da resposta (a regra de 20 ou 15 anos já existe no cálculo) e dá sentido ao "é a variável que mais pesa" |
| ~~Prévia trancada no contato~~ | Desligada nas correções de 16/11 | Saiu o bloco "Já está pronto no seu plano" da tela 9 |
| Fechamento sem redirecionamento | No celular, sai a contagem de 30 s que abria o WhatsApp sozinho. No lugar, depois que a pessoa passa pelos números, sobe um convite ("Quando quiser, o seu especialista está a um toque.") com "Falar agora" e um ✕ | Abrir outro app sem a pessoa pedir corta a leitura justamente de quem está engajado. O convite aparece no momento de maior interesse e não tira ninguém da página. O aviso de saída do computador continua |

Os recursos desligados continuam no código. Cada um volta mudando a chave em `src/conteudo/variantes.ts`.

## Correções de 16/11 (A e B)

Vieram do PDF "Correções Diagnóstico Financeiro" e valem para as duas versões:

- Saiu o painel lateral "Seu plano". A pergunta fica centralizada, e o contador do topo ficou maior.
- A barra de progresso do topo é clicável e volta para qualquer pergunta já passada. Para quem respondeu "Ninguém ainda", a tela de nível fica travada, porque o fluxo a pulou.
- Tela 1: saiu a linha de confiança. O destaque passou para "Seu plano financeiro ao final".
- Tela 2: saiu "Cada resposta afina o seu número."
- Resultado: o título do número ficou "…construir em 20 anos investindo". A classificação virou uma frase ("Você é um construtor de patrimônio"), em `resultado.perfilFrase`.
- Resultado no tema escuro: o quadro do número e o do botão final ficam claros sobre o preto.
- Devolução no selo da tela 9 e na nota do botão final: "Se você não ficar satisfeito, nós devolvemos 100% do seu dinheiro após a emissão do certificado!"

## Eventos novos (só na B)

- `convite_show`, quando o convite aparece.
- `convite_close`, quando a pessoa fecha o convite.

## A validar antes de testar

- **Mensagem do WhatsApp:** ficou igual nas duas versões. Personalizar com nome e perfil ajudaria o atendimento, mas pode quebrar o roteamento do bot (Blip), que depende do texto. Isso precisa ser combinado com o atendimento.
- **Premissas:** a Selic de 14,25% continua fixa em `src/lib/diagnostico/config.ts`, como na v6.
