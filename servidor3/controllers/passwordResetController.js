const crypto = require('crypto');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const axios = require('axios');

exports.requestReset = async (req, res) => {
  const { email } = req.body;
  const found = await user.findOne({ email });

  if (!found) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 3600000; // 1 hour from now

  // ✅ Save the token + expiry
  found.resetPasswordToken = token;
  found.resetPasswordExpires = expires;
  await found.save(); // <-- THIS is critical

  // Send email
  await axios.post('http://mailer:6000/send', {
    to: email,
    subject: "Recupera tu contraseña",
    template_key: "reset",
    variables: {
      resetlink: `https://sinomotos.site/reset-password?token=${token}`
    }
  });

  res.status(200).json({ success: true, message: "Email sent" });
};


exports.confirmReset = async (req, res) => {
  const { token, newPassword } = req.body;

  const found = await user.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!found) return res.status(400).json({ success: false, message: "Invalid or expired token" });

  const hashed = await bcrypt.hash(newPassword, 10);
  found.password = hashed;
  found.resetPasswordToken = undefined;
  found.resetPasswordExpires = undefined;
  await found.save();

  res.status(200).json({ success: true, message: "Password updated" });
};
