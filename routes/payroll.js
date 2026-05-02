const express = require("express");
const router = express.Router();
const { getPayrolls, generatePayroll, approvePayroll, generateWPS, getPayslip } = require("../controllers/payrollController");
const { auth, hrOnly } = require("../middleware/auth");

router.get("/", auth, getPayrolls);
router.post("/generate", auth, hrOnly, generatePayroll);
router.put("/:id/approve", auth, hrOnly, approvePayroll);
router.get("/wps/:month/:year", auth, hrOnly, generateWPS);
router.get("/:id/payslip", auth, getPayslip);

module.exports = router;