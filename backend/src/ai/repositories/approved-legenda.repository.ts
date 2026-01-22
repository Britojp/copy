import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovedLegenda } from '../entities/approved-legenda.entity';
import { BaseCrudRepository } from '../../common/repository/base-crud.repository';

@Injectable()
export class ApprovedLegendaRepository extends BaseCrudRepository<ApprovedLegenda> {
  constructor(@InjectRepository(ApprovedLegenda) repo: Repository<ApprovedLegenda>) {
    super(repo);
  }

  async findByBrandProfile(brandProfileId: string): Promise<ApprovedLegenda[]> {
    return this.repo.find({
      where: { brandProfileId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCorrelationId(correlationId: string): Promise<ApprovedLegenda[]> {
    return this.repo.find({
      where: { correlationId },
      order: { createdAt: 'DESC' },
    });
  }
}
