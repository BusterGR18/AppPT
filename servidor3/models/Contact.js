const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  alias: String,
  number: String
});

module.exports = mongoose.model('Contact', ContactSchema);
