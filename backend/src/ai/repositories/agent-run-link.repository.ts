import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { AgentRunLink } from '../entities/agent-run-link.entity';
import { BaseCrudRepository } from '../../common/repository/base-crud.repository';

@Injectable()
export class AgentRunLinkRepository extends BaseCrudRepository<AgentRunLink> {
  private readonly logger = new Logger(AgentRunLinkRepository.name);

  constructor(@InjectRepository(AgentRunLink) repo: Repository<AgentRunLink>) {
    super(repo);
  }

  async createLink(parentRunId: string, childRunId: string, relation?: string | null): Promise<AgentRunLink | null> {
    try {
      const entity = this.repo.create({
        parentRunId,
        childRunId,
        relation: relation ?? null,
      });
      return await this.repo.save(entity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isForeignKeyError =
        error instanceof QueryFailedError &&
        (errorMessage.includes('foreign key') ||
          errorMessage.includes('fk_agent_run_links') ||
          errorMessage.includes('violates foreign key constraint') ||
          (error as any).code === '23503');

      if (isForeignKeyError) {
        this.logger.warn(
          `Não foi possível criar link: parentRunId=${parentRunId}, childRunId=${childRunId}. Parent run não existe no banco de dados.`,
        );
        return null;
      }
      throw error;
    }
  }
}


