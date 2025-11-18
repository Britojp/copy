import { DeepPartial, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseCrudRepository<T extends { id: string }> {
  protected readonly repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  async createOne(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data as DeepPartial<T>);
    return this.repo.save(entity as T);
  }

  async findById(id: string): Promise<T | null> {
    return this.repo.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
    }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  async updatePartial(id: string, patch: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repo.update(id, patch);
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}


