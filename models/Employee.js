const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  nationality: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  employmentType: { type: String, enum: ["full-time", "part-time", "contract"], default: "full-time" },
  joinDate: { type: Date, required: true },
  salary: {
    basic: { type: Number, required: true },
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  bank: {
    bankName: { type: String },
    accountNumber: { type: String },
    iban: { type: String },
    routingCode: { type: String },
  },
  documents: {
    passportNumber: { type: String },
    passportExpiry: { type: Date },
    emiratesId: { type: String },
    emiratesIdExpiry: { type: Date },
    visaNumber: { type: String },
    visaExpiry: { type: Date },
    labourCardExpiry: { type: Date },
  },
  leaveBalance: {
    annual: { type: Number, default: 30 },
    sick: { type: Number, default: 15 },
    emergency: { type: Number, default: 5 },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

employeeSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.virtual("totalSalary").get(function() {
  return this.salary.basic + this.salary.housing + this.salary.transport + this.salary.other;
});

module.exports = mongoose.model("Employee", employeeSchema);