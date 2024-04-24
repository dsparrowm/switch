import { Express, Request, Response } from 'express';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'SWIICH API',
      version: '1.0.0',
      description: "The backend API for the Swiich productivity SaaS application. This API enables organizations to collaborate, create, assign, and track tasks, as well as chat with team members.",
      
    },
    servers: [
      {
        url: 'http://localhost:3001/',
        description: 'Development server',
      },
      {
        url: 'https://swiichbackend.onrender.com/',
        description: 'Production server',
      }
    ],
  };

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/*.ts', './src/routes/*.ts', './src/utils/*.ts'],
};

const swaggerSpec = swaggerjsdoc(options);

function swaggerDocs(app: Express, port: number) {
//swagger page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//swagger json
app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

console.log(`API docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;