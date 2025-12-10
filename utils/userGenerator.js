export function generateUniqueUser({
  status = "Active",
  attendance = "Yes",
  category = "Admin [System]"
} = {}) {

  const ts = Date.now();

  return {
    userName: `user_${ts}`,
    mobileNumber: `98${ts.toString().slice(-8)}`,
    email: `user_${ts}@test.com`,
    category,
    status,
    attendance,
  };
}

export function generateEditUserData() {
    const ts = Date.now();

    return {
        email: `user_${ts}@test.com`,
        mobileNumber: `98${ts.toString().slice(-8)}`,
        category: "Admin [System]",
        status: "Active",
        faceAttendance: "Yes",
        qrAttendance: "Yes"
    };
}

