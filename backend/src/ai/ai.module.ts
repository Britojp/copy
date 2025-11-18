import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { AgentService } from './agent.service';
import { MarkdownService } from './markdown.service';
import { AiController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRun } from './entities/agent-run.entity';
import { AgentOutput } from './entities/agent-output.entity';
import { AgentRunLink } from './entities/agent-run-link.entity';
import { BrandProfile } from './entities/brand-profile.entity';
import { AgentRunRepository } from './repositories/agent-run.repository';
import { AgentOutputRepository } from './repositories/agent-output.repository';
import { AgentRunLinkRepository } from './repositories/agent-run-link.repository';
import { BrandProfileRepository } from './repositories/brand-profile.repository';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([AgentRun, AgentOutput, AgentRunLink, BrandProfile])],
  providers: [GeminiService, AgentService, MarkdownService, AgentRunRepository, AgentOutputRepository, AgentRunLinkRepository, BrandProfileRepository],
  exports: [GeminiService, AgentService, MarkdownService, AgentRunRepository, AgentOutputRepository, AgentRunLinkRepository, BrandProfileRepository],
  controllers: [AiController],
})
export class AiModule {}


