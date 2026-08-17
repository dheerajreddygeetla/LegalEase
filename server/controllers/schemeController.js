const Scheme = require('../models/Scheme');

/**
 * Get all schemes with optional filters
 * Route: GET /api/schemes
 * Access: Public (or Private? We'll keep public for now)
 */
exports.getAllSchemes = async (req, res) => {
    try {
        const { state, category, q } = req.query;
        const filter = {};

        if (state && state !== 'All India') {
            filter.state = { $in: [state, 'All India'] };
        }
        if (category) {
            filter['eligibility.category'] = { $in: [category] };
        }
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ];
        }

        const schemes = await Scheme.find(filter).sort({ name: 1 });
        res.json({ success: true, data: schemes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get a single scheme by ID
 * Route: GET /api/schemes/:id
 */
exports.getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }
        res.json({ success: true, data: scheme });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get schemes based on user profile (recommendation)
 * Route: POST /api/schemes/recommend
 * Access: Private (user needs to be logged in)
 */
exports.recommendSchemes = async (req, res) => {
    try {
        const { age, state, occupation, income, education, category, isFarmer, isStudent, isRural } = req.body;

        // If user is logged in, we could use the profile from req.user
        // For now, use provided profile or req.user.profile if exists

        const allSchemes = await Scheme.find({});
        const recommended = allSchemes.map(scheme => {
            const eligibility = scheme.eligibility || {};
            let score = 0;
            let reasons = [];
            let missingInfo = [];

            // Age check
            if (eligibility.ageMin !== null && eligibility.ageMin !== undefined) {
                if (age >= eligibility.ageMin) {
                    score += 10;
                } else {
                    reasons.push(`Age below minimum ${eligibility.ageMin}`);
                }
            }
            if (eligibility.ageMax !== null && eligibility.ageMax !== undefined) {
                if (age <= eligibility.ageMax) {
                    score += 10;
                } else {
                    reasons.push(`Age above maximum ${eligibility.ageMax}`);
                }
            }

            // State check
            if (scheme.state === 'All India') {
                score += 10;
            } else if (scheme.state === state) {
                score += 20;
            } else {
                reasons.push(`Scheme not available in your state (${scheme.state})`);
            }

            // Occupation
            if (eligibility.occupation && eligibility.occupation.length) {
                if (eligibility.occupation.includes(occupation)) {
                    score += 15;
                } else {
                    reasons.push(`Occupation not matched (requires ${eligibility.occupation.join(', ')})`);
                }
            }

            // Income
            if (eligibility.incomeMax) {
                if (income <= eligibility.incomeMax) {
                    score += 15;
                } else {
                    reasons.push(`Income exceeds limit (max ${eligibility.incomeMax})`);
                }
            }

            // Category (SC/ST/OBC/General/EWS)
            if (eligibility.category && eligibility.category.length) {
                if (eligibility.category.includes(category)) {
                    score += 10;
                } else {
                    reasons.push(`Category not eligible (requires ${eligibility.category.join(', ')})`);
                }
            }

            // Education
            if (eligibility.education && eligibility.education.length) {
                // Simple matching - if education string matches any in array (partial match)
                const matched = eligibility.education.some(edu => education && education.includes(edu) || edu.includes(education));
                if (matched) {
                    score += 10;
                } else {
                    reasons.push(`Education not matched (requires ${eligibility.education.join(', ')})`);
                }
            }

            // Boolean flags
            if (eligibility.isFarmer && isFarmer) score += 10;
            if (eligibility.isStudent && isStudent) score += 10;
            if (eligibility.isRural && isRural) score += 10;
            if (eligibility.isBelowPovertyLine) {
                // We don't have this data; treat as missing
                missingInfo.push('Poverty line status');
            }

            // Determine eligibility level
            let result = 'Potentially Eligible';
            if (score < 20) result = 'Not Eligible';
            else if (score < 50) result = 'Partially Eligible (need more info)';

            return {
                scheme: {
                    _id: scheme._id,
                    name: scheme.name,
                    description: scheme.description,
                    benefits: scheme.benefits,
                    officialUrl: scheme.officialUrl,
                },
                score,
                result,
                reasons: reasons.slice(0, 3),
                missingInfo,
            };
        });

        // Sort by score descending
        recommended.sort((a, b) => b.score - a.score);

        // Return top matches
        res.json({
            success: true,
            data: recommended.slice(0, 10),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const { checkEligibility } = require('../services/eligibilityService');

/**
 * Check eligibility for a specific scheme based on user profile
 * Route: POST /api/schemes/:id/check-eligibility
 * Access: Private
 */
exports.checkSchemeEligibility = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        // Get profile from request body or from logged-in user
        const profile = req.body.profile || req.user.profile || {};
        if (!profile.age || !profile.state) {
            return res.status(400).json({ success: false, message: 'Profile incomplete: age and state required' });
        }

        const result = checkEligibility(scheme, profile);
        res.json({
            success: true,
            data: {
                scheme: {
                    _id: scheme._id,
                    name: scheme.name,
                    description: scheme.description,
                },
                ...result,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};