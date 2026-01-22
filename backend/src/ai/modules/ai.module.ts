import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from '../services/gemini.service';
import { AgentService } from '../services/agent.service';
import { MarkdownService } from '../services/markdown.service';
import { PromptSecurityService } from '../services/prompt-security.service';
import { AiController } from '../controllers/ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRun } from '../entities/agent-run.entity';
import { AgentOutput } from '../entities/agent-output.entity';
import { AgentRunLink } from '../entities/agent-run-link.entity';
import { BrandProfile } from '../entities/brand-profile.entity';
import { ApprovedLegenda } from '../entities/approved-legenda.entity';
import { AgentRunRepository } from '../repositories/agent-run.repository';
import { AgentOutputRepository } from '../repositories/agent-output.repository';
import { AgentRunLinkRepository } from '../repositories/agent-run-link.repository';
import { BrandProfileRepository } from '../repositories/brand-profile.repository';
import { ApprovedLegendaRepository } from '../repositories/approved-legenda.repository';
import { AgentExecutionFilter } from '../filters/agent-execution.filter';
import { PromptValidationFilter } from '../filters/prompt-validation.filter';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([AgentRun, AgentOutput, AgentRunLink, BrandProfile, ApprovedLegenda])],
  providers: [
    GeminiService,
    AgentService,
    MarkdownService,
    PromptSecurityService,
    AgentRunRepository,
    AgentOutputRepository,
    AgentRunLinkRepository,
    BrandProfileRepository,
    ApprovedLegendaRepository,
    AgentExecutionFilter,
    PromptValidationFilter,
  ],
  exports: [
    GeminiService,
    AgentService,
    MarkdownService,
    PromptSecurityService,
    AgentRunRepository,
    AgentOutputRepository,
    AgentRunLinkRepository,
    BrandProfileRepository,
    ApprovedLegendaRepository,
  ],
  controllers: [AiController],
})
export class AiModule {}


