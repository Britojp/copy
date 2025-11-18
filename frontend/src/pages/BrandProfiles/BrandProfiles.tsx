import { useState, useEffect } from 'react';
import { listBrandProfiles, deleteBrandProfile } from '../../services/brand';
import { type BrandProfile } from '../../types/brand';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import BrandProfileForm from './components/BrandProfileForm';

export default function BrandProfilesPage() {
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BrandProfile | null>(null);

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
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProfile(null);
    loadProfiles();
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">Criar Perfil</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showForm && <BrandProfileForm profile={editingProfile} onClose={handleCloseForm} />}

        {loading ? (
          <div className="text-center py-12">Carregando perfis...</div>
        ) : profiles.length === 0 ? (
          <Card className="p-6 sm:p-12 text-center text-muted-foreground">
            Nenhum perfil de marca cadastrado. Crie um novo perfil para começar.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-logo)' }}>{profile.nome}</h3>
                  <p className="text-sm text-muted-foreground">{profile.setor}</p>
                </div>
                {profile.valores && profile.valores.length > 0 && (
                  <div>
                    <h4 className="text-sm mb-2" style={{ fontFamily: 'var(--font-logo)' }}>Valores:</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.valores.map((valor, idx) => (
                        <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                          {valor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.tomDeVoz && (
                  <div>
                    <h4 className="text-sm" style={{ fontFamily: 'var(--font-logo)' }}>Tom de Voz:</h4>
                    <p className="text-sm text-muted-foreground">{profile.tomDeVoz.principal}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
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

