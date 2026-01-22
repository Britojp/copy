import { Controller, Post, Body, Get, Put, Delete, Param, Query, UseFilters } from '@nestjs/common';
import { AgentService } from '../services/agent.service';
import { AgentBaseDto } from '../dto/agent-base.dto';
import { PipelineDto } from '../dto/pipeline.dto';
import { CreateBrandProfileDto, UpdateBrandProfileDto } from '../dto/brand-profile.dto';
import { SaveApprovedLegendaDto } from '../dto/approved-legenda.dto';
import { BrandProfileRepository } from '../repositories/brand-profile.repository';
import { ApprovedLegendaRepository } from '../repositories/approved-legenda.repository';
import { AgentExecutionFilter } from '../filters/agent-execution.filter';
import { PromptValidationFilter } from '../filters/prompt-validation.filter';

@Controller('ai')
@UseFilters(AgentExecutionFilter, PromptValidationFilter)
export class AiController {
  constructor(
    private readonly agent: AgentService,
    private readonly brandProfiles: BrandProfileRepository,
    private readonly approvedLegendas: ApprovedLegendaRepository,
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

  @Post('approved-legendas')
  async saveApprovedLegenda(@Body() body: SaveApprovedLegendaDto) {
    return this.approvedLegendas.createOne({
      brandProfileId: body.brandProfileId && body.brandProfileId.trim() ? body.brandProfileId : null,
      nome: body.nome && body.nome.trim() ? body.nome : null,
      data: body.data && body.data.trim() ? body.data : null,
      tipo: body.tipo,
      opcaoNumero: body.opcaoNumero ?? 0,
      descricaoPost: body.descricaoPost,
      cta: body.cta && body.cta.trim() ? body.cta : null,
      hashtags: body.hashtags && body.hashtags.length > 0 ? body.hashtags : null,
      palavrasChave: body.palavrasChave && body.palavrasChave.length > 0 ? body.palavrasChave : null,
      correlationId: body.correlationId && body.correlationId.trim() ? body.correlationId : null,
      runId: body.runId && body.runId.trim() ? body.runId : null,
    });
  }

  @Get('approved-legendas')
  async listApprovedLegendas(@Query('brandProfileId') brandProfileId?: string) {
    if (brandProfileId) {
      return this.approvedLegendas.findByBrandProfile(brandProfileId);
    }
    return this.approvedLegendas.findAll();
  }

  @Get('approved-legendas/brand-profile/:id')
  async getApprovedLegendasByBrandProfile(@Param('id') id: string) {
    return this.approvedLegendas.findByBrandProfile(id);
  }
}

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return { result: s };
  }
}


