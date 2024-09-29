# Payroll Challenge

## Instructions on how to build/run your application
Using a Docker container:
```sh
$ docker build -t will-pringle-se-challenge-payroll .
$ docker run -p 3300:3300 --name payroll-app will-pringle-se-challenge-payroll
# verify it's working by making a request to /status
$ curl localhost:3300/status
```

Running natively:
```sh
$ npm i
$ node app.js # note, this has only been tested on Node 20
$ curl localhost:3300/status
```

## Questions

### How did you test that your implementation was correct?

### If this application was destined for a production environment, what would you add or change?

### What compromises did you have to make as a result of the time constraints of this challenge?

## Models / Entities

### Database Models
The database comprises of 4 tables: `job_groups`, `employees`, `time_reports`, `work_entries`. These tables are listed generically and can be used with different SQL database solutions, for more details on the specific database table types used with sqlite, check out [database/init.js](./database/init.js).

#### job_groups
| Field | Type | Key | Units|
| - | - | - | - |
| name | string | primary |
| hourly_rate | integer | | cents |

Assumptions:
- The currency is either entirely in CAD or entirely in USD; however if in the future this is no longer the case, an additional column could be added to the job_groups table for the currency applied to a particular job group.
- Hour rates will always be cleanly divisible into cents. For instance, $3.141 per hour is invalid, but $3.14 per hour is valid.
- Job groups will change and there may be more in the future.
- No one will be paid more than $9999 per hour. 

Design Notes:
- Hourly Rate is stored in cents to avoid floating point inconsistencies and save space.

#### employees
| Field | Type | Key | Units |
| - | - | - | - |
| id | string | primary |

Design Notes:
- Currently the employees table doesn't serve much purpose; however, maybe in the future more information will need to be tracked for specific employees. 
- Although the examples use integers for the employee id, in the assignment it's stated the employee id is a string. 

#### time_reports
| Field | Type | Key | Units |
| - | - | - | - |
| id | integer | primary |
| upload_date | date |

#### work_entries
| Field | Type | Key | Units |
| - | - | - | - |
| id | integer | primary |
| date | date |
| time_duration | integer | | seconds |
| job_group | string | foreign key |
| report_id | integer | foreign key |
| employee_id | string | foreign key |

Assumptions:
- Hours Worked will always be cleanly divisible into seconds. 

## Separation of Concerns

## Other
The original instructions are [here (docs/wave-instructions.md)](./docs/wave-instructions.md).


