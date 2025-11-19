import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Section } from '../../../components/common/Section';
import { Badge } from '../../../components/common/Badge';

type EtapaEscritorDescricaoProps = {
  infoOut: unknown;
  descOut: unknown;
  loading: boolean;
  onBack: () => void;
  onNext?: () => void;
  canAdvance?: boolean;
};

export function EtapaEscritorDescricao({
  infoOut,
  descOut,
  loading,
  onBack,
  onNext,
  canAdvance = false,
}: EtapaEscritorDescricaoProps) {
  const descList = useMemo(() => {
    if (descOut && typeof descOut === 'object' && 'itens' in (descOut as any)) {
      const arr = (descOut as any).itens;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [descOut]);

  const hasData = descList.length > 0;
  const isCompleted = hasData;

  return (
    <>
      <Section
        title="Etapa 3: Escritor de Descrição"
        actions={
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-2 sm:px-3 text-xs font-medium text-secondary-foreground transition-colors hover:opacity-90 whitespace-nowrap"
            >
              Voltar
            </button>
            {isCompleted && (
              <span className="inline-flex h-8 items-center justify-center rounded-md bg-primary/10 px-2 sm:px-3 text-xs font-medium text-primary whitespace-nowrap">
                Concluída
              </span>
            )}
          </div>
        }
      >
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Gerando descrições...</span>
        </div>
      ) : !hasData ? (
        <div className="text-xs text-muted-foreground">Aguarde selecionar uma data na etapa anterior.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {descList.map((it, idx) => (
            <div key={idx} className="rounded-md p-2 border border-border">
              <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-xs font-medium break-words">{it?.nome ?? 'Item'}</div>
                <div className="text-xs text-muted-foreground flex-shrink-0">{it?.data ?? '—'}</div>
              </div>
              {Array.isArray(it?.variacoes) && it.variacoes.length > 0 ? (
                <div className="flex flex-col gap-2 mt-1.5">
                  {it.variacoes.map((v: any, vIdx: number) => (
                    <div key={vIdx} className="rounded-l-4-primary/30 bg-secondary/10 p-2">
                      <div className="mb-1 text-xs text-primary" style={{ fontFamily: 'var(--font-logo)' }}>
                        {v?.tamanho ? v.tamanho.toUpperCase() : 'VARIAÇÃO'}
                      </div>
                      <div className="mb-1.5 text-xs">{v?.descricaoPost ?? ''}</div>
                      <div className="mb-1.5 text-xs font-medium">CTA: {v?.cta ?? '—'}</div>
                      {Array.isArray(v?.hashtags) && v.hashtags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {v.hashtags.slice(0, 10).map((h: string, i: number) => (
                            <Badge key={i} variant="outline">
                              #{h.replace(/^#/, '')}
                            </Badge>
                          ))}
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
                  <div className="mb-1.5 text-xs">{it?.descricaoPost ?? ''}</div>
                  <div className="mb-1.5 text-xs font-medium">CTA: {it?.cta ?? '—'}</div>
                  {Array.isArray(it?.hashtags) && it.hashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {it.hashtags.slice(0, 10).map((h: string, i: number) => (
                        <Badge key={i} variant="outline">
                          #{h.replace(/^#/, '')}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </Section>
      
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

