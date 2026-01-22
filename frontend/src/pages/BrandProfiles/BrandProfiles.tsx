import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listBrandProfiles, deleteBrandProfile } from '../../services/brand';
import { type BrandProfile } from '../../types/brand';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DeleteConfirmDialog } from '../../components/common/DeleteConfirmDialog';
import { ProfileCard } from './components/ProfileCard';
import { ProfileCardSkeleton } from './components/ProfileCardSkeleton';
import { EmptyState } from './components/EmptyState';
import { toast } from '../../lib/toast';
import { extractErrorMessage, extractErrorDetails } from '../../services/errors';
import { Search, Plus } from 'lucide-react';

type SortOption = 'nome-asc' | 'nome-desc' | 'setor-asc' | 'setor-desc' | 'recent';

export default function BrandProfilesPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('nome-asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{ id: string; nome: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await listBrandProfiles();
      setProfiles(data);
    } catch (err) {
      const message = extractErrorMessage(err);
      const details = extractErrorDetails(err);
      toast.error('Erro ao carregar perfis', details || message);
      console.error('Erro ao carregar perfis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = [...profiles];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (profile) =>
          profile.nome.toLowerCase().includes(query) ||
          profile.setor?.toLowerCase().includes(query) ||
          profile.valores?.some((valor) => valor.toLowerCase().includes(query)) ||
          profile.tomDeVoz?.principal.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'nome-asc':
          return a.nome.localeCompare(b.nome, 'pt-BR');
        case 'nome-desc':
          return b.nome.localeCompare(a.nome, 'pt-BR');
        case 'setor-asc':
          return (a.setor || '').localeCompare(b.setor || '', 'pt-BR');
        case 'setor-desc':
          return (b.setor || '').localeCompare(a.setor || '', 'pt-BR');
        case 'recent':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [profiles, searchQuery, sortOption]);

  const handleDeleteClick = (id: string, nome: string) => {
    setProfileToDelete({ id, nome });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!profileToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBrandProfile(profileToDelete.id);
      toast.success('Perfil excluído com sucesso');
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
      await loadProfiles();
    } catch (err) {
      const message = extractErrorMessage(err);
      const details = extractErrorDetails(err);
      toast.error('Erro ao excluir perfil', details || message);
      console.error('Erro ao excluir perfil:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (profile: BrandProfile) => {
    navigate(`/brand-profiles/edit/${profile.id}`);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:px-6 lg:pb-6 lg:pt-0">
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-logo)' }}>
            Perfis de Marca
          </h1>
          <Button
            onClick={() => navigate('/brand-profiles/create')}
            size="sm"
            className="w-full sm:w-auto gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Perfil
          </Button>
        </div>

        {!loading && profiles.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome, setor, valores ou tom de voz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
                <SelectItem value="setor-asc">Setor (A-Z)</SelectItem>
                <SelectItem value="setor-desc">Setor (Z-A)</SelectItem>
                <SelectItem value="recent">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProfileCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredAndSortedProfiles.length === 0 ? (
          <EmptyState
            onCreateClick={() => navigate('/brand-profiles/create')}
          />
        ) : (
          <>
            {searchQuery && filteredAndSortedProfiles.length !== profiles.length && (
              <div className="text-sm text-muted-foreground">
                {filteredAndSortedProfiles.length} perfil(s) encontrado(s) de {profiles.length}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredAndSortedProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={handleEdit}
                  onDelete={(id) => handleDeleteClick(id, profile.nome)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Excluir Perfil de Marca"
        itemName={profileToDelete?.nome}
        description={`Tem certeza que deseja excluir o perfil "${profileToDelete?.nome}"? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
