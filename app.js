#!/usr/bin/env node
/**
 * Description: Entrypoint for the payroll http server.
 */

const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const config = require('./config/config');
const routes = require('./src/routes');

const specPath = path.join(__dirname, 'docs', 'spec.yaml');
const swaggerSpec = yaml.load(specPath);

const app = express();
app.use(routes);

app.use('/swagger-theme.css', express.static(path.join(__dirname, 'public/swagger-theme.css')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: '/swagger-theme.css',
}));

app.listen(config.port, () => {
  console.log(`> Running  http://localhost:${config.port}`);
  console.log(`> API Docs http://localhost:${config.port}/docs`);
});

