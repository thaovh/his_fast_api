import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'oracle',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1521,
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    serviceName: process.env.DB_SERVICE_NAME || '',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
})); 