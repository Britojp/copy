import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listBrandProfiles, deleteBrandProfile } from '../../services/brand';
import { type BrandProfile } from '../../types/brand';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/common/Card';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function BrandProfilesPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await listBrandProfiles();
      setProfiles(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar perfis de marca');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este perfil?')) return;
    try {
      await deleteBrandProfile(id);
      await loadProfiles();
    } catch (err) {
      setError('Erro ao excluir perfil');
      console.error(err);
    }
  };

  const handleEdit = (profile: BrandProfile) => {
    navigate(`/brand-profiles/edit/${profile.id}`);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:px-6 lg:pb-6 lg:pt-0">
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <Button onClick={() => navigate('/brand-profiles/create')} size="sm" className="w-full sm:w-auto">Criar Perfil</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8 text-xs">Carregando perfis...</div>
        ) : profiles.length === 0 ? (
          <Card padding="lg" className="text-center text-xs text-muted-foreground">
            Nenhum perfil de marca cadastrado. Crie um novo perfil para começar.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className="space-y-3">
                <div>
                  <h3 className="text-sm" style={{ fontFamily: 'var(--font-logo)' }}>{profile.nome}</h3>
                  <p className="text-xs text-muted-foreground">{profile.setor}</p>
                </div>
                {profile.valores && profile.valores.length > 0 && (
                  <div>
                    <h4 className="text-xs mb-1.5" style={{ fontFamily: 'var(--font-logo)' }}>Valores:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.valores.map((valor, idx) => (
                        <span key={idx} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                          {valor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.tomDeVoz && (
                  <div>
                    <h4 className="text-xs" style={{ fontFamily: 'var(--font-logo)' }}>Tom de Voz:</h4>
                    <p className="text-xs text-muted-foreground">{profile.tomDeVoz.principal}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-1.5 pt-3">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(profile)} className="flex-1 sm:flex-none">
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(profile.id)} className="flex-1 sm:flex-none">
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

