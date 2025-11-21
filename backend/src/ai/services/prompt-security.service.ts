import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PromptSecurityService {
  private readonly MAX_INPUT_LENGTH = 5000;
  private readonly MAX_LINE_LENGTH = 1000;
  private readonly SUSPICIOUS_PATTERNS: RegExp[] = [
    /ignore\s+(previous|all|above|prior)\s+instructions?/gi,
    /forget\s+(previous|all|above|prior)\s+instructions?/gi,
    /disregard\s+(previous|all|above|prior)\s+instructions?/gi,
    /you\s+are\s+now/gi,
    /system\s*:\s*/gi,
    /assistant\s*:\s*/gi,
    /user\s*:\s*/gi,
    /<\|system\|>/gi,
    /<\|assistant\|>/gi,
    /<\|user\|>/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /###\s*instructions?\s*:/gi,
    /###\s*system\s*:/gi,
    /---\s*begin\s+system\s+prompt\s*---/gi,
    /---\s*end\s+system\s+prompt\s*---/gi,
    /execute\s+(command|code|script)/gi,
    /run\s+(command|code|script)/gi,
    /eval\s*\(/gi,
    /<script/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /prompt\(/gi,
    /alert\(/gi,
    /confirm\(/gi,
    /new\s+Function\(/gi,
    /import\s+system/gi,
    /require\s*\([\s'"]*fs[\s'"]*\)/gi,
    /require\s*\([\s'"]*child_process[\s'"]*\)/gi,
    /process\.(env|argv|exit)/gi,
    /__dirname|__filename/gi,
    /\.exec\(/gi,
    /\.spawn\(/gi,
  ];

  private readonly DANGEROUS_WORDS: string[] = [
    'bypass',
    'override',
    'hack',
    'exploit',
    'inject',
    'payload',
    'malware',
    'virus',
    'trojan',
    'backdoor',
  ];

  validateAndSanitize(input: string): string {
    if (!input || typeof input !== 'string') {
      throw new BadRequestException('Input inválido: deve ser uma string não vazia');
    }

    const originalLength = input.length;
    
    if (originalLength === 0) {
      throw new BadRequestException('Input não pode estar vazio');
    }

    if (originalLength > this.MAX_INPUT_LENGTH) {
      throw new BadRequestException(
        `Input muito longo: máximo ${this.MAX_INPUT_LENGTH} caracteres, recebido ${originalLength}`
      );
    }

    let sanitized = this.removeControlCharacters(input);
    sanitized = this.normalizeWhitespace(sanitized);
    sanitized = this.checkForSuspiciousPatterns(sanitized);
    sanitized = this.checkForDangerousWords(sanitized);
    sanitized = this.validateLineLengths(sanitized);
    sanitized = this.escapeSpecialChars(sanitized);

    if (sanitized.length === 0) {
      throw new BadRequestException('Input contém apenas caracteres inválidos ou perigosos');
    }

    return sanitized.trim();
  }

  private removeControlCharacters(input: string): string {
    return input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  }

  private normalizeWhitespace(input: string): string {
    return input
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n');
  }

  private checkForSuspiciousPatterns(input: string): string {
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      if (regex.test(input)) {
        throw new BadRequestException(
          'Input contém padrões suspeitos de prompt injection. Operação bloqueada por segurança.'
        );
      }
    }
    return input;
  }

  private checkForDangerousWords(input: string): string {
    const lowerInput = input.toLowerCase();
    const wordsInInput = lowerInput.split(/\s+/);
    
    for (const dangerousWord of this.DANGEROUS_WORDS) {
      const foundIndex = wordsInInput.findIndex(word => 
        word.includes(dangerousWord) || dangerousWord.includes(word)
      );
      
      if (foundIndex !== -1) {
        const context = wordsInInput.slice(
          Math.max(0, foundIndex - 2),
          Math.min(wordsInInput.length, foundIndex + 3)
        ).join(' ');
        
        if (this.isDangerousContext(context, dangerousWord)) {
          throw new BadRequestException(
            `Input contém palavras perigosas associadas a tentativas de manipulação. Operação bloqueada.`
          );
        }
      }
    }
    
    return input;
  }

  private isDangerousContext(context: string, word: string): boolean {
    const dangerousContexts = [
      'ignore',
      'bypass',
      'override',
      'system',
      'prompt',
      'instruction',
      'command',
      'execute',
    ];
    
    return dangerousContexts.some(ctx => 
      context.includes(ctx) && 
      (context.indexOf(word) - context.indexOf(ctx)) < 50
    );
  }

  private validateLineLengths(input: string): string {
    const lines = input.split('\n');
    const validLines: string[] = [];
    
    for (const line of lines) {
      if (line.length > this.MAX_LINE_LENGTH) {
        validLines.push(line.substring(0, this.MAX_LINE_LENGTH) + '... [truncado]');
      } else {
        validLines.push(line);
      }
    }
    
    return validLines.join('\n');
  }

  private escapeSpecialChars(input: string): string {
    if (!input.includes('<') && !input.includes('>')) {
      return input;
    }
    
    return input
      .replace(/</g, match => {
        if (!input.includes('</')) return '&lt;';
        return match;
      })
      .replace(/>/g, '&gt;');
  }

  detectRepetitionAttack(input: string): boolean {
    const words = input.toLowerCase().split(/\s+/);
    const wordCounts = new Map<string, number>();
    
    for (const word of words) {
      if (word.length > 3) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }
    
    if (wordCounts.size === 0) {
      return false;
    }
    
    const counts = Array.from(wordCounts.values());
    const maxRepetition = Math.max(...counts);
    const uniqueWords = wordCounts.size;
    
    if (uniqueWords > 0 && maxRepetition / uniqueWords > 10) {
      return true;
    }
    
    return false;
  }

  validateTokenCount(input: string, maxTokens: number = 4000): boolean {
    const estimatedTokens = Math.ceil(input.length / 4);
    return estimatedTokens <= maxTokens;
  }
}

