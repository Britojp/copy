Objetivo

Gerar 3 opções de legendas para posts do Instagram a partir dos itens retornados pelo `buscador-informacoes.md`, no tom solicitado e alinhadas ao perfil de marca quando fornecido. Cada opção deve conter uma versão curta e uma versão média, totalizando 6 legendas.

Entradas

- objeto anterior (JSON) com `itens[]` do `buscador-informacoes.md` (nome, data, descricaoDetalhada, ideiasConteudo, insights, referencias).
- tom: "serio" | "divertido" | "persuasivo" | "inspirador" | "educativo".
- opcional: perfil de marca (JSON com nome, valores, publicoAlvo, tomDeVoz, identidadeVisual).
- opcional: CTA preferido, número de hashtags (padrão 6–10), proibição de emojis (padrão: sem emojis).

Diretrizes

- Foco em utilidade e clareza; evitar jargões desnecessários.
- Não inventar fatos; basear-se em `descricaoDetalhada` e `insights`.
- Adaptar a linguagem ao tom escolhido mantendo coerência com o nicho e a região.
- Se perfil de marca fornecido, alinhar tom, valores e linguagem à identidade da marca.
- Gerar 3 opções distintas, cada uma com uma versão curta (~100 palavras) e uma versão média (~200 palavras).
- Cada opção deve explorar um ângulo diferente, variando ganchos, abordagens e CTAs.
- Evitar repetição entre as 3 opções; cada uma deve ter uma perspectiva única.
- Sem emojis por padrão; só usar se explicitamente solicitado ou se perfil de marca indicar.
- Limitar cada descrição a ~1.800 caracteres.
- Inserir hashtags relevantes ao final, respeitando o limite solicitado.

Estrutura recomendada por item

1) Gancho curto (1–2 frases) alinhado ao tom.
2) Corpo que contextualiza a data/tema com 2–4 pontos chave úteis para a audiência.
3) CTA claro e específico (ex.: comente, salve, compartilhe, agende, confira link).
4) Hashtags relacionadas ao nicho/tema/região.

Formato de resposta

```json
{
  "tom": "serio|divertido|persuasivo|inspirador|educativo",
  "marcaAplicada": "string | null",
  "itens": [
    {
      "nome": "string",
      "data": "YYYY-MM-DD | null",
      "opcoes": [
        {
          "numero": 1,
          "curta": {
            "descricaoPost": "string",
            "cta": "string",
            "hashtags": ["string"],
            "palavrasChave": ["string"]
          },
          "media": {
          "descricaoPost": "string",
          "cta": "string",
          "hashtags": ["string"],
          "palavrasChave": ["string"]
          }
        }
      ]
    }
  ]
}
```

IMPORTANTE: Deve gerar exatamente 3 opções (numero: 1, 2, 3) para cada item, cada uma com curta e media.

Notas de adaptação por tom

- Sério: direto, informativo, confiável. Frases objetivas, dados e orientações práticas.
- Divertido: leve, com trocadilhos moderados. Evitar exageros; manter clareza e respeito ao tema.
- Persuasivo: benefícios explícitos, urgência moderada, prova social quando cabível.

Processo

1) Se perfil de marca fornecido, absorver tom de voz, valores e identidade visual.
2) Para cada item, gerar exatamente 3 opções distintas, cada uma com uma versão curta e uma versão média.
3) Cada opção deve explorar um ângulo diferente: variar o gancho inicial, a abordagem do conteúdo e o CTA.
4) Garantir que cada legenda seja autossuficiente e completa.
5) Selecionar 6–10 hashtags específicas para cada legenda (curta e média); incluir variações do nicho e região.
6) Adicionar palavras-chave relevantes que resumam o foco de cada legenda.
7) Se faltarem dados, manter generalidade sem afirmar fatos não verificados.
8) Diferenciar as 3 opções por perspectiva, gancho, abordagem e CTA, garantindo variedade real entre elas.


