const supabase = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const { count: totalEmployees } = await supabase.from("employees").select("*", { count: "exact", head: true }).eq("is_active", true);
    const firstOfMonth = new Date(); firstOfMonth.setDate(1); firstOfMonth.setHours(0, 0, 0, 0);
    const { count: newThisMonth } = await supabase.from("employees").select("*", { count: "exact", head: true }).gte("created_at", firstOfMonth.toISOString());
    const { count: pendingLeaves } = await supabase.from("leaves").select("*", { count: "exact", head: true }).eq("status", "pending");
    const today = new Date().toISOString().split("T")[0];
    const { count: presentToday } = await supabase.from("attendance").select("*", { count: "exact", head: true }).eq("date", today).in("status", ["present", "late"]);
    const thirtyDays = new Date(); thirtyDays.setDate(thirtyDays.getDate() + 30);
    const { data: expiringEmps } = await supabase.from("employees").select("id").eq("is_active", true).or(`passport_expiry.lte.${thirtyDays.toISOString()},emirates_id_expiry.lte.${thirtyDays.toISOString()},visa_expiry.lte.${thirtyDays.toISOString()}`);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const { data: payrolls } = await supabase.from("payroll").select("net_salary").eq("month", currentMonth).eq("year", currentYear);
    const totalPayroll = (payrolls || []).reduce((sum, p) => sum + (p.net_salary || 0), 0);
    const { data: deptData } = await supabase.from("employees").select("department").eq("is_active", true);
    const deptCount = {};
    (deptData || []).forEach(e => { deptCount[e.department] = (deptCount[e.department] || 0) + 1; });
    const departments = Object.entries(deptCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    res.json({ totalEmployees, newThisMonth, pendingLeaves, presentToday, expiringDocs: expiringEmps?.length || 0, totalPayroll, departments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPayrollChart = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const data = [];
    for (let month = 1; month <= 12; month++) {
      const { data: payrolls } = await supabase.from("payroll").select("net_salary").eq("month", month).eq("year", year);
      const total = (payrolls || []).reduce((sum, p) => sum + (p.net_salary || 0), 0);
      data.push({ month: new Date(year, month - 1).toLocaleString("default", { month: "short" }), total });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDepartmentStats = async (req, res) => {
  try {
    const { data } = await supabase.from("employees").select("department, basic_salary").eq("is_active", true);
    const stats = {};
    (data || []).forEach(e => {
      if (!stats[e.department]) stats[e.department] = { department: e.department, count: 0, totalSalary: 0 };
      stats[e.department].count++;
      stats[e.department].totalSalary += e.basic_salary || 0;
    });
    const result = Object.values(stats).map(s => ({ ...s, avgSalary: Math.round(s.totalSalary / s.count) }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboardStats, getPayrollChart, getDepartmentStats };