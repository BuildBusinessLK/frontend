# 🌴 BuildBusinessLK — Team Setup Guide

> **💡 How to read this file nicely in VS Code**
> Open this file in VS Code, then press:
> - **Mac** → `Cmd + Shift + V`
> - **Windows** → `Ctrl + Shift + V`
>
> This opens a formatted preview instead of raw text.

Welcome to the project! This guide will help you set up everything from scratch on your computer. Read it carefully from top to bottom before starting.

---

## 📌 What is this project?

**BuildBusinessLK** is an AI-powered business support platform for Sri Lankan SMEs (small businesses) in the coconut, kithul, and palmyrah industries.

The project is split into **4 separate repositories**. Each team member works across all four:

| Repo | Technology | What it does |
|---|---|---|
| `frontend` | React (JavaScript) | The main dashboard app users interact with |
| `backend` | Spring Boot (Java) | API server — handles all data, auth, business logic |
| `ai-service` | Python (FastAPI + LLM) | AI advisor with RAG — answers user questions using local knowledge |
| `website-templates` | Next.js (TypeScript) | Hosts the public business websites generated for SMEs |

---

## 🗂️ Step 1 — Create your local workspace folder

Open your **Terminal** (Mac/Linux) or **Git Bash** (Windows) and run:

```bash
mkdir BuildBusinessLK
cd BuildBusinessLK
```

> Everything goes inside this one folder. Think of it as your project container.

---

## 📥 Step 2 — Clone all 4 repositories

Run each of these commands one by one inside `BuildBusinessLK/`:

```bash
# 1. Frontend (React)
git clone https://github.com/your-org/frontend.git

# 2. Backend (Spring Boot)
git clone https://github.com/your-org/backend.git

# 3. AI Service (Python)
git clone https://github.com/your-org/ai-service.git

# 4. Website Templates (Next.js)
git clone https://github.com/your-org/website-templates.git
```

> ⚠️ Replace the URLs above with the actual GitHub links — ask Havindu for the exact repo URLs.

After cloning, your folder should look like this:

```
BuildBusinessLK/
├── frontend/
├── backend/
├── ai-service/
└── website-templates/
```

---

## 🌿 Step 3 — Understand the branch structure

We use this branching strategy on **all 4 repos**:

```
main
 └── development
      └── dev-yourname     ← this is YOUR branch
```

- **`main`** — production-ready, stable code. Never push directly here.
- **`development`** — shared development branch. Only merge here when your feature is complete and reviewed.
- **`dev-yourname`** — your personal working branch. All your day-to-day work goes here.

> Replace `yourname` with your actual name e.g. `dev-saman`, `dev-nimesha`.

### Create your branch in each repo

After cloning, do this for **each** of the 4 repos:

```bash
git fetch                      # download all branch info from GitHub
git checkout development        # switch to the shared development branch
```

Now create **your own branch** from `development`:

```bash
# ✅ Use -b only when creating a NEW branch (first time only)
git checkout -b dev-yourname

# ✅ Next time (branch already exists) — switch without -b
git checkout dev-yourname
```

> **Rule:** `-b` = create a brand new branch. Without `-b` = switch to one that already exists.

---

## 🚀 Step 4 — Set up each repo

Open **4 separate terminal tabs/windows** — one for each repo.

---

### 🖥️ Frontend (React)

```bash
cd BuildBusinessLK/frontend

# Install dependencies (only needed once, or when package.json changes)
npm install

# Start the development server
npm run dev
```

The app will be available at: **http://localhost:3000**

---

### ☕ Backend (Spring Boot)

The backend runs on **port 8083**.

**Option A — IntelliJ IDEA (recommended)**
1. Open IntelliJ IDEA
2. Click **Open** and select `BuildBusinessLK/backend/backend`
3. Wait for Maven to download dependencies (bottom bar will show progress)
4. Click the green ▶ **Run** button

**Option B — VS Code / Terminal**
```bash
cd BuildBusinessLK/backend/backend

# Run the Spring Boot server
mvn spring-boot:run
```

The backend will be available at: **http://localhost:8083**

---

### 🤖 AI Service (Python + Ollama)

The AI service needs **two things running** at the same time — in two separate terminals.

#### First: Install Ollama and download the AI model (once only)

1. Download Ollama from **https://ollama.com** and install it
2. Open a terminal and run:

```bash
# Download the Llama 3 model (this is a large download ~4GB, do it on good WiFi)
ollama pull llama3
```

#### Then: Start Ollama (Terminal 1)

```bash
ollama serve
```

> Leave this terminal open. Ollama must keep running.

#### Then: Start the AI service (Terminal 2)

```bash
cd BuildBusinessLK/ai-service

# Install Python dependencies (only once)
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --reload
```

The AI service will be available at: **http://localhost:8000**

---

### 🌐 Website Templates (Next.js)

> ⚠️ **Important:** The `npm install` and `npm run dev` commands must be run **inside the template subfolder**, not in the root of the `website-templates` repo.

```bash
# 1. Go into the repo
cd BuildBusinessLK/website-templates

# 2. Then go into the actual Next.js app folder
cd templates/modern-business-template

# 3. Install dependencies (only once)
npm install

# 4. Start the development server
npm run dev
```

