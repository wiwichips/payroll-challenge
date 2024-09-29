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

  // may be used in other tests, swallow 409 errors
  await request(server)
      .post('/reports')
      .attach('file', path.join(__dirname, 'resources/time-report-42.csv'))
});

afterAll(async () => {
  await server.close();  // close the server after all tests complete
});

describe('GET /reports and GET /reports/:id - Payroll Report Download', () => {

  it('Validating the numbers returned by the server', async () => {
    const res = await request(server)
      .get(`/reports/${knownReportId}?employeeid=100`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.payrollReport.employeeReports.length).toBeGreaterThan(0);

    // verify that the math for the payday makes sense
    const paydays = res.body.data.payrollReport.employeeReports;
    const expectedPayout = (7.5 + 6 + 5 + 7.5 + 6 + 5) * 20; // hours worked * workgroup (always A)
    let total = 0;
    for (const payday of paydays) {
      total += Number(payday.amountPaid.substring(1));
    }
    expect(total).toBe(expectedPayout);

    // verify that the work days are split up properly
    expect(paydays.length).toBe(4); // should be four (2 for nov, 2 for dec)
    expect(paydays[0].amountPaid).toBe('$150.00');
    expect(paydays[1].amountPaid).toBe('$220.00');
    expect(paydays[2].amountPaid).toBe('$150.00');
    expect(paydays[3].amountPaid).toBe('$220.00');
  });


  it('should fail when report doesn\'t exist', async () => {
    const res = await request(server)
      .get('/reports/this-report-doesnt-exist')
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('should fail when employee doesn\'t exist', async () => {
    const res = await request(server)
      .get(`/reports/${knownReportId}?employeeid=123123`)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('should successfully retrieve a report by report ID', async () => {
    const res = await request(server)
      .get(`/reports/${knownReportId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.payrollReport.employeeReports.length).toBeGreaterThan(0);
  });

  it('should successfully retrieve a report for employees across different time-reports', async () => {
    const res1 = await request(server)
      .get(`/reports?employeeId=1`)  // Assuming employee ID 1 exists in the report, was uploaded in report 42
      .expect(200);

    expect(res1.body.success).toBe(true);
    expect(res1.body.data.payrollReport.employeeReports.length).toBeGreaterThan(0);

    const res2 = await request(server)
      .get(`/reports?employeeId=200`)  // assuming employee ID 200 exists in the report, but was uploaded in report 2
      .expect(200);

    expect(res2.body.success).toBe(true);
    expect(res2.body.data.payrollReport.employeeReports.length).toBeGreaterThan(0);
  });

  it('should return 0 if employee has no entries in the given report', async () => {
    const res = await request(server)
      .get(`/reports/${knownReportId}?employeeId=1`) // employee 1 isn't in report "2", should be a valid yet empty response
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.payrollReport.employeeReports.length).toBe(0);
  });
});

