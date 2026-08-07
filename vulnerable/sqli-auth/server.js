const express = require('express');
const initSqlJs = require('sql.js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5174;
const FLAG = 'FLAG{tm-01-sql-injection}';

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let db;

initSqlJs().then(SQL => {
  db = new SQL.Database();
  db.run(`
    CREATE TABLE users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role     TEXT DEFAULT 'user'
    );
    INSERT INTO users (username, password, role) VALUES
      ('admin', 'sup3rS3cr3t!', 'admin'),
      ('alice', 'alice123',     'user'),
      ('bob',   'bobpass',      'user');
  `);

  app.listen(PORT, () => {
    console.log(`[SQLi-Auth Lab] Running on http://localhost:${PORT}`);
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: 'Username and password are required.' });

  // INTENTIONALLY VULNERABLE — raw string interpolation (no parameterisation)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  let user;
  try {
    const stmt = db.prepare(query);
    user = stmt.getAsObject({});
    stmt.free();
    if (!user || !user.id) user = null;
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `SQL Error: ${err.message}`,
      hint: 'Your payload caused a SQL error. Refine your injection syntax.',
    });
  }

  if (user) {
    const injectionMarkers = ["'", '--', '/*', 'or ', 'OR ', '1=1'];
    const wasInjected = injectionMarkers.some(m => username.includes(m) || password.includes(m));
    return res.json({
      success: true,
      injected: wasInjected,
      user: { id: user.id, username: user.username, role: user.role },
      flag: wasInjected ? FLAG : null,
      message: wasInjected
        ? `Authentication bypassed via SQL Injection! Welcome, ${user.username}.`
        : `Welcome back, ${user.username}!`,
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password.' });
});

app.get('/health', (_, res) => res.json({ status: 'ok', lab: 'sqli-auth' }));
