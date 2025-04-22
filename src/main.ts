import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const apiPrefix = configService.get('API_PREFIX') || 'api';
    const apiVersion = configService.get('API_VERSION') || 'v1';
    const apiPort = configService.get('API_PORT') || 3000;
    const globalPrefix = `${apiPrefix}/${apiVersion}`;

    // Set global prefix for all routes
    app.setGlobalPrefix(globalPrefix);

    // Enable validation
    app.useGlobalPipes(new ValidationPipe());

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('HIS FASH API')
        .setDescription('API for HIS FASH system with Oracle 12c database integration')
        .setVersion(apiVersion)
        .addTag('health', 'Health check endpoints')
        .addTag('treatments', 'Treatment management endpoints')
        .addTag('patients', 'Patient management endpoints')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true,
        operationIdFactory: (
            controllerKey: string,
            methodKey: string
        ) => methodKey
    });

    SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customSiteTitle: 'HIS FASH API Documentation',
        customfavIcon: 'https://nestjs.com/img/favicon.png',
    });

    // Enable CORS
    app.enableCors();

    await app.listen(apiPort);

    const serverUrl = await app.getUrl();
    console.log(`Application is running on: ${serverUrl}`);
    console.log(`Swagger documentation is available at: ${serverUrl}/${globalPrefix}/docs`);
}
bootstrap(); 