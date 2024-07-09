const mongoose = require('mongoose');

const ShelfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bay: { type: mongoose.Schema.Types.ObjectId, ref: 'Bay', required: true }
});

module.exports = mongoose.model('Shelf', ShelfSchema);