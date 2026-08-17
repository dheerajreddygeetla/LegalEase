const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ministry: String,
    state: {
        type: String,
        default: 'All India',
    },
    benefits: [String],
    eligibility: {
        ageMin: Number,
        ageMax: Number,
        incomeMax: Number,
        occupation: [String],
        education: [String],
        category: [String],
        // more fields can be added
    },
    requiredDocuments: [String],
    applicationProcess: [String],
    officialUrl: String,
    lastVerified: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Scheme', schemeSchema);