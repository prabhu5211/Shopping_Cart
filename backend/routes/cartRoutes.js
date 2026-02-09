const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// POST /api/carts - Add items to cart (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { item_id } = req.body;

    console.log('Add to cart request:', { item_id, user: req.user._id });

    if (!item_id) {
      return res.status(400).send({ error: 'Item ID is required' });
    }

    // Check if item exists
    const item = await Item.findById(item_id);
    if (!item) {
      console.log('Item not found:', item_id);
      return res.status(404).send({ error: 'Item not found' });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user_id: req.user._id, status: 'active' });
    
    if (!cart) {
      console.log('Creating new cart for user:', req.user._id);
      
      // Simply create a new cart (don't delete old ones - they're needed for order history)
      cart = new Cart({
        user_id: req.user._id,
        name: 'My Cart',
        status: 'active'
      });
      await cart.save();

      // Update user's cart_id
      req.user.cart_id = cart._id;
      await req.user.save();
    }

    // Check if item already in cart
    const existingCartItem = await CartItem.findOne({ cart_id: cart._id, item_id });
    if (existingCartItem) {
      return res.status(400).send({ error: 'Item already in cart' });
    }

    // Add item to cart
    const cartItem = new CartItem({
      cart_id: cart._id,
      item_id
    });
    await cartItem.save();

    console.log('Item added to cart successfully');
    res.status(201).send({ message: 'Item added to cart', cart, cartItem });
  } catch (error) {
    console.error('Error in add to cart:', error);
    res.status(500).send({ error: 'Error adding item to cart' });
  }
});

// GET /api/carts - List all carts (or user's cart if authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id, status: 'active' });
    
    if (!cart) {
      return res.send({ cart: null, items: [] });
    }

    const cartItems = await CartItem.find({ cart_id: cart._id }).populate('item_id');
    
    res.send({ cart, items: cartItems });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching cart' });
  }
});

// PUT /api/carts/:cartItemId - Update cart item quantity (Protected)
router.put('/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).send({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await CartItem.findById(cartItemId).populate('cart_id');
    
    if (!cartItem) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    // Verify cart belongs to user
    if (cartItem.cart_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.send({ message: 'Quantity updated', cartItem });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).send({ error: 'Error updating quantity' });
  }
});

// DELETE /api/carts/:cartItemId - Remove item from cart (Protected)
router.delete('/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findById(cartItemId).populate('cart_id');
    
    if (!cartItem) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    // Verify cart belongs to user
    if (cartItem.cart_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    await CartItem.findByIdAndDelete(cartItemId);

    res.send({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).send({ error: 'Error removing item' });
  }
});

module.exports = router;
