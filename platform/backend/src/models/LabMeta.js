const pool = require('../config/db');

const LabMeta = {
  async findByLabId(labId) {
    const [rows] = await pool.query('SELECT * FROM lab_meta WHERE lab_id = ?', [labId]);
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      objectives: typeof row.objectives === 'string' ? JSON.parse(row.objectives) : row.objectives,
      scenario:   typeof row.scenario   === 'string' ? JSON.parse(row.scenario)   : row.scenario,
      hints:      typeof row.hints      === 'string' ? JSON.parse(row.hints)      : row.hints,
      resources:  typeof row.resources  === 'string' ? JSON.parse(row.resources)  : row.resources,
    };
  },
};

module.exports = LabMeta;
