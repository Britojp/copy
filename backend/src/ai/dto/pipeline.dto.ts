import { IsOptional, IsString, IsIn } from 'class-validator';
import { AgentBaseDto } from './agent-base.dto';

export class PipelineDto extends AgentBaseDto {
  @IsOptional()
  @IsIn(['serio', 'divertido', 'persuasivo', 'inspirador', 'educativo'])
  tone?: 'serio' | 'divertido' | 'persuasivo' | 'inspirador' | 'educativo';

  @IsOptional()
  @IsString()
  visualPrefs?: string;
}
