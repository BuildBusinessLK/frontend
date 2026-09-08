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

Open **separate terminal tabs/windows** — one for each repo.

---

### 🖥️ Frontend (React)

```bash
cd BuildBusinessLK/frontend

# Install dependencies (only needed once, or when package.json changes)
npm install

# Start the development server
npm start
```

The app will be available at: **http://localhost:3000**

---

### ☕ Backend (Spring Boot)

The backend runs on **port 8083**.

> ⚠️ **Important:** The backend source is one level deeper — always `cd` into `backend/backend/`, not just `backend/`.

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

### 🗄️ Database Setup (required before running the backend)

The backend uses **MySQL**. Every team member runs their **own local database** for development. There is also a shared deployed database for production.

#### Understanding the 3 properties files

All 3 files are inside:
```
BuildBusinessLK/backend/backend/src/main/resources/
```

| File | Purpose |
|---|---|
| `application.properties` | Main config — sets which profile (dev/prod) is active |
| `application-dev.properties` | **Your** local database credentials — edit this |
| `application-prod.properties` | Shared deployed database — get from Havindu, do not edit |

#### How profiles work

Open `application.properties`. You will see this line at the top:

```properties
spring.profiles.active=dev
```

This tells Spring Boot to use `application-dev.properties` on top of the main file.
- `dev` → uses **your local MySQL** database
- `prod` → uses the **shared deployed** database

> ⚠️ **Always keep this set to `dev` while developing.** Only Havindu changes this to `prod`.

#### Step 1 — Install MySQL

If you don't have MySQL installed:
- Download **MySQL Community Server** from https://dev.mysql.com/downloads/mysql/
- During install, set a root password you will remember
- MySQL will run on port **3306** by default

#### Step 2 — Set up your local database credentials

Open `application-dev.properties`. It looks like this:

```properties
# Local MySQL — active when spring.profiles.active=dev
spring.datasource.url=jdbc:mysql://localhost:3306/buildbusinesslk?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**What to do:**
1. Replace `YOUR_MYSQL_PASSWORD` with the password you set when installing MySQL
2. If the file already has someone else's credentials — **delete those lines** and put in yours
3. The database name (`buildbusinesslk`) will be **created automatically** the first time the backend runs — you don't need to create it manually
4. Save the file

> ⚠️ `createDatabaseIfNotExist=true` means Spring Boot creates the database for you. No need to open MySQL Workbench manually.

#### Step 3 — Verify the active profile

Make sure `application.properties` still has:

```properties
spring.profiles.active=dev
```

That's it. Now start the backend — it will connect to your local MySQL.

#### ⚠️ Do NOT push properties files to GitHub

These files contain your personal database password. They are already listed in `.gitignore`.

- ✅ Stage and push your code files normally
- ❌ Never add `application-dev.properties` or `application-prod.properties` to a commit
- ✅ Commit backend changes **through IntelliJ** — it shows you exactly which files are staged, making it easy to avoid accidentally committing these files

---

### 🤖 AI Service (Python + Ollama)

The AI service needs **two things running** at the same time — in two separate terminals.

#### First: Install Ollama and download the AI model (once only)

1. Download Ollama from **https://ollama.com** and install it
2. Open a terminal and run:

```bash
# Download the Llama 3 model (~4 GB download — do this on good WiFi)
ollama pull llama3
```

#### Then: Set up the Python virtual environment (once only)

```bash
cd BuildBusinessLK/ai-service

# Create a virtual environment inside the repo
python3 -m venv .venv

# Activate it (Mac/Linux)
source .venv/bin/activate

# Install all Python dependencies into the venv
.venv/bin/pip install -r requirements.txt
```

#### Then: Build the vector database (once only — or after changing data/ files)

This reads all `.txt` files in `data/` and creates the FAISS vector index the AI uses for retrieval:

```bash
# Still inside BuildBusinessLK/ai-service/
.venv/bin/python rag/ingest.py
```

You should see:
```
Loading documents...
Splitting documents...
Loaded X documents and created Y chunks.
Creating embeddings & saving FAISS index...
Done. Vector DB created.
```

> ⚠️ Re-run `rag/ingest.py` any time you add or edit files inside `data/`. The vector index must match the current data.

#### Then: Start Ollama (Terminal 1)

```bash
ollama serve
```

> Leave this terminal open. Ollama must keep running in the background.

#### Then: Start the AI service (Terminal 2)

```bash
cd BuildBusinessLK/ai-service

