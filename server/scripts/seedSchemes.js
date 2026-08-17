const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('../models/Scheme');

dotenv.config();

// Sample schemes (Indian government schemes)
const schemes = [
    {
        name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        description: 'Income support scheme for small and marginal farmers. Provides ₹6,000 per year in three equal instalments.',
        ministry: 'Ministry of Agriculture',
        state: 'All India',
        benefits: ['₹6,000 per year', 'Direct benefit transfer to bank account'],
        eligibility: {
            ageMin: null,
            ageMax: null,
            incomeMax: null,
            occupation: ['Farmer'],
            education: [],
            category: [],
            isFarmer: true,
        },
        requiredDocuments: ['Aadhaar', 'Bank Account', 'Land Records'],
        applicationProcess: [
            'Visit the PM-KISAN portal',
            'Fill in the application form',
            'Upload required documents',
            'Submit for verification',
            'Receive funds after approval',
        ],
        officialUrl: 'https://pmkisan.gov.in',
    },
    {
        name: 'Pradhan Mantri Awas Yojana (PMAY) - Urban',
        description: 'Housing for All scheme providing affordable housing to urban poor.',
        ministry: 'Ministry of Housing and Urban Affairs',
        state: 'All India',
        benefits: ['Subsidy on home loans', 'Affordable housing options'],
        eligibility: {
            ageMin: 18,
            ageMax: null,
            incomeMax: 300000,
            occupation: [],
            education: [],
            category: ['EWS', 'LIG'],
        },
        requiredDocuments: ['Aadhaar', 'Income Certificate', 'Address Proof'],
        applicationProcess: [
            'Check eligibility on PMAY website',
            'Fill application online or offline',
            'Submit required documents',
            'Wait for approval',
        ],
        officialUrl: 'https://pmaymis.gov.in',
    },
    {
        name: 'National Scholarship Portal (NSP)',
        description: 'Central government scholarship for students from economically weaker sections.',
        ministry: 'Ministry of Education',
        state: 'All India',
        benefits: ['Tuition fee reimbursement', 'Monthly stipend'],
        eligibility: {
            ageMin: 5,
            ageMax: 30,
            incomeMax: 250000,
            occupation: ['Student'],
            education: ['Class 1 to PhD'],
            category: ['SC', 'ST', 'OBC', 'General'],
        },
        requiredDocuments: ['Aadhaar', 'Income Certificate', 'Student ID', 'Bank Account'],
        applicationProcess: [
            'Visit National Scholarship Portal',
            'Register and fill application',
            'Upload documents',
            'Submit online',
            'Track application status',
        ],
        officialUrl: 'https://scholarships.gov.in',
    },
    {
        name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
        description: 'Health insurance scheme providing coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
        ministry: 'Ministry of Health and Family Welfare',
        state: 'All India',
        benefits: ['₹5 lakh health insurance cover per family', 'Cashless treatment'],
        eligibility: {
            ageMin: null,
            ageMax: null,
            incomeMax: null,
            occupation: [],
            education: [],
            category: ['SC', 'ST', 'OBC', 'EWS'],
            isBelowPovertyLine: true,
        },
        requiredDocuments: ['Aadhaar', 'Ration Card', 'Income Certificate'],
        applicationProcess: [
            'Check eligibility on PM-JAY website',
            'Visit nearest empanelled hospital',
            'Get Aadhaar verification done',
            'Receive e-card',
        ],
        officialUrl: 'https://pmjay.gov.in',
    },
    {
        name: 'Skill India - Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
        description: 'Skill training and certification for youth to enhance employability.',
        ministry: 'Ministry of Skill Development and Entrepreneurship',
        state: 'All India',
        benefits: ['Free skill training', 'Certification', 'Placement assistance'],
        eligibility: {
            ageMin: 15,
            ageMax: 35,
            incomeMax: null,
            occupation: ['Student', 'Unemployed'],
            education: ['10th pass'],
            category: [],
        },
        requiredDocuments: ['Aadhaar', 'Educational certificates', 'Bank Account'],
        applicationProcess: [
            'Visit the Skill India portal',
            'Choose a training program',
            'Register online',
            'Attend training sessions',
            'Take assessment and get certified',
        ],
        officialUrl: 'https://pmkvyofficial.org',
    },
    {
        name: 'Telangana Rythu Bandhu',
        description: 'Investment support scheme for farmers in Telangana. Provides ₹5,000 per acre per season.',
        ministry: 'Government of Telangana',
        state: 'Telangana',
        benefits: ['₹5,000 per acre per season', 'Direct benefit transfer'],
        eligibility: {
            ageMin: 18,
            ageMax: null,
            incomeMax: null,
            occupation: ['Farmer'],
            education: [],
            category: [],
            isFarmer: true,
        },
        requiredDocuments: ['Aadhaar', 'Land Records', 'Bank Account'],
        applicationProcess: [
            'Visit Telangana e-KYC portal',
            'Link Aadhaar and land records',
            'Verification by agriculture department',
            'Receive funds directly',
        ],
        officialUrl: 'https://telangana.gov.in/rythubandhu',
    },
    {
        name: 'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)',
        description: 'Guarantees 100 days of wage employment per year to rural households.',
        ministry: 'Ministry of Rural Development',
        state: 'All India',
        benefits: ['100 days of guaranteed work', 'Wages as per schedule'],
        eligibility: {
            ageMin: 18,
            ageMax: null,
            incomeMax: null,
            occupation: ['Rural worker'],
            education: [],
            category: [],
            isRural: true,
        },
        requiredDocuments: ['Aadhaar', 'Job card', 'Bank Account'],
        applicationProcess: [
            'Apply for job card at local panchayat',
            'Get registered on the MGNREGA portal',
            'Request work in writing',
            'Work allotted and wages paid',
        ],
        officialUrl: 'https://nrega.nic.in',
    },
];

const seedSchemes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing schemes (optional)
        await Scheme.deleteMany({});
        console.log('Cleared existing schemes');

        // Insert new schemes
        const inserted = await Scheme.insertMany(schemes);
        console.log(`${inserted.length} schemes inserted successfully`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding schemes:', error);
        process.exit(1);
    }
};

seedSchemes();