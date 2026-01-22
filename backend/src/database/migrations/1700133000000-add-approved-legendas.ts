import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApprovedLegendas1700133000000 implements MigrationInterface {
  name = 'AddApprovedLegendas1700133000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS approved_legendas (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        brand_profile_id uuid NULL,
        nome varchar(255) NULL,
        data date NULL,
        tipo varchar(50) NOT NULL,
        opcao_numero integer NOT NULL,
        descricao_post text NOT NULL,
        cta text NULL,
        hashtags jsonb NULL,
        palavras_chave jsonb NULL,
        correlation_id uuid NULL,
        run_id uuid NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_approved_legendas_brand_profile FOREIGN KEY (brand_profile_id) REFERENCES brand_profiles(id) ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_approved_legendas_brand_profile ON approved_legendas(brand_profile_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_approved_legendas_correlation ON approved_legendas(correlation_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_approved_legendas_run ON approved_legendas(run_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS approved_legendas`);
  }
}
