const express = require('express');
const Picklist = require('../models/Picklist');
const axios = require('axios');

const router = express.Router();

// Shippo API credentials
const SHIPPO_API_TOKEN = 'your-shippo-api-token';

// Generate shipping label for a picklist
router.post('/generate-label', async (req, res) => {
  const { picklistId } = req.body;

  try {
    const picklist = await Picklist.findById(picklistId).populate('order');
    if (!picklist) {
      return res.status(404).send('Picklist not found');
    }

    const shipment = {
      address_from: {
        name: "Warehouse",
        street1: "123 Main St",
        city: "City",
        state: "State",
        zip: "12345",
        country: "US"
      },
      address_to: {
        name: picklist.order.customer.name,
        street1: picklist.order.customer.address,
        city: "City", // Update based on customer address
        state: "State", // Update based on customer address
        zip: "Zip", // Update based on customer address
        country: "Country" // Update based on customer address
      },
      parcels: [{
        length: "10",
        width: "10",
        height: "10",
        distance_unit: "in",
        weight: "2",
        mass_unit: "lb"
      }],
      async: false
    };

    const response = await axios.post('https://api.goshippo.com/shipments/', shipment, {
      headers: { Authorization: `ShippoToken ${SHIPPO_API_TOKEN}` }
    });

    const shipmentId = response.data.object_id;

    const labelResponse = await axios.post('https://api.goshippo.com/transactions/', {
      rate: shipmentId,
      label_file_type: "PDF"
    }, {
      headers: { Authorization: `ShippoToken ${SHIPPO_API_TOKEN}` }
    });

    res.status(200).send({ label_url: labelResponse.data.label_url });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;