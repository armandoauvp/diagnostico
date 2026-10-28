# Diagnóstico AUVP

Redesign do Diagnóstico (diagnostico.auvp.com.br) com a identidade da AUVP Escola. Ele substitui o Raio-X Financeiro.

São duas versões:

- **`/` (versão A):** mesmo fluxo, mesmas perguntas, mesmas regras e mesmos textos da v6 que está no ar, com o visual novo. O "Toque para revelar" saiu.
- **`/b` (versão B):** proposta de copy e de fluxo, com cada mudança justificada em [docs/versao-b.md](docs/versao-b.md).

A versão atual ficou guardada em [referencia/](referencia/): o HTML original e um mapa de todas as telas, textos e regras.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # paridade com a v6 + checagens da copy B
npm run build
```

## Variáveis de ambiente

Veja [.env.example](.env.example).

| Variável | Padrão | O que faz |
|---|---|---|
| `LEAD_WEBHOOK_ENABLED` | `false` | Só envia o lead ao n8n/Salesforce quando é `true` |
| `LEAD_WEBHOOK_URL` | — | O mesmo webhook da v6 |
| `NEXT_PUBLIC_MODO_REVISAO` | `false` | Libera `/variacoes` e o atalho `?etapa=<id>&perfil=<preset>`. Já vem ligado em `npm run dev` |
| `NEXT_PUBLIC_ANALYTICS_WEBHOOK` | — | Destino extra dos eventos de funil, além do `dataLayer` |

## Onde está cada coisa

```
src/lib/diagnostico/   regras puras, sem interface (é o que o Wendell confere)
  fluxo.ts             ordem das telas, pulo do "Ninguém ainda", padrão × patrimonial, validações
  calculo.ts           porte de compute() e build() da v6: projeções, passos do plano, score, tags
  valores.ts           escala dos sliders, passos de − e +, formatação
  telefone.ts          países, máscara e validação do WhatsApp
  envio.ts             payload do lead (igual ao da v6) e eventos de funil
  config.ts            WhatsApp, premissas (Selic etc.), imprensa, especialista
  presets.ts           perfis de exemplo para revisar variações
src/conteudo/          todos os textos
  a.ts                 versão A, a copy de hoje
  b.ts                 versão B, a proposta
  montar.ts            junta números + textos do resultado
src/components/        interface
src/app/               rotas: /, /b, /variacoes, /api/lead
tests/                 v6-original.ts (transcrição do código no ar) e paridade.test.ts
```

Para mudar a copy, mexa só em `src/conteudo/`. O negrito e o itálico ficam em HTML simples (`<b>`, `<em>`, `<i>`), como no site de hoje.

## Paridade com a v6

`tests/paridade.test.ts` gera 5.000 combinações de respostas. Em cada uma, compara o código novo com uma transcrição do `compute()`/`build()` que está no ar. A comparação é texto por texto e cobre número do herói, notas, plano e passos, tabela, imóvel, comparação, título, score, prioridade e tags. Quando alguém mudar uma regra, o teste avisa.

## Diferenças de comportamento em relação à v6

- **Revelar:** os blocos do resultado aparecem inteiros. Eles só entram com um fade suave ao rolar a página. O evento `result_unlock` deixou de existir.
- **Lead:**
  - O envio vai para `/api/lead`, que repassa ao n8n no servidor. A URL do webhook sai do código do navegador.
  - O payload tem um campo novo, `variante_design` (`a` ou `b`), para o teste A/B. Os outros campos e o `versao: "v6"` ficaram iguais, para não quebrar o mapeamento do n8n. Os eventos de funil também levam `variante_design`.
- **Telas novas no visual:**
  - O painel "Seu plano" acompanha as respostas: no computador fica ao lado das perguntas e, no celular, aparece como uma faixa nas telas de valor. A curva reage ao slider, mas o número continua trancado até o fim.
  - Cada passo do plano mostra a etiqueta do produto (Escola, Consultoria…). Esse dado já existia no código da v6, mas não aparecia.
- **Sobretítulos:** saíram de todas as telas, nas duas versões, porque repetiam o título, o contador ou o selo do resultado: "Sobre você", "Capacidade", "Ponto de partida", "Imóveis", "Seu momento", "Última pergunta", "Seu nível", "Diagnóstico concluído" (contato) e "Um instante" (cálculo). O da abertura ("Diagnóstico patrimonial AUVP") virou o nome da ferramenta no topo, ao lado da logo ("Diagnóstico patrimonial"), e aparece em todas as telas.
- **Logo:** sempre monocromática, com olho e texto na mesma cor: escura no tema claro e dourada no escuro.
- **Teclado:** Enter avança a tela quando a resposta é válida.
- **Revisão:** no modo revisão, a contagem de 30 s do celular aparece, mas não abre o WhatsApp.

## Deploy (Vercel)

```bash
npm i -g vercel
vercel link
vercel env add LEAD_WEBHOOK_ENABLED      # false no teste
vercel env add NEXT_PUBLIC_MODO_REVISAO  # true no preview de revisão
vercel deploy
```
