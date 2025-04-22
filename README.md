# HIS FASH API

A NestJS application with Oracle 12c database integration.

## Features

- Oracle 12c database integration
- Swagger API documentation
- Winston logger
- Health check endpoint
- Raw SQL query execution
- RESTful API with proper status codes

## Prerequisites

- Node.js (v14 or higher)
- Oracle 12c database
- Oracle Instant Client

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory with the following content:
```
DB_HOST=192.168.7.234
DB_PORT=1521
DB_USERNAME=his_rs
DB_PASSWORD=his_rs
DB_SID=orclstb
```

## Running the application

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Health Check

The health check endpoint is available at:
```
http://localhost:3000/health
```

## Project Structure

```
src/
├── config/           # Configuration files
├── modules/          # Feature modules
├── common/           # Shared resources
├── raw_query/        # SQL query files
├── app.module.ts     # Main application module
└── main.ts          # Application entry point
```

## API Endpoints

### Treatments

GET /treatments
- Query Parameters:
  - timeFrom: Start time
  - timeTo: End time
- Returns: List of treatments within the specified time range

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 500: Internal Server Error

## Logging

Logs are stored in the `logs` directory:
- error.log: Error level logs
- combined.log: All logs 