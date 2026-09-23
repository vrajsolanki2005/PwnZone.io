# 🛡️ PwnZone.io

### **Hands-On Web Security Training & Vulnerability Labs**

PwnZone.io is a self-hosted cybersecurity learning platform designed to help students, developers, and security enthusiasts **learn web application security through hands-on vulnerable labs**.

Instead of only reading about vulnerabilities, users can interact with intentionally vulnerable applications, understand how security flaws work, and practice identifying them in a controlled environment.

> ⚠️ **Security Notice:** PwnZone.io contains intentionally vulnerable applications. It is designed strictly for authorized security education, penetration-testing practice, and research. Do **not** expose the vulnerable lab services to the public internet or use the project against systems you do not own or have explicit permission to test.

---

## 🚀 What is PwnZone.io?

PwnZone.io provides a centralized platform for practicing web application security.

The project separates the **training platform** from the **vulnerable applications**, allowing individual security labs to run in isolated containers.

### Core concept

```text
                    ┌─────────────────────────┐
                    │       PwnZone.io        │
                    │     Training Platform   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Platform Backend    │
                    │     Authentication      │
                    │       APIs / DB         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Platform Frontend   │
                    │       Dashboard         │
                    │      Lab Interface      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
      ┌───────▼────────┐                    ┌──────▼─────────┐
      │  SQLi Lab      │                    │   XSS Lab      │
      │    tm-01       │                    │     tm-41      │
      └────────────────┘                    └────────────────┘
```

Each vulnerable lab can run as an isolated Docker service while the main platform handles the learning experience.

---

## ✨ Features

### 🎯 Interactive Security Labs

Practice web security concepts using intentionally vulnerable applications.

Current Docker configuration includes isolated labs such as:

* **SQL Injection Authentication Lab**
* **XSS Search Lab**
* Additional labs can be added using the same architecture.

The repository is structured to make adding new vulnerability labs straightforward.

---

### 🔐 Authentication

The platform supports application authentication using:

* JWT-based authentication
* Session-based authentication
* Google OAuth integration

Configuration for these authentication mechanisms is provided through environment variables.

---

### 🤖 AI-Powered Assistance

PwnZone.io is designed with AI-assisted learning in mind.

The platform can integrate with **Groq** through an API key, allowing AI-powered functionality to be incorporated into the security-learning workflow.

---

### 🗄️ MySQL Database

The platform uses **MySQL 8** as its database.

Docker Compose automatically:

* Creates the MySQL container
* Initializes the database
* Persists database data through a Docker volume
* Performs database health checks
* Connects the backend after the database becomes healthy

---

### 🐳 Dockerized Architecture

PwnZone.io uses Docker Compose to orchestrate the platform.

The current architecture includes:

| Service      | Purpose                            |
| ------------ | ---------------------------------- |
| `db`         | MySQL database                     |
| `backend`    | Platform API/backend               |
| `frontend`   | Web interface served through Nginx |
| `sqli-auth`  | SQL Injection training lab         |
| `xss-search` | XSS training lab                   |

The vulnerable labs are intentionally configured as internal Docker services rather than being directly exposed through host ports.

---

## 🏗️ Project Structure

```text
PwnZone.io/
│
├── platform/
│   ├── backend/
│   │   ├── database/
│   │   │   └── init/
│   │   └── ...
│   │
│   └── frontend/
│       └── ...
│
├── vulnerable/
│   ├── sqli-auth/
│   ├── xss-search/
│   └── ...
│
├── backup/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

The repository currently contains dedicated `platform`, `vulnerable`, and `backup` directories.

---

# ⚙️ Getting Started

## 📋 Prerequisites

Before running PwnZone.io, install:

* [Docker](https://www.docker.com/)
* Docker Compose
* Git

No local MySQL installation is required when using the provided Docker setup because MySQL runs inside Docker.

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/vrajsolanki2005/PwnZone.io.git

cd PwnZone.io
```

---

### 2. Create environment configuration

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

---

### 3. Configure `.env`

Example configuration:

```env
# Database
MYSQL_ROOT_PASSWORD=your_db_password
MYSQL_DATABASE=hackonymous

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=hackonymous

# Application
PORT=3000
CLIENT_URL=http://localhost

# Authentication
JWT_SECRET=change_this_secret
SESSION_SECRET=change_this_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost/api/auth/google/callback

# AI
GROQ_API_KEY=your_groq_api_key
```

The repository's `.env.example` defines these database, application, authentication, Google OAuth, and Groq configuration variables.

> 🔒 Never commit your real `.env` file, API keys, OAuth secrets, or production credentials.

---

## ▶️ Run the Platform

Start all services:

```bash
docker compose up --build
```

Or run in detached mode:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

## 🌐 Access the Application

Once the containers are running, open:

```text
http://localhost
```

The frontend is exposed on port `80`.

The platform backend runs internally on port `3000`, while the vulnerable lab services are exposed internally to the Docker network rather than directly mapped to host ports.

---

# 🧪 Vulnerability Labs

PwnZone.io uses isolated vulnerable applications to prevent vulnerabilities from contaminating unrelated labs.

### Current examples

#### 🔴 SQL Injection Authentication

```text
Lab ID: tm-01
Service: sqli-auth
Port: 5174
```

This lab is intended for learning SQL injection concepts through an intentionally vulnerable authentication workflow.

---

#### 🟠 XSS Search

