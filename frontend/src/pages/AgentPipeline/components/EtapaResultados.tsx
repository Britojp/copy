import { useMemo, useState } from 'react';
import { Badge } from '../../../components/common/Badge';
import { Card } from '../../../components/common/Card';
import { Check, X } from 'lucide-react';
import { extractArrayFromObject, toggleSetItem } from '../../../lib/format';

type EtapaResultadosProps = {
  descOut: unknown;
  imgPromptOut: unknown;
  loading: boolean;
  onBack: () => void;
};

export function EtapaResultados({
  descOut,
  imgPromptOut,
  loading,
  onBack,
}: EtapaResultadosProps) {
  const [approvedDescs, setApprovedDescs] = useState<Set<number>>(new Set());
  const [approvedPrompts, setApprovedPrompts] = useState<Set<number>>(new Set());

  const descList = useMemo(() => {
    return extractArrayFromObject(descOut, 'itens') as Array<Record<string, unknown> & { nome?: string; data?: string; variacoes?: Array<unknown>; descricaoPost?: string; cta?: string; hashtags?: string[]; palavrasChave?: string[] }>;
  }, [descOut]);

  const promptList = useMemo(() => {
    return extractArrayFromObject(imgPromptOut, 'itens') as Array<Record<string, unknown> & { nome?: string; data?: string; tema?: string; elementos?: string[]; composicao?: string; estilo?: string; promptBase?: string; promptMidjourney?: string; promptStableDiffusion?: string; promptDalle?: string }>;
  }, [imgPromptOut]);

  const hasDescData = descList.length > 0;
  const hasPromptData = promptList.length > 0;
  const isLoadingDesc = loading && !hasDescData;
  const isLoadingPrompt = loading && hasDescData && !hasPromptData;
  const isCompleted = hasDescData && hasPromptData;

  const toggleDescApproval = (idx: number) => {
    setApprovedDescs((prev) => toggleSetItem(prev, idx));
  };

  const togglePromptApproval = (idx: number) => {
    setApprovedPrompts((prev) => toggleSetItem(prev, idx));
  };

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-md" style={{ fontFamily: 'var(--font-logo)' }}>Etapa 3: Resultados</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium" style={{ fontFamily: 'var(--font-logo)' }}>
              Descrições
            </h3>
            {hasDescData && approvedDescs.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {approvedDescs.size}/{descList.length} aprovadas
              </span>
            )}
          </div>
        {isLoadingDesc ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Gerando descrições...</span>
          </div>
        ) : !hasDescData ? (
          <div className="text-xs text-muted-foreground">Aguarde selecionar uma data na etapa anterior.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {descList.map((it, idx) => {
              const isApproved = approvedDescs.has(idx);
              return (
              <div 
                key={idx} 
                className={`rounded-md p-3 transition-all duration-200 ${
                  isApproved 
                    ? 'bg-green-500/5 border border-green-500/20' 
                    : 'bg-transparent'
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-logo)' }}>
                    {it?.nome ?? 'Item'}
                  </h4>
                  <div className="flex items-center gap-2">
                    {it?.data && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{it.data}</span>
                    )}
                    <button
                      onClick={() => toggleDescApproval(idx)}
                      className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 ${
                        isApproved
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                      aria-label={isApproved ? 'Desaprovar' : 'Aprovar'}
                    >
                      {isApproved ? (
                        <Check size={14} />
                      ) : (
                        <X size={14} />
                      )}
                    </button>
                  </div>
                </div>
                
                {Array.isArray(it?.variacoes) && it.variacoes.length > 0 ? (
                  <div className="space-y-4">
                    {it.variacoes.map((v: any, vIdx: number) => (
                      <div key={vIdx} className="space-y-2.5">
                        <div className="text-xs font-medium text-primary uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
                          {v?.tamanho || 'VARIAÇÃO'}
                        </div>
                        
                        {v?.descricaoPost && (
                          <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                            {v.descricaoPost}
                          </p>
                        )}
                        
                        {v?.cta && (
                          <div className="text-xs">
                            <span className="font-medium text-muted-foreground">CTA: </span>
                            <span className="text-foreground">{v.cta}</span>
                          </div>
                        )}
                        
                        {Array.isArray(v?.hashtags) && v.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {v.hashtags.map((h: string, i: number) => (
                              <Badge key={i} variant="outline">
                                #{h.replace(/^#/, '')}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {Array.isArray(v?.palavrasChave) && v.palavrasChave.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Palavras-chave: </span>
                            <span>{v.palavrasChave.join(', ')}</span>
                          </div>
                        )}
                        
                        {it.variacoes && vIdx < it.variacoes.length - 1 && (
                          <div className="border-t border-muted/30 pt-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {it?.descricaoPost && (
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                        {it.descricaoPost}
                      </p>
                    )}
                    
                    {it?.cta && (
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">CTA: </span>
                        <span className="text-foreground">{it.cta}</span>
                      </div>
                    )}
                    
                    {Array.isArray(it?.hashtags) && it.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {it.hashtags.map((h: string, i: number) => (
                          <Badge key={i} variant="outline">
                            #{h.replace(/^#/, '')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium" style={{ fontFamily: 'var(--font-logo)' }}>
              Prompts de Imagem
            </h3>
            {hasPromptData && approvedPrompts.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {approvedPrompts.size}/{promptList.length} aprovados
              </span>
            )}
          </div>
        {isLoadingPrompt ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Gerando prompts...</span>
          </div>
        ) : !hasPromptData ? (
          <div className="text-xs text-muted-foreground">
            {hasDescData ? 'Aguarde a geração dos prompts...' : 'Aguarde concluir as etapas anteriores.'}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {promptList.map((it, idx) => {
              const isApproved = approvedPrompts.has(idx);
              return (
              <div 
                key={idx} 
                className={`rounded-md p-3 transition-all duration-200 ${
                  isApproved 
                    ? 'bg-green-500/5 border border-green-500/20' 
                    : 'bg-transparent'
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-logo)' }}>
                    {it?.nome ?? 'Item'}
                  </h4>
                  <div className="flex items-center gap-2">
                    {it?.data && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{it.data}</span>
                    )}
                    <button
                      onClick={() => togglePromptApproval(idx)}
                      className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 ${
                        isApproved
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                      aria-label={isApproved ? 'Desaprovar' : 'Aprovar'}
                    >
                      {isApproved ? (
                        <Check size={14} />
                      ) : (
                        <X size={14} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2.5 mb-4">
                  {it?.tema && (
                    <div className="text-xs">
                      <span className="font-medium text-muted-foreground">Tema: </span>
                      <span className="text-foreground">{it.tema}</span>
                    </div>
                  )}
                  
                  {Array.isArray(it?.elementos) && it.elementos.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {it.elementos.map((e: string, i: number) => (
                        <Badge key={i} variant="outline">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {it?.composicao && (
                    <div className="text-xs">
                      <span className="font-medium text-muted-foreground">Composição: </span>
                      <span className="text-foreground">{it.composicao}</span>
                    </div>
                  )}
                  
                  {it?.estilo && (
                    <div className="text-xs">
                      <span className="font-medium text-muted-foreground">Estilo: </span>
                      <span className="text-foreground">{it.estilo}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
                    Prompts
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {it?.promptBase && (
                      <div className="rounded-md p-3 bg-muted/30">
                        <div className="mb-2 text-xs font-semibold text-primary" style={{ fontFamily: 'var(--font-logo)' }}>
                          Base
                        </div>
                        <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {it.promptBase}
                        </div>
                      </div>
                    )}
                    {it?.promptMidjourney && (
                      <div className="rounded-md p-3 bg-muted/30">
                        <div className="mb-2 text-xs font-semibold text-primary" style={{ fontFamily: 'var(--font-logo)' }}>
                          Midjourney
                        </div>
                        <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {it.promptMidjourney}
                        </div>
                      </div>
                    )}
                    {it?.promptStableDiffusion && (
                      <div className="rounded-md p-3 bg-muted/30">
                        <div className="mb-2 text-xs font-semibold text-primary" style={{ fontFamily: 'var(--font-logo)' }}>
                          Stable Diffusion
                        </div>
                        <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {it.promptStableDiffusion}
                        </div>
                      </div>
                    )}
                    {it?.promptDalle && (
                      <div className="rounded-md p-3 bg-muted/30">
                        <div className="mb-2 text-xs font-semibold text-primary" style={{ fontFamily: 'var(--font-logo)' }}>
                          DALL·E
                        </div>
                        <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {it.promptDalle}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
        </Card>
      </div>
    </>
  );
}

