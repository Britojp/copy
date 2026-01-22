import { post, AI_REQUEST_TIMEOUT, AI_ESCRITOR_DESCRICAO_TIMEOUT } from './http';
import {
  type ApiResult,
  type AgentStepResponse,
  type BuscadorDataRequest,
  type BuscadorInformacoesRequest,
  type EscritorDescricaoRequest,
  type GeradorPromptImagemPostRequest,
  type PipelineRequest,
} from '../types/ai';

export function aiBuscadorData(body: BuscadorDataRequest) {
  return post<AgentStepResponse>('ai/buscador-data', body, undefined, AI_REQUEST_TIMEOUT);
}

export function aiBuscadorInformacoes(body: BuscadorInformacoesRequest) {
  return post<AgentStepResponse>('ai/buscador-informacoes', body, undefined, AI_REQUEST_TIMEOUT);
}

export function aiEscritorDescricao(body: EscritorDescricaoRequest) {
  return post<AgentStepResponse>('ai/escritor-descricao', body, undefined, AI_ESCRITOR_DESCRICAO_TIMEOUT);
}

export function aiGeradorPromptImagemPost(body: GeradorPromptImagemPostRequest) {
  return post<AgentStepResponse>('ai/gerador-prompt-imagem-post', body, undefined, AI_REQUEST_TIMEOUT);
}

export function aiPipeline(body: PipelineRequest) {
  return post<ApiResult>('ai/pipeline', body, undefined, AI_REQUEST_TIMEOUT);
}

export type SaveApprovedLegendaRequest = {
  brandProfileId?: string;
  nome?: string;
  data?: string;
  tipo: string;
  opcaoNumero?: number;
  descricaoPost: string;
  cta?: string;
  hashtags?: string[];
  palavrasChave?: string[];
  correlationId?: string;
  runId?: string;
};

export function saveApprovedLegenda(body: SaveApprovedLegendaRequest) {
  return post<{ id: string }>('ai/approved-legendas', body);
}


