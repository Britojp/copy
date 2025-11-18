import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentOutput } from '../entities/agent-output.entity';
import { BaseCrudRepository } from '../../common/repository/base-crud.repository';

@Injectable()
export class AgentOutputRepository extends BaseCrudRepository<AgentOutput> {
  constructor(@InjectRepository(AgentOutput) repo: Repository<AgentOutput>) {
    super(repo);
  }

  async saveOutput(params: {
    runId: string;
    contentText?: string | null;
    contentJson?: unknown | null;
    model?: string | null;
    promptTokens?: number | null;
    completionTokens?: number | null;
    latencyMs?: number | null;
  }): Promise<AgentOutput> {
    const entity = this.repo.create({
      runId: params.runId,
      contentText: params.contentText ?? null,
      contentJson: params.contentJson ?? null,
      model: params.model ?? null,
      promptTokens: params.promptTokens ?? null,
      completionTokens: params.completionTokens ?? null,
      latencyMs: params.latencyMs ?? null,
    });
    return this.repo.save(entity);
  }
}


