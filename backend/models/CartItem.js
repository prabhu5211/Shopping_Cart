const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
