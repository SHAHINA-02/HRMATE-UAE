const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  housingAllowance: { type: Number, default: 0 },
  transportAllowance: { type: Number, default: 0 },
  otherAllowance: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  overtimeAmount: { type: Number, default: 0 },
  deductions: {
    absence: { type: Number, default: 0 },
    loan: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  grossSalary: { type: Number },
  totalDeductions: { type: Number },
  netSalary: { type: Number },
  status: { type: String, enum: ["draft", "approved", "paid"], default: "draft" },
  paymentDate: { type: Date },
  wpsStatus: { type: String, enum: ["pending", "submitted", "confirmed"], default: "pending" },
  notes: { type: String },
}, { timestamps: true });

payrollSchema.pre("save", function(next) {
  this.grossSalary = this.basicSalary + this.housingAllowance + this.transportAllowance + this.otherAllowance + this.overtimeAmount;
  this.totalDeductions = this.deductions.absence + this.deductions.loan + this.deductions.other;
  this.netSalary = this.grossSalary - this.totalDeductions;
  next();
});

module.exports = mongoose.model("Payroll", payrollSchema);