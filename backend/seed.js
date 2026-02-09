require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear ALL existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    await Cart.deleteMany({});
    await CartItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared all existing data');

    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      username: 'testuser',
      password: hashedPassword
    });
    console.log('Created user:', user.username);

    // Create sample items with images
    const items = await Item.insertMany([
      { 
        name: 'Laptop', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
      },
      { 
        name: 'Smartphone', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      },
      { 
        name: 'Headphones', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      },
      { 
        name: 'Keyboard', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'
      },
      { 
        name: 'Mouse', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
      },
      { 
        name: 'Monitor', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
      },
      { 
        name: 'Webcam', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400'
      },
      { 
        name: 'USB Cable', 
        status: 'active',
        image: 'https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=400'
      }
    ]);
    console.log(`Created ${items.length} items with images`);

    console.log('\n✓ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('\nAll items now have images and quantity support!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
