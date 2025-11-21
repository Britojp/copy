import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MarkdownService } from '../services/markdown.service';
import { promises as fs } from 'fs';
import { join } from 'path';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe('MarkdownService', () => {
  let service: MarkdownService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkdownService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'PROMPTS_DIR') return undefined;
              if (key === 'NODE_ENV') return 'test';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MarkdownService>(MarkdownService);
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('getMarkdown', () => {
    it('deve ler arquivo markdown com sucesso', async () => {
      const mockContent = '# Título\n\nConteúdo do prompt';
      (fs.readFile as jest.Mock).mockResolvedValue(mockContent);

      const result = await service.getMarkdown('test-prompt');

      expect(result).toBe(mockContent.trim());
      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('test-prompt.md'),
        'utf8'
      );
    });

    it('deve retornar string vazia se arquivo não existir', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await service.getMarkdown('inexistente');

      expect(result).toBe('');
    });

    it('deve normalizar quebras de linha', async () => {
      const mockContent = 'linha1\r\nlinha2\nlinha3';
      (fs.readFile as jest.Mock).mockResolvedValue(mockContent);

      const result = await service.getMarkdown('test');

      expect(result).not.toContain('\r\n');
      expect(result.split('\n').length).toBeGreaterThanOrEqual(2);
    });

    it('deve usar cache em modo produção', async () => {
      const mockContent = 'conteúdo do prompt';
      (fs.readFile as jest.Mock).mockResolvedValue(mockContent);

      jest.spyOn(configService, 'get').mockReturnValue('production');

      const serviceProd = new MarkdownService(configService);

      const result1 = await serviceProd.getMarkdown('cached');
      const result2 = await serviceProd.getMarkdown('cached');

      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(result1).toBe(result2);
    });
  });

  describe('getManyMarkdown', () => {
    it('deve retornar string vazia para array vazio', async () => {
      const result = await service.getManyMarkdown([]);
      expect(result).toBe('');
    });

    it('deve retornar string vazia para array null', async () => {
      const result = await service.getManyMarkdown(null as any);
      expect(result).toBe('');
    });

    it('deve combinar múltiplos arquivos markdown', async () => {
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce('prompt 1')
        .mockResolvedValueOnce('prompt 2');

      const result = await service.getManyMarkdown(['prompt1', 'prompt2']);

      expect(result).toBe('prompt 1\n\nprompt 2');
    });

    it('deve filtrar arquivos vazios', async () => {
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce('prompt válido')
        .mockResolvedValueOnce('')
        .mockResolvedValueOnce('outro prompt');

      const result = await service.getManyMarkdown(['valido', 'vazio', 'outro']);

      expect(result).toBe('prompt válido\n\noutro prompt');
    });

    it('deve retornar string vazia se todos os arquivos estiverem vazios', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('');

      const result = await service.getManyMarkdown(['vazio1', 'vazio2']);

      expect(result).toBe('');
    });
  });
});

