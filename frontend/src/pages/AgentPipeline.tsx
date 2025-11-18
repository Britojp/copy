import { useEffect, useMemo, useState } from 'react';
import { aiBuscadorData, aiBuscadorInformacoes, aiEscritorDescricao, aiGeradorPromptImagemPost } from '../services/ai';
import { listBrandProfiles } from '../services/brand';
import { type BrandProfile } from '../types/brand';
import { Section } from '../components/common/Section';
import { Field } from '../components/common/Field';
import { StepCard } from '../components/common/StepCard';
import { Badge } from '../components/common/Badge';
import { type Tone } from '../types/common/ai';

type HistoryItem = {
  id: string;
  nicho: string;
  startDate: string;
  endDate: string;
  correlationId: string | null;
  runId: string | null;
  createdAt: string;
  snapshot: unknown;
};

const HISTORY_KEY = 'agent_search_history_v1';

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 10)));
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function AgentPipelinePage() {
  const [nicho, setNicho] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tone, setTone] = useState<Tone>('serio');
  const [visualPrefs, setVisualPrefs] = useState('');
  const [brandProfileId, setBrandProfileId] = useState<string>('');
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [correlationId, setCorrelationId] = useState<string | null>(null);
  const [run1, setRun1] = useState<string | null>(null);
  const [run2, setRun2] = useState<string | null>(null);
  const [run3, setRun3] = useState<string | null>(null);
  const [run4, setRun4] = useState<string | null>(null);

  const [dataOut, setDataOut] = useState<unknown>(null);
  const [infoOut, setInfoOut] = useState<unknown>(null);
  const [descOut, setDescOut] = useState<unknown>(null);
  const [imgPromptOut, setImgPromptOut] = useState<unknown>(null);

  useEffect(() => {
    setHistory(loadHistory());
    listBrandProfiles()
      .then((profiles) => setBrandProfiles(profiles))
      .catch((err) => console.error('Erro ao carregar perfis:', err));
  }, []);

  const datasList = useMemo(() => {
    if (dataOut && typeof dataOut === 'object' && 'datas' in (dataOut as any)) {
      const arr = (dataOut as any).datas;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [dataOut]);
  const infoList = useMemo(() => {
    if (infoOut && typeof infoOut === 'object' && 'itens' in (infoOut as any)) {
      const arr = (infoOut as any).itens;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [infoOut]);
  const descList = useMemo(() => {
    if (descOut && typeof descOut === 'object' && 'itens' in (descOut as any)) {
      const arr = (descOut as any).itens;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [descOut]);
  const promptList = useMemo(() => {
    if (imgPromptOut && typeof imgPromptOut === 'object' && 'itens' in (imgPromptOut as any)) {
      const arr = (imgPromptOut as any).itens;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [imgPromptOut]);

  async function fetchDates() {
    setLoading(true);
    setError(null);
    setCorrelationId(null);
    setRun1(null);
    setRun2(null);
    setRun3(null);
    setRun4(null);
    setDataOut(null);
    setInfoOut(null);
    setDescOut(null);
    setImgPromptOut(null);
    const periodo = startDate && endDate ? `${startDate}..${endDate}` : '';
    const base = [`nicho=${nicho}`, periodo ? `periodo=${periodo}` : ''].filter(Boolean).join('; ');
    try {
      const d = await aiBuscadorData({ input: base, brandProfileId: brandProfileId || undefined });
      setCorrelationId(d.correlationId ?? null);
      setRun1(d.runId ?? null);
      setDataOut(d.output);
      const item: HistoryItem = {
        id: newId(),
        nicho,
        startDate,
        endDate,
        correlationId: d.correlationId ?? null,
        runId: d.runId ?? null,
        createdAt: new Date().toISOString(),
        snapshot: d.output,
      };
      const next = [item, ...history].slice(0, 10);
      setHistory(next);
      saveHistory(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function restoreHistory(h: HistoryItem) {
    setNicho(h.nicho);
    setStartDate(h.startDate);
    setEndDate(h.endDate);
    setCorrelationId(h.correlationId);
    setRun1(h.runId);
    setDataOut(h.snapshot);
    setInfoOut(null);
    setDescOut(null);
    setImgPromptOut(null);
    setRun2(null);
    setRun3(null);
    setRun4(null);
  }

  async function runForDate(item: any) {
    setLoading(true);
    setError(null);
    setInfoOut(null);
    setDescOut(null);
    setImgPromptOut(null);
    const dText = JSON.stringify(item);
    try {
      const i = await aiBuscadorInformacoes({
        input: `Item selecionado do buscador-data:\n${dText}\nIdioma: pt-BR`,
        correlationId: correlationId ?? undefined,
        parentRunId: run1 ?? undefined,
        brandProfileId: brandProfileId || undefined,
      });
      setRun2(i.runId ?? null);
      setInfoOut(i.output);

      const iText = typeof i.output === 'string' ? i.output : JSON.stringify(i.output);
      const ed = await aiEscritorDescricao({
        input: `tom=${tone}\nObjeto do buscador-informacoes:\n${iText}\nGere 3 variações de descrição (curta, média, longa) conforme instruções.`,
        correlationId: i.correlationId ?? undefined,
        parentRunId: i.runId ?? undefined,
        brandProfileId: brandProfileId || undefined,
      });
      setRun3(ed.runId ?? null);
      setDescOut(ed.output);

      const edText = typeof ed.output === 'string' ? ed.output : JSON.stringify(ed.output);
      const gp = await aiGeradorPromptImagemPost({
        input: `Objeto A (escritor-descricao):\n${edText}\nObjeto B (buscador-informacoes):\n${iText}\nPreferencias visuais: ${visualPrefs}`,
        correlationId: ed.correlationId ?? undefined,
        parentRunId: ed.runId ?? undefined,
        brandProfileId: brandProfileId || undefined,
      });
      setRun4(gp.runId ?? null);
      setImgPromptOut(gp.output);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:px-8 lg:pb-8 lg:pt-0">
      <div>
        {correlationId ? <div className="mt-1 text-xs text-muted-foreground break-all sm:break-normal">correlationId: {correlationId}</div> : null}
      </div>

      <Section
        title="Parâmetros"
        actions={
          <div className="flex gap-2">
            <button
              onClick={fetchDates}
              disabled={loading || !nicho}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 sm:px-4 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
            >
              Buscar datas
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nicho">
            <input
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              placeholder="ex.: esportes, médico"
              className="h-9 rounded-md bg-background px-3 text-sm"
            />
          </Field>
          <Field label="Data inicial">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 rounded-md bg-background px-3 text-sm" />
          </Field>
          <Field label="Data final">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 rounded-md bg-background px-3 text-sm" />
          </Field>
          <Field label="Tom (para etapas seguintes)">
            <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="h-9 rounded-md bg-background px-3 text-sm">
              <option value="serio">Sério</option>
              <option value="divertido">Divertido</option>
              <option value="persuasivo">Persuasivo</option>
              <option value="inspirador">Inspirador</option>
              <option value="educativo">Educativo</option>
            </select>
          </Field>
          <Field label="Perfil de Marca (opcional)">
            <select value={brandProfileId} onChange={(e) => setBrandProfileId(e.target.value)} className="h-9 rounded-md bg-background px-3 text-sm">
              <option value="">Nenhum</option>
              {brandProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Preferências visuais (para etapas seguintes)">
              <input
                value={visualPrefs}
                onChange={(e) => setVisualPrefs(e.target.value)}
                placeholder="ex.: paleta azul; minimalista"
                className="h-9 w-full rounded-md bg-background px-3 text-sm"
              />
            </Field>
          </div>
        </div>
        {error && (
          <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
            <div className="font-medium">Erro</div>
            <div className="text-destructive-foreground/90">{error}</div>
          </div>
        )}
      </Section>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <Section title="Histórico" actions={<span className="text-xs text-muted-foreground">{history.length} itens</span>}>
          {history.length === 0 ? (
            <div className="text-sm text-muted-foreground">Sem histórico</div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((h) => (
                <div key={h.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border p-2 text-xs">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium truncate">{h.nicho}</span>
                    <span className="text-muted-foreground">{h.startDate || '—'} → {h.endDate || '—'}</span>
                    {h.correlationId ? <span className="text-muted-foreground break-all sm:break-normal">corr: {h.correlationId}</span> : null}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => restoreHistory(h)} className="rounded-md border px-2 py-1 hover:bg-muted whitespace-nowrap">Restaurar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <StepCard index={1} title="Buscador de Datas" runId={run1} loading={loading && !dataOut} emptyText="Sem dados">
          {datasList.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhuma data encontrada para os parâmetros.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {datasList.map((it, idx) => (
                <div key={idx} className="rounded-md border p-3">
                  <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-sm font-medium break-words">{it?.nome ?? 'Evento'}</div>
                    <div className="flex gap-2 flex-wrap">
                      {it?.relevancia ? <Badge variant="muted">{it.relevancia}</Badge> : null}
                      {it?.recorrencia ? <Badge variant="outline">{it.recorrencia}</Badge> : null}
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-muted-foreground">Data: {it?.data ?? '—'}</div>
                  {Array.isArray(it?.tags) && it.tags.length > 0 ? (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {it.tags.slice(0, 6).map((t: string, i: number) => (
                        <Badge key={i} variant="outline">{t}</Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="mb-2 text-xs break-words">{it?.descricao ?? ''}</div>
                  <button
                    onClick={() => runForDate(it)}
                    disabled={loading}
                    className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 w-full sm:w-auto"
                  >
                    Gerar etapas para esta data
                  </button>
                </div>
              ))}
            </div>
          )}
        </StepCard>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <StepCard index={2} title="Buscador de Informações" runId={run2} loading={Boolean(loading && dataOut && !infoOut)} emptyText="Aguarde selecionar uma data">
            {infoList.length === 0 ? <div className="text-sm text-muted-foreground">Sem informações</div> : (
              <div className="flex flex-col gap-3">
                {infoList.map((it, idx) => (
                  <div key={idx} className="rounded-md border p-3">
                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm font-medium break-words">{it?.nome ?? 'Item'}</div>
                      <div className="text-xs text-muted-foreground flex-shrink-0">{it?.data ?? '—'}</div>
                    </div>
                    <div className="mb-2 text-xs break-words">{it?.descricaoDetalhada ?? ''}</div>
                    {Array.isArray(it?.ideiasConteudo) && it.ideiasConteudo.length > 0 ? (
                      <ul className="mb-2 list-disc pl-5 text-xs">
                        {it.ideiasConteudo.slice(0, 4).map((idea: string, i: number) => <li key={i}>{idea}</li>)}
                      </ul>
                    ) : null}
                    {Array.isArray(it?.referencias) && it.referencias.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {it.referencias.slice(0, 3).map((u: string, i: number) => (
                          <a key={i} href={u} target="_blank" rel="noreferrer" className="text-xs text-primary underline break-all">{u}</a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </StepCard>

          <StepCard index={3} title="Escritor de Descrição" runId={run3} loading={Boolean(loading && infoOut && !descOut)} emptyText="Aguarde selecionar uma data">
            {descList.length === 0 ? <div className="text-sm text-muted-foreground">Sem descrições</div> : (
              <div className="flex flex-col gap-3">
                {descList.map((it, idx) => (
                  <div key={idx} className="rounded-md border p-3">
                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm font-medium break-words">{it?.nome ?? 'Item'}</div>
                      <div className="text-xs text-muted-foreground flex-shrink-0">{it?.data ?? '—'}</div>
                    </div>
                    {Array.isArray(it?.variacoes) && it.variacoes.length > 0 ? (
                      <div className="flex flex-col gap-3 mt-2">
                        {it.variacoes.map((v: any, vIdx: number) => (
                          <div key={vIdx} className="rounded border-l-4 border-primary/30 bg-secondary/10 p-2">
                            <div className="mb-1 text-xs text-primary" style={{ fontFamily: 'var(--font-logo)' }}>{v?.tamanho ? v.tamanho.toUpperCase() : 'VARIAÇÃO'}</div>
                            <div className="mb-2 text-sm">{v?.descricaoPost ?? ''}</div>
                            <div className="mb-2 text-xs font-medium">CTA: {v?.cta ?? '—'}</div>
                            {Array.isArray(v?.hashtags) && v.hashtags.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {v.hashtags.slice(0, 10).map((h: string, i: number) => <Badge key={i} variant="outline">#{h.replace(/^#/, '')}</Badge>)}
                              </div>
                            ) : null}
                            {Array.isArray(v?.palavrasChave) && v.palavrasChave.length > 0 ? (
                              <div className="text-xs text-muted-foreground">
                                Palavras-chave: {v.palavrasChave.join(', ')}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2 text-sm">{it?.descricaoPost ?? ''}</div>
                        <div className="mb-2 text-xs font-medium">CTA: {it?.cta ?? '—'}</div>
                        {Array.isArray(it?.hashtags) && it.hashtags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {it.hashtags.slice(0, 10).map((h: string, i: number) => <Badge key={i} variant="outline">#{h.replace(/^#/, '')}</Badge>)}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </StepCard>

          <StepCard index={4} title="Gerador de Prompt de Imagem" runId={run4} loading={Boolean(loading && descOut && !imgPromptOut)} emptyText="Aguarde selecionar uma data">
            {promptList.length === 0 ? <div className="text-sm text-muted-foreground">Sem prompts</div> : (
              <div className="flex flex-col gap-3">
                {promptList.map((it, idx) => (
                  <div key={idx} className="rounded-md border p-3">
                    <div className="mb-1 text-sm font-medium break-words">{it?.nome ?? 'Item'}</div>
                    <div className="mb-2 text-xs text-muted-foreground">{it?.data ?? '—'}</div>
                    <div className="mb-2 text-xs"><span className="font-medium">Tema:</span> {it?.tema ?? '—'}</div>
                    {Array.isArray(it?.elementos) && it.elementos.length > 0 ? (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {it.elementos.slice(0, 6).map((e: string, i: number) => <Badge key={i} variant="outline">{e}</Badge>)}
                      </div>
                    ) : null}
                    <div className="mb-2 text-xs"><span className="font-medium">Composição:</span> {it?.composicao ?? '—'}</div>
                    <div className="mb-2 text-xs"><span className="font-medium">Estilo:</span> {it?.estilo ?? '—'}</div>
                    <div className="mb-1 text-xs font-medium">Prompts</div>
                    <div className="grid gap-2 text-xs grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {it?.promptBase ? <div className="rounded-md border p-2"><div className="mb-1 font-medium">Base</div><div className="whitespace-pre-wrap break-words">{it.promptBase}</div></div> : null}
                      {it?.promptMidjourney ? <div className="rounded-md border p-2"><div className="mb-1 font-medium">Midjourney</div><div className="whitespace-pre-wrap break-words">{it.promptMidjourney}</div></div> : null}
                      {it?.promptStableDiffusion ? <div className="rounded-md border p-2"><div className="mb-1 font-medium">Stable Diffusion</div><div className="whitespace-pre-wrap break-words">{it.promptStableDiffusion}</div></div> : null}
                      {it?.promptDalle ? <div className="rounded-md border p-2"><div className="mb-1 font-medium">DALL·E</div><div className="whitespace-pre-wrap break-words">{it.promptDalle}</div></div> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </StepCard>
        </div>
      </div>
    </div>
  );
}


