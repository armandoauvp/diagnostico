# Auditoria do design: no-red-flags

O critério é a skill [armandoauvp/no-red-flags](https://github.com/armandoauvp/no-red-flags) (`SKILL.md` e `eval.md`), no modo **detectar**. Cada achado traz o sinal, o lugar e a correção em poucas palavras. Nada foi alterado e não há nota.

> **Status (18/11/2026):** os itens 1, 2 e 3 de "Por onde começar" foram aplicados nas versões A e B.
> - **Ícones:** saíram os ícones em quadradinho e os de enfeite. Ficaram só os que têm função: marcadores de seleção, − e +, check de campo válido, check e X dos dois futuros, logo do WhatsApp, X de fechar, botão de tema e a seta do Continuar.
> - **Animações:** saíram todas as que rodavam sozinhas, as entradas por seção e o pop e o pulinho no clique.
> - **Molduras:**
>   - O "Você sabia?", o selo do contato, o prêmio e a imprensa viraram texto direto, sem caixa nem caixa alta.
>   - A pílula acima do título saiu.
>   - A faixa de destaques perdeu os ícones e a linha tracejada. O texto ficou, porque "Seu plano financeiro" foi pedido nas correções de 16/11.
>   - O selo de cada passo virou uma linha de texto. Ele não saiu, porque depende da regra da v6.
>   - Os três cartões da tela 1 viraram lista.
>
> **Continuam abertos:**
> - item 4 (pisos de acessibilidade);
> - cor e superfície: sombra dourada, topo com desfoque e gradiente repetido;
> - raio único;
> - cálculo encenado;
> - modal de saída.

Auditei o estado de 17/11/2026, já com as correções de 16/11. Os achados valem para as versões A e B, porque as duas usam os mesmos componentes e o mesmo CSS. As linhas citadas são de `src/app/globals.css`, `src/components/*.tsx` e `src/components/icones.tsx`.

## Veredito

A skill trata como P0 a combinação de três ou mais "sinais instantâneos". Aqui aparecem quatro:

1. **Três cartões iguais com ícone em quadradinho** na tela 1.
2. **Rótulo em caixa alta acima dos títulos**: "Você sabia?", em todas as telas de pergunta.
3. **Orbe de luz** animado atrás do número e do CTA.
4. **Faixa de números com ícones** ("9 etapas rápidas · ~2 min · Seu plano financeiro ao final").

A sensação de "vibecodado" vem mais de três hábitos que se somam do que de um erro isolado:

- **Ícone em quadradinho dourado** em quase toda opção e em todo título de bloco.
- **Coisas que se mexem sozinhas**: orbe, brilho no botão, lâmpada pulsando, halo do gráfico e faíscas.
- **Moldura em tudo**: cartão, selo, pílula e caixinha em volta de texto.

## O que é da marca e fica

A skill manda a marca existente vencer as preferências dela. Por isso, estes pontos não entram como problema:

- **Fontes**: Anek Latin, Roboto e Sora vêm dos tokens `.escola` do Central. A skill lista Roboto como fonte padrão, mas aqui ela é decisão da marca.
- **Paleta**: o fundo creme com dourado é a paleta da AUVP Escola, não o "creme padrão" com terracota.
- **Tema escuro**: segue o sistema e tem contraste bom. O dourado no escuro também é da marca.
- **Contador "01 / 09" e passos numerados do plano**: as duas sequências são reais.
- **Logo do WhatsApp no botão**: o logo diz para onde o botão leva, então tem função.

---

## 1. Ícones (o ponto que você levantou)

São cerca de 45 ícones Phosphor diferentes no produto. Pela skill, ícone só fica quando substitui uma palavra ou marca uma função, sempre no tamanho do texto.

### Quantos aparecem por tela

| Tela | Ícones na tela | Quantos têm função |
|---|---|---|
| 1 · Objetivo | 3 ícones em quadradinho de 52px, 3 marcadores de seleção, 3 ícones na faixa de destaques e 1 seta (10 no total) | Só os 3 marcadores |
| 2 a 5 · Valores | − e +, a lâmpada do "Você sabia?" e 2 setas | − e + |
| 6 · Momento | Até 8 opções, cada uma com quadradinho e caixa de marcar (cerca de 18 no total) | Só as caixas de marcar |
| 7 e 8 | Cada opção com quadradinho e marcador | Só os marcadores |
| 9 · Contato | Pessoa, WhatsApp e envelope nos campos, até 3 checks de validação, o escudo do selo e 2 setas | Os checks (estado) |
| Resultado | Check no selo, 4 títulos com quadradinho, ampulheta 2x, check e X nos futuros, escudo em cada passo, 3 WhatsApp, 4 jornais, medalha e seta de refazer (cerca de 20 no total) | WhatsApp, X de fechar |

### Achados

| Sinal | Onde | Correção |
|---|---|---|
| Ícone em quadradinho (icon tile) | Opções de resposta: `.opcao .ico` (globals.css:225, 44px; 52px na tela 1, linha 251) com os glifos de `icones.tsx` | Tirar o quadradinho e o ícone. Título e apoio já dizem tudo, e a seleção já tem marcador |
| Ícone em quadradinho | Títulos dos blocos do resultado: `.bloco-h .ic` (globals.css:506) em Futuros, Plano e Números (Resultado.tsx:161, 200, 240) | Tirar. O h2 de 24px já faz a hierarquia |
| Ícone em quadradinho | Classificação do resultado: `.hero .perfil .ic` (Resultado.tsx:127), **colocado nas correções de 16/11** | Tirar. A frase já tem peso de título |
| Ícone de enfeite | Faixa de destaques da tela 1, com lista, cronômetro e alvo (Telas.tsx:156) | Texto sem ícone, ou tirar a faixa (ver seção 3) |
| Ícone de enfeite | Lâmpada pulsando no "Você sabia?" (Telas.tsx:81, globals.css:387) | Tirar a lâmpada e o círculo |
| Ícone de enfeite | Escudo no selo do contato (Telas.tsx:450) e escudo em cada passo do plano (Resultado.tsx:222) | Texto simples. Em cada passo, o escudo repete o mesmo selo |
| Ícone de enfeite | Ampulheta no aviso de espera e no fim do resultado (Resultado.tsx:147, 454) | Tirar. A cor de perda já marca o bloco |
| Ícone de enfeite | Jornal em cada link de imprensa e medalha no prêmio (Resultado.tsx:481, 486) | Só o nome do veículo. Sem a medalha |
| Ícone de enfeite | Pessoa e envelope nos campos do contato (Telas.tsx:385, 435) | Tirar. O placeholder já diz o campo. O WhatsApp pode ficar, porque explica o DDI |
| Check com efeito de comemoração | Check e faíscas no selo "Diagnóstico concluído" (Resultado.tsx:433–440) | Ver seção 4 |
| Seta em todo botão | Seta em Continuar, Começar e Voltar, com deslize no hover (Telas.tsx:66, 70; globals.css:376) | Pode ficar só no Continuar, porque avança. Sem o deslize |

---

## 2. Cor, brilho e superfície

| Sinal | Onde | Correção |
|---|---|---|
| Orbe de luz (aurora) | `.hero-brilho`, círculo dourado desfocado que "respira" sem parar atrás do número e do CTA (globals.css:480; Resultado.tsx:125, 460) | Tirar o orbe. O fundo liso do quadro basta |
| Sombra colorida | Sombra dourada no botão principal (globals.css:373–374), no botão do WhatsApp e no thumb do slider (globals.css:301, 308) | Sombra neutra curta ou nenhuma |
| Brilho que passa no botão | `.btn-wa::after` atravessa o botão a cada 3,4 s, para sempre (globals.css:600) | Tirar |
| Fundo translúcido com desfoque (glass) | Topo fixo com `backdrop-filter: blur` (globals.css:132–137) | Fundo sólido com uma linha fina embaixo. O desfoque do aviso de saída pode ficar, porque é sobreposição de verdade |
| Gradiente repetido | O gradiente dourado está no slider, no trilho, na barra dividida, na barra de leitura e na área do gráfico | Gradiente da marca uma vez só. No resto, dourado sólido |

## 3. Tipografia e texto como enfeite

| Sinal | Onde | Correção |
|---|---|---|
| Rótulo em caixa alta em todo lugar | "VOCÊ SABIA?" em todas as perguntas (globals.css:393), etiqueta de cada passo do plano (`.tag`, linha 560), "AUVP NA IMPRENSA" (linha 612) e a classe `.eyebrow` com risquinho (linha 203) | No máximo um rótulo por página. Nos passos, a etiqueta pode virar texto normal ou sair |
| Faixa de números (stat bar) | "9 etapas rápidas · ~2 min · Seu plano financeiro ao final", com linha tracejada (Telas.tsx:155; globals.css:257) | Virar uma frase no subtítulo ("São 9 perguntas, cerca de 2 minutos.") ou sair |
| Ponto no meio como separador | Título da aba da B: "AUVP · Diagnóstico patrimonial" (b.ts:87) | "Diagnóstico patrimonial AUVP" |
| Bolinha antes da linha de confiança | `.confianca i` (globals.css:396) | Tirar a bolinha |

## 4. Movimento

A skill permite um momento orquestrado por página. Fora isso, o movimento deve responder a uma ação da pessoa.

| Sinal | Onde | Correção |
|---|---|---|
| Animação que nunca para | Orbe que respira, brilho no botão, lâmpada pulsando (globals.css:389) e halo do gráfico em loop (linha 531) | Tirar todas. Nenhuma responde a uma ação |
| Entrada com fade e subida em toda seção | `.revela` em cada bloco do resultado (globals.css:449), mais o "Você sabia?" subindo atrasado (linha 385) | Deixar só a entrada do número. Os blocos aparecem parados |
| Comemoração | Faíscas, onda e pop no selo "Diagnóstico concluído" (globals.css:457–463) | Tirar as faíscas e a onda. Se quiser um momento, que seja o número contando |
| Exagero no clique | `pop` com escala de 1,16 no ícone ao escolher (linha 245), opção que sobe no hover (linha 223) e número que pula (linha 278) | Troca de cor e borda, sem escala |
| Cálculo encenado | Gráfico de curva perfeita e três etapas com check durante 2,6 s, sem nada sendo calculado (Calculando.tsx) | Decidir com o time. A conta é instantânea e a espera é encenação. Pelo menos tirar o gráfico de mentira |

## 5. Estrutura e componentes

| Sinal | Onde | Correção |
|---|---|---|
| Três cartões iguais | Tela 1: três cartões com ícone, título e duas linhas (globals.css:248–253) | Lista simples como nas outras telas, sem ícone |
| Moldura em tudo | "Você sabia?" em cartão abaixo do cartão (globals.css:382), selo do contato em caixa (343), prêmio em caixa (616) e cada link de imprensa em pílula (614) | Texto direto na página, separado por espaço ou linha fina |
| Pílula acima do título | "Diagnóstico concluído" com check, acima do h1 do resultado (Resultado.tsx:431) | Tirar. O título "Marina, aqui está o seu plano" já diz que acabou |
| Selo repetido em cada passo | Pílula "100% do dinheiro de volta…" em cada passo com garantia (globals.css:559) | Dizer uma vez, no CTA |
| Faixa lateral de destaque | `.callout` com borda esquerda dourada (globals.css:540) | Aceitável, porque é um destaque de verdade. Se ficar, que seja o único |
| Mesmo raio em tudo | 14px em opções, campos, botões, selo e callout; 20px nos cartões; pílula no resto | Escala com sentido: menor em campos e etiquetas, maior só nos quadros do resultado |
| Modal de saída | Aviso de saída que abre ao tirar o mouse da página (Resultado.tsx:354–366, 500) | Decisão de negócio herdada da v6. A skill pede tirar. Se ficar, que abra uma vez e não cubra a leitura |
| Barra de progresso de leitura | Barra fina no topo do resultado (Resultado.tsx:426) | Pode ficar, porque a página é longa. Se a página encurtar com os cortes acima, tirar |

## 6. Pisos de acessibilidade

O contraste foi calculado pelos tokens. A skill pede 4,5:1 para texto e 3:1 para texto grande e elementos de interface.

| Sinal | Onde | Medida | Correção |
|---|---|---|---|
| Texto fraco no tema claro | `--ink-3` no apoio das opções, na dica, nas pontas do slider, na confiança e no aviso | 4,30 sobre branco; 4,06 sobre o fundo creme | Escurecer `--ink-3` até cerca de hsl(40 12% 40%) |
| Borda de estado fraca | Borda dourada da opção marcada e do campo válido (`--gold` sobre branco) | 1,69 (mínimo 3) | A seleção também tem fundo e check, então não depende só da cor. Mesmo assim, usar `--gold-ink` na borda |
| Botão sem contorno no quadro invertido | Botão do WhatsApp sobre o creme, no tema escuro | 1,51 entre o botão e o fundo | O texto lê bem (9,1). Dar uma borda `--gold-ink` ao botão nesse quadro |
| Alvos de toque pequenos | Botão de tema com 34px (32px no celular), X do convite com 34px e **segmentos da barra de progresso com cerca de 16px de altura, clicáveis desde 16/11** | Menos de 44px | Aumentar a área de toque para 44px, mesmo com o desenho menor |

Estão em ordem: foco visível (`:focus-visible` global), navegação por teclado e `prefers-reduced-motion`.

---

## Por onde começar

Se a ideia é tirar a cara de "vibecodado" com o menor número de mudanças, esta é a ordem de maior efeito:

1. **Tirar os quadradinhos de ícone** das opções, dos títulos do resultado e da classificação. Esse é o sinal que mais aparece.
2. **Parar tudo o que se mexe sozinho**: orbe, brilho do botão, lâmpada, halo e faíscas.
3. **Tirar molduras e rótulos em caixa alta**: o cartão e o rótulo do "Você sabia?", a pílula acima do título, a faixa de destaques e os selos repetidos.
4. **Ajustar os pisos**: `--ink-3`, a área de toque da barra de progresso e o botão de tema.

Os três primeiros mexem só em CSS e em poucos componentes, e não tocam em regra nem em copy. O cálculo encenado e o modal de saída são decisões de produto e ficam para o time.
