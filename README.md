# HIS Fast API

A FastAPI-based REST API for HIS (Hospital Information System) data retrieval.

## Features

- Accept time input in format DD/MM/YYYY HH:mm:ss
- Convert input time to Oracle format (YYYYMMDDHHmmss) for database queries
- Clear error messages for invalid time formats
- Swagger UI documentation with examples

## Installation

1. Clone the repository:
```bash
git clone https://github.com/thaovh/his_fast_api.git
cd his_fast_api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```env
PORT=3000
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password
ORACLE_CONNECT_STRING=your_connect_string
```

4. Start the server:
```bash
npm start
```

## API Usage

### Get Treatments by Time Range

```bash
curl -X GET "http://localhost:3000/api/treatments?startTime=01/01/2024 00:00:00&endTime=31/01/2024 23:59:59"
```

The API accepts:
- `startTime`: Start time in format DD/MM/YYYY HH:mm:ss
- `endTime`: End time in format DD/MM/YYYY HH:mm:ss

## Error Handling

The API provides clear error messages for:
- Invalid date format
- Start time after end time
- Database connection issues
- Query execution errors

## Documentation

API documentation is available at `/swagger` when the server is running.
