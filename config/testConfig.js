import {generateRandomId} from '../utils/generateRandomNumber.js';
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
    "supervisorEmail": process.env.SUPERVISOR_EMAIL,
    "supervisorPassword": process.env.SUPERVISOR_PASSWORD,
    "resetPasswordEmail": 'shabitalahi123@gmail.com',
    "newPassword":'Pihr@' + generateRandomId(100,999),
    "employeeAdminEmail": process.env.EMPLOYEE_ADMIN_EMAIL,
    "employeeAdminPassword": process.env.EMPLOYEE_ADMIN_PASSWORD,
    "deactivatedAdmin": process.env.DEACTIVATED_ADMIN,
    "deactivatedPassword": process.env.DEACTIVATED_PASSWORD
  },
  "slug": {
    "leavepage": 'leave/leave?page_size=10&page_number=1',
    "leavedashboard": 'leave/leavedashboard',
    "dashboard": 'dashboard',
    "attendanceDashboard": 'attendance/attendancedashboard',
    "leaveDashboard": 'leave/leavedashboard',
    "manageUser": 'user',
    "monthWiseAttendanceReport": 'selfservice/selfattendancereport/selfattendancereport',
    "visitapplication": 'selfservice/visit',
    "supervisorVisitApplication": '/selfservice/appapproval?page_size=10&page_number=1',
    "admidVisitApplication" : '/leave/visit?page_size=10&page_number=1',

    "myClaim": 'selfservice/claim',
    "claimRequest": 'salary/employeeclaimrequest',
    "claim": 'salary/claim',
    "myAdvanceSalary": 'selfservice/advancesalary',
    "approveApplication": 'selfservice/appapproval?page_size=10&page_number=1',
    "advanceSalary": 'salary/advancesalary',
    "employeeasset": '/selfservice/myassignedasset',
    "assetrequisitionrequest": 'employee/assetrequisitionrequest' ,
    "documentRequest": 'selfservice/mydocumentrequest',
    "adminDocumentRequest" : 'employee/employeedocumentrequest'

  },
  "data": {
    //  "emplyeeName":"Tanzim Emon",
     "leaveType":"Annual Leave",
     "leaveStartDate":"13-12-2025",
     "leaveEndDate":"15-12-2025",
     "leavePurpose":"Vacation",
     "deleteEmployeeName":"Tanzim",
     "updateLeaveEndDate":"24-12-2025",
     "supEditLeaveDate":"24-12-2025",
     "adminEditLeaveDate":"24-12-2025",
     "newLeaveStartDate": "",
     "newLeaveEndDate": "",
  },
  "visitApplicationData": {
     "visitFromtDate":"19-12-2025",
     "visitEndDate":"20-12-2025",
     "visitPurpose":"Vacation",
     "employeeName":"Tanzim Emon",
     "updatedVisitPurpose":"Client Visit",
     "updatedVisitFromDate":"18-12-2025",
  },
  "deleteApplicationData": {
    "visitReason": "Vacation"
  },
  "viewEmployeeDetailsData": {
    "employeeName" : "Tanzim  Emon",
    "employeeId"   : "00000276",
    "employeeRole" : "SQA Engineer L-II",
    "joinDate"     : "06-10-2022",
    "jobStatus"    : "Active",
    "branch"       : "Banani",
    "department"   : "SQA",
    "fromDate"     : "02-12-2025, 12:00 AM",
    "endDate"      : "03-12-2025, 12:00 AM",
    "dayCount"     : "2",
    "visitPurpose" : "d",
    "status"       : "Pending"
  },
   "documentRequest": {
    "documentPurpose": "Personal",
    "remarks": "NOC",
    "expectedDate": "22-12-2025",
    "updatedDocumentPurpose": "Official",
  },
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
  { name: 'Emplyee Admin', email: config.credentials.employeeAdminEmail, password: config.credentials.employeeAdminPassword },
  { name : 'Supervisor', email: config.credentials.supervisorEmail, password: config.credentials.supervisorPassword }
];

export const branches = ['Banani', 'bKash', 'PiHR', 'Financfy', 'Kathmandu', 'Klikit', 'Mirpur DOHS', 'PiHR Support Rajshahi', 'Rajshahi'];

export const invalidMobileNumbers = [
    "017",         
    "01712345678912414",     
    "abc12345678",      
    "01712@#$%1"        
];
//Attendance report config data
export const reportConfig = {
  month: 12,
  year: 2025
};
//Asset config data
export const assetConfig = {
  emplyeeName: "Tanzim"
};