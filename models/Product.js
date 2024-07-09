const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  vendor: { type: String, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);