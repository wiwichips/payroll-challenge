/**
 * Tests downloading reports from reports/ and reports/:reportId.
 */
const path = require('node:path');
const request = require('supertest');
const setupTestDB = require('./init-test-db.js');

let server;
let knownReportId;

beforeAll(async () => {
  server = await setupTestDB();  // await server initialization
  // only used for this test
  const uploadRes = await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/time-report-2.csv'))
      .expect(201);
  knownReportId = uploadRes.body.data.id;
});

afterAll(async () => {
  await server.close();  // close the server after all tests complete
});

describe('GET /reports and GET /reports/:id - Payroll Report Download', () => {

  it('should fail when report doesn\'t exist', async () => {
    const res = await request(server)
      .get('/reports/this-report-doesnt-exist')
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('should fail when employee doesn\'t exist', async () => {
    const res = await request(server)
      .get(`/reports/${knownReportId}?employeeid=123123`)
      .attach('file', path.join(__dirname, 'resources/invalid-name.csv'))
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

