const supabase = require("../config/db");

const getPayrolls = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    let query = supabase.from("payroll").select("*, employees(first_name, last_name, employee_id, department, designation)");
    if (month) query = query.eq("month", parseInt(month));
    if (year) query = query.eq("year", parseInt(year));
    if (status) query = query.eq("status", status);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ count: data.length, payrolls: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generatePayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    const { data: employees } = await supabase.from("employees").select("*").eq("is_active", true);
    const payrolls = [];
    for (const emp of employees) {
      const { data: existing } = await supabase.from("payroll").select("id").eq("employee_id", emp.id).eq("month", month).eq("year", year).single();
      if (existing) continue;
      const { data: attendance } = await supabase.from("attendance").select("*").eq("employee_id", emp.id).gte("date", `${year}-${String(month).padStart(2, "0")}-01`).lte("date", `${year}-${String(month).padStart(2, "0")}-31`);
      const absentDays = (attendance || []).filter(a => a.status === "absent").length;
      const overtimeHours = (attendance || []).reduce((sum, a) => sum + (a.overtime_hours || 0), 0);
      const dailyRate = emp.basic_salary / 30;
      const overtimeRate = (emp.basic_salary / 30 / 8) * 1.25;
      const overtimeAmount = Math.round(overtimeHours * overtimeRate);
      const absenceDeduction = Math.round(absentDays * dailyRate);
      const grossSalary = emp.basic_salary + emp.housing_allowance + emp.transport_allowance + emp.other_allowance + overtimeAmount;
      const totalDeductions = absenceDeduction;
      const netSalary = grossSalary - totalDeductions;
      const { data: payroll } = await supabase.from("payroll").insert([{
        employee_id: emp.id, month, year,
        basic_salary: emp.basic_salary,
        housing_allowance: emp.housing_allowance,
        transport_allowance: emp.transport_allowance,
        other_allowance: emp.other_allowance,
        overtime_hours: overtimeHours,
        overtime_amount: overtimeAmount,
        absence_deduction: absenceDeduction,
        gross_salary: grossSalary,
        total_deductions: totalDeductions,
        net_salary: netSalary,
      }]).select().single();
      payrolls.push(payroll);
    }
    res.json({ message: `Generated ${payrolls.length} payroll records`, payrolls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approvePayroll = async (req, res) => {
  try {
    const { data, error } = await supabase.from("payroll").update({ status: "approved", payment_date: new Date().toISOString() }).eq("id", req.params.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateWPS = async (req, res) => {
  try {
    const { month, year } = req.params;
    const { data: payrolls } = await supabase.from("payroll").select("*, employees(*)").eq("month", parseInt(month)).eq("year", parseInt(year)).eq("status", "approved");
    if (!payrolls?.length) return res.status(404).json({ error: "No approved payrolls found" });
    let sifContent = `HDR|${new Date().toISOString().split("T")[0].replace(/-/g, "")}|${payrolls.length}\n`;
    payrolls.forEach(p => {
      sifContent += `EMP|${p.employees.employee_id}|${p.employees.first_name} ${p.employees.last_name}|${p.employees.iban || ""}|${p.net_salary}|AED\n`;
    });
    sifContent += `TRL|${payrolls.reduce((sum, p) => sum + p.net_salary, 0)}`;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename=WPS_${month}_${year}.sif`);
    res.send(sifContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPayslip = async (req, res) => {
  try {
    const { data, error } = await supabase.from("payroll").select("*, employees(*)").eq("id", req.params.id).single();
    if (error) return res.status(404).json({ error: "Payroll not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPayrolls, generatePayroll, approvePayroll, generateWPS, getPayslip };