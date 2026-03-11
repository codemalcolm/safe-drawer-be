// local "DB" for testing
let allowedUIDs = [];

// Endpoint to manage allowed UIDs
// TODO : Implement Database so that there is not a local variable
// UID is sent with a allowed: boolean in request body
const addUid = (req, res) => {
  const { uid, allowed } = req.body;
  if (!uid || typeof allowed !== "boolean")
    throw new BadRequestError("Valid UID and allowed boolean are required.");

  if (allowed) {
    if (!allowedUIDs.includes(uid)) allowedUIDs.push(uid);
  } else {
    allowedUIDs = allowedUIDs.filter((id) => id !== uid);
  }

  const uidMsg = allowed
    ? `Access granted to card with UID:${uid}`
    : `Access removed from card with UID:${uid}`;

  res.status(200).json({
    status: "success",
    message: uidMsg,
    uidBody: { uid, allowed },
  });
};

// TODO GET ALL SCANNED CARDS

module.exports = { addUid };
