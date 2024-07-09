const express = require('express');
const Order = require('../models/Order');
const Variant = require('../models/Variant');
const Picklist = require('../models/Picklist');
const axios = require('axios');

const router = express.Router();

// Shopify API credentials
const SHOPIFY_STORE_URL = 'https://your-shopify-store.myshopify.com';
const SHOPIFY_API_KEY = 'your-api-key';
const SHOPIFY_API_PASSWORD = 'your-api-password';

// Sync orders from Shopify
router.get('/sync', async (req, res) => {
  try {
    const response = await axios.get(`${SHOPIFY_STORE_URL}/admin/api/2023-01/orders.json`, {
      auth: {
        username: SHOPIFY_API_KEY,
        password: SHOPIFY_API_PASSWORD,
      },
    });

    const orders = response.data.orders;
    for (const shopifyOrder of orders) {
      const order = await Order.findOneAndUpdate(
        { orderId: shopifyOrder.id },
        {
          orderId: shopifyOrder.id,
          customer: {
            name: `${shopifyOrder.customer.first_name} ${shopifyOrder.customer.last_name}`,
            address: `${shopifyOrder.shipping_address.address1}, ${shopifyOrder.shipping_address.city}, ${shopifyOrder.shipping_address.zip}`,
            phone: shopifyOrder.shipping_address.phone,
            email: shopifyOrder.email,
          },
          products: shopifyOrder.line_items.map(item => ({
            variant: item.variant_id,
            quantity: item.quantity,
          })),
          status: 'open',
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).send('Orders synced successfully');
  } catch (error) {
    res.status(500).send(error);
  }
});

// CRUD operations for Order
router.post('/orders', async (req, res) => {
  const order = new Order(req.body);
  try {
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.variant');
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;