const Lab     = require('../models/Lab');
const LabMeta = require('../models/LabMeta');

const getAllLabs = async ({ difficulty, category, search, sort }) => {
  return Lab.findAll({ difficulty, category, search, sort });
};

const getLabById = async (id) => {
  const lab = await Lab.findById(id);
  if (!lab) { const err = new Error('Lab not found.'); err.status = 404; throw err; }
  return lab;
};

const getLabBySlug = async (slug) => {
  const lab = await Lab.findBySlug(slug);
  if (!lab) { const err = new Error('Lab not found.'); err.status = 404; throw err; }
  lab.meta = await LabMeta.findByLabId(lab.id);
  return lab;
};

const getLabMeta = async (labId) => {
  const meta = await LabMeta.findByLabId(labId);
  if (!meta) { const err = new Error('Meta not found.'); err.status = 404; throw err; }
  return meta;
};

module.exports = { getAllLabs, getLabBySlug, getLabById, getLabMeta };
