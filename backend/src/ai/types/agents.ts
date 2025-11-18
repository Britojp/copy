export type Tone = 'serio' | 'divertido' | 'persuasivo';

export type BuscadorDataItem = {
  nome: string;
  descricao: string;
  data: string | null;
  recorrencia: 'anual' | 'movel' | 'única' | 'desconhecida';
  relevancia: 'alta' | 'media' | 'baixa';
  tags: string[];
  oportunidades: string[];
  fontes?: string[];
};

export type BuscadorDataOutput = {
  nicho: string;
  regiao?: string;
  periodo?: string;
  datas: BuscadorDataItem[];
  observacoes?: string[];
};

export type BuscadorInformacoesItem = {
  nome: string;
  data: string | null;
  descricaoDetalhada: string;
  ideiasConteudo: string[];
  insights?: string[];
  referencias?: string[];
  status: 'ok' | 'insuficiente';
  observacoes?: string;
};

export type BuscadorInformacoesOutput = {
  nicho: string;
  regiao?: string;
  periodo?: string;
  itens: BuscadorInformacoesItem[];
};

export type EscritorDescricaoItem = {
  nome: string;
  data: string | null;
  descricaoPost: string;
  cta: string;
  hashtags: string[];
};

export type EscritorDescricaoOutput = {
  tom: Tone;
  itens: EscritorDescricaoItem[];
};

export type GeradorPromptImagemPostItem = {
  nome: string;
  data: string | null;
  promptBase: string;
  promptMidjourney: string;
  promptStableDiffusion: string;
  promptDalle: string;
  tema: string;
  elementos: string[];
  composicao: string;
  estilo: string;
  variacoes: string[];
  restricoes: string[];
  observacoes?: string;
};

export type GeradorPromptImagemPostOutput = {
  itens: GeradorPromptImagemPostItem[];
};


