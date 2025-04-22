import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentController } from './controllers/treatment.controller';
import { TreatmentService } from './services/treatment.service';
import { Treatment } from './entities/treatment.entity';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [Treatment],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Treatment]),
  ],
  controllers: [TreatmentController],
  providers: [TreatmentService],
})
export class AppModule { }
