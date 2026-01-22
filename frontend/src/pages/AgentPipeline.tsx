import { useEffect, useState } from 'react';
import { aiBuscadorData, aiBuscadorInformacoes, aiEscritorDescricao } from '../services/ai';
import { type Tone } from '../types/common/ai';
import { EtapaParametros } from './AgentPipeline/components/EtapaParametros';
import { EtapaBuscadorDatas } from './AgentPipeline/components/EtapaBuscadorDatas';
import { EtapaResultados } from './AgentPipeline/components/EtapaResultados';
import { EtapaNavigator } from './AgentPipeline/components/EtapaNavigator';
import { toast } from '../lib/toast';
import { extractErrorMessage, extractErrorDetails } from '../services/errors';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Parâmetros
  const [nicho, setNicho] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tone, setTone] = useState<Tone>('serio');
  const [brandProfileId, setBrandProfileId] = useState<string>('');

  // Estados das etapas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correlationId, setCorrelationId] = useState<string | null>(null);
  const [run1, setRun1] = useState<string | null>(null);
  const [_run2, setRun2] = useState<string | null>(null);
  const [_run3, setRun3] = useState<string | null>(null);
  const [dataOut, setDataOut] = useState<unknown>(null);
  const [_infoOut, setInfoOut] = useState<unknown>(null);
  const [descOut, setDescOut] = useState<unknown>(null);

  // Histórico
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const allCompleted = completedSteps.has(1) && completedSteps.has(2) && completedSteps.has(3);

  async function handleNextFromEtapa1() {
    setLoading(true);
    setError(null);
    setCurrentStep(2); // Navega imediatamente para a etapa 2
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

      setCompletedSteps((prev) => new Set([...prev, 1]));
      toast.success('Datas encontradas com sucesso');
    } catch (e: unknown) {
      const message = extractErrorMessage(e);
      const details = extractErrorDetails(e);
      setError(message);
      toast.error('Erro ao buscar datas', details || message);
      console.error('Erro ao buscar datas:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectDate(item: any) {
    setLoading(true);
    setError(null);
    setInfoOut(null);
    setDescOut(null);
    
    setCompletedSteps((prev) => new Set([...prev, 2]));
    setCurrentStep(3);
    
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
        input: `tom=${tone}\nObjeto do buscador-informacoes:\n${iText}\nGere 3 opções de legendas, cada uma com versão curta e média conforme instruções.`,
        correlationId: correlationId ?? undefined,
        parentRunId: i.runId ?? undefined,
        brandProfileId: brandProfileId || undefined,
      });
      setRun3(ed.runId ?? null);
      setDescOut(ed.output);

      setCompletedSteps((prev) => new Set([...prev, 3]));
      toast.success('Legendas geradas com sucesso');
    } catch (e: unknown) {
      const message = extractErrorMessage(e);
      const details = extractErrorDetails(e);
      setError(message);
      toast.error('Erro ao gerar legendas', details || message);
      console.error('Erro ao gerar legendas:', e);
    } finally {
      setLoading(false);
    }
  }

  function handleStepClick(step: number) {
    if (allCompleted) {
      setCurrentStep(step);
    } else if (step === 1) {
      setCurrentStep(step);
    } else if (completedSteps.has(step - 1)) {
      setCurrentStep(step);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleNext() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  const canAdvanceFromStep2 = completedSteps.has(2) || allCompleted;

  // Determina qual etapa está carregando
  const getLoadingStep = (): number | null => {
    if (!loading) return null;
    // Etapa 2 carregando (buscando datas - navega imediatamente para etapa 2)
    if (currentStep === 2 && !dataOut) return 2;
    // Quando seleciona data, navega para etapa 3 e processa legendas
    // Mostra loading na etapa 3 enquanto processa
    if (currentStep === 3 && !descOut) return 3;
    return null;
  };

  const loadingStep = getLoadingStep();

  function restoreHistory(h: HistoryItem) {
    setNicho(h.nicho);
    setStartDate(h.startDate);
    setEndDate(h.endDate);
    setCorrelationId(h.correlationId);
    setRun1(h.runId);
    setDataOut(h.snapshot);
    setInfoOut(null);
    setDescOut(null);
    setRun2(null);
    setRun3(null);
    setCompletedSteps(new Set([1]));
    setCurrentStep(2);
  }

  return (
    <div className="w-full p-3 sm:p-4 lg:px-6 lg:pb-6 lg:pt-0">
      {correlationId && (
        <div className="mb-3">
          <div className="text-xs text-muted-foreground break-all sm:break-normal">
            correlationId: {correlationId}
          </div>
        </div>
      )}

      <EtapaNavigator
        currentStep={currentStep}
        completedSteps={completedSteps}
        allCompleted={allCompleted}
        onStepClick={handleStepClick}
        loadingStep={loadingStep}
      />

      {error && (
        <div className="mb-3 rounded-md bg-destructive/10 p-2 text-xs">
          <div className="font-medium">Erro</div>
          <div className="text-destructive-foreground/90">{error}</div>
        </div>
      )}

      {currentStep === 1 && (
        <EtapaParametros
          nicho={nicho}
          startDate={startDate}
          endDate={endDate}
          tone={tone}
          brandProfileId={brandProfileId}
          onNichoChange={setNicho}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onToneChange={setTone}
          onBrandProfileIdChange={setBrandProfileId}
          onNext={handleNextFromEtapa1}
          loading={loading && currentStep === 1}
          history={history}
          onRestoreHistory={restoreHistory}
        />
      )}

      {currentStep === 2 && (
        <EtapaBuscadorDatas
          dataOut={dataOut}
          loading={loading}
          onSelectDate={handleSelectDate}
          onBack={handleBack}
          onNext={handleNext}
          canAdvance={canAdvanceFromStep2}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {currentStep === 3 && (
        <EtapaResultados
          descOut={descOut}
          loading={loading}
          onBack={handleBack}
          brandProfileId={brandProfileId || undefined}
          correlationId={correlationId}
          runId={_run3}
        />
      )}

    </div>
  );
}
