import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandProfile } from '../entities/brand-profile.entity';
import { BaseCrudRepository } from '../../common/repository/base-crud.repository';

@Injectable()
export class BrandProfileRepository extends BaseCrudRepository<BrandProfile> {
  constructor(@InjectRepository(BrandProfile) repo: Repository<BrandProfile>) {
    super(repo);
  }

  async findByNome(nome: string): Promise<BrandProfile | null> {
    return this.repo.findOne({ where: { nome } });
  }

  async listAll(): Promise<BrandProfile[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}

