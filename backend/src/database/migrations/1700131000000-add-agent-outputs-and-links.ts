import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgentOutputsAndLinks1700131000000 implements MigrationInterface {
  name = 'AddAgentOutputsAndLinks1700131000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS agent_outputs (
        id uuid PRIMARY KEY,
        run_id uuid NOT NULL,
        content_text text NULL,
        content_json jsonb NULL,
        model varchar(128) NULL,
        prompt_tokens integer NULL,
        completion_tokens integer NULL,
        latency_ms integer NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_agent_outputs_run FOREIGN KEY (run_id) REFERENCES agent_runs(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_outputs_run ON agent_outputs(run_id)`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS agent_run_links (
        id uuid PRIMARY KEY,
        parent_run_id uuid NOT NULL,
        child_run_id uuid NOT NULL,
        relation varchar(64) NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_agent_run_links_parent FOREIGN KEY (parent_run_id) REFERENCES agent_runs(id) ON DELETE CASCADE,
        CONSTRAINT fk_agent_run_links_child FOREIGN KEY (child_run_id) REFERENCES agent_runs(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_run_links_parent ON agent_run_links(parent_run_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_agent_run_links_child ON agent_run_links(child_run_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS agent_run_links`);
    await queryRunner.query(`DROP TABLE IF EXISTS agent_outputs`);
  }
}


