Objetivo

Gerar um prompt de imagem para criação de arte de post no Instagram, combinando o conteúdo produzido por `escritor-descricao.md` e os dados enriquecidos por `buscador-informacoes.md`, garantindo coerência visual com o tema, nicho e região.

Entradas

- objeto A (JSON) de `escritor-descricao.md`: itens com nome, data, descricaoPost, cta, hashtags, tom.
- objeto B (JSON) de `buscador-informacoes.md`: itens com nome, data, descricaoDetalhada, ideiasConteudo, insights, referencias.
- preferências visuais (opcional): paleta, estilo, fotografia/ilustração, tipografia, proporção, restrições de marca.

Diretrizes

- O prompt deve descrever claramente o tema, elementos visuais principais e estilo, evitando ambiguidades.
- Priorizar legibilidade para feed e stories: contraste adequado, hierarquia visual, áreas de respiro para texto.
- Se houver data específica, refletir o clima/temporada/local quando fizer sentido.
- Para nichos regulados (saúde, finanças), manter sobriedade e evitar claims não comprovados.
- Evitar incluir texto extenso renderizado na imagem; reservar espaço para título curto apenas se necessário.
- Adequar a linguagem do prompt ao gerador de imagens (ex.: Midjourney, SDXL, Firefly, DALL·E). Se não informado, gerar versão neutra e anotar variações.

Campos visuais sugeridos

- tema: descrição curta do assunto central e público-alvo.
- elementos: 3–6 elementos visuais específicos relacionados ao nicho/tema.
- composição: enquadramento, foco, profundidade, hierarquia, espaço negativo para título ou selo de data.
- estilo: fotográfico/ilustrado, realista/minimalista/flat, textura, iluminação, paleta (se informado).
- variações: 2–3 alternativas de estilo ou composição.
- restricoes: o que evitar (ex.: conteúdo sensível, estereótipos, excesso de texto).

Formato de saída

```json
{
  "itens": [
    {
      "nome": "string",
      "data": "YYYY-MM-DD | null",
      "promptBase": "string",
      "promptMidjourney": "string",
      "promptStableDiffusion": "string",
      "promptDalle": "string",
      "tema": "string",
      "elementos": ["string"],
      "composicao": "string",
      "estilo": "string",
      "variacoes": ["string"],
      "restricoes": ["string"],
      "observacoes": "string"
    }
  ]
}
```

Processo

1) Para cada item:
   - Extrair do objeto B os pontos visuais fortes (insights, ideiasConteudo) e do objeto A o tom e CTA para orientar a atmosfera da arte.
   - Definir tema, elementos e composição coerentes com nicho/região e com o período da data.
   - Produzir um prompt neutro (promptBase) e adaptá-lo para 3 motores populares.
   - Incluir 2–3 variações bem distintas de estilo/composição.
2) Manter prompts entre 180–400 caracteres quando possível; ser específico sem listar texto corrido demais.
3) Se houver preferências visuais, incorporá-las; caso contrário, sugerir paleta e estilo compatíveis com o tema.
4) Evitar termos vagos (“bonito”, “legal”); preferir referências visuais concretas (iluminação, texturas, ângulos, materiais).

Exemplo de construção de prompt

- Base: “Poster Instagram sobre [evento] para público [nicho/região], foco em [benefício/conceito], paleta [cores], iluminação [tipo], estilo [estilo], composição com espaço para título curto no topo, alta legibilidade, contraste elevado, sem texto longo renderizado, sem marcas.”


