const crypto = require("crypto");

// --- Encryption Utility (Moved to the Cloud!) ---
const encrypt = (text) => {
  // Uses the ENCRYPTION_KEY from your Render environment variables
  const keyStr = process.env.ENCRYPTION_KEY || "fallback_key_do_not_use_in_prod";
  const key = crypto.createHash('sha256').update(String(keyStr)).digest('base64').substring(0, 32);
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  
  return (
    iv.toString("hex") +
    ":" +
    Buffer.concat([cipher.update(text), cipher.final()]).toString("hex")
  );
}

module.exports = encrypt;