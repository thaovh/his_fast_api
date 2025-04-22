import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicController } from './dynamic.controller';
import { DynamicService } from './dynamic.service';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [DynamicController],
    providers: [DynamicService],
    exports: [DynamicService],
})
export class DynamicModule { } 