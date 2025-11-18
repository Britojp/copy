import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { buildTypeOrmOptions } from './typeorm.config';

async function main() {
  const moduleRef = await ConfigModule.forRoot({ isGlobal: false });
  const config = new ConfigService();
  const ormOpts = buildTypeOrmOptions(config) as any;
  const dataSource = new DataSource({
    type: 'postgres',
    host: ormOpts.host,
    port: ormOpts.port,
    username: ormOpts.username,
    password: ormOpts.password,
    database: ormOpts.database,
    entities: ormOpts.entities,
    migrations: ['src/database/migrations/*{.ts,.js}'],
    synchronize: false,
  });
  await dataSource.initialize();
  try {
    const results = await dataSource.runMigrations();
    for (const r of results) {
      // eslint-disable-next-line no-console
      console.log(`Migration: ${r.name}`);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


