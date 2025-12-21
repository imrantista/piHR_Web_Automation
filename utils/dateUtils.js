// utils/dateUtils.js

import fs from "fs";
import path from "path";

/* ------------------ BASIC DATE HELPERS ------------------ */

export function parseDDMMYYYY(s) {
  if (!s) return null;
  const [dd, mm, yyyy] = String(s).trim().split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export function formatDDMMYYYY(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isFriOrSat(d) {
  const day = d.getDay();
  return day === 5 || day === 6;
}

function nextValidWorkday(date) {
  let d = new Date(date);
  while (isFriOrSat(d)) d = addDays(d, 1);
  return d;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ------------------ DATE GENERATION ------------------ */

/**
 * Generates leave dates strictly AFTER previous "To" date
 * - start >= max(tomorrow, prevTo + 1)
 * - skip Fri/Sat
 * - end = start + 1–2 days
 * - year must be current year
 */
export function generateLeaveDatesAfter(prevToDDMMYYYY) {
  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const prevTo = parseDDMMYYYY(prevToDDMMYYYY);
  const currentYear = today.getFullYear();

  let start, end;

  do {
    const base = new Date(
      Math.max(tomorrow.getTime(), addDays(prevTo, 1).getTime())
    );

    start = nextValidWorkday(addDays(base, randomInt(0, 10)));

    const gapDays = randomInt(1, 2);
    end = nextValidWorkday(addDays(start, gapDays));

    while (end.getTime() <= start.getTime()) {
      end = nextValidWorkday(addDays(end, 1));
    }
  } while (
    start.getFullYear() !== currentYear ||
    end.getFullYear() !== currentYear
  );

  return {
    leaveStartDate: formatDDMMYYYY(start),
    leaveEndDate: formatDDMMYYYY(end),
  };
}

/* ------------------ TABLE DATA HELPERS ------------------ */

export function getLatestToDate(rows = []) {
  let latest = null;

  for (const row of rows) {
    if (!row?.To) continue;
    const d = parseDDMMYYYY(row.To);
    if (!d) continue;

    if (!latest || d.getTime() > latest.getTime()) {
      latest = d;
    }
  }

  return latest ? formatDDMMYYYY(latest) : null;
}

export function isConfigRangePresent(rows = [], start, end) {
  return rows.some((r) => r.From === start && r.To === end);
}

export function isPastRange(start, end) {
  const today = startOfToday();
  const e = parseDDMMYYYY(end);
  if (!e) return false;
  return e.getTime() < today.getTime();
}


/* ------------------ TXT-BASED DATE ADJUSTMENT ------------------ */

/**
 * Reads Row 1 from Leave Table TXT and adjusts the "To" date based on Duration:
 * - Duration: 2 (Days)  => To = To - 1 day
 * - Duration: 1 (Day)   => To = To + 1 day
 *
 * Returns:
 * {
 *   from, to, durationDays, adjustedTo
 * }
 */
/* ------------------ TXT-BASED DATE ADJUSTMENT ------------------ */

/**
 * Reads Row 1 from Leave Table TXT and adjusts the "To" date based on Duration:
 * - Duration: 2 (Days)  => To = To - 1 day
 * - Duration: 1 (Day)   => To = To + 1 day
 */
export function getAdjustedToDateFromLeaveTxt({
  filePath = path.join(
    process.cwd(),
    "SaveData",
    "txt",
    "Employee",
    "updateLeaveApplicationTableInfo.txt"
  ),
} = {}) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`TXT file not found: ${filePath}`);
  }

  const text = fs.readFileSync(filePath, "utf8");

  // Split into row blocks: "Row 1:", "Row 2:", ...
  const rowBlocks = text.split(/^Row\s+\d+\s*:\s*/m).slice(1);
  if (!rowBlocks.length) {
    throw new Error(`No rows found in TXT: ${filePath}`);
  }

  // Row 1 content = first block, cut off before next separator line if present
  const row1Block = rowBlocks[0];

  // Helper: pick value from any matching label (very tolerant about spaces/case)
  const pick = (labels) => {
    for (const label of labels) {
      const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+?)\\s*$`, "im");
      const m = row1Block.match(re);
      if (m?.[1]) return m[1].trim();
    }
    return null;
  };

  const from = pick(["From", "From Date"]);
  const to = pick(["To", "To Date"]);
  const durationRaw = pick(["Duration", "Leave Duration"]);

  if (!to) {
    // helpful debug (won't change any other logic)
    const preview = row1Block
      .split(/\r?\n/)
      .slice(0, 12)
      .join(" | ");
    throw new Error(
      `"To" date not found in Row 1: ${filePath}\nRow 1 preview: ${preview}`
    );
  }

  const durationDays = Number(durationRaw?.match(/(\d+)/)?.[1]);

  const toDate = parseDDMMYYYY(to);
  if (!toDate || Number.isNaN(toDate.getTime())) {
    throw new Error(`Invalid "To" date in Row 1: "${to}"`);
  }

  let adjusted = new Date(toDate);

  if (durationDays === 2) {
    adjusted = addDays(toDate, -1);
  } else if (durationDays === 1) {
    adjusted = addDays(toDate, 1);
  }

  return {
    from,
    to,
    durationDays: Number.isFinite(durationDays) ? durationDays : null,
    adjustedTo: formatDDMMYYYY(adjusted),
  };
}

/* ------------------ ATTENDANCE RECONCILIATION HELPERS ------------------ */

/* ------------------ ATTENDANCE RECONCILIATION HELPERS ------------------ */

/**
 * Generate dynamic Attendance Reconciliation values:
 * - attendanceDate and outTimeDate are the same date (dd-mm-yyyy)
 * - inTime/outTime are in "hh:mm AM/PM"
 * - gap between inTime and outTime is 1–2 hours (inclusive)
 * - keeps outTime within the same day (no midnight cross)
 */
export function generateAttendanceReconciliationData({
  dateWithinPastDays = 10,     // pick date from last N days including today
  minGapMinutes = 60,          // 1 hour
  maxGapMinutes = 120,         // 2 hours
  skipFriSat = false,
} = {}) {
  // ---------- date (same for both fields) ----------
  const base = startOfToday();
  const offsetDays = randomInt(0, Math.max(0, dateWithinPastDays));
  let d = addDays(base, -offsetDays);
  if (skipFriSat) d = nextValidWorkday(d);

  const attendanceDate = formatDDMMYYYY(d);
  const outTimeDate = attendanceDate;

  // ---------- helpers ----------
  const to12H = (totalMinutes) => {
    const hh24 = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;

    const isPM = hh24 >= 12;
    let hh12 = hh24 % 12;
    if (hh12 === 0) hh12 = 12;

    const hh = String(hh12).padStart(2, "0");
    const min = String(mm).padStart(2, "0");
    const suffix = isPM ? "PM" : "AM";
    return `${hh}:${min} ${suffix}`;
  };

  const isValid12H = (s) => /^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/.test(String(s).trim());

  // ---------- duration (1–2 hours) ----------
  const safeMin = Math.max(1, Math.floor(minGapMinutes));
  const safeMax = Math.max(safeMin, Math.floor(maxGapMinutes));
  const durationMinutes = randomInt(safeMin, safeMax);

  // ---------- time generation (must NOT cross midnight) ----------
  // latest start so that end <= 23:59
  const latestStartMinute = 23 * 60 + 59 - durationMinutes;
  const startMinute = randomInt(0, Math.max(0, latestStartMinute));
  const endMinute = startMinute + durationMinutes;

  const inTime = to12H(startMinute);
  const outTime = to12H(endMinute);

  // ---------- validation ----------
  if (!isValid12H(inTime)) {
    throw new Error(`Invalid In Time generated (expected "hh:mm AM/PM"): "${inTime}"`);
  }
  if (!isValid12H(outTime)) {
    throw new Error(`Invalid Out Time generated (expected "hh:mm AM/PM"): "${outTime}"`);
  }
  if (durationMinutes < 60 || durationMinutes > 120) {
    throw new Error(`Invalid duration generated: ${durationMinutes} minutes (expected 60–120)`);
  }

  return {
    attendanceDate,
    outTimeDate,
    inTime,
    outTime,
    durationMinutes,
    durationHours: Math.round((durationMinutes / 60) * 100) / 100,
  };
}
