#!/usr/bin/env node
/**
 * Description: Entrypoint for the payroll http server.
 */

const createExpressApp = require('express');
const config = require('./config/config');
const routes = require('./src/routes');

const app = createExpressApp();
app.use(routes);

app.listen(config.port, () => console.log(`> http://localhost:${config.port}`));

