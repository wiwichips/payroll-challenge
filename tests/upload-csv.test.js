/**
 * Tests uploading CSV time reports.
 */
const path = require('node:path');
const request = require('supertest');
const setupTestDB = require('./init-test-db.js');

let server;

beforeAll(async () => {
  server = await setupTestDB();  // await server initialization
});

afterAll(async () => {
  await server.close();  // close the server after all tests complete
});

describe('POST /reports - CSV Upload', () => {

  it('should upload a valid CSV file successfully', async () => {
    const res = await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/time-report-42.csv'))
      .expect(201);

    expect(res.body.success).toBe(true);
  });

  it('should upload a CSV with no rows successfully', async () => {
    const res = await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/time-report-0.csv'))
      .expect(201);

    expect(res.body.success).toBe(true);

    const getRes = await request(server)
      .get(`/reports/0`)
      .expect(200);

    expect(getRes.body.data.payrollReport.employeeReports.length).toBe(0);
  });

  it('should fail to upload when the file name is invalid', async () => {
    const res = await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/invalid-name.csv'))
      .expect(422);

    expect(res.body.success).toBe(false);
  });

  it('should fail when a CSV file with duplicate report ID is uploaded', async () => {
    // first upload
    await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/time-report-421.csv'))
      .expect(201);

    // second upload (with same report id)
    const res = await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/time-report-421.csv'))
      .expect(409);

    expect(res.body.success).toBe(false);
  });
});

