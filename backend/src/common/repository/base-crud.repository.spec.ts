import { Repository } from 'typeorm';
import { BaseCrudRepository } from './base-crud.repository';

interface TestEntity {
  id: string;
  name: string;
}

describe('BaseCrudRepository', () => {
  let repository: BaseCrudRepository<TestEntity>;
  let mockRepo: jest.Mocked<Repository<TestEntity>>;

  const mockEntity: TestEntity = {
    id: '123',
    name: 'Test Entity',
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    repository = new BaseCrudRepository<TestEntity>(mockRepo);
  });

  it('deve ser definido', () => {
    expect(repository).toBeDefined();
  });

  describe('createOne', () => {
    it('deve criar uma entidade', async () => {
      mockRepo.create.mockReturnValue(mockEntity);
      mockRepo.save.mockResolvedValue(mockEntity);

      const result = await repository.createOne({ name: 'Test Entity' });

      expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Test Entity' });
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findById', () => {
    it('deve encontrar entidade por ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('123');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockEntity);
    });

    it('deve retornar null se não encontrar', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('inexistente');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as entidades', async () => {
      const entities = [mockEntity];
      mockRepo.find.mockResolvedValue(entities);

      const result = await repository.findAll();

      expect(mockRepo.find).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(entities);
    });

    it('deve aceitar opções de busca', async () => {
      const entities = [mockEntity];
      const options = { where: { name: 'Test' } };
      mockRepo.find.mockResolvedValue(entities);

      const result = await repository.findAll(options);

      expect(mockRepo.find).toHaveBeenCalledWith(options);
      expect(result).toEqual(entities);
    });
  });

  describe('updatePartial', () => {
    it('deve atualizar parcialmente uma entidade', async () => {
      mockRepo.update.mockResolvedValue({ affected: 1 } as any);

      await repository.updatePartial('123', { name: 'Updated' });

      expect(mockRepo.update).toHaveBeenCalledWith('123', { name: 'Updated' });
    });
  });

  describe('deleteById', () => {
    it('deve deletar entidade por ID', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.deleteById('123');

      expect(mockRepo.delete).toHaveBeenCalledWith('123');
    });
  });
});

