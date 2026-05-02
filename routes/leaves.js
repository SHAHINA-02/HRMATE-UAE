const express = require("express");
const router = express.Router();
const { getLeaves, applyLeave, updateLeaveStatus, getLeaveBalance } = require("../controllers/leaveController");
const { auth, hrOnly } = require("../middleware/auth");

router.get("/", auth, getLeaves);
router.post("/", auth, applyLeave);
router.put("/:id/status", auth, hrOnly, updateLeaveStatus);
router.get("/balance/:employeeId", auth, getLeaveBalance);

module.exports = router;