The website templates will be available at: **http://localhost:3001**

> This is where the public business websites are served (e.g. `http://localhost:3001/business/your-slug`).

---

## 🔐 Step 5 — Environment variables (.env files)

Each repo has a `.env` file in its root folder. These files contain **secret keys and config values** (like API URLs and passwords).

> ⚠️ **These files are NOT on GitHub.** You must get them from **Havindu** directly (via WhatsApp or email).

| Repo | File to create |
|---|---|
| `frontend/` | `.env` |
| `backend/backend/src/main/resources/` | `application.properties` |
| `ai-service/` | `.env` |
| `website-templates/templates/modern-business-template/` | `.env.local` |

Once you receive the file contents from Havindu, create the file in the correct location and paste the values in.

---

## 💻 Step 6 — Summary: Running everything

You need **5 terminal windows** open at the same time:

| Terminal | Command | URL |
|---|---|---|
| 1 — Ollama | `ollama serve` | (internal) |
| 2 — AI Service | `uvicorn app:app --reload` in `ai-service/` | http://localhost:8000 |
| 3 — Backend | `mvn spring-boot:run` in `backend/backend/` | http://localhost:8083 |
| 4 — Frontend | `npm run dev` in `frontend/` | http://localhost:3000 |
| 5 — Templates | `npm run dev` in `website-templates/.../modern-business-template/` | http://localhost:3001 |

---

## 🔁 Step 7 — Daily Git workflow

Every day when you sit down to work, follow these steps:

### 1. Pull the latest changes before you start

> ⚠️ **Always do this before touching any code.** Every single time.

```bash
# Make sure you're on your branch first
git checkout dev-yourname

# Pull the latest from the development branch to stay up to date
git pull origin development
```

This keeps your branch in sync with your teammates' work and prevents merge conflicts.

### 2. Make your changes

Write your code in VS Code, IntelliJ, or any editor.

### 3. Check what files you changed

```bash
# See which files you've modified
git status
```

### 4. Stage your changes

```bash
# Stage all changed files at once
git add .

# OR stage a specific file only
git add src/pages/MyPage.js
```

> **Staging** means telling Git "I want to include these files in my next save point."

### 5. Commit your changes

```bash
git commit -m "Short description of what you did"
```

**Good commit messages:**
```bash
git commit -m "Add business profile form validation"
git commit -m "Fix AI chat session loading bug"
git commit -m "Update hero text in website template"
```

**Bad commit messages:**
```bash
git commit -m "fix"        # ❌ too vague
git commit -m "changes"    # ❌ no information
```

### 6. Push to GitHub

```bash
# Push your branch to GitHub
git push origin dev-yourname
```

> Only push to **your own branch** (`dev-yourname`). Never push directly to `main` or `development`.

### 7. When your feature is ready — create a Pull Request

1. Go to the GitHub repo in your browser
2. Click **"Compare & pull request"**
3. Set the base branch to **`development`**
4. Add a description of what you did
5. Ask Havindu to review and merge it

---

## 🛡️ What is .gitignore?

The `.gitignore` file tells Git which files to **never upload to GitHub**. This protects sensitive info and keeps the repo clean.

Things that should be in `.gitignore` (never push these):

```
# Dependencies (huge folders, auto-generated on npm install / pip install)
node_modules/
__pycache__/
.venv/

# Environment files (contain secrets like API keys and passwords)
.env
.env.local
.env.production

# Spring Boot secrets
application.properties
application-dev.properties

# Build output (auto-generated, not source code)
build/
dist/
.next/
target/

# IDE / OS files (only useful on your machine)
.idea/
.DS_Store
*.iml
```

> If you accidentally track a file that should be ignored, tell Havindu and we'll fix it together.

---

## ⚠️ Important rules

1. **Never push `.env` or `application.properties` to GitHub.** These contain API keys.
2. **Never push directly to `main`.** Always use your `dev-yourname` branch.
3. **Pull before you push.** Always `git pull` before starting work each day.
4. **Commit through your IDE** (IntelliJ for backend) when possible — it's easier to review what you're committing.
5. **Ask before merging** into `development`. Always get Havindu's approval first.
6. **Do not push `node_modules/`** — this folder can be hundreds of megabytes. It's in `.gitignore` already.

---

## 🆘 Common problems & fixes

| Problem | Fix |
|---|---|
| `npm: command not found` | Install Node.js from https://nodejs.org |
| `mvn: command not found` | Install Maven from https://maven.apache.org or use IntelliJ |
| `ollama: command not found` | Install Ollama from https://ollama.com |
| `pip: command not found` | Install Python 3.11+ from https://python.org |
| Backend won't start | Check that `application.properties` exists in the correct folder |
| AI service errors | Make sure `ollama serve` is running in a separate terminal |
| Port already in use | Another process is using that port — restart your computer or kill the process |
| Merge conflict | Don't panic — message Havindu, we'll resolve it together |

---

## 📞 Need help?

Message **Havindu** on WhatsApp for:
- GitHub repo URLs
- `.env` file contents
- Merge approvals
- Any setup issues

---

*Last updated by Havindu · BuildBusinessLK Team*
