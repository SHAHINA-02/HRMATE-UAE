const supabase = require("../config/db");

const getAttendance = async (req, res) => {
  try {
    const { employee_id, date } = req.query;
    let query = supabase.from("attendance").select("*, employees(first_name, last_name, employee_id)");
    if (employee_id) query = query.eq("employee_id", employee_id);
    if (date) query = query.eq("date", date);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ count: data.length, attendance: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const { employee_id } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase.from("attendance").select("id").eq("employee_id", employee_id).eq("date", today).single();
    if (existing) return res.status(400).json({ error: "Already checked in today" });
    const now = new Date();
    const workStart = new Date(); workStart.setHours(9, 0, 0, 0);
    const status = now > workStart ? "late" : "present";
    const { data, error } = await supabase.from("attendance").insert([{ employee_id, date: today, check_in: now.toISOString(), status }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const { employee_id } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const { data: attendance, error: findError } = await supabase.from("attendance").select("*").eq("employee_id", employee_id).eq("date", today).single();
    if (findError || !attendance) return res.status(404).json({ error: "No check-in found for today" });
    if (attendance.check_out) return res.status(400).json({ error: "Already checked out today" });
    const now = new Date();
    const hoursWorked = Math.round(((now - new Date(attendance.check_in)) / (1000 * 60 * 60)) * 100) / 100;
    const overtimeHours = Math.max(0, hoursWorked - 8);
    const { data, error } = await supabase.from("attendance").update({ check_out: now.toISOString(), hours_worked: hoursWorked, overtime_hours: overtimeHours }).eq("id", attendance.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.params;
    const { data, error } = await supabase.from("attendance").select("*, employees(first_name, last_name, employee_id, department)").gte("date", `${year}-${String(month).padStart(2, "0")}-01`).lte("date", `${year}-${String(month).padStart(2, "0")}-31`);
    if (error) return res.status(400).json({ error: error.message });
    const summary = {
      totalPresent: data.filter(r => r.status === "present").length,
      totalAbsent: data.filter(r => r.status === "absent").length,
      totalLate: data.filter(r => r.status === "late").length,
      totalOvertime: data.reduce((sum, r) => sum + (r.overtime_hours || 0), 0),
    };
    res.json({ summary, records: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAttendance, checkIn, checkOut, getAttendanceReport };