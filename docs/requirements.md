# Requirements
- Will be used by a frontend application (most likely a SPA)
- Upload a CSV file containing payroll data
  - Time Reports
    - Will always have a filename in the format `time-report-${id}.csv` where id is always an integer
    - Will always have a header with the following columns in this order:
      - "date"
      - "hours worked"
      - "employee id"
      - "job group"
    - May have 0 or more rows of data
    - Each column will always be populated with correctly formatted data
    - dates are in the format DD/MM/YYYY
  - There must be an endpoint for uploading a time report csv file as described 
    - the timekeeping information within the file must be stored to a database for archival purposes
    - Attemping to upload a file with a report id which has already been used for a previously uploaded file will error
      - There will be an error message indicating this is not allowed

- Retrieve a report detailing how much each employee should be paid in each pay period
  - There must be an endpoint for retrieving a payroll report
    - The API should not return HTML 
    - The endpoint must return a JSON object `payrollreport`
      - `payrollReport` will have a single field, `employeeReports`, containing a list of objects with fields `employeeId`, `payPeriod` and `amountPaid`.
      - The payPeriod field is an object containing a date interval that is roughly biweekly. Each month has two pay periods; the first half is from the 1st to the 15th inclusive, and the second half is from the 16th to the end of the month, inclusive. payPeriod will have two fields to represent this interval: startDate and endDate.
      - Each employee should have a single object in employeeReports for each pay period that they have recorded hours worked. The amountPaid field should contain the sum of the hours worked in that pay period multiplied by the hourly rate for their job group.
      - If an employee was not paid in a specific pay period, there should not be an object in employeeReports for that employee + pay period combination.
      - The report should be sorted in some sensical order (e.g. sorted by employee id and then pay period start.)
      - The report should be based on all of the data across all of the uploaded time reports, for all time.
- All employees are paid by the hour, there are no salaried employees
- Job Groups
  - Job Group A is paid $20 / hr
  - Job Group B is paid $30 / hr
  - Employees may switch between different job groups (even within a single pay period) as seen in the example dataset
- Employees
  - Employees have an employee id which is a unique string generated outside of this application
- The project must be easy to set up and run on either a Mac or Linux developer machine
- The project must not include non open-source software
- Include all code and models in the submission
- The `README.md` must include:
  - Instructions on how to build/run your application
  - Answers to the following questions: 
    - How did you test that your implementation was correct?
    - If this application was destined for a production environment, what would you add or change?
    - What compromises did you have to make as a result of the time constraints of this challenge?
- The project must follow the submission instructions:
  - Clone the Wave se-payroll-challenge repo
  - Complete the project locally
  - email a git bundle of the project using `git bundle create your_name.bundle --all`

# Additional Notes
I went outside of the scope of the requirements listed in the assignment description such as adding an endpoint to request a report from a specific time-sheet as well, specifying a specific employee in a report, adding OpenAPI API docs / docs page, adding GitHub Actions CI, and other areas. Typically I would make the argument it's a bad idea to go outside of the scope of requirements and stay focused to the stakeholders needs. Adding more code always means increasing the surface area for bugs and taking more time from developers. I strayed beyond the requirements so I could demonstrate some additional skills.

