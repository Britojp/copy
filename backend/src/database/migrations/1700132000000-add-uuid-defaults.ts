import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUuidDefaults1700132000000 implements MigrationInterface {
  name = 'AddUuidDefaults1700132000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await queryRunner.query(`ALTER TABLE agent_runs ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
    await queryRunner.query(`ALTER TABLE agent_outputs ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
    await queryRunner.query(`ALTER TABLE agent_run_links ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE agent_run_links ALTER COLUMN id DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE agent_outputs ALTER COLUMN id DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE agent_runs ALTER COLUMN id DROP DEFAULT;`);
  }
}


