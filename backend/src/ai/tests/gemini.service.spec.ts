import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../services/gemini.service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

jest.mock('@langchain/google-genai');

describe('GeminiService', () => {
  let service: GeminiService;
  let configService: ConfigService;
  let mockModel: jest.Mocked<ChatGoogleGenerativeAI>;

  beforeEach(async () => {
    mockModel = {
      invoke: jest.fn(),
    } as any;

    (ChatGoogleGenerativeAI as jest.Mock).mockImplementation(() => mockModel);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return 'test-api-key';
              throw new Error(`Config key ${key} not found`);
            }),
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_MODEL') return 'gemini-1.5-flash-8b';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve inicializar modelo com configurações corretas', () => {
    expect(ChatGoogleGenerativeAI).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      model: 'gemini-1.5-flash-8b',
      apiVersion: 'v1',
      temperature: 0.2,
    });
  });

  it('deve usar modelo padrão quando GEMINI_MODEL não estiver configurado', async () => {
    const configWithoutModel = {
      getOrThrow: jest.fn(() => 'test-api-key'),
      get: jest.fn(() => undefined),
    };

    const moduleWithoutModel = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: configWithoutModel,
        },
      ],
    }).compile();

    const serviceWithoutModel = moduleWithoutModel.get<GeminiService>(GeminiService);

    expect(ChatGoogleGenerativeAI).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-1.5-flash-8b',
      })
    );
  });

  describe('generateText', () => {
    it('deve gerar texto com sucesso', async () => {
      const mockResponse = {
        content: {
          toString: jest.fn(() => 'resposta gerada'),
        },
      };

      mockModel.invoke = jest.fn().mockResolvedValue(mockResponse);

      const prompt = 'Gere um texto sobre marketing';
      const result = await service.generateText(prompt);

      expect(mockModel.invoke).toHaveBeenCalledWith([new HumanMessage(prompt)]);
      expect(result).toBe('resposta gerada');
    });

    it('deve retornar string vazia se content for null', async () => {
      const mockResponse = {
        content: null,
      };

      mockModel.invoke = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.generateText('prompt');

      expect(result).toBe('');
    });

    it('deve retornar string vazia se toString não estiver disponível', async () => {
      const mockResponse = {
        content: {
          toString: undefined,
        },
      };

      mockModel.invoke = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.generateText('prompt');

      expect(result).toBe('');
    });

    it('deve propagar erros da API', async () => {
      const error = new Error('API Error');
      mockModel.invoke = jest.fn().mockRejectedValue(error);

      await expect(service.generateText('prompt')).rejects.toThrow('API Error');
    });
  });
});

