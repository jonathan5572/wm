const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shelf: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf', required: true }
});

module.exports = mongoose.model('Bin', BinSchema);