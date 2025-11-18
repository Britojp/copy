import { IsOptional, IsString, IsUUID, IsIn } from 'class-validator';

export class AgentBaseDto {
  @IsString()
  input!: string;

  @IsOptional()
  @IsUUID()
  correlationId?: string;

  @IsOptional()
  @IsUUID()
  parentRunId?: string;

  @IsOptional()
  @IsUUID()
  brandProfileId?: string;
}

export class PipelineDto extends AgentBaseDto {
  @IsOptional()
  @IsIn(['serio', 'divertido', 'persuasivo', 'inspirador', 'educativo'])
  tone?: 'serio' | 'divertido' | 'persuasivo' | 'inspirador' | 'educativo';

  @IsOptional()
  @IsString()
  visualPrefs?: string;
}

export class CreateBrandProfileDto {
  @IsString()
  nome!: string;

  @IsString()
  setor!: string;

  @IsOptional()
  publicoAlvo?: unknown;

  @IsOptional()
  valores?: unknown;

  @IsOptional()
  tomDeVoz?: unknown;

  @IsOptional()
  identidadeVisual?: unknown;

  @IsOptional()
  diferenciais?: unknown;

  @IsOptional()
  evitar?: unknown;
}

export class UpdateBrandProfileDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  setor?: string;

  @IsOptional()
  publicoAlvo?: unknown;

  @IsOptional()
  valores?: unknown;

  @IsOptional()
  tomDeVoz?: unknown;

  @IsOptional()
  identidadeVisual?: unknown;

  @IsOptional()
  diferenciais?: unknown;

  @IsOptional()
  evitar?: unknown;
}


