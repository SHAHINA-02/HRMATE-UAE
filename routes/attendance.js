const express = require("express");
const router = express.Router();
const { getAttendance, checkIn, checkOut, getAttendanceReport } = require("../controllers/attendanceController");
const { auth, hrOnly } = require("../middleware/auth");

router.get("/", auth, getAttendance);
router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);
router.get("/report/:month/:year", auth, hrOnly, getAttendanceReport);

module.exports = router;