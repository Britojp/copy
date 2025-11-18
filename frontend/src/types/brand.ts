export type TomDeVoz = 'serio' | 'divertido' | 'persuasivo' | 'inspirador' | 'educativo';

export type BrandProfile = {
  id: string;
  nome: string;
  setor: string;
  publicoAlvo?: {
    faixaEtaria?: string;
    interesses?: string[];
    comportamento?: string;
  };
  valores?: string[];
  tomDeVoz?: {
    principal: TomDeVoz;
    caracteristicas: string[];
  };
  identidadeVisual?: {
    paletaCores?: string[];
    estiloPreferido?: string;
    elementosVisuais?: string[];
  };
  diferenciais?: string[];
  evitar?: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBrandProfileRequest = Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBrandProfileRequest = Partial<CreateBrandProfileRequest>;

