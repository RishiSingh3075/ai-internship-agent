# 🤖 AI Internship Application Assistant

A full-stack AI-powered platform that helps job seekers manage their internship search — from storing resumes and browsing jobs to AI-driven skill matching and cover letter generation.

> **Built with** Node.js · Express.js · PostgreSQL · Prisma · JWT · Ollama (Llama3)

---

## ✨ Features

### 🔐 Authentication
- Secure registration & login with **bcrypt** password hashing
- **Dual JWT token system** — short-lived access token (1h) + refresh token (1d)
- Server-side refresh token stored in DB with secure logout (token invalidation)

### 📄 Resume Management
- Full **CRUD** for resumes with ownership-based access control
- Categorize resumes by field (AI, ML, WebDev, Cyber, etc.)
- Partial updates supported — update title, content, or both

### 💼 Job Search
- Multi-filter search with **server-side pagination**
- Filter by keywords (comma-separated), location, minimum salary, and job type
- Case-insensitive matching across job descriptions

### 📋 Application Tracking
- Apply to jobs by linking a resume
- Duplicate application prevention via unique DB constraint
- Track application status: `APPLIED → INTERVIEW → OFFER → REJECTED → GHOSTED`

### 🧠 AI-Powered Features (Ollama / Llama3)
- **Resume Parsing** — extract skills, positions, and preferred roles as structured JSON
- **Job Matching** — compare resume skills against all jobs, returns match score (%), matched & missing skills
- **Cover Letter Generation** — auto-generate tailored 150–200 word cover letters from resume + job context
- Parsed skills cached in DB to avoid redundant LLM calls

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma (with migrations) |
| Auth | JWT + bcrypt.js |
| AI / LLM | Ollama (Llama3 — local) |
| HTTP Client | Axios |
| Dev Tools | Nodemon, Prisma Studio |

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database models & enums
│   └── migrations/            # Prisma migration history
├── src/
│   ├── app.js                 # Express app setup & route mounting
│   ├── config/
│   │   └── prisma.js          # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── resume.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   └── ai.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   └── ai.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification & refresh token logic
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   └── error.middleware.js  # Global error handler
│   └── utils/
│       ├── generateToken.js     # JWT access & refresh token generation
│       └── apiResponse.js       # Standardized API response format
├── server.js                    # Entry point
├── .env                         # Environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (running locally or remote)
- **Ollama** with the `llama3` model pulled (for AI features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RishiSingh3075/ai-internship-agent.git
cd ai-internship-agent/backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Create a .env file with:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai-internship-agent"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# 4. Set up the database
npx prisma migrate dev

# 5. Start the dev server
npm run dev
```

### Ollama Setup (for AI features)

```bash
# Install Ollama from https://ollama.com
# Then pull the Llama3 model:
ollama pull llama3

# Ensure Ollama is running on http://127.0.0.1:11434
ollama serve
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ✗ | Register a new user |
| `POST` | `/api/auth/login` | ✗ | Login and receive tokens |
| `POST` | `/api/auth/token` | Refresh | Refresh access token |
| `POST` | `/api/auth/logout` | ✓ | Invalidate refresh token |
| `GET` | `/api/auth/me` | ✓ | Get current user profile |

### Resumes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/resumes` | ✓ | List all resumes |
| `POST` | `/api/resumes` | ✓ | Create a new resume |
| `PUT` | `/api/resumes/:id` | ✓ | Update a resume |
| `DELETE` | `/api/resumes/:id` | ✓ | Delete a resume |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/jobs` | ✓ | Search jobs (query: `search`, `location`, `salary`, `jobType`, `page`, `limit`) |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/application` | ✓ | List all applications |
| `POST` | `/api/application` | ✓ | Apply to a job |
| `PATCH` | `/api/application/:id` | ✓ | Update application status |

### AI
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/ai/test` | ✗ | Test AI connectivity |
| `POST` | `/api/ai` | ✓ | Parse resume skills via AI |
| `POST` | `/api/ai/match-jobs` | ✓ | Match resume to jobs with scoring |
| `POST` | `/api/ai/generate-cover-letter` | ✓ | Generate tailored cover letter |

---

## 🗄️ Database Schema

```
User ─────┐
  id       │──── Resume ────┐
  name     │      id         │──── Application
  email    │      title      │      id
  password │      content    │      status (enum)
           │      parseSkills│      notes
           │                 │      appliedAt
           └─────────────────┘
                              ──── Job
                                    id
                                    title
                                    company
                                    description
                                    location
                                    salary
```

**Application Status Enum:** `APPLIED` | `INTERVIEW` | `REJECTED` | `OFFER` | `GHOSTED`

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload (Nodemon) |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
