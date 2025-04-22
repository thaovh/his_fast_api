import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treatment } from '../entities/treatment.entity';
import { GET_TREATMENTS_BY_TIME_RANGE } from '../raw_queries/treatment.query';
import { formatDateToOracle } from '../utils/date.util';

@Injectable()
export class TreatmentService {
    private readonly logger = new Logger(TreatmentService.name);

    constructor(
        @InjectRepository(Treatment)
        private readonly treatmentRepository: Repository<Treatment>,
    ) { }

    async getTreatmentsByTimeRange(timeFrom: Date, timeTo: Date) {
        try {
            // Convert Date objects to DD/MM/YYYY HH:mm:ss format
            const fromDateStr = timeFrom.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(',', '');

            const toDateStr = timeTo.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(',', '');

            // Convert to Oracle format
            const oracleTimeFrom = formatDateToOracle(fromDateStr);
            const oracleTimeTo = formatDateToOracle(toDateStr);

            const result = await this.treatmentRepository.query(GET_TREATMENTS_BY_TIME_RANGE, [
                oracleTimeFrom,
                oracleTimeTo,
            ]);
            return result;
        } catch (error) {
            this.logger.error(`Error fetching treatments: ${error.message}`);
            throw error;
        }
    }
} 