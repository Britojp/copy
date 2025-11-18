import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AgentRun } from './agent-run.entity';

@Entity({ name: 'agent_outputs' })
export class AgentOutput {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => AgentRun, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'run_id' })
  run!: AgentRun;

  @Column({ name: 'run_id', type: 'uuid' })
  @Index()
  runId!: string;

  @Column({ name: 'content_text', type: 'text', nullable: true })
  contentText?: string | null;

  @Column({ name: 'content_json', type: 'jsonb', nullable: true })
  contentJson?: unknown | null;

  @Column({ name: 'model', type: 'varchar', length: 128, nullable: true })
  model?: string | null;

  @Column({ name: 'prompt_tokens', type: 'integer', nullable: true })
  promptTokens?: number | null;

  @Column({ name: 'completion_tokens', type: 'integer', nullable: true })
  completionTokens?: number | null;

  @Column({ name: 'latency_ms', type: 'integer', nullable: true })
  latencyMs?: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}


