import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

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
    const res = await this.model.invoke([new HumanMessage(prompt)]);
    return res.content?.toString?.() ?? '';
  }
}


