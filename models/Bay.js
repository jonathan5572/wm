const mongoose = require('mongoose');

const BaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  aisle: { type: mongoose.Schema.Types.ObjectId, ref: 'Aisle', required: true }
});

module.exports = mongoose.model('Bay', BaySchema);