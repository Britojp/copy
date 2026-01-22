import { Building2, Plus } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/ui/button';

type EmptyStateProps = {
  onCreateClick: () => void;
};

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card padding="lg" className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="rounded-full bg-muted p-6">
          <Building2 className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-logo)' }}>
          Nenhum perfil cadastrado
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Crie seu primeiro perfil de marca para começar a gerar conteúdos personalizados com IA.
        </p>
      </div>
      <Button onClick={onCreateClick} size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        Criar Perfil
      </Button>
    </Card>
  );
}





