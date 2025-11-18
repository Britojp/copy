Objetivo

Para cada item retornado pelo buscador de datas, pesquisar rapidamente na web por inspirações e sintetizar uma descrição detalhada, ideias de conteúdo e referências confiáveis.

Entradas

- objeto anterior (JSON) contendo `nicho`, `regiao`, `periodo`, e `datas[]` do `buscador-data.md`.
- idioma preferido (opcional): pt-BR por padrão.

Estratégia

1) Para cada item em `datas[]`:
   - Gerar 3 a 5 consultas curtas e diferentes que combinem o nome do evento, nicho e região.
   - Usar ferramenta de HTTP GET para obter páginas públicas relevantes; priorizar fontes oficiais, órgãos, veículos reconhecidos.
   - Extrair fatos centrais (o que é, objetivos, público, contexto histórico, edições/recorrência, ações típicas).
   - Sintetizar descrição de 120–220 palavras, clara, prática e adequada ao nicho e região.
   - Propor 2–4 ideias de conteúdo aplicáveis (post, campanha, ação local, conteúdo multimídia).
   - Coletar 1–3 URLs de referência confiáveis.
2) Quando a data for móvel ou parcial, explicar sucintamente a lógica/variação na síntese.
3) Se a pesquisa não trouxer fonte confiável, sinalizar `status: "insuficiente"` e produzir uma descrição breve baseada em conhecimento geral, com aviso em `observacoes`.

Regras

- Priorizar precisão e utilidade prática para criação de conteúdo.
- Não inventar números ou fatos; evite especulação. Cite fontes quando possível.
- Manter linguagem objetiva, evitando jargões desnecessários.
- Respeitar limites: por item, até ~220 palavras na descrição e até 4 ideias.
- Evitar repetir as mesmas ideias entre itens; variar ângulos e formatos.

Formato de resposta

```json
{
  "nicho": "string",
  "regiao": "string",
  "periodo": "string",
  "itens": [
    {
      "nome": "string",
      "data": "YYYY-MM-DD | null",
      "descricaoDetalhada": "string",
      "ideiasConteudo": ["string"],
      "insights": ["string"],
      "referencias": ["url"],
      "status": "ok|insuficiente",
      "observacoes": "string"
    }
  ]
}
```

Dicas de consulta

- Combinar: [nome oficial] + [nicho] + [regiao/país] + "significado" | "história" | "campanhas" | "ações".
- Para campanhas sazonais: incluir termos como "iniciativas", "marketing", "mídias sociais", "guia".


