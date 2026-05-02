const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const payrollRoutes = require("./routes/payroll");
const leaveRoutes = require("./routes/leaves");
const attendanceRoutes = require("./routes/attendance");
const aiRoutes = require("./routes/ai");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "HRMate UAE API Running ✅", status: "ok", version: "1.0.0" }));
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`✅ HRMate UAE Backend running on http://localhost:${PORT}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? "Configured ✅" : "MISSING ❌"}`);
  console.log(`🤖 Groq API: ${process.env.GROQ_API_KEY ? "Configured ✅" : "MISSING ❌"}`);
  console.log(`🗄️  Supabase: ${process.env.SUPABASE_URL ? "Configured ✅" : "MISSING ❌"}`);
});