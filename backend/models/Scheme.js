const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    categoryTag: {
        type: String,
        default: 'General Welfare',
        index: true,
    },
    ministry: {
        type: String,
        default: 'Government of India',
    },
    state: {
        type: String,
        default: 'All India',
        index: true,
    },
    isCentralScheme: {
        type: Boolean,
        default: true,
    },
    financialBenefit: {
        type: String,
        default: '',
    },
    helpline: {
        type: String,
        default: '1800-11-0031',
    },
    benefits: [String],
    eligibility: {
        ageMin: Number,
        ageMax: Number,
        incomeMax: Number,
        gender: {
            type: String,
            default: 'All', // 'All', 'Female', 'Male', 'Transgender'
        },
        occupation: [String],
        education: [String],
        category: [String], // SC, ST, OBC, General, EWS
        isFarmer: Boolean,
        isStudent: Boolean,
        isRural: Boolean,
        isDisability: Boolean,
        isBelowPovertyLine: Boolean,
    },
    requiredDocuments: [String],
    applicationProcess: [String],
    officialUrl: String,
    tags: [String],
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