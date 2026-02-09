const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// POST /api/items - Create new item
router.post('/', async (req, res) => {
  try {
    const { name, status, image } = req.body;

    if (!name) {
      return res.status(400).send({ error: 'Item name is required' });
    }

    const item = new Item({
      name,
      image: image || null,
      status: status || 'active'
    });

    await item.save();
    res.status(201).send({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).send({ error: 'Error creating item' });
  }
});

// GET /api/items - List all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ status: 'active' });
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching items' });
  }
});

module.exports = router;
