import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentBaseDto, PipelineDto, CreateBrandProfileDto, UpdateBrandProfileDto } from './dto/common.dto';
import { BrandProfileRepository } from './repositories/brand-profile.repository';

@Controller('ai')
export class AiController {
  constructor(
    private readonly agent: AgentService,
    private readonly brandProfiles: BrandProfileRepository,
  ) {}

  @Post('buscador-data')
  async buscadorData(@Body() body: AgentBaseDto) {
    const res = await this.agent.runBuscadorData(body.input, body.correlationId, body.parentRunId, body.brandProfileId);
    const parsed = safeParse(res.output);
    return { runId: res.runId, correlationId: res.correlationId, output: parsed };
  }

  @Post('buscador-informacoes')
  async buscadorInformacoes(@Body() body: AgentBaseDto) {
    const res = await this.agent.runBuscadorInformacoes(body.input, body.correlationId, body.parentRunId, body.brandProfileId);
    const parsed = safeParse(res.output);
    return { runId: res.runId, correlationId: res.correlationId, output: parsed };
  }

  @Post('escritor-descricao')
  async escritorDescricao(@Body() body: AgentBaseDto) {
    const res = await this.agent.runEscritorDescricao(body.input, body.correlationId, body.parentRunId, body.brandProfileId);
    const parsed = safeParse(res.output);
    return { runId: res.runId, correlationId: res.correlationId, output: parsed };
  }

  @Post('gerador-prompt-imagem-post')
  async geradorPromptImagemPost(@Body() body: AgentBaseDto) {
    const res = await this.agent.runGeradorPromptImagemPost(body.input, body.correlationId, body.parentRunId, body.brandProfileId);
    const parsed = safeParse(res.output);
    return { runId: res.runId, correlationId: res.correlationId, output: parsed };
  }

  @Post('pipeline')
  async pipeline(@Body() body: PipelineDto) {
    const output = await this.agent.runPipeline(body.input, body.tone ?? 'serio', body.visualPrefs, body.brandProfileId);
    const parsed = safeParse(output);
    return parsed;
  }

  @Get('brand-profiles')
  async listBrandProfiles() {
    return this.brandProfiles.listAll();
  }

  @Get('brand-profiles/:id')
  async getBrandProfile(@Param('id') id: string) {
    return this.brandProfiles.findById(id);
  }

  @Post('brand-profiles')
  async createBrandProfile(@Body() body: CreateBrandProfileDto) {
    return this.brandProfiles.createOne(body);
  }

  @Put('brand-profiles/:id')
  async updateBrandProfile(@Param('id') id: string, @Body() body: UpdateBrandProfileDto) {
    return this.brandProfiles.updatePartial(id, body as any);
  }

  @Delete('brand-profiles/:id')
  async deleteBrandProfile(@Param('id') id: string) {
    return this.brandProfiles.deleteById(id);
  }
}

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return { result: s };
  }
}


