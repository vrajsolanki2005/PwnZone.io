const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [[{ total_users }]]       = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_labs }]]        = await pool.query('SELECT COUNT(*) AS total_labs FROM labs');
    const [[{ total_completions }]] = await pool.query("SELECT COUNT(*) AS total_completions FROM user_lab_progress WHERE status = 'COMPLETED'");
    const [[{ total_points }]]      = await pool.query("SELECT COALESCE(SUM(points_earned),0) AS total_points FROM user_lab_progress WHERE status = 'COMPLETED'");
    const [[{ new_users_week }]]    = await pool.query("SELECT COUNT(*) AS new_users_week FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [top_labs]                = await pool.query(
      `SELECT l.title, l.difficulty, COUNT(ulp.id) AS solves
       FROM labs l LEFT JOIN user_lab_progress ulp ON ulp.lab_id = l.id AND ulp.status = 'COMPLETED'
       GROUP BY l.id ORDER BY solves DESC LIMIT 5`
    );
    res.json({ total_users, total_labs, total_completions, total_points, new_users_week, top_labs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users?search=&page=&limit=
const getUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(100, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const like = `%${search}%`;
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar, u.provider, u.is_admin, u.created_at,
              COALESCE(SUM(ulp.points_earned),0) AS total_points,
              COUNT(ulp.id) AS labs_completed
       FROM users u
       LEFT JOIN user_lab_progress ulp ON ulp.user_id = u.id AND ulp.status = 'COMPLETED'
       WHERE u.name LIKE ? OR u.email LIKE ?
       GROUP BY u.id
       ORDER BY total_points DESC
       LIMIT ? OFFSET ?`,
      [like, like, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM users WHERE name LIKE ? OR email LIKE ?',
      [like, like]
    );
    res.json({ users, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, is_admin, password } = req.body;
    const fields = [];
    const params = [];
    if (name     !== undefined) { fields.push('name = ?');     params.push(name); }
    if (email    !== undefined) { fields.push('email = ?');    params.push(email); }
    if (is_admin !== undefined) { fields.push('is_admin = ?'); params.push(is_admin ? 1 : 0); }
    if (password)               { fields.push('password = ?'); params.push(await bcrypt.hash(password, 12)); }
    if (!fields.length) return res.status(400).json({ message: 'Nothing to update.' });
    params.push(req.params.id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'User updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id/progress
const resetUserProgress = async (req, res) => {
  try {
    await pool.query('DELETE FROM user_lab_progress WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'Progress reset.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM user_lab_progress WHERE user_id = ?', [req.params.id]);
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/labs
const getLabs = async (req, res) => {
  try {
    const search = req.query.search || '';
    const like   = `%${search}%`;
    const [labs] = await pool.query(
      `SELECT l.*, COUNT(ulp.id) AS solves
       FROM labs l
       LEFT JOIN user_lab_progress ulp ON ulp.lab_id = l.id AND ulp.status = 'COMPLETED'
       WHERE l.title LIKE ? OR l.category LIKE ?
       GROUP BY l.id
       ORDER BY l.difficulty, l.id`,
      [like, like]
    );
    res.json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/labs
const createLab = async (req, res) => {
  try {
    const { title, slug, category, difficulty, points, flag, description } = req.body;
    if (!title || !slug || !category || !difficulty || !points || !flag)
      return res.status(400).json({ message: 'title, slug, category, difficulty, points, flag are required.' });
    const [result] = await pool.query(
      'INSERT INTO labs (title, slug, category, difficulty, points, flag, description) VALUES (?,?,?,?,?,?,?)',
      [title, slug, category, difficulty, points, flag, description || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Lab created.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/labs/:id
const updateLab = async (req, res) => {
  try {
    const { title, slug, category, difficulty, points, flag, description } = req.body;
    const fields = [];
    const params = [];
    if (title       !== undefined) { fields.push('title = ?');       params.push(title); }
    if (slug        !== undefined) { fields.push('slug = ?');        params.push(slug); }
    if (category    !== undefined) { fields.push('category = ?');    params.push(category); }
    if (difficulty  !== undefined) { fields.push('difficulty = ?');  params.push(difficulty); }
    if (points      !== undefined) { fields.push('points = ?');      params.push(points); }
    if (flag        !== undefined) { fields.push('flag = ?');        params.push(flag); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (!fields.length) return res.status(400).json({ message: 'Nothing to update.' });
    params.push(req.params.id);
    await pool.query(`UPDATE labs SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Lab updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/labs/:id
const deleteLab = async (req, res) => {
  try {
    await pool.query('DELETE FROM user_lab_progress WHERE lab_id = ?', [req.params.id]);
    await pool.query('DELETE FROM labs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lab deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getUsers, updateUser, resetUserProgress, deleteUser, getLabs, createLab, updateLab, deleteLab };
