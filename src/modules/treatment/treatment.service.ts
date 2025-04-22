import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TreatmentService {
    private readonly logger = new Logger(TreatmentService.name);

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    async getTreatmentsByTimeRange(timeFrom: string, timeTo: string) {
        try {
            const queryPath = path.join(__dirname, '../../raw_query/his_treatment.sql');
            const query = fs.readFileSync(queryPath, 'utf8');

            const result = await this.dataSource.query(query, [timeFrom, timeTo]);

            this.logger.log(`Retrieved ${result.length} treatments`);
            return result;
        } catch (error) {
            this.logger.error(`Error fetching treatments: ${error.message}`);
            throw error;
        }
    }
} 