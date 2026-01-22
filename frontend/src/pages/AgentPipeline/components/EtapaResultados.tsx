import { useMemo, useState } from 'react';
import { Badge } from '../../../components/common/Badge';
import { Card } from '../../../components/common/Card';
import { Check, X, Copy, CheckCircle2 } from 'lucide-react';
import { extractArrayFromObject, toggleSetItem, formatDateBR } from '../../../lib/format';
import { toast } from '../../../lib/toast';
import { saveApprovedLegenda } from '../../../services/ai';

type Legenda = {
  descricaoPost: string;
  cta: string;
  hashtags: string[];
  palavrasChave: string[];
};

type Opcao = {
  numero: number;
  curta: Legenda;
  media: Legenda;
};

type ItemLegenda = {
  nome: string;
  data: string | null;
  opcoes: Opcao[];
};

type EtapaResultadosProps = {
  descOut: unknown;
  loading: boolean;
  onBack: () => void;
  brandProfileId?: string;
  correlationId?: string | null;
  runId?: string | null;
};

export function EtapaResultados({
  descOut,
  loading,
  onBack,
  brandProfileId,
  correlationId,
  runId,
}: EtapaResultadosProps) {
  const [approvedLegendas, setApprovedLegendas] = useState<Set<string>>(new Set());
  const [copiedLegendas, setCopiedLegendas] = useState<Set<string>>(new Set());
  const [savingLegendas, setSavingLegendas] = useState<Set<string>>(new Set());

  const itemsList = useMemo(() => {
    const items = extractArrayFromObject(descOut, 'itens') as ItemLegenda[];
    return items.filter((item) => item && item.opcoes && Array.isArray(item.opcoes));
  }, [descOut]);

  const hasData = itemsList.length > 0;
  const isLoading = loading && !hasData;
  const isCompleted = hasData;

  const toggleLegendaApproval = async (itemIdx: number, opcaoNum: number, tipo: 'curta' | 'media', legenda: Legenda, item: ItemLegenda) => {
    const key = `${itemIdx}-${opcaoNum}-${tipo}`;
    const isCurrentlyApproved = approvedLegendas.has(key);
    
    setApprovedLegendas((prev) => toggleSetItem(prev, key));

    if (!isCurrentlyApproved) {
      const saveKey = key;
      setSavingLegendas((prev) => new Set([...prev, saveKey]));
      
      try {
        await saveApprovedLegenda({
          brandProfileId: brandProfileId || undefined,
          nome: item.nome || undefined,
          data: item.data || undefined,
          tipo: tipo,
          opcaoNumero: opcaoNum,
          descricaoPost: legenda.descricaoPost,
          cta: legenda.cta || undefined,
          hashtags: legenda.hashtags || undefined,
          palavrasChave: legenda.palavrasChave || undefined,
          correlationId: correlationId || undefined,
          runId: runId || undefined,
        });
        toast.success('Legenda salva com sucesso');
      } catch (error) {
        setApprovedLegendas((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        toast.error('Erro ao salvar legenda');
        console.error('Erro ao salvar legenda:', error);
      } finally {
        setSavingLegendas((prev) => {
          const next = new Set(prev);
          next.delete(saveKey);
          return next;
        });
      }
    }
  };

  const isLegendaApproved = (itemIdx: number, opcaoNum: number, tipo: 'curta' | 'media'): boolean => {
    const key = `${itemIdx}-${opcaoNum}-${tipo}`;
    return approvedLegendas.has(key);
  };

  const getApprovedCount = (): number => {
    return approvedLegendas.size;
  };

  const getTotalLegendas = (): number => {
    return itemsList.reduce((total, item) => total + (item.opcoes?.length || 0) * 2, 0);
  };

  const handleCopyLegenda = async (legenda: Legenda, itemIdx: number, opcaoNum: number, tipo: 'curta' | 'media') => {
    const textToCopy = [
      legenda.descricaoPost,
      legenda.cta && `CTA: ${legenda.cta}`,
      legenda.hashtags?.length > 0 && legenda.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' '),
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      const key = `${itemIdx}-${opcaoNum}-${tipo}`;
      setCopiedLegendas((prev) => new Set([...prev, key]));
      toast.success('Legenda copiada para a área de transferência');
      setTimeout(() => {
        setCopiedLegendas((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 2000);
    } catch {
      toast.error('Erro ao copiar legenda');
    }
  };

  const isLegendaCopied = (itemIdx: number, opcaoNum: number, tipo: 'curta' | 'media'): boolean => {
    const key = `${itemIdx}-${opcaoNum}-${tipo}`;
    return copiedLegendas.has(key);
  };

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-md" style={{ fontFamily: 'var(--font-logo)' }}>Etapa 3: Legendas</h2>
          {hasData && (
            <p className="text-xs text-muted-foreground mt-1">
              {itemsList.length} {itemsList.length === 1 ? 'item' : 'itens'} • {getTotalLegendas()} legendas geradas
            </p>
          )}
        </div>
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

      <div className="space-y-4">
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium" style={{ fontFamily: 'var(--font-logo)' }}>
              Legendas Geradas
            </h3>
            {hasData && approvedLegendas.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {getApprovedCount()}/{getTotalLegendas()} aprovadas
                </span>
                {getApprovedCount() === getTotalLegendas() && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Todas aprovadas
                  </span>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Gerando legendas...</span>
              <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
                Isso pode levar alguns minutos. Por favor, aguarde.
              </p>
            </div>
          ) : !hasData ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm text-muted-foreground">Aguarde selecionar uma data na etapa anterior.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {itemsList.map((item, itemIdx) => (
                <div key={itemIdx} className="space-y-5">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-muted/40">
                    <div>
                      <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-logo)' }}>
                        {item.nome ?? 'Item'}
                      </h4>
                      {item.data && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateBR(item.data)}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.opcoes && item.opcoes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {item.opcoes.map((opcao) => (
                        <div key={opcao.numero} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-semibold text-primary uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
                              Opção {opcao.numero}
                            </div>
                            <div className="flex-1 h-px bg-muted/30"></div>
                          </div>

                          <div className="space-y-3">
                            {opcao.curta && (
                              <div
                                className={`rounded-lg p-4 transition-all duration-200 border ${
                                  isLegendaApproved(itemIdx, opcao.numero, 'curta')
                                    ? 'bg-green-500/10 border-green-500/40 shadow-sm'
                                    : 'bg-muted/30 border-muted/50 hover:border-muted/70 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-primary uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
                                    Curta
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyLegenda(opcao.curta, itemIdx, opcao.numero, 'curta')}
                                      className="h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 bg-background border border-muted hover:bg-muted text-muted-foreground hover:text-foreground"
                                      aria-label="Copiar legenda"
                                      title="Copiar legenda"
                                    >
                                      {isLegendaCopied(itemIdx, opcao.numero, 'curta') ? (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                      ) : (
                                        <Copy size={14} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => toggleLegendaApproval(itemIdx, opcao.numero, 'curta', opcao.curta, item)}
                                      disabled={savingLegendas.has(`${itemIdx}-${opcao.numero}-curta`)}
                                      className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 shadow-sm ${
                                        isLegendaApproved(itemIdx, opcao.numero, 'curta')
                                          ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow'
                                          : 'bg-background border border-muted hover:bg-muted text-muted-foreground hover:text-foreground'
                                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                                      aria-label={isLegendaApproved(itemIdx, opcao.numero, 'curta') ? 'Desaprovar legenda' : 'Aprovar legenda'}
                                      title={isLegendaApproved(itemIdx, opcao.numero, 'curta') ? 'Desaprovar' : 'Aprovar'}
                                    >
                                      {savingLegendas.has(`${itemIdx}-${opcao.numero}-curta`) ? (
                                        <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                      ) : isLegendaApproved(itemIdx, opcao.numero, 'curta') ? (
                                        <Check size={14} />
                                      ) : (
                                        <X size={14} />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {opcao.curta.descricaoPost && (
                                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap mb-3">
                                    {opcao.curta.descricaoPost}
                                  </p>
                                )}

                                {opcao.curta.cta && (
                                  <div className="text-xs mb-3 p-2 rounded-md bg-primary/5 border border-primary/10">
                                    <span className="font-semibold text-primary">CTA: </span>
                                    <span className="text-foreground">{opcao.curta.cta}</span>
                                  </div>
                                )}

                                {Array.isArray(opcao.curta.hashtags) && opcao.curta.hashtags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-3">
                                    {opcao.curta.hashtags.map((h: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-[10px]">
                                        #{h.replace(/^#/, '')}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                {Array.isArray(opcao.curta.palavrasChave) && opcao.curta.palavrasChave.length > 0 && (
                                  <div className="text-xs text-muted-foreground pt-2 border-t border-muted/30">
                                    <span className="font-medium">Palavras-chave: </span>
                                    <span>{opcao.curta.palavrasChave.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {opcao.media && (
                              <div
                                className={`rounded-lg p-4 transition-all duration-200 border ${
                                  isLegendaApproved(itemIdx, opcao.numero, 'media')
                                    ? 'bg-green-500/10 border-green-500/40 shadow-sm'
                                    : 'bg-muted/30 border-muted/50 hover:border-muted/70 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-primary uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
                                    Média
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyLegenda(opcao.media, itemIdx, opcao.numero, 'media')}
                                      className="h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 bg-background border border-muted hover:bg-muted text-muted-foreground hover:text-foreground"
                                      aria-label="Copiar legenda"
                                      title="Copiar legenda"
                                    >
                                      {isLegendaCopied(itemIdx, opcao.numero, 'media') ? (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                      ) : (
                                        <Copy size={14} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => toggleLegendaApproval(itemIdx, opcao.numero, 'media', opcao.media, item)}
                                      disabled={savingLegendas.has(`${itemIdx}-${opcao.numero}-media`)}
                                      className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 shadow-sm ${
                                        isLegendaApproved(itemIdx, opcao.numero, 'media')
                                          ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow'
                                          : 'bg-background border border-muted hover:bg-muted text-muted-foreground hover:text-foreground'
                                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                                      aria-label={isLegendaApproved(itemIdx, opcao.numero, 'media') ? 'Desaprovar legenda' : 'Aprovar legenda'}
                                      title={isLegendaApproved(itemIdx, opcao.numero, 'media') ? 'Desaprovar' : 'Aprovar'}
                                    >
                                      {savingLegendas.has(`${itemIdx}-${opcao.numero}-media`) ? (
                                        <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                      ) : isLegendaApproved(itemIdx, opcao.numero, 'media') ? (
                                        <Check size={14} />
                                      ) : (
                                        <X size={14} />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {opcao.media.descricaoPost && (
                                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap mb-3">
                                    {opcao.media.descricaoPost}
                                  </p>
                                )}

                                {opcao.media.cta && (
                                  <div className="text-xs mb-3 p-2 rounded-md bg-primary/5 border border-primary/10">
                                    <span className="font-semibold text-primary">CTA: </span>
                                    <span className="text-foreground">{opcao.media.cta}</span>
                                  </div>
                                )}

                                {Array.isArray(opcao.media.hashtags) && opcao.media.hashtags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-3">
                                    {opcao.media.hashtags.map((h: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-[10px]">
                                        #{h.replace(/^#/, '')}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                {Array.isArray(opcao.media.palavrasChave) && opcao.media.palavrasChave.length > 0 && (
                                  <div className="text-xs text-muted-foreground pt-2 border-t border-muted/30">
                                    <span className="font-medium">Palavras-chave: </span>
                                    <span>{opcao.media.palavrasChave.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

