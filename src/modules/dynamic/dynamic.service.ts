import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DynamicService {
    private readonly logger = new Logger(DynamicService.name);
    private readonly rawQueryDir: string;

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        private configService: ConfigService,
    ) {
        this.rawQueryDir = this.configService.get<string>('RAW_QUERY_DIR') || 'src/raw_query';
        this.logger.log(`Raw query directory: ${this.rawQueryDir}`);
    }

    async executeQuery(endpoint: string, method: string, params: any): Promise<any> {
        try {
            // Validate endpoint name
            if (!endpoint || typeof endpoint !== 'string') {
                throw new BadRequestException('Invalid endpoint name');
            }

            // Check if endpoint contains invalid characters
            if (!/^[a-zA-Z0-9_-]+$/.test(endpoint)) {
                throw new BadRequestException('Endpoint name contains invalid characters');
            }

            const queryPath = path.join(process.cwd(), this.rawQueryDir, `${endpoint}.sql`);
            this.logger.debug(`Looking for SQL file at: ${queryPath}`);

            // Check if file exists
            if (!fs.existsSync(queryPath)) {
                throw new NotFoundException(`SQL file not found for endpoint: ${endpoint}`);
            }

            // Read and parse SQL file
            const fileContent = fs.readFileSync(queryPath, 'utf8');
            const lines = fileContent.split('\n').filter(line => line.trim());

            // Validate file format
            if (lines.length < 2) {
                throw new BadRequestException(`Invalid SQL file format for endpoint: ${endpoint}. File must contain at least 2 lines.`);
            }

            // Extract endpoint name and SQL query
            const endpointName = lines[0].trim();
            const sqlQuery = lines.slice(1).join('\n');

            // Validate endpoint name matches
            if (endpointName !== endpoint) {
                throw new BadRequestException(`Endpoint name in file (${endpointName}) does not match requested endpoint (${endpoint})`);
            }

            // Validate SQL query
            if (!sqlQuery.trim()) {
                throw new BadRequestException(`Empty SQL query in file for endpoint: ${endpoint}`);
            }

            // Check for SQL injection attempts
            if (this.containsSqlInjection(sqlQuery)) {
                throw new BadRequestException('SQL injection attempt detected');
            }

            // Replace parameters in SQL query
            const finalQuery = this.replaceParameters(sqlQuery, params);

            // Log query execution
            this.logger.log(`Executing dynamic query for endpoint: ${endpoint}`);
            this.logger.debug(`Query: ${finalQuery}`);
            this.logger.debug(`Parameters: ${JSON.stringify(params)}`);

            // Execute query
            const result = await this.dataSource.query(finalQuery);

            // Log success
            this.logger.log(`Query executed successfully for endpoint: ${endpoint}`);
            this.logger.debug(`Result count: ${Array.isArray(result) ? result.length : 1}`);

            return result;
        } catch (error) {
            // Log error
            this.logger.error(`Error executing query for endpoint ${endpoint}: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);

            // Rethrow the error
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

    private containsSqlInjection(query: string): boolean {
        // Basic SQL injection detection
        const sqlInjectionPatterns = [
            /--/i,           // SQL comments
            /;/i,            // Multiple statements
            /xp_/i,          // Extended stored procedures
            /sp_/i,          // System stored procedures
            /exec\s*\(/i,    // EXEC function
            /union\s+select/i, // UNION SELECT
            /insert\s+into/i,  // INSERT INTO
            /delete\s+from/i,  // DELETE FROM
            /drop\s+table/i,   // DROP TABLE
            /alter\s+table/i,  // ALTER TABLE
            /truncate\s+table/i, // TRUNCATE TABLE
        ];

        return sqlInjectionPatterns.some(pattern => pattern.test(query));
    }
} 