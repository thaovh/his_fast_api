import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

export const createLoggerConfig = (configService: ConfigService): WinstonModuleOptions => ({
    level: configService.get<string>('LOG_LEVEL') || 'warn',
    transports: [
        new winston.transports.Console({
            level: configService.get<string>('LOG_LEVEL') || 'warn',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, context, ms }) => {
                    return `${timestamp} [${context}] ${level}: ${message} ${ms}`;
                }),
            ),
        }),
        new winston.transports.File({
            filename: configService.get<string>('LOG_ERROR_FILE') || 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        new winston.transports.File({
            filename: configService.get<string>('LOG_WARNING_FILE') || 'logs/warnings.log',
            level: 'warn',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
}); 