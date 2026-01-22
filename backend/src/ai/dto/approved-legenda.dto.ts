import { IsOptional, IsString, IsUUID, IsInt } from 'class-validator';

export class SaveApprovedLegendaDto {
  @IsOptional()
  @IsUUID()
  brandProfileId?: string;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  data?: string;

  @IsString()
  tipo!: string;

  @IsOptional()
  @IsInt()
  opcaoNumero?: number;

  @IsString()
  descricaoPost!: string;

  @IsOptional()
  @IsString()
  cta?: string;

  @IsOptional()
  hashtags?: string[];

  @IsOptional()
  palavrasChave?: string[];

  @IsOptional()
  @IsUUID()
  correlationId?: string;

  @IsOptional()
  @IsUUID()
  runId?: string;
}
