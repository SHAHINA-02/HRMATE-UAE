const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  leaveType: { type: String, enum: ["annual", "sick", "emergency", "unpaid", "maternity", "paternity"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  comments: { type: String },
}, { timestamps: true });

leaveSchema.pre("save", function(next) {
  const diff = this.endDate - this.startDate;
  this.days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  next();
});

module.exports = mongoose.model("Leave", leaveSchema);