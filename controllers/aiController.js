const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const UAE_HR_PROMPT = `You are an expert UAE HR and Labor Law consultant with deep knowledge of:
- UAE Federal Labour Law (Federal Decree-Law No. 33 of 2021)
- WPS (Wages Protection System) requirements
- UAE gratuity calculation rules
- Annual leave, sick leave entitlements
- UAE visa and work permit regulations
- DIFC and ADGM employment laws
- UAE Ministry of Human Resources regulations
Always provide accurate, practical advice specific to UAE labor law. Be concise and professional.`;

const askHR = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: UAE_HR_PROMPT },
        { role: "user", content: question }
      ],
      max_tokens: 1024,
    });
    res.json({ answer: response.choices[0].message.content, question });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const analyzeSalary = async (req, res) => {
  try {
    const { designation, department, experience, currentSalary, nationality } = req.body;
    const prompt = `Analyze this UAE salary and provide market insights:
    - Designation: ${designation}
    - Department: ${department}
    - Experience: ${experience} years
    - Current Salary: AED ${currentSalary}
    - Nationality: ${nationality}
    
    Respond ONLY with valid JSON (no markdown, no extra text):
    {
      "marketMin": number,
      "marketMax": number,
      "marketAverage": number,
      "assessment": "below/at/above market",
      "recommendation": "string",
      "gratuityNote": "string"
    }`;
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: UAE_HR_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024,
    });
    const text = response.choices[0].message.content.replace(/```json|```/g, "").trim();
    try {
      res.json(JSON.parse(text));
    } catch {
      res.json({ raw: text });
    }
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const generateJobDescription = async (req, res) => {
  try {
    const { designation, department, requirements } = req.body;
    const prompt = `Generate a professional UAE job description for:
    - Position: ${designation}
    - Department: ${department}
    - Requirements: ${requirements}
    Include: Overview, responsibilities, qualifications, UAE-specific requirements (visa status, language), benefits. Keep it professional and ATS-friendly.`;
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: UAE_HR_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 2048,
    });
    res.json({ jobDescription: response.choices[0].message.content });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { askHR, analyzeSalary, generateJobDescription };