require('dotenv').config();
const mongoose = require('mongoose');
const CartItem = require('./models/CartItem');

const fixQuantities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all cart items without quantity to have quantity = 1
    const result = await CartItem.updateMany(
      { quantity: { $exists: false } },
      { $set: { quantity: 1 } }
    );

    console.log(`Updated ${result.modifiedCount} cart items with default quantity`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing quantities:', error);
    process.exit(1);
  }
};

fixQuantities();
