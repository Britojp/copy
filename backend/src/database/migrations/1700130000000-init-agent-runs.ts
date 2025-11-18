import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAgentRuns1700130000000 implements MigrationInterface {
  name = 'InitAgentRuns1700130000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS agent_runs (
        id uuid PRIMARY KEY,
        type varchar(64) NOT NULL,
        input text NOT NULL,
        md_keys text[] NULL,
        output_json jsonb NULL,
        status varchar(16) NOT NULL DEFAULT 'ok',
        error_message text NULL,
        correlation_id uuid NULL,
        parent_run_id uuid NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_runs_type ON agent_runs(type)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_runs_correlation ON agent_runs(correlation_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_runs_parent ON agent_runs(parent_run_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_runs_created_at ON agent_runs(created_at)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS agent_runs`);
  }
}


