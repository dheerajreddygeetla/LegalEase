const Scheme = require('../models/Scheme');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const {
    evaluateSchemeEligibility,
    generateEligibilityExplanation,
} = require('../services/eligibilityService');

// Escapes regex metacharacters in user-supplied search input before it is
// used to build a MongoDB $regex filter. Without this, a query string like
// "(a+)+$" could trigger catastrophic backtracking (ReDoS) against the
// scheme collection.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Get all schemes with advanced multi-facet filters (paginated)
 * Route: GET /api/schemes
 * Access: Public
 */
exports.getAllSchemes = asyncHandler(async (req, res) => {
    const { state, category, ministry, gender, occupation, isBpl, maxIncome, q, sort } = req.query;
    const andConditions = [];

    if (state && state !== 'All India' && state !== 'All') {
        andConditions.push({ state: { $in: [state, 'All India'] } });
    }

    if (category && category !== 'All') {
        andConditions.push({ categoryTag: category });
    }

    if (ministry && ministry !== 'All') {
        andConditions.push({ ministry: { $regex: escapeRegex(ministry), $options: 'i' } });
    }

    if (gender && gender !== 'All') {
        andConditions.push({
            $or: [
                { 'eligibility.gender': 'All' },
                { 'eligibility.gender': gender },
                { 'eligibility.gender': { $exists: false } },
            ],
        });
    }

    if (occupation && occupation !== 'All') {
        andConditions.push({ 'eligibility.occupation': { $in: [occupation] } });
    }

    if (isBpl === 'true') {
        andConditions.push({ 'eligibility.isBelowPovertyLine': true });
    }

    if (maxIncome && !isNaN(maxIncome) && String(maxIncome).trim() !== '') {
        andConditions.push({
            $or: [
                { 'eligibility.incomeMax': { $gte: Number(maxIncome) } },
                { 'eligibility.incomeMax': null },
                { 'eligibility.incomeMax': { $exists: false } },
            ],
        });
    }

    if (q && q.trim()) {
        const queryRegex = { $regex: escapeRegex(q.trim()), $options: 'i' };
        andConditions.push({
            $or: [
                { name: queryRegex },
                { description: queryRegex },
                { categoryTag: queryRegex },
                { ministry: queryRegex },
                { benefits: queryRegex },
                { tags: queryRegex },
            ],
        });
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    let sortOption = { name: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'state') sortOption = { state: 1, name: 1 };
    if (sort === 'ministry') sortOption = { ministry: 1, name: 1 };

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [schemes, total] = await Promise.all([
        Scheme.find(filter).sort(sortOption).skip(skip).limit(limit),
        Scheme.countDocuments(filter),
    ]);

    res.json({
        success: true,
        count: schemes.length,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: schemes,
    });
});

/**
 * Get distinct categories and scheme count metadata
 * Route: GET /api/schemes/categories
 */
exports.getSchemeCategories = asyncHandler(async (req, res) => {
    const categories = await Scheme.aggregate([
        { $group: { _id: '$categoryTag', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
    res.json({
        success: true,
        data: categories.map((c) => ({ name: c._id || 'General', count: c.count })),
    });
});

/**
 * Get distinct states list
 * Route: GET /api/schemes/states
 */
exports.getSchemeStates = asyncHandler(async (req, res) => {
    const states = await Scheme.distinct('state');
    res.json({ success: true, data: states.filter(Boolean).sort() });
});

/**
 * Get a single scheme by ID
 * Route: GET /api/schemes/:id
 */
exports.getSchemeById = asyncHandler(async (req, res) => {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
        throw ApiError.notFound('Scheme not found');
    }
    res.json({ success: true, data: scheme });
});

/**
 * Get scheme recommendations based on detailed user profile
 * Route: POST /api/schemes/recommend
 * Access: Public / Protected
 */
exports.recommendSchemes = asyncHandler(async (req, res) => {
    const {
        age,
        gender,
        state,
        occupation,
        income,
        education,
        category, // SC, ST, OBC, General, EWS
        isFarmer,
        isStudent,
        isRural,
        isDisability,
        isBelowPovertyLine,
    } = req.body || {};

    const allSchemes = await Scheme.find({});
    const numAge = (age !== undefined && age !== null && age !== '') ? Number(age) : null;
    const numIncome = (income !== undefined && income !== null && income !== '') ? Number(income) : null;

    const evaluated = allSchemes.map((scheme) => {
        const el = scheme.eligibility || {};
        let score = 0;
        let maxPossible = 0;
        const advantages = [];
        const disqualifiedReasons = [];

        // 1. State Criteria (Weight 20)
        maxPossible += 20;
        if (scheme.state === 'All India') {
            score += 20;
            advantages.push('Applicable nationwide across all states & UTs');
        } else if (state && scheme.state.toLowerCase() === state.toLowerCase()) {
            score += 20;
            advantages.push(`Specifically targeted for residents of ${scheme.state}`);
        } else if (state) {
            disqualifiedReasons.push(`Restricted to ${scheme.state} (your profile state is ${state})`);
        } else {
            score += 10;
        }

        // 2. Age Criteria (Weight 15)
        if ((el.ageMin !== undefined && el.ageMin !== null) || (el.ageMax !== undefined && el.ageMax !== null)) {
            maxPossible += 15;
            let ageOk = true;
            if (numAge !== null) {
                if (el.ageMin && numAge < el.ageMin) {
                    ageOk = false;
                    disqualifiedReasons.push(`Requires minimum age of ${el.ageMin} (current: ${numAge})`);
                }
                if (el.ageMax && numAge > el.ageMax) {
                    ageOk = false;
                    disqualifiedReasons.push(`Requires maximum age of ${el.ageMax} (current: ${numAge})`);
                }
                if (ageOk) {
                    score += 15;
                    advantages.push(`Age (${numAge}) falls within eligible window (${el.ageMin || 0} - ${el.ageMax || 'No Limit'})`);
                }
            } else {
                score += 7; // Neutral
            }
        }

        // 3. Gender Criteria (Weight 10)
        if (el.gender && el.gender !== 'All') {
            maxPossible += 10;
            if (gender && gender.toLowerCase() === el.gender.toLowerCase()) {
                score += 10;
                advantages.push(`Exclusive priority benefit for ${el.gender} beneficiaries`);
            } else if (gender) {
                disqualifiedReasons.push(`Targeted exclusively for ${el.gender} applicants`);
            }
        }

        // 4. Income Limit (Weight 20)
        if (el.incomeMax) {
            maxPossible += 20;
            if (numIncome !== null) {
                if (numIncome <= el.incomeMax) {
                    score += 20;
                    advantages.push(`Annual income (₹${numIncome.toLocaleString('en-IN')}) is within statutory ceiling (₹${el.incomeMax.toLocaleString('en-IN')})`);
                } else {
                    disqualifiedReasons.push(`Income exceeds cap of ₹${el.incomeMax.toLocaleString('en-IN')}/year`);
                }
            } else {
                score += 10;
            }
        }

        // 5. Social Category (Weight 15)
        if (el.category && el.category.length > 0) {
            maxPossible += 15;
            if (category && el.category.includes(category)) {
                score += 15;
                advantages.push(`Category '${category}' fully matches priority affirmative action criteria`);
            } else if (category) {
                if (!el.category.includes('General')) {
                    disqualifiedReasons.push(`Requires category: ${el.category.join(', ')}`);
                } else {
                    score += 10;
                }
            }
        }

        // 6. Specific Attributes (Occupation / Flags) (Weight 20)
        maxPossible += 20;
        let attributePoints = 0;

        if (el.isFarmer && isFarmer) {
            attributePoints += 10;
            advantages.push('Verified Farmer / Agriculturalist priority entitlement');
        }
        if (el.isStudent && isStudent) {
            attributePoints += 10;
            advantages.push('Student / Higher Education beneficiary match');
        }
        if (el.isBelowPovertyLine && isBelowPovertyLine) {
            attributePoints += 10;
            advantages.push('BPL / Priority Ration Card holder statutory entitlement');
        }
        if (el.isDisability && isDisability) {
            attributePoints += 10;
            advantages.push('Divyangjan / Persons with Disabilities quota matched');
        }
        if (el.isRural && isRural) {
            attributePoints += 5;
            advantages.push('Rural residency affirmative action entitlement');
        }
        if (el.occupation && el.occupation.length > 0) {
            if (occupation && el.occupation.some((occ) => occ.toLowerCase() === occupation.toLowerCase())) {
                attributePoints += 10;
                advantages.push(`Occupation matches scheme focus (${occupation})`);
            }
        }

        score += Math.min(attributePoints, 20);

        const percentage = maxPossible > 0 ? Math.min(100, Math.round((score / maxPossible) * 100)) : 80;

        let status = 'High Match';
        if (disqualifiedReasons.length > 0) {
            status = 'Potentially Ineligible';
        } else if (percentage < 50) {
            status = 'Partial Match';
        } else if (percentage >= 80) {
            status = 'Directly Eligible';
        }

        return {
            scheme,
            matchPercentage: percentage,
            status,
            advantages: advantages.slice(0, 4),
            disqualifiedReasons: disqualifiedReasons.slice(0, 3),
        };
    });

    evaluated.sort((a, b) => {
        if (a.disqualifiedReasons.length === 0 && b.disqualifiedReasons.length > 0) return -1;
        if (b.disqualifiedReasons.length === 0 && a.disqualifiedReasons.length > 0) return 1;
        return b.matchPercentage - a.matchPercentage;
    });

    res.json({
        success: true,
        totalEvaluated: evaluated.length,
        data: evaluated,
    });
});

/**
 * Check comprehensive eligibility for a specific scheme
 * Route: POST /api/schemes/:id/check-eligibility
 * Optional body.includeAiExplanation=true for Gemini plain-language summary
 */
exports.checkSchemeEligibility = asyncHandler(async (req, res) => {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
        throw ApiError.notFound('Scheme not found');
    }

    const profile = req.body || {};
    const results = evaluateSchemeEligibility(scheme, profile);

    let aiExplanation = null;
    if (profile.includeAiExplanation === true || profile.includeAiExplanation === 'true') {
        aiExplanation = await generateEligibilityExplanation(scheme, profile, results);
    }

    res.json({
        success: true,
        data: {
            schemeId: scheme._id,
            schemeName: scheme.name,
            isEligible: results.isEligible,
            status: results.status,
            matchPercentage: results.matchPercentage,
            checks: results.checks,
            explanation: results.explanation,
            aiExplanation,
            requiredDocuments: scheme.requiredDocuments || [],
            applicationProcess: scheme.applicationProcess || [],
            officialUrl: scheme.officialUrl || '',
            financialBenefit: scheme.financialBenefit || '',
            helpline: scheme.helpline || '',
        },
    });
});

/**
 * Toggle bookmark/save for a scheme
 * Route: POST /api/schemes/:id/bookmark
 * Access: Private
 */
exports.toggleBookmark = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const schemeId = req.params.id;

    // Confirm the scheme actually exists before saving a dangling reference.
    const schemeExists = await Scheme.exists({ _id: schemeId });
    if (!schemeExists) {
        throw ApiError.notFound('Scheme not found');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const isSaved = user.savedSchemes.some((id) => id.toString() === schemeId);

    if (isSaved) {
        user.savedSchemes = user.savedSchemes.filter((id) => id.toString() !== schemeId);
    } else {
        user.savedSchemes.push(schemeId);
    }

    await user.save();

    res.json({
        success: true,
        isBookmarked: !isSaved,
        savedSchemes: user.savedSchemes,
        message: !isSaved ? 'Scheme saved to your profile' : 'Scheme removed from saved list',
    });
});

/**
 * Get all bookmarked schemes for logged-in user
 * Route: GET /api/schemes/user/bookmarked
 * Access: Private
 */
exports.getBookmarkedSchemes = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('savedSchemes');
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    res.json({
        success: true,
        count: user.savedSchemes.length,
        data: user.savedSchemes,
    });
});
