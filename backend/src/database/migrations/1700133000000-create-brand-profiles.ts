import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBrandProfiles1700133000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'brand_profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'setor',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'publico_alvo',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'valores',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tom_de_voz',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'identidade_visual',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'diferenciais',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'evitar',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('brand_profiles');
  }
}

