const supabase = require("../config/db");

const getEmployees = async (req, res) => {
  try {
    const { department, search, is_active } = req.query;
    let query = supabase.from("employees").select("*");
    if (department) query = query.eq("department", department);
    if (is_active !== undefined) query = query.eq("is_active", is_active === "true");
    if (search) query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%,email.ilike.%${search}%`);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ count: data.length, employees: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { data, error } = await supabase.from("employees").select("*").eq("id", req.params.id).single();
    if (error) return res.status(404).json({ error: "Employee not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { data: count } = await supabase.from("employees").select("id", { count: "exact" });
    const employeeId = `EMP${String((count?.length || 0) + 1).padStart(4, "0")}`;
    const { data, error } = await supabase.from("employees").insert([{ ...req.body, employee_id: employeeId }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { data, error } = await supabase.from("employees").update(req.body).eq("id", req.params.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { error } = await supabase.from("employees").update({ is_active: false }).eq("id", req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Employee deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getExpiringDocuments = async (req, res) => {
  try {
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const { data, error } = await supabase.from("employees").select("*").eq("is_active", true).or(`passport_expiry.lte.${thirtyDays.toISOString()},emirates_id_expiry.lte.${thirtyDays.toISOString()},visa_expiry.lte.${thirtyDays.toISOString()},labour_card_expiry.lte.${thirtyDays.toISOString()}`);
    if (error) return res.status(400).json({ error: error.message });
    const alerts = [];
    const today = new Date();
    data.forEach(emp => {
      const docs = [
        { field: "passport_expiry", label: "Passport" },
        { field: "emirates_id_expiry", label: "Emirates ID" },
        { field: "visa_expiry", label: "Visa" },
        { field: "labour_card_expiry", label: "Labour Card" },
      ];
      docs.forEach(({ field, label }) => {
        if (emp[field] && new Date(emp[field]) <= thirtyDays) {
          alerts.push({
            employee: `${emp.first_name} ${emp.last_name}`,
            employeeId: emp.employee_id,
            document: label,
            expiry: emp[field],
            daysLeft: Math.ceil((new Date(emp[field]) - today) / (1000 * 60 * 60 * 24))
          });
        }
      });
    });
    res.json({ count: alerts.length, alerts: alerts.sort((a, b) => a.daysLeft - b.daysLeft) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getExpiringDocuments };