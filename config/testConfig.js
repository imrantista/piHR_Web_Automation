import dotenv from 'dotenv';
dotenv.config();

export const config = {
  "PIHR_PROD": process.env.BASE_URL_PIHR_PROD,
  "PIHR_QA": process.env.BASE_URL_PIHR_QA,
  "PIHR_DEV": "https://localhost:3000",
  "ADMIN_PROD": "",
  "ADMIN_QA": "",

  "credentials": {
    "adminEmail": process.env.ADMIN_EMAIL, 
    "adminPassword": process.env.ADMIN_PASSWORD,
    "employeeEmail": process.env.EMPLOYEE_EMAIL,
    "employeePassword": process.env.EMPLOYEE_PASSWORD,
  },
  "slug":{
    "leavepage":'leave/leave?page_size=10&page_number=1',
    "dashboard":'dashboard',
  },
  "data": {
     "emplyeeName":"Golam Mostafa Imran",
     "leaveType":"Annual Leave",
     "leaveStartDate":"28-12-2025",
     "leaveEndDate":"30-12-2025",
     "leavePurpose":"Family Vacation",
     "deleteEmployeeName":"Golam"
  }
}

