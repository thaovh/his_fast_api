import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { createLoggerConfig } from './config/logger.config';
import { WinstonModule } from 'nest-winston';
import { HealthModule } from './modules/health/health.module';
import { TreatmentModule } from './modules/treatment/treatment.module';
import { PatientModule } from './modules/patient/patient.module';
import { DynamicModule } from './modules/dynamic/dynamic.module';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(databaseConfig),
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => createLoggerConfig(configService),
            inject: [ConfigService],
        }),
        HealthModule,
        TreatmentModule,
        PatientModule,
        DynamicModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ApiKeyMiddleware)
            .forRoutes('*');
    }
} 