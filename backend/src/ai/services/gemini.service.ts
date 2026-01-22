import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { ExternalServiceError } from '../../common/errors/AppError';
import { retryWithBackoff } from '../../common/utils/retry.util';

@Injectable()
export class GeminiService {
  private readonly model: ChatGoogleGenerativeAI;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
    const modelName =
      this.config.get<string>('GEMINI_MODEL') ?? 'gemini-1.5-flash-8b';
    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: modelName,
      apiVersion: 'v1',
      temperature: 0.2,
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const res = await retryWithBackoff(
        async () => {
          return await this.model.invoke([new HumanMessage(prompt)]);
        },
        {
          maxRetries: 3,
          initialDelayMs: 2000,
          maxDelayMs: 30000,
          backoffMultiplier: 2,
        },
      );
      return res.content?.toString?.() ?? '';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      
      if (message.includes('429') || message.includes('quota') || message.includes('rate limit')) {
        throw new ExternalServiceError(
          'Limite de requisições da API excedido. Por favor, aguarde alguns minutos e tente novamente. Se o problema persistir, verifique sua cota na API do Google Gemini.',
          'GEMINI_QUOTA_EXCEEDED',
        );
      }
      
      throw new ExternalServiceError(
        `Erro ao gerar texto com Gemini: ${message}`,
        'GEMINI_API_ERROR',
      );
    }
  }
}


