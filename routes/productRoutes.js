const express = require('express');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const axios = require('axios');

const router = express.Router();

// Shopify API credentials
const SHOPIFY_STORE_URL = 'https://your-shopify-store.myshopify.com';
const SHOPIFY_API_KEY = 'your-api-key';
const SHOPIFY_API_PASSWORD = 'your-api-password';

// Sync products from Shopify
router.get('/sync', async (req, res) => {
  try {
    const response = await axios.get(`${SHOPIFY_STORE_URL}/admin/api/2023-01/products.json`, {
      auth: {
        username: SHOPIFY_API_KEY,
        password: SHOPIFY_API_PASSWORD,
      },
    });

    const products = response.data.products;
    for (const shopifyProduct of products) {
      const product = await Product.findOneAndUpdate(
        { productId: shopifyProduct.id },
        {
          productId: shopifyProduct.id,
          title: shopifyProduct.title,
          vendor: shopifyProduct.vendor,
        },
        { upsert: true, new: true }
      );

      for (const variant of shopifyProduct.variants) {
        await Variant.findOneAndUpdate(
          { variantId: variant.id },
          {
            variantId: variant.id,
            sku: variant.sku,
            upc: variant.barcode,
            hsCode: variant.harmonized_system_code,
            countryOfOrigin: variant.origin_country,
            stock: variant.inventory_quantity,
            location: null, // You can update this based on your location logic
            product: product._id,
          },
          { upsert: true, new: true }
        );
      }
    }

    res.status(200).send('Products synced successfully');
  } catch (error) {
    res.status(500).send(error);
  }
});

// CRUD operations for Product
router.post('/products', async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('variants');
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('variants');
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// CRUD operations for Variant
router.post('/variants', async (req, res) => {
  const variant = new Variant(req.body);
  try {
    await variant.save();
    res.status(201).send(variant);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/variants', async (req, res) => {
  try {
    const variants = await Variant.find().populate('product');
    res.send(variants);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/variants/:id', async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id).populate('product');
    if (!variant) {
      return res.status(404).send();
    }
    res.send(variant);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/variants/:id', async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!variant) {
      return res.status(404).send();
    }
    res.send(variant);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/variants/:id', async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id);
    if (!variant) {
      return res.status(404).send();
    }
    res.send(variant);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;