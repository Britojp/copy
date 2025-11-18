import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AgentRun } from './agent-run.entity';

@Entity({ name: 'agent_run_links' })
export class AgentRunLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => AgentRun, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_run_id' })
  parentRun!: AgentRun;

  @Column({ name: 'parent_run_id', type: 'uuid' })
  @Index()
  parentRunId!: string;

  @ManyToOne(() => AgentRun, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_run_id' })
  childRun!: AgentRun;

  @Column({ name: 'child_run_id', type: 'uuid' })
  @Index()
  childRunId!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  relation?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}


