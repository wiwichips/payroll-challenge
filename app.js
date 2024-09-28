#!/usr/bin/env node
/**
 * Description: Entrypoint for the payroll http server.
 */

const createExpressApp = require('express');
const multer = require('multer');
const config = require('./config/config');

const app = createExpressApp();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 10 * 10 },
});

app.get('/report', (req, res) => {
  res.json({ hello: 'world' });
});

app.post('/report', upload.single('file'), (req, res) => {
  console.log(req);
  console.log(req.file.buffer.toString());
  res.json({ ijustgot: 'yourcsvfile (:' });
});

app.listen(config.port, () => console.log(`> http://localhost:${config.port}`));

