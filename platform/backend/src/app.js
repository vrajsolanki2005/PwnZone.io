require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/labs',        require('./routes/labRoutes'));
app.use('/api/progress',    require('./routes/labProgressRoutes'));
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/recon',       require('./routes/reconRoutes'));
app.use('/api/admin',       require('./routes/adminRoutes'));
app.use('/api/ai',          require('./routes/aiRoutes'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

module.exports = app;
