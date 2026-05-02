const express = require("express");
const router = express.Router();
const { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getExpiringDocuments } = require("../controllers/employeeController");
const { auth, hrOnly } = require("../middleware/auth");

router.get("/", auth, getEmployees);
router.get("/expiring-documents", auth, hrOnly, getExpiringDocuments);
router.get("/:id", auth, getEmployee);
router.post("/", auth, hrOnly, createEmployee);
router.put("/:id", auth, hrOnly, updateEmployee);
router.delete("/:id", auth, hrOnly, deleteEmployee);

module.exports = router;