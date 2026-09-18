const mongoose = require('mongoose');
const env = require('./env');

// Masks credentials in a Mongo connection string before it is ever logged,
// e.g. mongodb+srv://user:pass@host/db -> mongodb+srv://***:***@host/db
function maskUri(uri) {
    try {
        return uri.replace(/\/\/([^:/?#]+):([^@/?#]+)@/, '//***:***@');
    } catch (_) {
        return '[unparseable URI]';
    }
}

mongoose.set('strictQuery', true);

const connectDB = async () => {
    const uri = env.MONGODB_URI;
    console.log(`🔌 Connecting to MongoDB at ${maskUri(uri)} ...`);

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected.');
    });
    mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected.');
    });

    const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
};

const disconnectDB = async () => {
    await mongoose.connection.close();
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
