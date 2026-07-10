const { getAllLabs, getLabBySlug, getLabById, getLabMeta } = require('../services/labService');

const listLabs = async (req, res) => {
  try {
    const { difficulty, category, search, sort } = req.query;
    const labs = await getAllLabs({ difficulty, category, search, sort });
    res.json(labs);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getLabByIdHandler = async (req, res) => {
  try {
    const lab = await getLabById(Number(req.params.id));
    res.json(lab);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getLab = async (req, res) => {
  try {
    const lab = await getLabBySlug(req.params.slug);
    res.json(lab);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getLabMetaHandler = async (req, res) => {
  try {
    const meta = await getLabMeta(Number(req.params.labId));
    res.json(meta);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { listLabs, getLab, getLabByIdHandler, getLabMetaHandler };
