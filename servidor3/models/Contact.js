const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  alias: String,
  number: String,
  useremail: String
});

module.exports = mongoose.model('Contacts', ContactSchema);
