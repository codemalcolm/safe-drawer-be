const Log = require("../models/Log");
// Tady míříme přímo na ten soubor, co vidím na tvém screenshotu
const BadRequestError = require("../errors/bad-request");

// POST - vytvoření logu
const addLog = async (req, res) => {
  const { event, message } = req.body;

  if (!event || !message) {
    // Tohle použije tu třídu od spolužáků
    throw new BadRequestError("Log is missing event or message information.");
  }

  // Uložení do MongoDB - tohle je tvůj splněný úkol
  const newLog = await Log.create({ event, message });

  console.log(`\n[ALERT] Nový log uložen do DB!`);

  res.status(201).json({
    status: "success",
    logBody: newLog,
  });
};

// GET - získání všech logů (pro Jiru)
const getAllLogs = async (req, res) => {
  const logs = await Log.find({}).sort("-timestamp");
  res.status(200).json({ count: logs.length, logs });
};

// DELETE - smazání logu (pro Jiru)
const deleteLog = async (req, res) => {
  const { id } = req.params;
  await Log.findByIdAndDelete(id);
  res.status(200).json({ msg: "Log smazán" });
};

module.exports = { addLog, getAllLogs, deleteLog };