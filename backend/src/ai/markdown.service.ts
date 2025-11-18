import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class MarkdownService {
  private readonly baseDir: string;
  private readonly cache = new Map<string, string>();
  private readonly isDev: boolean;

  constructor(private readonly config: ConfigService) {
    const configured = this.config.get<string>('PROMPTS_DIR');
    this.baseDir = configured ?? join(process.cwd(), 'resources', 'prompts');
    this.isDev = (this.config.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? '') === 'development';
  }

  async getMarkdown(key: string): Promise<string> {
    if (!this.isDev && this.cache.has(key)) return this.cache.get(key) as string;
    const filePath = join(this.baseDir, `${key}.md`);
    const data = await fs.readFile(filePath, 'utf8').catch(() => '');
    const normalized = data.replace(/\r\n/g, '\n').trim();
    if (!this.isDev) this.cache.set(key, normalized);
    return normalized;
  }

  async getManyMarkdown(keys: string[]): Promise<string> {
    if (!keys?.length) return '';
    const parts = await Promise.all(keys.map((k) => this.getMarkdown(k)));
    const filtered = parts.filter((p) => p && p.length > 0);
    if (filtered.length === 0) return '';
    return filtered.join('\n\n');
  }
}


