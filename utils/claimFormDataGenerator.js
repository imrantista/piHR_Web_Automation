export function generateClaimData(overrides = {}) {
  const today = formatDDMMYYYY(new Date());
  const oneWeekAgo = formatDDMMYYYY(addDays(-7));

  const data = {
    // Required fields
    claimDate: today,
    fromDate: oneWeekAgo,
    toDate: today,
    claimAmount: random(10, 1000).toString(),

    // Optional fields
    advancedAmount: random(100, 1000).toString(),
    advanceDate: oneWeekAgo,
    claimCategory: "Advance", // default
    description: "Test description",
    remark: "Test remark",
    attachmentFile: null,
  };

  return { ...data, ...overrides };
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function formatDDMMYYYY(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
