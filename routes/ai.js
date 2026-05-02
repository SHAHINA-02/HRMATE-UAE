const express = require("express");
const router = express.Router();
const { askHR, analyzeSalary, generateJobDescription } = require("../controllers/aiController");
const { auth } = require("../middleware/auth");

router.post("/ask", auth, askHR);
router.post("/analyze-salary", auth, analyzeSalary);
router.post("/job-description", auth, generateJobDescription);

module.exports = router;