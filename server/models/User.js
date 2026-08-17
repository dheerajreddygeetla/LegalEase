const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    preferredLanguage: {
        type: String,
        default: 'en',
    },
    state: {
        type: String,
        default: '',
    },
    profile: {
        age: Number,
        occupation: String,
        income: Number,
        education: String,
        category: String,
        isFarmer: Boolean,
        isStudent: Boolean,
        // add more as needed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);