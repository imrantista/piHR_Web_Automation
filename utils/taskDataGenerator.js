import { taskEmployee, taskPriorityOptions, taskStatusOptions } from "../config/testConfig";

// Helper to format date as DD-MM-YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function generateTaskData(overrides = {}) {
    const taskCategoryOptions = [
        "Office work",
        "Online Support",
        "Health Check",
        "PiHR Employee Training",
        "Problem Solve",
        "Data Input",
        "PiHR Internal Meeting",
        "Task Update"
    ];
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Random dates: start today + 0-7 days, end after start + 0-5 days
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 6));

    // Task data
    const taskData = {
        taskTitle: `Task - ${Date.now()}`,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        assignToEmployee: taskEmployee.name,
        assignToEmployeeCode: taskEmployee.code,
        taskCategory: "Online Support",
        taskPriority: randomItem(taskPriorityOptions),
        taskStatus: "Pending",
        taskDescription: "This is an auto-generated description for testing purposes."
    };

    return { ...taskData, ...overrides };
}
