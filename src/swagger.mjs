import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Automated Serverless API',
    version: '1.0.0',
    description: 'API docs for serverless app',
  },
  servers: [
    {
      url: 'http://localhost:4000', // Update for prod if needed
    },
  ],
};

const options = {
  swaggerDefinition,
  // Path to the APIs to be documented
  apis: ['./handler.mjs', './src/routes/users.mjs'], 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
