# HRMATE UAE — Backend API

![Status](https://img.shields.io/badge/Status-Production-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Deployed](https://img.shields.io/badge/Deployed-HuggingFace_Spaces-FFD21E?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-F97316?style=flat-square)

### Production REST API for UAE HR & Payroll Management — WPS Compliant, AI-Powered.

**LIVE API:** https://shahina-02-hrmate-uae-backend.hf.space

**FRONTEND:** https://hrmate-uae-frontend.vercel.app

---

## ABOUT

HRMate UAE Backend is a production-grade REST API built with Node.js and Express, powering the HRMate UAE HR and payroll management system. It handles all core business logic — employee records, WPS-compliant payroll processing, leave and attendance management, JWT authentication, and an AI HR assistant powered by Groq's Llama 3.3 70B model trained with UAE Labour Law context.

---

## HOW IT WORKS

```
Client Request (Next.js Frontend)
        ↓
JWT Authentication Middleware
        ↓
Express Route Handler
        ↓
Supabase (PostgreSQL) — Data Layer
        ↓
Groq AI (Llama 3.3 70B) — AI HR Assistant
        ↓
JSON Response
```

---

## API MODULES

**Authentication**
- JWT-based login and session management
- Password hashing via bcryptjs
- Role-based access: Admin, HR Manager, Employee

**Employee Management**
- CRUD operations for employee records
- Department and role assignment
- Document and profile management

**Payroll & WPS Compliance**
- UAE Wages Protection System (WPS) payroll processing
- Salary calculations, allowances, and deductions
- Payslip generation per pay cycle

**Leave Management**
- Leave request submission and approval workflow
- Leave balance tracking per employee
- UAE public holiday calendar integration

**Attendance Tracking**
- Daily attendance logging
- Late arrival and absence reporting
- Monthly attendance summary

**AI HR Assistant**
- Powered by Groq AI — Llama 3.3 70B
- UAE Labour Law guidance and compliance Q&A
- Contextual HR policy responses

---

## TECH STACK

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js 4 |
| Database | Supabase (PostgreSQL) |
| Authentication | JWT + bcryptjs |
| AI Engine | Groq AI — Llama 3.3 70B |
| Deployment | Hugging Face Spaces |

---

## INSTALLATION

**Prerequisites:** Node.js 18+, Supabase account, Groq API key

```bash
git clone https://github.com/YOUR_USERNAME/hrmate-uae-backend.git
cd hrmate-uae-backend
npm install
cp .env.example .env
# Add your environment variables
npm run dev
```

**ENVIRONMENT VARIABLES**
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=3001
```

---

## ROADMAP

- [ ] Arabic language support for AI responses
- [ ] End-of-service gratuity auto-calculation (UAE Labour Law)
- [ ] Visa and Emirates ID expiry notification system
- [ ] Webhook support for payroll events
- [ ] Rate limiting and API key management

---

## AUTHOR

**SHAHINA S** — Full Stack Developer & AI Engineer, UAE

- Portfolio: https://yoursite.com
- LinkedIn: https://linkedin.com/in/yourhandle
- Email: you@email.com

---

*MIT License. Open source. Built for UAE HR compliance and workforce management.*
