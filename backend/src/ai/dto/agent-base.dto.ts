import { IsOptional, IsString, IsUUID } from 'class-validator';

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
