# Perfil de Marca (Brand Profile)

## Objetivo
Capturar e estruturar informações essenciais sobre a identidade da marca para garantir consistência em todas as comunicações.

## Entrada esperada
- Nome da marca
- Setor/nicho de atuação
- Público-alvo
- Valores e missão
- Tom de voz desejado
- Paleta de cores (opcional)
- Referências visuais (opcional)

## Saída esperada (JSON)
```json
{
  "nome": "string",
  "setor": "string",
  "publicoAlvo": {
    "faixaEtaria": "string",
    "interesses": ["string"],
    "comportamento": "string"
  },
  "valores": ["string"],
  "tomDeVoz": {
    "principal": "serio|divertido|persuasivo|inspirador|educativo",
    "caracteristicas": ["string"]
  },
  "identidadeVisual": {
    "paletaCores": ["string"],
    "estiloPreferido": "string",
    "elementosVisuais": ["string"]
  },
  "diferenciais": ["string"],
  "evitar": ["string"]
}
```

## Diretrizes
1. Ser específico sobre o público-alvo (idade, interesses, dores, aspirações)
2. Definir claramente o tom de voz e dar exemplos
3. Listar palavras/frases que a marca usa frequentemente
4. Identificar temas e assuntos que NÃO devem ser abordados
5. Capturar a essência da marca em poucas frases

## Processo
1. Extrair informações fornecidas pelo usuário
2. Inferir características complementares baseadas no nicho
3. Sugerir tom de voz apropriado se não especificado
4. Validar consistência entre valores, tom e público
5. Retornar JSON estruturado para reutilização

