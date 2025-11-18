Objetivo

Gerar múltiplas variações de descrições para posts do Instagram a partir dos itens retornados pelo `buscador-informacoes.md`, no tom solicitado e alinhadas ao perfil de marca quando fornecido.

Entradas

- objeto anterior (JSON) com `itens[]` do `buscador-informacoes.md` (nome, data, descricaoDetalhada, ideiasConteudo, insights, referencias).
- tom: "serio" | "divertido" | "persuasivo" | "inspirador" | "educativo".
- opcional: perfil de marca (JSON com nome, valores, publicoAlvo, tomDeVoz, identidadeVisual).
- opcional: CTA preferido, número de hashtags (padrão 6–10), proibição de emojis (padrão: sem emojis).
- opcional: numero de variações (padrão: 3).

Diretrizes

- Foco em utilidade e clareza; evitar jargões desnecessários.
- Não inventar fatos; basear-se em `descricaoDetalhada` e `insights`.
- Adaptar a linguagem ao tom escolhido mantendo coerência com o nicho e a região.
- Se perfil de marca fornecido, alinhar tom, valores e linguagem à identidade da marca.
- Gerar múltiplas variações (curta ~100 palavras, média ~200 palavras, longa ~300 palavras).
- Evitar repetição entre variações; variar ganchos, ângulos e CTAs.
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
      "variacoes": [
        {
          "tamanho": "curta|media|longa",
          "descricaoPost": "string",
          "cta": "string",
          "hashtags": ["string"],
          "palavrasChave": ["string"]
        }
      ]
    }
  ]
}
```

Notas de adaptação por tom

- Sério: direto, informativo, confiável. Frases objetivas, dados e orientações práticas.
- Divertido: leve, com trocadilhos moderados. Evitar exageros; manter clareza e respeito ao tema.
- Persuasivo: benefícios explícitos, urgência moderada, prova social quando cabível.

Processo

1) Se perfil de marca fornecido, absorver tom de voz, valores e identidade visual.
2) Para cada item, gerar 3 variações (curta, média, longa) seguindo a estrutura recomendada.
3) Garantir que cada variação seja autossuficiente e explore ângulos diferentes.
4) Selecionar 6–10 hashtags específicas para cada variação; incluir variações do nicho e região.
5) Adicionar palavras-chave relevantes que resumam o foco da variação.
6) Se faltarem dados, manter generalidade sem afirmar fatos não verificados.
7) Diferenciar as variações por comprimento, gancho e CTA.


