export type Tone = 'serio' | 'divertido' | 'persuasivo' | 'inspirador' | 'educativo';

export type ApiResult<T = unknown> = T | { result: string };

export type AgentStepResponse<T = unknown> = {
  runId: string | null;
  correlationId: string | null;
  output: ApiResult<T>;
};

export type BuscadorDataRequest = { input: string; correlationId?: string; parentRunId?: string; brandProfileId?: string };
export type BuscadorInformacoesRequest = { input: string; correlationId?: string; parentRunId?: string; brandProfileId?: string };
export type EscritorDescricaoRequest = { input: string; correlationId?: string; parentRunId?: string; brandProfileId?: string };
export type GeradorPromptImagemPostRequest = { input: string; correlationId?: string; parentRunId?: string; brandProfileId?: string };
export type PipelineRequest = { input: string; tone?: Tone; visualPrefs?: string; brandProfileId?: string };


