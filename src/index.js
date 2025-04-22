require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const treatmentsRouter = require('./routes/treatments');

const app = express();
const port = process.env.PORT || 3000;

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/treatments', treatmentsRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
}); 