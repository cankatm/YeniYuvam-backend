const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adSchema = new Schema({
  name: String,
  type: String,
  userId: String,
});

module.exports = mongoose.model('Ad', adSchema);
