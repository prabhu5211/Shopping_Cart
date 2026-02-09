require('dotenv').config();
const mongoose = require('mongoose');

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('carts');

    // Drop the unique index on user_id
    try {
      await collection.dropIndex('user_id_1');
      console.log('✓ Dropped unique index on user_id');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index does not exist (already dropped)');
      } else {
        throw error;
      }
    }

    console.log('\n✓ Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropIndex();
