const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  variantId: { type: String, required: true },
  sku: { type: String, required: true },
  upc: { type: String },
  hsCode: { type: String },
  countryOfOrigin: { type: String },
  stock: { type: Number, default: 0 },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
});

module.exports = mongoose.model('Variant', VariantSchema);