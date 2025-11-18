import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';
import { GeminiService } from './gemini.service';

async function main() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: false,
  });
  try {
    const prompt = process.argv.slice(2).join(' ').trim();
    if (!prompt) {
      console.error('Uso: npm run ai:gemini -- \"seu prompt aqui\"');
      process.exit(1);
    }
    const gemini = app.get(GeminiService);
    const output = await gemini.generateText(prompt);
    console.log(output);
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