# Start the FastAPI server using the venv Python
.venv/bin/python -m uvicorn app:app --reload
```

The AI service will be available at: **http://localhost:8000**

> ⚠️ Always use `.venv/bin/python -m uvicorn` (not just `uvicorn`) to ensure the venv packages are used, not your system Python.

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
| `backend/backend/` | `.env` |
| `backend/backend/src/main/resources/` | `application-dev.properties` |
| `ai-service/` | `.env` |
| `website-templates/templates/modern-business-template/` | `.env.local` |

Once you receive the file contents from Havindu, create the file in the correct location and paste the values in.

---

## 💻 Step 6 — Summary: Running everything

You need **5 terminal windows** open at the same time:

| Terminal | Command | Directory | URL |
|---|---|---|---|
| 1 — Ollama | `ollama serve` | anywhere | (internal — port 11434) |
| 2 — AI Service | `.venv/bin/python -m uvicorn app:app --reload` | `ai-service/` | http://localhost:8000 |
| 3 — Backend | `mvn spring-boot:run` | `backend/backend/` ⚠️ | http://localhost:8083 |
| 4 — Frontend | `npm start` | `frontend/` | http://localhost:3000 |
| 5 — Templates | `npm run dev` | `website-templates/templates/modern-business-template/` ⚠️ | http://localhost:3001 |

> ⚠️ Backend and website-templates both require you to be in a **subdirectory** — not the repo root.

### VS Code shortcut

If you open the `BuildBusinessLK/` folder in VS Code, press **`Cmd + Shift + B`** to launch all terminals automatically.

---

## 🆕 Fresh Clone Checklist

Every time someone clones the project for the first time, run these commands in order:

```bash
# ── FRONTEND ──────────────────────────────────────────────────
cd frontend
npm install
cd ..

# ── AI SERVICE ────────────────────────────────────────────────
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
.venv/bin/pip install -r requirements.txt
.venv/bin/python rag/ingest.py        # builds the FAISS vector database
cd ..

# ── WEBSITE TEMPLATES ─────────────────────────────────────────
cd website-templates/templates/modern-business-template
npm install
cd ../../..

# ── OLLAMA (only once ever) ───────────────────────────────────
ollama pull llama3                    # ~4 GB download

# ── BACKEND ───────────────────────────────────────────────────
# 1. Get your .env and application-dev.properties from Havindu
# 2. Place them in backend/backend/ and backend/backend/src/main/resources/
# 3. Then run:
cd backend/backend
mvn spring-boot:run
```

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

# Spring Boot — your personal DB credentials (never push these)
application-dev.properties
application-prod.properties

# Build output (auto-generated, not source code)
build/
dist/
.next/
target/

# IDE / OS files (only useful on your machine)
.idea/
.DS_Store
*.iml

# AI vector database (auto-generated by rag/ingest.py — do not push)
rag/vectorstore/
```

> `application.properties` itself **is safe to commit** — it only contains non-secret shared config like port numbers and JPA settings. The files with your personal DB password (`application-dev.properties` and `application-prod.properties`) are what you must never push.

---

## ⚠️ Important rules

1. **Never push `application-dev.properties` or `application-prod.properties` to GitHub.** These contain your DB password.
2. **Never push `.env` files.** These contain API keys and secrets.
3. **Never push directly to `main`.** Always use your `dev-yourname` branch.
4. **Pull before you start.** Always `git pull origin development` before starting work each day.
5. **Commit through your IDE** (IntelliJ for backend) when possible — it shows you exactly which files are staged so you don't accidentally commit sensitive files.
6. **Ask before merging** into `development`. Always get Havindu's approval first.
7. **Do not push `node_modules/`** — this folder can be hundreds of megabytes. It's in `.gitignore` already.
8. **Do not push `rag/vectorstore/`** — this is auto-generated by `rag/ingest.py`. Each developer builds it locally.

---

## 🆘 Common problems & fixes

| Problem | Fix |
|---|---|
| `npm: command not found` | Install Node.js from https://nodejs.org |
| `npm error Missing script: "dev"` | Frontend uses `npm start`, not `npm run dev` |
| `mvn: command not found` | Install Maven from https://maven.apache.org or use IntelliJ |
| `ollama: command not found` | Install Ollama from https://ollama.com |
| `pip: command not found` | Install Python 3.11+ from https://python.org |
| `next: command not found` | Run `npm install` inside `website-templates/templates/modern-business-template/` first |
| Backend won't start | Check that you're in `backend/backend/` (not just `backend/`) and `.env` exists |
| AI chat times out | Normal — llama3 8B takes 30–60 s on local hardware. Backend timeout is set to 120 s. |
| AI service errors on startup | Run `rag/ingest.py` first to build the vector database |
| `ollama serve` error: address in use | Ollama is already running in the background — skip this step |
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
