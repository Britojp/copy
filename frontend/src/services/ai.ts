import { post } from './http';
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
  return post<AgentStepResponse>('ai/buscador-data', body);
}

export function aiBuscadorInformacoes(body: BuscadorInformacoesRequest) {
  return post<AgentStepResponse>('ai/buscador-informacoes', body);
}

export function aiEscritorDescricao(body: EscritorDescricaoRequest) {
  return post<AgentStepResponse>('ai/escritor-descricao', body);
}

export function aiGeradorPromptImagemPost(body: GeradorPromptImagemPostRequest) {
  return post<AgentStepResponse>('ai/gerador-prompt-imagem-post', body);
}

export function aiPipeline(body: PipelineRequest) {
  return post<ApiResult>('ai/pipeline', body);
}


