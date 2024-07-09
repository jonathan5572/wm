const mongoose = require('mongoose');

const AisleSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Aisle', AisleSchema);