```text
Lab ID: tm-41
Service: xss-search
Port: 5175
```

This lab provides a controlled environment for understanding Cross-Site Scripting vulnerabilities.

---

## ➕ Adding a New Lab

The Docker architecture is designed so additional labs can be introduced as separate services.

A new lab generally requires:

```text
vulnerable/
└── your-new-lab/
    ├── Dockerfile
    ├── application files
    └── ...
```

Then add the service to:

```text
docker-compose.yml
```

For example:

```yaml
new-lab:
  build: ./vulnerable/new-lab
  restart: always
  expose:
    - "5176"
```

The current Compose file explicitly follows this service-per-lab pattern.

---

# 🔒 Security Architecture

One of the important design goals of PwnZone.io is separating the vulnerable environments from the main platform.

```text
                 Internet / User
                       │
                       ▼
              ┌─────────────────┐
              │    Nginx / UI   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Platform Backend│
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │      MySQL      │
              └─────────────────┘

                       │
                       │ Internal Network
                       ▼

          ┌──────────────────────────┐
          │     Vulnerable Labs     │
          ├──────────────────────────┤
          │ SQLi Authentication      │
          │ XSS Search               │
          │ Future Labs              │
          └──────────────────────────┘
```

The vulnerable lab containers use Docker's internal networking model, reducing the chance of accidentally exposing each training service directly to the host network.

---

# 🧠 Learning Objectives

PwnZone.io is intended to help learners develop practical understanding of:

* Web application security
* SQL Injection
* Cross-Site Scripting
* Authentication vulnerabilities
* Session security
* Access control
* Secure coding
* API security
* Vulnerability identification
* Penetration-testing methodology
* Defensive remediation

The goal is to bridge the gap between **security theory and hands-on practice**.

---

# 🛠️ Technology Stack

| Layer                | Technology                            |
| -------------------- | ------------------------------------- |
| Frontend             | Web-based platform                    |
| Backend              | Node.js-based application             |
| Database             | MySQL 8                               |
| Authentication       | JWT / Sessions / Google OAuth         |
| AI Integration       | Groq API                              |
| Web Server           | Nginx                                 |
| Containerization     | Docker                                |
| Orchestration        | Docker Compose                        |
| Training Environment | Intentionally vulnerable applications |

The repository's Docker configuration confirms MySQL 8, a backend service, an Nginx-based frontend container, and isolated vulnerable lab containers.

---

# 🔐 Responsible Use

PwnZone.io is an **educational security platform**.

You should only use the vulnerable applications:

* On systems you own
* In your own local lab
* In authorized educational environments
* During explicitly authorized penetration tests

Do **not**:

* Deploy vulnerable labs on a public production server
* Attack third-party applications
* Scan systems without authorization
* Use the platform to obtain unauthorized access
* Expose vulnerable services to the public internet

The project intentionally contains security weaknesses, so treat it as a controlled laboratory environment.

---

# 🧪 Recommended Learning Workflow

```text
1. Choose a vulnerability
          ↓
2. Read the lab objective
          ↓
3. Explore the application
          ↓
4. Identify the vulnerable input
          ↓
5. Understand the vulnerability
          ↓
6. Reproduce it inside the lab
          ↓
7. Understand the impact
          ↓
8. Learn the secure implementation
          ↓
9. Complete the lab
          ↓
10. Move to the next vulnerability
```

This approach encourages understanding the vulnerability rather than simply copying payloads.

---

# 🚧 Roadmap

Planned improvements can include:

* [ ] More vulnerability labs
* [ ] Lab progress tracking
* [ ] User dashboard
* [ ] Vulnerability categories
* [ ] Difficulty levels
* [ ] Points and scoring
* [ ] Leaderboards
* [ ] Achievement system
* [ ] Certificates
* [ ] AI security mentor
* [ ] Lab hints
* [ ] Lab completion validation
* [ ] Detailed vulnerability explanations
* [ ] OWASP mapping
* [ ] Admin dashboard
* [ ] Improved lab isolation
* [ ] Automated lab deployment
* [ ] Security-focused analytics

---

# 🤝 Contributing

Contributions are welcome.

### Fork the repository

```bash
git fork
```

### Create a feature branch

```bash
git checkout -b feature/new-lab
```

### Make your changes

Test the application locally before submitting your changes.

### Commit

```bash
git add .
git commit -m "feat: add new security lab"
```

### Push

```bash
git push origin feature/new-lab
```

Then open a Pull Request.

---

# 📜 License

Add the project's intended license here once the repository has an explicit license file.

> If this project is intended to be open source, consider adding an `LICENSE` file before publishing a stable release.

---

# 👨‍💻 Author

**Vraj Solanki**

GitHub:
https://github.com/vrajsolanki2005

Project:
https://github.com/vrajsolanki2005/PwnZone.io

---

## ⭐ Support the Project

If you find PwnZone.io useful for cybersecurity learning:

* ⭐ Star the repository
* 🐛 Report bugs
* 💡 Suggest new labs
* 🔧 Contribute improvements
* 📚 Share the project with security learners

---

## ⚠️ Final Security Disclaimer

PwnZone.io is intentionally designed with vulnerable applications for **authorized cybersecurity education and research**.

The maintainers are not responsible for misuse of the software.

**Practice responsibly. Hack only what you are authorized to hack.**

---

### 🔗 Repository

https://github.com/vrajsolanki2005/PwnZone.io
