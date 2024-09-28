/**
 * Description: Parse req.file.buffer into a csv.
 * Namespace:   req.locals.csv.
 */
const { PassThrough } = require('node:stream');
const csv = require('csv-parser');
const sendResponse = require('../helpers/response');

function parseUploadedCSV(req, res, next) {
  const results = [];

  if (!req.file)
    return sendResponse(res, 'No file uploaded', 400);

  if (!req.locals)
    req.locals = {};

  req.locals.csv = {};

  // parse csv line by line
  const bufferStream = new PassThrough();
  bufferStream.end(req.file.buffer);
  bufferStream
    .pipe(csv())
    .on('headers', (headers) => req.locals.csv.headers = headers)
    .on('data', (row) => results.push(row))
    .on('end', () => {
      req.locals.csv.data = results;
      next();
    })
    .on('error', (err) => {
      console.log(err); // TODO: centralized logging service
      return sendResponse.error(res, 'Error parsing CSV file', 422);
    });
}

module.exports = parseUploadedCSV;

