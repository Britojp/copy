import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BrandProfile } from './brand-profile.entity';

@Entity('approved_legendas')
export class ApprovedLegenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'brand_profile_id', type: 'uuid', nullable: true })
  @Index()
  brandProfileId: string | null;

  @ManyToOne(() => BrandProfile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_profile_id' })
  brandProfile: BrandProfile | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nome: string | null;

  @Column({ type: 'date', nullable: true })
  data: string | null;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ name: 'opcao_numero', type: 'integer' })
  opcaoNumero: number;

  @Column({ name: 'descricao_post', type: 'text' })
  descricaoPost: string;

  @Column({ type: 'text', nullable: true })
  cta: string | null;

  @Column({ type: 'jsonb', nullable: true })
  hashtags: string[] | null;

  @Column({ name: 'palavras_chave', type: 'jsonb', nullable: true })
  palavrasChave: string[] | null;

  @Column({ name: 'correlation_id', type: 'uuid', nullable: true })
  @Index()
  correlationId: string | null;

  @Column({ name: 'run_id', type: 'uuid', nullable: true })
  @Index()
  runId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
