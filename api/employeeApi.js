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

