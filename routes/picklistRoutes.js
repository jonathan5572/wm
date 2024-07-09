const express = require('express');
const Picklist = require('../models/Picklist');
const Order = require('../models/Order');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// CRUD operations for Picklist
router.post('/picklists', async (req, res) => {
  const picklist = new Picklist(req.body);
  try {
    await picklist.save();
    res.status(201).send(picklist);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/picklists', async (req, res) => {
  try {
    const picklists = await Picklist.find().populate('order');
    res.send(picklists);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/picklists/:id', async (req, res) => {
  try {
    const picklist = await Picklist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!picklist) {
      return res.status(404).send();
    }
    res.send(picklist);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/picklists/:id', async (req, res) => {
  try {
    const picklist = await Picklist.findByIdAndDelete(req.params.id);
    if (!picklist) {
      return res.status(404).send();
    }
    res.send(picklist);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Generate PDF picklist
router.get('/picklists/:id/pdf', async (req, res) => {
  try {
    const picklist = await Picklist.findById(req.params.id).populate('order');
    if (!picklist) {
      return res.status(404).send();
    }

    const htmlContent = `
      <h1>Picklist</h1>
      <p>Picklist ID: ${picklist.picklistId}</p>
      <p>Order ID: ${picklist.order.orderId}</p>
      <p>Status: ${picklist.status}</p>
    `;

    pdf.create(htmlContent).toFile(path.join(__dirname, `${picklist.picklistId}.pdf`), (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendFile(result.filename);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;