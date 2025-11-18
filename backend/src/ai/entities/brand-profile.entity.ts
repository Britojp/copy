import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('brand_profiles')
export class BrandProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255 })
  setor: string;

  @Column({ name: 'publico_alvo', type: 'jsonb', nullable: true })
  publicoAlvo: unknown;

  @Column({ type: 'jsonb', nullable: true })
  valores: unknown;

  @Column({ name: 'tom_de_voz', type: 'jsonb', nullable: true })
  tomDeVoz: unknown;

  @Column({ name: 'identidade_visual', type: 'jsonb', nullable: true })
  identidadeVisual: unknown;

  @Column({ type: 'jsonb', nullable: true })
  diferenciais: unknown;

  @Column({ type: 'jsonb', nullable: true })
  evitar: unknown;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

