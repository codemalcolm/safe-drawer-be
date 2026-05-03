const mongoose = require("mongoose");
const { isValidId } = require("../tools/utils");
const Log = require("../models/Log");

// might be useless (MQTT Substitute)
const addLog = async (req, res) => {
  const { event, message, drawerId, type, timestamp } = req.body;

  // 1. Validate all required fields exist
  if (!event || !message || !drawerId || !timestamp) {
    return res.status(400).json({
      message: "Chybí povinné údaje (event, message, drawerId,timestamp).",
    });
  }

  if (!isValidId(drawerId)) {
    return res.status(400).json({ message: "Neplatný formát 'drawerId'." });
  }
  try {
    const newLog = await Log.create({
      event,
      message,
      drawerId,
      type: type || "info",
    });

    console.log(`\n[ALERT] Nový log uložen do DB pro šuplík: ${drawerId}`);

    res.status(201).json({
      status: "success",
      logBody: newLog,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Chyba validace dat", error: error.message });
    }
    res.status(500).json({
      message: "Interní chyba serveru při vytváření logu",
      error: error.message,
    });
  }
};

const getAllLogs = async (req, res) => {
  try {
    const { drawerId } = req.params;

    if (!isValidId(drawerId)) {
      return res
        .status(400)
        .json({ message: "Neplatný formát ID šuplíku (drawerId)" });
    }

    // foretch logs ONLY for this specific drawer, sorted newest first
    const logs = await Log.find({ drawerId: drawerId }).sort("-timestamp");

    res.status(200).json({ count: logs.length, logs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Chyba při načítání logů", error: error.message });
  }
};

const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Neplatný formát ID logu" });
    }

    const deletedLog = await Log.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({ message: "Log ke smazání nebyl nalezen" });
    }

    res.status(200).json({ msg: "Log úspěšně smazán", deletedLog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Chyba při mazání logu", error: error.message });
  }
};

module.exports = { addLog, getAllLogs, deleteLog };
