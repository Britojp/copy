import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { Card } from '../../../components/common/Card';
import { CalendarView } from './CalendarView';

type EtapaBuscadorDatasProps = {
  dataOut: unknown;
  loading: boolean;
  onSelectDate: (item: any) => void;
  onBack: () => void;
  onNext?: () => void;
  canAdvance?: boolean;
  startDate?: string;
  endDate?: string;
};

export function EtapaBuscadorDatas({
  dataOut,
  loading,
  onSelectDate,
  onBack,
  onNext,
  canAdvance = false,
  startDate,
  endDate,
}: EtapaBuscadorDatasProps) {
  const datasList = useMemo(() => {
    if (dataOut && typeof dataOut === 'object' && 'datas' in (dataOut as any)) {
      const arr = (dataOut as any).datas;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [dataOut]);

  const eventsWithoutDate = useMemo(() => {
    return datasList.filter((it) => !it?.data || it.data === '' || it.data === null || it.data === undefined);
  }, [datasList]);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const hasData = datasList.length > 0;
  const hasEventsWithoutDate = eventsWithoutDate.length > 0;
  const isCompleted = hasData;

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-md" style={{ fontFamily: 'var(--font-logo)' }}>Etapa 2: Buscador de Datas</h2>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-2 sm:px-3 text-xs font-medium text-secondary-foreground transition-colors hover:opacity-90 whitespace-nowrap"
          >
            Voltar
          </button>
          {isCompleted && (
            <span className="inline-flex h-8 items-center justify-center rounded-md bg-green-500/10 px-2 sm:px-3 text-xs font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
              Concluída
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Processando...</span>
        </div>
      ) : !hasData ? (
        <div className="text-xs text-muted-foreground">Nenhuma data encontrada para os parâmetros.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card padding="md">
            <h3 className="text-md font-medium mb-2" style={{ fontFamily: 'var(--font-logo)' }}>
              Eventos com data encontrada
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Clique em uma data com evento para avançar para a próxima etapa
            </p>
            <CalendarView
              startDate={startDate || ''}
              endDate={endDate || ''}
              events={datasList}
              onDateClick={onSelectDate}
            />
          </Card>
          
          <Card padding="md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium" style={{ fontFamily: 'var(--font-logo)' }}>
                Eventos com data não encontrada
              </h3>
              {hasEventsWithoutDate && (
                <span className="text-[10px] text-muted-foreground">
                  {eventsWithoutDate.length} {eventsWithoutDate.length === 1 ? 'evento' : 'eventos'}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Você pode escolher um evento sem data para avançar para a próxima etapa
            </p>
            <div className="overflow-auto max-h-[calc(100vh-300px)]">
              {hasEventsWithoutDate ? (
                <div className="flex flex-col gap-4">
                  {eventsWithoutDate.map((it, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-lg p-4 bg-muted/20 hover:bg-muted/40 transition-all duration-200 border border-transparent hover:border-muted/50"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-semibold break-words flex-1 leading-tight" style={{ fontFamily: 'var(--font-logo)' }}>
                            {it?.nome ?? 'Evento'}
                          </h4>
                          <div className="flex gap-1.5 flex-wrap flex-shrink-0">
                            {it?.relevancia ? (
                              <Badge variant="muted">
                                {it.relevancia}
                              </Badge>
                            ) : null}
                            {it?.recorrencia ? (
                              <Badge variant="outline">
                                {it.recorrencia}
                              </Badge>
                            ) : null}
                          </div>
                        </div>

                        {it?.descricao && (
                          <div className="text-xs text-foreground/70 leading-relaxed break-words line-clamp-3">
                            {it.descricao}
                          </div>
                        )}

                        {Array.isArray(it?.tags) && it.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {it.tags.slice(0, 10).map((t: string, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-md px-2.5 py-1 bg-primary/10 text-primary font-medium text-xs border border-primary/20 hover:bg-primary/15 transition-colors"
                              >
                                {capitalizeFirstLetter(t)}
                              </span>
                            ))}
                            {it.tags.length > 10 && (
                              <span className="inline-flex items-center rounded-md px-2.5 py-1 bg-primary/10 text-primary font-medium text-xs border border-primary/20">
                                +{it.tags.length - 10}
                              </span>
                            )}
                          </div>
                        ) : null}

                        <div className="pt-2 border-t border-muted/30">
                          <button
                            onClick={() => onSelectDate(it)}
                            disabled={loading}
                            className="w-full inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                          >
                            {loading ? 'Processando...' : 'Selecionar e Continuar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-xs text-muted-foreground">
                    Nenhum evento sem data encontrado.
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">
                    Eventos com data aparecem no calendário
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {canAdvance && onNext && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onNext}
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Próxima etapa"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
}

