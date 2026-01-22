import { NestFactory } from '@nestjs/core';
import { CliModule } from './modules/cli.module';
import { GeminiService } from './services/gemini.service';
import { ExternalServiceError, ValidationError, AgentExecutionError } from '../common/errors/AppError';

async function main() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: false,
  });
  try {
    const prompt = process.argv.slice(2).join(' ').trim();
    if (!prompt) {
      console.error('Uso: npm run ai:gemini -- "seu prompt aqui"');
      process.exit(1);
    }
    const gemini = app.get(GeminiService);
    const output = await gemini.generateText(prompt);
    console.log(output);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`[VALIDATION_ERROR] ${error.message}`);
      process.exit(1);
    } else if (error instanceof ExternalServiceError) {
      console.error(`[EXTERNAL_SERVICE_ERROR] ${error.message}`);
      process.exit(1);
    } else if (error instanceof AgentExecutionError) {
      console.error(`[AGENT_EXECUTION_ERROR] ${error.message}`);
      process.exit(1);
    } else {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[ERROR] ${message}`);
      process.exit(1);
    }
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[FATAL_ERROR] ${message}`);
  process.exit(1);
});


