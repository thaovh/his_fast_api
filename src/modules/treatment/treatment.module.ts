import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentController } from './treatment.controller';
import { TreatmentService } from './treatment.service';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [TreatmentController],
    providers: [TreatmentService],
    exports: [TreatmentService],
})
export class TreatmentModule { } 