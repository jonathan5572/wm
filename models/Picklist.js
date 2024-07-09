const mongoose = require('mongoose');

const PicklistSchema = new mongoose.Schema({
  picklistId: { type: String, required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});

module.exports = mongoose.model('Picklist', PicklistSchema);