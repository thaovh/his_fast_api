import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'oracle',
    host: '192.168.7.234',
    port: 1521,
    username: 'his_rs',
    password: 'his_rs',
    sid: 'orclstb',
    synchronize: false,
    logging: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsRun: false,
    extra: {
        max: 20,
        connectionTimeout: 10000,
    },
}; 