import { getDataFromApi } from "../utils/apiUtils";

export async function getCurrentLeaveBalance(employeeId) {
    const response = await getDataFromApi(`api/v2/current-leave-statuses/${employeeId}/current-leave-balances`);
    return response.leave_balances;
}