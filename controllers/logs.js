const Log = require("../models/Log");
const BadRequestError = require("../errors/bad-request");

const addLog = async (req, res) => {
  const { event, message } = req.body;

  if (!event || !message) {
    throw new BadRequestError("Log is missing event or message information.");
  }

  const newLog = await Log.create({ event, message });

  console.log(`\n[ALERT] Nový log uložen do DB!`);

  res.status(201).json({
    status: "success",
    logBody: newLog,
  });
};

const getAllLogs = async (req, res) => {
  const logs = await Log.find({}).sort("-timestamp");
  res.status(200).json({ count: logs.length, logs });
};

const deleteLog = async (req, res) => {
  const { id } = req.params;
  await Log.findByIdAndDelete(id);
  res.status(200).json({ msg: "Log smazán" });
};

module.exports = { addLog, getAllLogs, deleteLog };
