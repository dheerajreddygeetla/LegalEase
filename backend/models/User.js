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
        select: false, // never return password hash unless explicitly requested
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
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
        gender: String,
        state: String,
        occupation: String,
        income: Number,
        education: String,
        category: String, // SC, ST, OBC, General, EWS
        isFarmer: Boolean,
        isStudent: Boolean,
        isRural: Boolean,
        isDisability: Boolean,
        isBelowPovertyLine: Boolean,
    },
    savedSchemes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);