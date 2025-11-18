import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type AgentType =
  | 'buscador-data'
  | 'buscador-informacoes'
  | 'escritor-descricao'
  | 'gerador-prompt-imagem-post'
  | 'pipeline';

export type AgentStatus = 'ok' | 'erro';

@Entity({ name: 'agent_runs' })
export class AgentRun {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 64 })
  @Index()
  type!: AgentType;

  @Column({ type: 'text' })
  input!: string;

  @Column({ name: 'md_keys', type: 'text', array: true, nullable: true })
  mdKeys?: string[] | null;

  @Column({ name: 'output_json', type: 'jsonb', nullable: true })
  outputJson?: unknown | null;

  @Column({ type: 'varchar', length: 16, default: 'ok' })
  status!: AgentStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string | null;

  @Column({ name: 'correlation_id', type: 'uuid', nullable: true })
  @Index()
  correlationId?: string | null;

  @Column({ name: 'parent_run_id', type: 'uuid', nullable: true })
  @Index()
  parentRunId?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}


