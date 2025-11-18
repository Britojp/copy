import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentRunLink } from '../entities/agent-run-link.entity';
import { BaseCrudRepository } from '../../common/repository/base-crud.repository';

@Injectable()
export class AgentRunLinkRepository extends BaseCrudRepository<AgentRunLink> {
  constructor(@InjectRepository(AgentRunLink) repo: Repository<AgentRunLink>) {
    super(repo);
  }

  async createLink(parentRunId: string, childRunId: string, relation?: string | null): Promise<AgentRunLink> {
    const entity = this.repo.create({
      parentRunId,
      childRunId,
      relation: relation ?? null,
    });
    return this.repo.save(entity);
  }
}


