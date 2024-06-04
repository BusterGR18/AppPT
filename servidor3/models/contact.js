/*const mongoose = require('mongoose');

const ContactoSchema = new mongoose.Schema({
  alias: String,
  number: String
});

module.exports = mongoose.model('Contacto', ContactoSchema);

//V2
const mongoose = require('mongoose');

const ContactoSchema = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Contacto', ContactoSchema);
*/
//V3
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Contact', contactSchema);
