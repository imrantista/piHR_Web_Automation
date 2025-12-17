export function generateAdvanceSalaryData(overrides = {}) {

    const currentDate = new Date();

    const paymentMethods = [
        "By Cash",
        "Salary Deduction"
    ];

    const randomAdvanceAmount =
        (Math.floor(Math.random() * 46) + 5) * 1000; // Random amount between 5000 and 50000

    const randomPaymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    const defaultData = {
        advanceAmount: String(randomAdvanceAmount),
        paymentMethod: randomPaymentMethod,
        paymentDuration: "6",
        startMonth: currentDate.toLocaleString("default", { month: "long" }),
        year: String(currentDate.getFullYear()),
        remarks: "Advance Salary Request"
    };

    return {
        ...defaultData,
        ...overrides
    };

}
