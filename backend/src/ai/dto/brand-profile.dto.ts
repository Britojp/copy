import { IsOptional, IsString } from 'class-validator';

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
