import { useMemo } from 'react';
import { Section } from '../../../components/common/Section';
import { Badge } from '../../../components/common/Badge';

type EtapaGeradorPromptProps = {
  descOut: unknown;
  imgPromptOut: unknown;
  loading: boolean;
  onBack: () => void;
};

export function EtapaGeradorPrompt({
  descOut,
  imgPromptOut,
  loading,
  onBack,
}: EtapaGeradorPromptProps) {
  const promptList = useMemo(() => {
    if (imgPromptOut && typeof imgPromptOut === 'object' && 'itens' in (imgPromptOut as any)) {
      const arr = (imgPromptOut as any).itens;
      if (Array.isArray(arr)) return arr as Array<any>;
    }
    return [] as Array<any>;
  }, [imgPromptOut]);

  const hasData = promptList.length > 0;
  const isCompleted = hasData;

  return (
    <Section
      title="Etapa 4: Gerador de Prompt de Imagem"
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
          <span>Gerando prompts...</span>
        </div>
      ) : !hasData ? (
        <div className="text-xs text-muted-foreground">Aguarde concluir as etapas anteriores.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {promptList.map((it, idx) => (
            <div key={idx} className="rounded-md p-2 border border-border">
              <div className="mb-1 text-xs font-medium break-words">{it?.nome ?? 'Item'}</div>
              <div className="mb-1.5 text-xs text-muted-foreground">{it?.data ?? '—'}</div>
              <div className="mb-1.5 text-xs">
                <span className="font-medium">Tema:</span> {it?.tema ?? '—'}
              </div>
              {Array.isArray(it?.elementos) && it.elementos.length > 0 ? (
                <div className="mb-1.5 flex flex-wrap gap-1">
                  {it.elementos.slice(0, 6).map((e: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {e}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <div className="mb-1.5 text-xs">
                <span className="font-medium">Composição:</span> {it?.composicao ?? '—'}
              </div>
              <div className="mb-1.5 text-xs">
                <span className="font-medium">Estilo:</span> {it?.estilo ?? '—'}
              </div>
              <div className="mb-1 text-xs font-medium">Prompts</div>
              <div className="grid gap-1.5 text-xs grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {it?.promptBase ? (
                  <div className="rounded-md p-1.5 border border-border">
                    <div className="mb-1 font-medium">Base</div>
                    <div className="whitespace-pre-wrap break-words">{it.promptBase}</div>
                  </div>
                ) : null}
                {it?.promptMidjourney ? (
                  <div className="rounded-md p-1.5 border border-border">
                    <div className="mb-1 font-medium">Midjourney</div>
                    <div className="whitespace-pre-wrap break-words">{it.promptMidjourney}</div>
                  </div>
                ) : null}
                {it?.promptStableDiffusion ? (
                  <div className="rounded-md p-1.5 border border-border">
                    <div className="mb-1 font-medium">Stable Diffusion</div>
                    <div className="whitespace-pre-wrap break-words">{it.promptStableDiffusion}</div>
                  </div>
                ) : null}
                {it?.promptDalle ? (
                  <div className="rounded-md p-1.5 border border-border">
                    <div className="mb-1 font-medium">DALL·E</div>
                    <div className="whitespace-pre-wrap break-words">{it.promptDalle}</div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

