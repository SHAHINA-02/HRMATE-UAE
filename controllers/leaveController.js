const supabase = require("../config/db");

const getLeaves = async (req, res) => {
  try {
    const { status, employee_id } = req.query;
    let query = supabase.from("leaves").select("*, employees(first_name, last_name, employee_id, department)");
    if (status) query = query.eq("status", status);
    if (employee_id) query = query.eq("employee_id", employee_id);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ count: data.length, leaves: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const applyLeave = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
    const { data, error } = await supabase.from("leaves").insert([{ ...req.body, days }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const { data: leave } = await supabase.from("leaves").select("*").eq("id", req.params.id).single();
    const { data, error } = await supabase.from("leaves").update({ status, comments, approved_by: req.user.id, approved_at: new Date().toISOString() }).eq("id", req.params.id).select("*, employees(*)").single();
    if (error) return res.status(400).json({ error: error.message });
    if (status === "approved") {
      const balanceField = `${leave.leave_type}_leave_balance`;
      const { data: emp } = await supabase.from("employees").select(balanceField).eq("id", leave.employee_id).single();
      await supabase.from("employees").update({ [balanceField]: (emp[balanceField] || 0) - leave.days }).eq("id", leave.employee_id);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaveBalance = async (req, res) => {
  try {
    const { data, error } = await supabase.from("employees").select("first_name, last_name, annual_leave_balance, sick_leave_balance, emergency_leave_balance").eq("id", req.params.employeeId).single();
    if (error) return res.status(404).json({ error: "Employee not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLeaves, applyLeave, updateLeaveStatus, getLeaveBalance };