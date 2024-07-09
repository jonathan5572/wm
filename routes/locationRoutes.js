const express = require('express');
const Aisle = require('../models/Aisle');
const Bay = require('../models/Bay');
const Shelf = require('../models/Shelf');
const Bin = require('../models/Bin');

const router = express.Router();

// Aisle Routes
router.post('/aisles', async (req, res) => {
  const aisle = new Aisle(req.body);
  try {
    await aisle.save();
    res.status(201).send(aisle);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/aisles', async (req, res) => {
  try {
    const aisles = await Aisle.find();
    res.send(aisles);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/aisles/:id', async (req, res) => {
  try {
    const aisle = await Aisle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!aisle) {
      return res.status(404).send();
    }
    res.send(aisle);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/aisles/:id', async (req, res) => {
  try {
    const aisle = await Aisle.findByIdAndDelete(req.params.id);
    if (!aisle) {
      return res.status(404).send();
    }
    res.send(aisle);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Bay Routes
router.post('/bays', async (req, res) => {
  const bay = new Bay(req.body);
  try {
    await bay.save();
    res.status(201).send(bay);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/bays', async (req, res) => {
  try {
    const bays = await Bay.find().populate('aisle');
    res.send(bays);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/bays/:id', async (req, res) => {
  try {
    const bay = await Bay.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bay) {
      return res.status(404).send();
    }
    res.send(bay);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/bays/:id', async (req, res) => {
  try {
    const bay = await Bay.findByIdAndDelete(req.params.id);
    if (!bay) {
      return res.status(404).send();
    }
    res.send(bay);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Shelf Routes
router.post('/shelves', async (req, res) => {
  const shelf = new Shelf(req.body);
  try {
    await shelf.save();
    res.status(201).send(shelf);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/shelves', async (req, res) => {
  try {
    const shelves = await Shelf.find().populate('bay');
    res.send(shelves);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/shelves/:id', async (req, res) => {
  try {
    const shelf = await Shelf.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shelf) {
      return res.status(404).send();
    }
    res.send(shelf);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/shelves/:id', async (req, res) => {
  try {
    const shelf = await Shelf.findByIdAndDelete(req.params.id);
    if (!shelf) {
      return res.status(404).send();
    }
    res.send(shelf);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Bin Routes
router.post('/bins', async (req, res) => {
  const bin = new Bin(req.body);
  try {
    await bin.save();
    res.status(201).send(bin);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/bins', async (req, res) => {
  try {
    const bins = await Bin.find().populate('shelf');
    res.send(bins);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/bins/:id', async (req, res) => {
  try {
    const bin = await Bin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bin) {
      return res.status(404).send();
    }
    res.send(bin);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/bins/:id', async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) {
      return res.status(404).send();
    }
    res.send(bin);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;