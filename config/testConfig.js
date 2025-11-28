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
    "systemAdmin": process.env.SYSTEM_ADMIN,
    "systemAdminPassword": process.env.SYSTEM_ADMIN_PASSWORD,
    "deactivatedAdmin": process.env.DEACTIVATED_ADMIN,
    "deactivatedPassword": process.env.DEACTIVATED_PASSWORD
  },
  "slug": {
    "leavepage": 'leave/leave?page_size=10&page_number=1',
    "dashboard": 'dashboard',
    "attendanceDashboard": 'attendance/attendancedashboard',
  },
  "data": {
    "emplyeeName": "Golam Mostafa Imran",
    "leaveType": "Annual Leave",
    "leaveStartDate": "28-12-2025",
    "leaveEndDate": "30-12-2025",
    "leavePurpose": "Family Vacation"
  }
}

export const invalidCredentials = [
  {
    name: "invalid email & invalid password",
    email: "wrong@example.com",
    password: "wrongpass",
    expectedError: "Invalid user name or password"
  },
  {
    name: "valid email & invalid password",
    email: config.credentials.adminEmail,
    password: "wrongpass",
    expectedError: "Invalid user name or password"
  },
  {
    name: "invalid email & valid password",
    email: "wrongemail",
    password: config.credentials.adminPassword,
    expectedError: "Invalid user name or password"
  },
  {
    name: "empty email & empty password",
    email: "",
    password: "",
    expectedError: "Please enter username & password"
  },
  {
    name: "empty email & valid password",
    email: "",
    password: config.credentials.adminPassword,
    expectedError: "Please enter username & password"
  },
  {
    name: "valid email & empty password",
    email: config.credentials.adminEmail,
    password: "",
    expectedError: "Please enter username & password"
  }
];

export const deactivatedUsers = [
  { name: 'Admin', username: config.credentials.deactivatedAdmin, password: config.credentials.deactivatedPassword },
];
export const validUsers = [
  { name: 'Admin', email: config.credentials.adminEmail, password: config.credentials.adminPassword },
  { name: 'Employee', email: config.credentials.employeeEmail, password: config.credentials.employeePassword },
  { name: 'System Admin', email: config.credentials.systemAdmin, password: config.credentials.systemAdminPassword },
];