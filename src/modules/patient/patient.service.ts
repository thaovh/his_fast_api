import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PatientService {
    private readonly logger = new Logger(PatientService.name);

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    async getAllPatients(page: number = 1, limit: number = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = fs.readFileSync(
                path.join(__dirname, '../../raw_query/get_patients.sql'),
                'utf8'
            );

            const result = await this.dataSource.query(query, [limit, offset]);
            this.logger.log(`Retrieved ${result.length} patients`);
            return result;
        } catch (error) {
            this.logger.error(`Error fetching patients: ${error.message}`);
            throw error;
        }
    }

    async getPatientById(id: string) {
        try {
            const query = fs.readFileSync(
                path.join(__dirname, '../../raw_query/get_patient_by_id.sql'),
                'utf8'
            );

            const result = await this.dataSource.query(query, [id]);
            this.logger.log(`Retrieved patient with ID: ${id}`);
            return result[0];
        } catch (error) {
            this.logger.error(`Error fetching patient ${id}: ${error.message}`);
            throw error;
        }
    }

    async getPatientTreatments(id: string) {
        try {
            const query = fs.readFileSync(
                path.join(__dirname, '../../raw_query/get_patient_treatments.sql'),
                'utf8'
            );

            const result = await this.dataSource.query(query, [id]);
            this.logger.log(`Retrieved treatments for patient ${id}`);
            return result;
        } catch (error) {
            this.logger.error(`Error fetching treatments for patient ${id}: ${error.message}`);
            throw error;
        }
    }
} 