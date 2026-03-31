// Endpoint to manage allowed UIDs

const { sendCommandToHardware } = require("../tools/sendCommandToHw");

// local "DB" for testing
let allowedUIDs = [];
// TODO : Implement Database so that there is not a local variable
// UID is sent with a allowed: boolean in request body
const addUid = async (req, res) => {
  const { uid, allowed } = req.body;
  if (!uid || typeof allowed !== "boolean")
    throw new BadRequestError("Valid UID and allowed boolean are required.");

  if (allowed) {
    await sendCommandToHardware(`ADD_UID:${uid}\n`);
    if (!allowedUIDs.includes(uid)) allowedUIDs.push(uid);
  } else {
    await sendCommandToHardware(`REMOVE_UID:${uid}\n`);
     allowedUIDs = allowedUIDs.filter((id) => id !== uid);
  }

  res.status(200).json({
    status: "success",
    message: allowed
    ? `Access granted to card with UID:${uid}`
    : `Access removed from card with UID:${uid}`,
    uidBody: { uid, allowed },
  });
};

// TODO GET ALL SCANNED CARDS

module.exports = { addUid, allowedUIDs };
