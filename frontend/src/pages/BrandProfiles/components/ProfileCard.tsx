import { Building2, Edit2, Trash2 } from 'lucide-react';
import { type BrandProfile } from '../../../types/brand';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/common/Badge';

type ProfileCardProps = {
  profile: BrandProfile;
  onEdit: (profile: BrandProfile) => void;
  onDelete: (id: string) => void;
};

export function ProfileCard({ profile, onEdit, onDelete }: ProfileCardProps) {
  return (
    <Card className="space-y-3 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="rounded-md bg-primary/10 p-2 flex-shrink-0">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-logo)' }}>
              {profile.nome}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{profile.setor}</p>
          </div>
        </div>
      </div>

      {profile.valores && profile.valores.length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-1.5 text-muted-foreground">Valores</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.valores.slice(0, 3).map((valor, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {valor}
              </Badge>
            ))}
            {profile.valores.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{profile.valores.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {profile.tomDeVoz && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground">Tom de Voz</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {profile.tomDeVoz.principal}
            </Badge>
          </div>
        </div>
      )}

      {profile.publicoAlvo?.faixaEtaria && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Público:</span> {profile.publicoAlvo.faixaEtaria}
        </div>
      )}

      <div className="flex gap-1.5 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(profile)}
          className="flex-1 gap-1.5"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(profile.id)}
          className="flex-1 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir
        </Button>
      </div>
    </Card>
  );
}





