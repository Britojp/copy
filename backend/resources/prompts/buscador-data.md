Objetivo

Identificar e listar datas comemorativas, campanhas e efemérides relevantes para um nicho específico, priorizando aquelas com maior impacto cultural, de mídia ou potencial de engajamento.

Entradas

- nicho: área de interesse (ex.: médico, odontologia, nutrição, esportes, pet, educação, tecnologia).
- país/região (opcional): contexto cultural e calendário (ex.: Brasil, Portugal, Global).
- período (opcional): intervalo alvo (ex.: próximo mês, trimestre, ano atual).

Saída esperada

- Lista estruturada de datas com: nome oficial, descrição curta, data (ISO 8601 quando possível), recorrência (anual, móvel), relevância (alta/média/baixa), tags do nicho, oportunidades de conteúdo.
- Se não houver datas específicas do nicho, retornar correlatas amplas e justificar a relação.

Formato de resposta

```json
{
  "nicho": "string",
  "regiao": "string",
  "periodo": "string",
  "datas": [
    {
      "nome": "string",
      "descricao": "string",
      "data": "YYYY-MM-DD | null",
      "recorrencia": "anual|movel|única|desconhecida",
      "relevancia": "alta|media|baixa",
      "tags": ["string"],
      "oportunidades": ["string"],
      "fontes": ["url"]
    }
  ],
  "observacoes": ["string"]
}
```

Estratégia

1) Mapear termos do nicho para datas típicas (ex.: médico → Dia do Médico, campanhas de saúde; esportes → Olimpíadas, Copas, maratonas).
2) Considerar campanhas sazonais e de saúde pública (ex.: Outubro Rosa, Novembro Azul), eventos esportivos recorrentes (ex.: finais, ligas, temporadas), conferências e dias internacionais da ONU/UNESCO.
3) Priorizar fontes confiáveis e oficiais; quando a data for móvel, indicar regra de cálculo (ex.: “primeiro domingo de…”).
4) Normalizar datas para ISO 8601 quando houver dia específico; se for somente mês, usar null e descrever no campo recorrencia/observacoes.
5) Adaptar ao país/região quando informado; quando não informado, priorizar Brasil e Global.

Regras

- Ser preciso, sucinto e focado no nicho solicitado.
- Evitar listas genéricas extensas; priorizar relevância e impacto de marca/conteúdo.
- Incluir no mínimo 8 e no máximo 25 itens relevantes.
- Sempre incluir pelo menos 1 oportunidade de conteúdo por item (ex.: ideia de post, campanha, ação local).
- Incluir links de referência quando possível; se indisponível, omitir fontes.
- Quando a data não for fixa, explicar a lógica em observacoes.

Exemplos de mapeamento rápido

- Médico: Dia do Médico (18-10 BR), campanhas de prevenção (Outubro Rosa, Novembro Azul), Dia Mundial da Saúde (07-04).
- Esportes: Olimpíadas/Paralimpíadas (anos correspondentes), Copa do Mundo, finais de ligas nacionais, Dia do Esportista.
- Nutrição: Dia do Nutricionista (31-08 BR), Semana da Alimentação, Dia Mundial da Alimentação (16-10).
- Pet: Dia do Veterinário (09-09 BR), campanhas de adoção, vacinação, Dia Mundial dos Animais (04-10).

Pós-processamento

- Ordenar por proximidade da data no período informado; se ausente, por relevância.
- Desduplicar e normalizar nomes/tags.
- Validar consistência mínima dos campos antes de retornar.


