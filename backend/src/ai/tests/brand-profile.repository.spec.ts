import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandProfileRepository } from '../repositories/brand-profile.repository';
import { BrandProfile } from '../entities/brand-profile.entity';

describe('BrandProfileRepository', () => {
  let repository: BrandProfileRepository;
  let repo: jest.Mocked<Repository<BrandProfile>>;

  const mockBrandProfile: BrandProfile = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Test Brand',
    setor: 'Tecnologia',
    publicoAlvo: { idade: '25-40', interesses: ['tech'] },
    valores: ['inovação', 'qualidade'],
    tomDeVoz: { estilo: 'profissional' },
    identidadeVisual: { cores: ['azul', 'branco'] },
    diferenciais: ['inovação'],
    evitar: ['jargões técnicos'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandProfileRepository,
        {
          provide: getRepositoryToken(BrandProfile),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<BrandProfileRepository>(BrandProfileRepository);
    repo = module.get(getRepositoryToken(BrandProfile));
  });

  it('deve ser definido', () => {
    expect(repository).toBeDefined();
  });

  describe('createOne', () => {
    it('deve criar um novo perfil de marca', async () => {
      const newProfile = { nome: 'Nova Marca', setor: 'Saúde' };
      repo.create.mockReturnValue(mockBrandProfile as any);
      repo.save.mockResolvedValue(mockBrandProfile);

      const result = await repository.createOne(newProfile);

      expect(repo.create).toHaveBeenCalledWith(newProfile);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockBrandProfile);
    });
  });

  describe('findById', () => {
    it('deve encontrar perfil por ID', async () => {
      repo.findOne.mockResolvedValue(mockBrandProfile);

      const result = await repository.findById(mockBrandProfile.id);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: mockBrandProfile.id },
      });
      expect(result).toEqual(mockBrandProfile);
    });

    it('deve retornar null se não encontrar', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await repository.findById('id-inexistente');

      expect(result).toBeNull();
    });
  });

  describe('findByNome', () => {
    it('deve encontrar perfil por nome', async () => {
      repo.findOne.mockResolvedValue(mockBrandProfile);

      const result = await repository.findByNome('Test Brand');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { nome: 'Test Brand' },
      });
      expect(result).toEqual(mockBrandProfile);
    });
  });

  describe('listAll', () => {
    it('deve listar todos os perfis ordenados por data', async () => {
      const profiles = [mockBrandProfile];
      repo.find.mockResolvedValue(profiles);

      const result = await repository.listAll();

      expect(repo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(profiles);
    });
  });

  describe('updatePartial', () => {
    it('deve atualizar parcialmente um perfil', async () => {
      const update = { nome: 'Nome Atualizado' };
      repo.update.mockResolvedValue({ affected: 1 } as any);

      await repository.updatePartial(mockBrandProfile.id, update);

      expect(repo.update).toHaveBeenCalledWith(mockBrandProfile.id, update);
    });
  });

  describe('deleteById', () => {
    it('deve deletar um perfil por ID', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.deleteById(mockBrandProfile.id);

      expect(repo.delete).toHaveBeenCalledWith(mockBrandProfile.id);
    });
  });
});

