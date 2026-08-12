const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/congdoan_portal';

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log(`[MongoDB] Đã kết nối: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('[MongoDB] Lỗi kết nối:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Mất kết nối, đang thử kết nối lại...');
  });
}

module.exports = connectDB;
