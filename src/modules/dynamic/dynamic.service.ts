import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DynamicService {
    private readonly logger = new Logger(DynamicService.name);

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    async executeQuery(endpoint: string, method: string, params: any): Promise<any> {
        try {
            const queryPath = path.join(__dirname, '../../raw_query', `${endpoint}.sql`);

            if (!fs.existsSync(queryPath)) {
                throw new Error(`SQL file not found for endpoint: ${endpoint}`);
            }

            const fileContent = fs.readFileSync(queryPath, 'utf8');
            const lines = fileContent.split('\n').filter(line => line.trim());

            if (lines.length < 2) {
                throw new Error(`Invalid SQL file format for endpoint: ${endpoint}`);
            }

            // First line is endpoint name, second line onwards is SQL query
            const sqlQuery = lines.slice(1).join('\n');

            // Replace parameters in SQL query
            const finalQuery = this.replaceParameters(sqlQuery, params);

            this.logger.log(`Executing dynamic query for endpoint: ${endpoint}`);
            const result = await this.dataSource.query(finalQuery);

            this.logger.log(`Query executed successfully for endpoint: ${endpoint}`);
            return result;
        } catch (error) {
            this.logger.error(`Error executing query for endpoint ${endpoint}: ${error.message}`);
            throw error;
        }
    }

    private replaceParameters(sqlQuery: string, params: any): string {
        let finalQuery = sqlQuery;

        // Replace named parameters with values
        Object.entries(params).forEach(([key, value]) => {
            const paramRegex = new RegExp(`:${key}`, 'g');
            const replacement = typeof value === 'string' ? `'${value}'` : String(value);
            finalQuery = finalQuery.replace(paramRegex, replacement);
        });

        return finalQuery;
    }
} 