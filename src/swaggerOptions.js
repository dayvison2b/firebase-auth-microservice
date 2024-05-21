const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'Auth Service',
      version: '1.0.0',
      description: 'API documentation for My API',
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Dayvison",
        url: "https://github.com/dayvison2b",
        email: "dayvisoncordeiro2001@gmail.com",
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/' // FIXME enable https
      }
    ],
    components: {
      securitySchemes: {
        FirebaseAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: "Requires a valid Firebase ID token obtained from the Firebase Authentication service using Bearer authentication"
        }
      },
      parameters: {
        ProjectIdHeader: {
          name: 'project-id',
          in: 'header',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Firebase project ID'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: [path.resolve(__dirname, './routes/*.js')] // Path to the route files
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
