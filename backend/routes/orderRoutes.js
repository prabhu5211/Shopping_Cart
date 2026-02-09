const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const auth = require('../middleware/auth');

// POST /api/orders - Convert cart to order (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { cart_id } = req.body;

    console.log('Create order request:', { cart_id, user: req.user._id });

    if (!cart_id) {
      return res.status(400).send({ error: 'Cart ID is required' });
    }

    // Find cart
    const cart = await Cart.findById(cart_id);
    if (!cart) {
      console.log('Cart not found:', cart_id);
      return res.status(404).send({ error: 'Cart not found' });
    }

    // Verify cart belongs to user
    if (cart.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Unauthorized access to cart' });
    }

    // Check if cart is already ordered
    if (cart.status === 'ordered') {
      return res.status(400).send({ error: 'Cart already converted to order' });
    }

    // Check if cart has items
    const cartItems = await CartItem.find({ cart_id: cart._id });
    if (cartItems.length === 0) {
      return res.status(400).send({ error: 'Cannot create order from empty cart' });
    }

    // Create order
    const order = new Order({
      cart_id: cart._id,
      user_id: req.user._id
    });
    await order.save();

    // Update cart status to ordered
    cart.status = 'ordered';
    await cart.save();

    console.log('Order created successfully:', order._id);
    res.status(201).send({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: 'Error creating order' });
  }
});

// GET /api/orders - List all orders for authenticated user (Protected)
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user._id);
    
    const orders = await Order.find({ user_id: req.user._id })
      .populate('cart_id')
      .sort({ created_at: -1 });
    
    // Fetch cart items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const cartItems = await CartItem.find({ cart_id: order.cart_id })
          .populate('item_id');
        
        // Ensure all items have quantity (default to 1 for old items)
        const itemsWithQuantity = cartItems.map(item => ({
          ...item.toObject(),
          quantity: item.quantity || 1
        }));
        
        return {
          ...order.toObject(),
          items: itemsWithQuantity
        };
      })
    );
    
    console.log('Found orders:', ordersWithItems.length);
    res.send(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ error: 'Error fetching orders' });
  }
});

module.exports = router;
