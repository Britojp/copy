import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { listBrandProfiles } from '../../../services/brand';
import { type BrandProfile } from '../../../types/brand';
import { type Tone } from '../../../types/common/ai';
import { Section } from '../../../components/common/Section';
import { Field } from '../../../components/common/Field';
import { Card } from '../../../components/common/Card';

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

type EtapaParametrosProps = {
  nicho: string;
  startDate: string;
  endDate: string;
  tone: Tone;
  visualPrefs: string;
  brandProfileId: string;
  onNichoChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onToneChange: (value: Tone) => void;
  onVisualPrefsChange: (value: string) => void;
  onBrandProfileIdChange: (value: string) => void;
  onNext: () => void;
  loading?: boolean;
  history?: HistoryItem[];
  onRestoreHistory?: (item: HistoryItem) => void;
};

export function EtapaParametros({
  nicho,
  startDate,
  endDate,
  tone,
  visualPrefs,
  brandProfileId,
  onNichoChange,
  onStartDateChange,
  onEndDateChange,
  onToneChange,
  onVisualPrefsChange,
  onBrandProfileIdChange,
  onNext,
  loading = false,
  history = [],
  onRestoreHistory,
}: EtapaParametrosProps) {
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([]);

  useEffect(() => {
    listBrandProfiles()
      .then((profiles) => setBrandProfiles(profiles))
      .catch((err) => console.error('Erro ao carregar perfis:', err));
  }, []);

  const formatDateBR = (dateStr: string) => {
    if (!dateStr || dateStr === '—') return '—';
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const canProceed = nicho.trim() !== '';

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-md" style={{ fontFamily: 'var(--font-logo)' }}>Etapa 1: Parâmetros</h2>
      </div>

      <Section>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Nicho">
          <input
            value={nicho}
            onChange={(e) => onNichoChange(e.target.value)}
            placeholder="ex.: esportes, médico"
            className="h-8 rounded-md bg-background px-2 text-xs"
          />
        </Field>
        <Field label="Data inicial">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-8 rounded-md bg-background px-2 text-xs"
          />
        </Field>
        <Field label="Data final">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-8 rounded-md bg-background px-2 text-xs"
          />
        </Field>
        <Field label="Tom (para etapas seguintes)">
          <select
            value={tone}
            onChange={(e) => onToneChange(e.target.value as Tone)}
            className="h-8 rounded-md bg-background px-2 text-xs"
          >
            <option value="serio">Sério</option>
            <option value="divertido">Divertido</option>
            <option value="persuasivo">Persuasivo</option>
            <option value="inspirador">Inspirador</option>
            <option value="educativo">Educativo</option>
          </select>
        </Field>
        <Field label="Perfil de Marca (opcional)">
          <select
            value={brandProfileId}
            onChange={(e) => onBrandProfileIdChange(e.target.value)}
            className="h-8 rounded-md bg-background px-2 text-xs"
          >
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
              onChange={(e) => onVisualPrefsChange(e.target.value)}
              placeholder="ex.: paleta azul; minimalista"
              className="h-8 w-full rounded-md bg-background px-2 text-xs"
            />
          </Field>
        </div>
      </div>

      <div className="mt-4 pt-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-md font-medium mb-2" style={{ fontFamily: 'var(--font-logo)' }}>Como funciona</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>Preencha o <strong>nicho</strong> para buscar datas relevantes relacionadas ao tema</span>
              </li>
              <li className="flex items-start gap-2">
                <span>As <strong>datas</strong> são opcionais e ajudam a filtrar eventos em um período específico</span>
              </li>
              <li className="flex items-start gap-2">
                <span>O <strong>tom</strong> e <strong>preferências visuais</strong> serão usados nas etapas seguintes para gerar conteúdo personalizado</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Selecione um <strong>perfil de marca</strong> para aplicar as configurações salvas automaticamente</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </Section>

      <div className="flex justify-center mt-6">
        <button
          onClick={onNext}
          disabled={!canProceed || loading}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Próxima etapa"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-4">
          <Card padding="md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium" style={{ fontFamily: 'var(--font-logo)' }}>Histórico</h3>
              <span className="text-xs text-muted-foreground">{history.length} {history.length === 1 ? 'item' : 'itens'}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Você pode restaurar uma busca anterior clicando em "Restaurar" para reutilizar os parâmetros e resultados já encontrados
            </p>
            <div className="flex flex-col gap-3">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-all duration-200 border border-transparent hover:border-muted/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex flex-col min-w-0 flex-1 gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-logo)' }}>
                          {h.nicho || 'Sem nicho'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">Período:</span>
                          <span>{formatDateBR(h.startDate)} até {formatDateBR(h.endDate)}</span>
                        </div>
                        {h.correlationId && (
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
                            <span className="font-medium">ID:</span>
                            <span className="break-all sm:break-normal font-mono">
                              {h.correlationId.slice(0, 30)}...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {onRestoreHistory && (
                      <div className="flex gap-2 flex-shrink-0 sm:items-start">
                        <button
                          onClick={() => onRestoreHistory(h)}
                          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow"
                        >
                          Restaurar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

