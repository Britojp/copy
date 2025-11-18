import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AgentRun, AgentStatus, AgentType } from '../entities/agent-run.entity';
import { BaseCrudRepository } from '../../common/repository/base-crud.repository';

@Injectable()
export class AgentRunRepository extends BaseCrudRepository<AgentRun> {
  constructor(@InjectRepository(AgentRun) repo: Repository<AgentRun>) {
    super(repo);
  }

  async createRun(params: {
    type: AgentType;
    input: string;
    mdKeys?: string[] | null;
    correlationId?: string | null;
    parentRunId?: string | null;
  }): Promise<AgentRun> {
    const run = this.repo.create({
      type: params.type,
      input: params.input,
      mdKeys: params.mdKeys ?? null,
      correlationId: params.correlationId ?? null,
      parentRunId: params.parentRunId ?? null,
      status: 'ok',
    });
    return this.repo.save(run);
  }

  async finishRunOk(id: string, outputJson: unknown): Promise<void> {
    const patch = { outputJson: outputJson as unknown, status: 'ok' } as QueryDeepPartialEntity<AgentRun>;
    await this.repo.update(id, patch);
  }

  async finishRunError(id: string, message: string): Promise<void> {
    await this.repo.update(id, { status: 'erro', errorMessage: message });
  }

  async findByCorrelationId(correlationId: string): Promise<AgentRun[]> {
    return this.repo.find({ where: { correlationId }, order: { createdAt: 'ASC' } });
  }
}


