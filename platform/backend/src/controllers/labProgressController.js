const {
  createSession,
  completeLab,
  submitFlag,
  unlockHint,
  getUserStats,
  getRecentCompletions,
  getProgressMap,
  getRecommendations,
} = require('../services/labProgressService');

const sessionStart = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await createSession(req.user.id, slug);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const complete = async (req, res) => {
  try {
    const { labId } = req.params;
    const result = await completeLab(req.user.id, Number(labId));
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const stats = async (req, res) => {
  try {
    res.json(await getUserStats(req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const recent = async (req, res) => {
  try {
    res.json(await getRecentCompletions(req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const progressMap = async (req, res) => {
  try {
    res.json(await getProgressMap(req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const recommendations = async (req, res) => {
  try {
    res.json(await getRecommendations(req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const flagSubmit = async (req, res) => {
  try {
    const { slug }  = req.params;
    const { flag }  = req.body;
    if (!flag) return res.status(400).json({ message: 'Flag is required.' });
    const result = await submitFlag(req.user.id, slug, flag.trim());
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const hintUnlock = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await unlockHint(req.user.id, slug);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { sessionStart, complete, flagSubmit, hintUnlock, stats, recent, progressMap, recommendations };
