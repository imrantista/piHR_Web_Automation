import { getDataFromApi } from "../utils/apiUtils.js";

export async function getEmployeeID(searchQuery) {
    const employees = await getDataFromApi(`api/v2/employee`, "admin", { query_data: searchQuery, is_active_employee: true });
    const match = employees.find(emp => emp.text === searchQuery);
    if (match) {
        return match.id; // Return the ID
    } else {
        console.log(`No employee found with exact name: ${searchQuery}`);
        return null;
    }
}



export async function getEmployeeInformation() {
    const employee = await getDataFromApi(`api/v2/employee-profiles/employee-information`, "employee", {});
    return employee;
}

export async function getEmployeeDashboard() {
    const dashboardInformation = await getDataFromApi('/api/v2/my-dashboard', "employee", {});
    return dashboardInformation;
}

export async function getEmployeeHierarchy() {
    const hierarchy = await getDataFromApi('api/v2/my-dashboard/hierarchy', "employee", {});
    return hierarchy;
}

export async function getAttendanceCalender() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    const from_date = formatDate(firstDay);
    const to_date = formatDate(lastDay);

    // Call the API with dynamic dates
    const attendanceCalender = await getDataFromApi(
        `api/v2/my-dashboard/attendance-calendar`,
        "employee",
        {from_date, to_date}
    );

    return attendanceCalender;
}
