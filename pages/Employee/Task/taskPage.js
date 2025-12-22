import { th } from "@faker-js/faker";
import BasePage from "../../BasePage";
import { generateTaskData } from "../../../utils/taskDataGenerator";
import { expect } from "@playwright/test";
import { taskStatusOptions } from "../../../config/testConfig";


export class TaskPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;

        // New Task Button
        this.newTaskBtn = page.getByRole('button', { name: 'New Task' });

        // New Task Modal Form Fields
        this.taskTitleField = page.getByRole('textbox', { name: 'Enter here' });
        this.startDateField = page.locator('input[name="task_start"]');
        this.endDateField = page.locator('input[name="task_end"]');
        this.assignToEmployeeField = page.locator('label:has-text("Assign to Employee")').locator('..').locator('..').getByRole('textbox', { name: 'Select' });
        this.taskCategoryField = page.locator('label:has-text("Task Category")').locator('..').locator('..').getByRole('textbox', { name: 'Select' });
        this.taskPriorityField = page.locator('label:has-text("Task Priority")').locator('..').locator('..').getByRole('textbox', { name: 'Select' });
        this.taskStatusField = page.locator('label:has-text("Task Status")').locator('..').locator('..').getByRole('textbox', { name: 'Select' });
        this.taskDescriptionField = page.getByRole('textbox', { name: 'Type here' });
        this.createBtn = page.getByRole('button', { name: 'Create' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });


        // Message/Chat Field
        this.messageField = page.getByRole('textbox', { name: 'Send a message' });
        this.sendBtn = page.getByRole('button', { name: 'Send' });
        this.employeeStaticMessage = "Hello Supervisor, I have started working on the task assigned to me.";
        this.supervisorStaticMessage = "Hello Employee, please ensure to complete the task by the deadline.";
        this.commentHeading = page.getByRole('heading', { name: 'Comments' });


        // Filter
        this.statusFilter = page.getByText('Status', { exact: true });
        this.resetButton = page.getByRole('button', { name: 'Reset' });




    }

    async openNewTaskModal() {
        await this.expectAndClick(this.newTaskBtn, "New Task Button");
    }
    async fillDateField(field, date) {
        await this.waitAndFill(field, date);
        await this.page.keyboard.press('Escape');
    }

    async fillTaskForm(taskData) {
        await this.waitAndFill(this.taskTitleField, taskData.taskTitle, "Task Title Field");
        await this.fillDateField(this.startDateField, taskData.startDate);
        await this.fillDateField(this.endDateField, taskData.endDate);
        await this.waitAndFill(this.assignToEmployeeField, taskData.assignToEmployeeCode, "Assign To Employee Field");
        await this.expectAndClick(this.page.getByRole('main').getByText(taskData.assignToEmployee), "Select Employee from Dropdown");
        await this.expectAndClick(this.taskCategoryField, "Task Category Field");
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: taskData.taskCategory }), "Task Category");
        await this.expectAndClick(this.taskPriorityField, "Task Priority Field");
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: taskData.taskPriority }), "Task Priority");
        await this.expectAndClick(this.taskStatusField, "Task Status Field");
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: taskData.taskStatus }), "Task Status");
        await this.waitAndFill(this.taskDescriptionField, taskData.taskDescription, "Task Description Field");
    }


    async addNewTask(data) {
        await this.openNewTaskModal();
        await this.fillTaskForm(data);
        await this.expectAndClick(this.createBtn, "Create Button");
    }

    async addAndVerifyTask() {
        const data = generateTaskData();
        await this.addNewTask(data);
        const successMessage = this.page.getByText('Add new task');
        await this.assert({
            locator: successMessage,
            condition: 'visible',
            message: 'Verify Success Message for Adding New Task'
        });
        return data;
    }


    async getTaskCount(status) {
        // Regex: match "status <number>", e.g., "Pending 5"
        const taskLocator = this.page.getByText(new RegExp(`^${status}\\s*(\\d+)$`));

        // Get the full text (e.g., "Pending 5")
        const text = await taskLocator.textContent();
        if (!text) return 0;

        // Extract the number using regex
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;

    }

    async updateTaskStatus(taskTitle, status) {
        const task = await this.page.getByText(taskTitle);
        await this.expectAndClick(task, `Select Task: ${taskTitle}`);
        await this.expectAndClick(this.page.getByText('Pending').first(), 'Current Status Field');
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: status }), `Select Status: ${status}`);
        await this.page.reload();
    }

    async updateTaskStatusandVerify(taskTitle, status) {
        const initialCount = await this.getTaskCount(status);
        await this.updateTaskStatus(taskTitle, status);
        const updatedCount = await this.getTaskCount(status);
        console.log(`Initial Count: ${initialCount}, Updated Count: ${updatedCount}`);
        expect(updatedCount).toBe(initialCount + 1);
    }

    async verifyStatus(taskTitle, status) {
        const task = await this.page.getByText(taskTitle);
        await this.expectAndClick(task, `Select Task: ${taskTitle}`);
        await this.assert({ locator: this.page.getByText(status).first(), state: 'visible', alias: 'Current Status Field' });
    }

    async sendMessageByRole(taskTitle, role) {
        const message =
            role === 'employee'
                ? this.employeeStaticMessage
                : this.supervisorStaticMessage;
        const count = await this.commentHeading.count();
        if (count === 0) {
            const task = this.page.getByText(taskTitle);
            await this.expectAndClick(task, `Select Task: ${taskTitle}`);
        }
        await this.waitAndFill(this.messageField, message, "Message Field");
        await this.expectAndClick(this.sendBtn, `Send Message By ${role}`);
    }

    async verifyMessageSentBy(taskTitle, role) {
        const message =
            role === 'employee'
                ? this.employeeStaticMessage
                : this.supervisorStaticMessage;
        const count = await this.commentHeading.count();
        if (count === 0) {
            const task = this.page.getByText(taskTitle);
            await this.expectAndClick(task, `Select Task: ${taskTitle}`);
        }
        const messageLocator = this.page.getByText(message);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `${role} Sent Message`
        });
    }

    async verifyStatusCountFilter(status) {
        for (const s of taskStatusOptions) {
            const count = await this.getTaskCount(s);
            if (s === status) {
                // Current filter may have any number of tasks, no assertion here
                console.log(`Filter "${status}" applied: ${count} tasks`);
            } else {
                // Other statuses must be 0
                if (count !== 0) {
                    throw new Error(
                        `Filter "${status}" applied but found ${count} tasks with status "${s}"`
                    );
                }
            }
        }
    }


    async verifyStatusFilter() {
        for (const status of taskStatusOptions) {
            await this.expectAndClick(this.statusFilter, "Status Filter");
            await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${status}$`) }), `Select Status: ${status}`);
            await this.verifyStatusCountFilter(status);
            await this.page.reload();
        }
    }

    async verifyFilterResetFunctionality() {
        // Apply a filter first
        await this.expectAndClick(this.statusFilter, "Status Filter");
        await this.expectAndClick(
            this.page.getByRole('listitem').filter({ hasText: 'Pending', exact: true }),
            `Select Status: Pending`
        );

        // Click Reset and capture API response
        const [data] = await this.expectAndClick(this.resetButton, "Reset Button", "employeeTaskApi:GET");

        // Get today
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // current month
        const yyyy = today.getFullYear();

        // Get previous month, adjust year if January
        const prevMonthDate = new Date(today);
        prevMonthDate.setMonth(today.getMonth() - 1);
        const prevMonth = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
        const prevYear = prevMonthDate.getFullYear();
        const startDate = `${dd}-${prevMonth}-${prevYear}`;
        const endDate = `${dd}-${mm}-${yyyy}`;

        const expectedUrl = `https://api.pihr.xyz/api/v2/task/employee-tasks?start_date=${startDate}&end_date=${endDate}`;

        expect(data.url()).toBe(expectedUrl);

        console.log("✅ Reset Button API verified with previous month start and today end:", expectedUrl);
    }



}