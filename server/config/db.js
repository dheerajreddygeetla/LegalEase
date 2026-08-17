const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('MongoDB URI:', uri);
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        // Remove deprecated options – they are no longer needed
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;