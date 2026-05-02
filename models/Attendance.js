const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  hoursWorked: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  status: { type: String, enum: ["present", "absent", "late", "half-day", "holiday"], default: "present" },
  notes: { type: String },
}, { timestamps: true });

attendanceSchema.pre("save", function(next) {
  if (this.checkIn && this.checkOut) {
    const diff = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.hoursWorked = Math.round(diff * 100) / 100;
    this.overtimeHours = Math.max(0, this.hoursWorked - 8);
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);