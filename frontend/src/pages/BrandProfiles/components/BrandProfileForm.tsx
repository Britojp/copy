import { useState, useEffect } from 'react';
import { createBrandProfile, updateBrandProfile } from '../../../services/brand';
import { type BrandProfile, type TomDeVoz } from '../../../types/brand';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Alert, AlertDescription } from '../../../components/ui/alert';

type Props = {
  profile: BrandProfile | null;
  onClose: () => void;
};

export default function BrandProfileForm({ profile, onClose }: Props) {
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');
  const [faixaEtaria, setFaixaEtaria] = useState('');
  const [interesses, setInteresses] = useState('');
  const [comportamento, setComportamento] = useState('');
  const [valores, setValores] = useState('');
  const [tomPrincipal, setTomPrincipal] = useState<TomDeVoz>('serio');
  const [caracteristicasTom, setCaracteristicasTom] = useState('');
  const [paletaCores, setPaletaCores] = useState('');
  const [estiloPreferido, setEstiloPreferido] = useState('');
  const [elementosVisuais, setElementosVisuais] = useState('');
  const [diferenciais, setDiferenciais] = useState('');
  const [evitar, setEvitar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setNome(profile.nome);
      setSetor(profile.setor);
      setFaixaEtaria(profile.publicoAlvo?.faixaEtaria || '');
      setInteresses(profile.publicoAlvo?.interesses?.join(', ') || '');
      setComportamento(profile.publicoAlvo?.comportamento || '');
      setValores(profile.valores?.join(', ') || '');
      setTomPrincipal(profile.tomDeVoz?.principal || 'serio');
      setCaracteristicasTom(profile.tomDeVoz?.caracteristicas?.join(', ') || '');
      setPaletaCores(profile.identidadeVisual?.paletaCores?.join(', ') || '');
      setEstiloPreferido(profile.identidadeVisual?.estiloPreferido || '');
      setElementosVisuais(profile.identidadeVisual?.elementosVisuais?.join(', ') || '');
      setDiferenciais(profile.diferenciais?.join(', ') || '');
      setEvitar(profile.evitar?.join(', ') || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = {
      nome,
      setor,
      publicoAlvo: {
        faixaEtaria: faixaEtaria || undefined,
        interesses: interesses ? interesses.split(',').map((i) => i.trim()) : undefined,
        comportamento: comportamento || undefined,
      },
      valores: valores ? valores.split(',').map((v) => v.trim()) : undefined,
      tomDeVoz: {
        principal: tomPrincipal,
        caracteristicas: caracteristicasTom ? caracteristicasTom.split(',').map((c) => c.trim()) : [],
      },
      identidadeVisual: {
        paletaCores: paletaCores ? paletaCores.split(',').map((c) => c.trim()) : undefined,
        estiloPreferido: estiloPreferido || undefined,
        elementosVisuais: elementosVisuais ? elementosVisuais.split(',').map((e) => e.trim()) : undefined,
      },
      diferenciais: diferenciais ? diferenciais.split(',').map((d) => d.trim()) : undefined,
      evitar: evitar ? evitar.split(',').map((e) => e.trim()) : undefined,
    };

    try {
      if (profile) {
        await updateBrandProfile(profile.id, data);
      } else {
        await createBrandProfile(data);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-logo)' }}>{profile ? 'Editar Perfil' : 'Novo Perfil'}</h2>
          <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Marca*</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setor">Setor/Nicho*</Label>
            <Input id="setor" value={setor} onChange={(e) => setSetor(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg" style={{ fontFamily: 'var(--font-logo)' }}>Público-Alvo</h3>
          <div className="space-y-2">
            <Label htmlFor="faixaEtaria">Faixa Etária</Label>
            <Input id="faixaEtaria" value={faixaEtaria} onChange={(e) => setFaixaEtaria(e.target.value)} placeholder="Ex: 25-45 anos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interesses">Interesses (separados por vírgula)</Label>
            <Input id="interesses" value={interesses} onChange={(e) => setInteresses(e.target.value)} placeholder="Ex: tecnologia, saúde, fitness" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comportamento">Comportamento</Label>
            <Textarea id="comportamento" value={comportamento} onChange={(e) => setComportamento(e.target.value)} placeholder="Descreva o comportamento do público-alvo" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg" style={{ fontFamily: 'var(--font-logo)' }}>Valores e Tom</h3>
          <div className="space-y-2">
            <Label htmlFor="valores">Valores (separados por vírgula)</Label>
            <Input id="valores" value={valores} onChange={(e) => setValores(e.target.value)} placeholder="Ex: inovação, qualidade, confiança" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tomPrincipal">Tom de Voz Principal</Label>
            <Select value={tomPrincipal} onValueChange={(value) => setTomPrincipal(value as TomDeVoz)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serio">Sério</SelectItem>
                <SelectItem value="divertido">Divertido</SelectItem>
                <SelectItem value="persuasivo">Persuasivo</SelectItem>
                <SelectItem value="inspirador">Inspirador</SelectItem>
                <SelectItem value="educativo">Educativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caracteristicasTom">Características do Tom (separadas por vírgula)</Label>
            <Input id="caracteristicasTom" value={caracteristicasTom} onChange={(e) => setCaracteristicasTom(e.target.value)} placeholder="Ex: amigável, técnico, inspirador" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg" style={{ fontFamily: 'var(--font-logo)' }}>Identidade Visual</h3>
          <div className="space-y-2">
            <Label htmlFor="paletaCores">Paleta de Cores (separadas por vírgula)</Label>
            <Input id="paletaCores" value={paletaCores} onChange={(e) => setPaletaCores(e.target.value)} placeholder="Ex: azul, branco, verde" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estiloPreferido">Estilo Preferido</Label>
            <Input id="estiloPreferido" value={estiloPreferido} onChange={(e) => setEstiloPreferido(e.target.value)} placeholder="Ex: minimalista, moderno, vintage" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="elementosVisuais">Elementos Visuais (separados por vírgula)</Label>
            <Input id="elementosVisuais" value={elementosVisuais} onChange={(e) => setElementosVisuais(e.target.value)} placeholder="Ex: fotos, ilustrações, ícones" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg" style={{ fontFamily: 'var(--font-logo)' }}>Diferenciais e Restrições</h3>
          <div className="space-y-2">
            <Label htmlFor="diferenciais">Diferenciais (separados por vírgula)</Label>
            <Input id="diferenciais" value={diferenciais} onChange={(e) => setDiferenciais(e.target.value)} placeholder="Ex: atendimento 24h, entrega rápida" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evitar">O que Evitar (separado por vírgula)</Label>
            <Input id="evitar" value={evitar} onChange={(e) => setEvitar(e.target.value)} placeholder="Ex: temas políticos, linguagem informal" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}

