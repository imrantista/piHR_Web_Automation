import dotenv from 'dotenv';
dotenv.config();

export const config = {
  "PIHR_PROD": process.env.PIHR_PROD,
  "PIHR_QA": process.env.PIHR_QA,
  "PIHR_DEV": "https://localhost:3000",
  "ADMIN_PROD": "",
  "ADMIN_QA": "",

  "credentials": {
    "adminEmail": process.env.ADMIN_EMAIL, 
    "adminPassword": process.env.ADMIN_PASSWORD,
    "employeeEmail": process.env.EMPLOYEE_EMAIL,
    "employeePassword": process.env.EMPLOYEE_PASSWORD,
  },
  "data": {
  
  }
}

