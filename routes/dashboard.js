const express = require("express");
const router = express.Router();
const { getDashboardStats, getPayrollChart, getDepartmentStats } = require("../controllers/dashboardController");
const { auth } = require("../middleware/auth");

router.get("/stats", auth, getDashboardStats);
router.get("/payroll-chart", auth, getPayrollChart);
router.get("/department-stats", auth, getDepartmentStats);

module.exports = router;