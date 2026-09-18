// services/eligibilityService.js
const { generateResponse } = require('./aiService');

/**
 * Build structured eligibility checks for a scheme against a user profile.
 * Returns the same shape the Schemes UI expects: { isEligible, checks, ...meta }.
 */
function evaluateSchemeEligibility(scheme, profile = {}) {
    const el = scheme.eligibility || {};
    const checks = [];
    let hardFails = 0;
    let softMissing = 0;
    let score = 0;
    let maxScore = 0;

    const hasValue = (v) => v !== undefined && v !== null && v !== '';

    // Age window
    if (el.ageMin != null || el.ageMax != null) {
        maxScore += 15;
        const hasAge = hasValue(profile.age);
        const age = Number(profile.age);
        let passed = true;
        if (hasAge) {
            if (el.ageMin != null && age < el.ageMin) passed = false;
            if (el.ageMax != null && age > el.ageMax) passed = false;
            if (passed) score += 15;
            else hardFails += 1;
        } else {
            softMissing += 1;
            score += 7;
        }
        checks.push({
            criterion: 'Age Window',
            passed: hasAge ? passed : true,
            note: `Requirement: ${el.ageMin ?? 0} to ${el.ageMax ?? 'No Limit'} years.`,
            value: hasAge ? `${age} years` : 'Not Provided',
        });
    }

    // State jurisdiction
    maxScore += 20;
    if (scheme.state && scheme.state !== 'All India') {
        const passed = profile.state
            ? profile.state.toLowerCase() === scheme.state.toLowerCase()
            : false;
        if (passed) score += 20;
        else hardFails += 1;
        checks.push({
            criterion: 'State Jurisdiction',
            passed,
            note: `Requires permanent residency in ${scheme.state}.`,
            value: profile.state || 'Not Provided',
        });
    } else {
        score += 20;
        checks.push({
            criterion: 'State Jurisdiction',
            passed: true,
            note: 'Applicable throughout all Indian states & Union Territories.',
            value: profile.state || 'All India',
        });
    }

    // Income ceiling
    if (el.incomeMax) {
        maxScore += 20;
        const hasIncome = hasValue(profile.income);
        const income = Number(profile.income);
        let passed = true;
        if (hasIncome && income > el.incomeMax) {
            passed = false;
            hardFails += 1;
        } else if (hasIncome) {
            score += 20;
        } else {
            softMissing += 1;
            score += 10;
        }
        checks.push({
            criterion: 'Annual Income Ceiling',
            passed,
            note: `Annual income must not exceed ₹${Number(el.incomeMax).toLocaleString('en-IN')}.`,
            value: hasIncome ? `₹${income.toLocaleString('en-IN')}` : 'Not Provided',
        });
    }

    // Gender
    if (el.gender && el.gender !== 'All') {
        maxScore += 10;
        const hasGender = !!profile.gender;
        const passed = hasGender
            ? profile.gender.toLowerCase() === el.gender.toLowerCase()
            : true;
        if (hasGender && !passed) hardFails += 1;
        else if (hasGender) score += 10;
        else {
            softMissing += 1;
            score += 5;
        }
        checks.push({
            criterion: 'Target Gender',
            passed,
            note: `Exclusively designed for ${el.gender} beneficiaries.`,
            value: profile.gender || 'Not Provided',
        });
    }

    // Social category
    if (el.category && el.category.length > 0) {
        maxScore += 15;
        const hasCategory = !!profile.category;
        let passed = true;
        if (hasCategory) {
            passed = el.category.includes(profile.category);
            if (!passed && !el.category.includes('General')) hardFails += 1;
            else if (passed) score += 15;
            else score += 10;
        } else {
            softMissing += 1;
            score += 7;
        }
        checks.push({
            criterion: 'Social Affirmative Category',
            passed,
            note: `Eligible categories: ${el.category.join(', ')}`,
            value: profile.category || 'Not Provided',
        });
    }

    // Boolean entitlement flags
    const flagChecks = [
        {
            key: 'isBelowPovertyLine',
            criterion: 'BPL / Antyodaya Status',
            note: 'Requires Below Poverty Line / Priority Household certificate.',
            trueLabel: 'Yes (BPL Verified)',
        },
        {
            key: 'isFarmer',
            criterion: 'Agricultural Status',
            note: 'Requires land ownership or registered tenant farmer status.',
            trueLabel: 'Yes (Farmer)',
        },
        {
            key: 'isStudent',
            criterion: 'Student Enrollment',
            note: 'Requires active enrollment in recognized educational institution.',
            trueLabel: 'Yes (Student)',
        },
        {
            key: 'isDisability',
            criterion: 'Divyangjan / Disability Quota',
            note: 'Requires UDID or certificate of benchmark disability (40%+).',
            trueLabel: 'Yes (UDID / Disability)',
        },
        {
            key: 'isRural',
            criterion: 'Rural Residency',
            note: 'Applicant must reside in a notified Gram Panchayat / rural sector.',
            trueLabel: 'Yes (Rural Resident)',
        },
    ];

    flagChecks.forEach(({ key, criterion, note, trueLabel }) => {
        if (!el[key]) return;
        maxScore += 10;
        const provided = profile[key] !== undefined && profile[key] !== null;
        const passed = !!profile[key];
        if (passed) score += 10;
        else if (provided) hardFails += 1;
        else {
            softMissing += 1;
            hardFails += 1;
        }
        checks.push({
            criterion,
            passed,
            note,
            value: passed ? trueLabel : 'No / Not Provided',
        });
    });

    // Occupation
    if (el.occupation && el.occupation.length > 0) {
        maxScore += 10;
        const hasOcc = !!profile.occupation;
        const passed = hasOcc
            ? el.occupation.some(
                (occ) => occ.toLowerCase() === String(profile.occupation).toLowerCase()
            )
            : true;
        if (hasOcc && !passed) hardFails += 1;
        else if (hasOcc) score += 10;
        else {
            softMissing += 1;
            score += 5;
        }
        checks.push({
            criterion: 'Eligible Occupation',
            passed,
            note: `Targeted professions: ${el.occupation.join(', ')}`,
            value: profile.occupation || 'Not Specified',
        });
    }

    // Education (informational when scheme specifies it)
    if (el.education && el.education.length > 0) {
        maxScore += 10;
        const hasEdu = !!profile.education;
        let passed = true;
        if (hasEdu) {
            passed = el.education.some(
                (edu) =>
                    profile.education.toLowerCase().includes(edu.toLowerCase()) ||
                    edu.toLowerCase().includes(profile.education.toLowerCase())
            );
            if (passed) score += 10;
            else hardFails += 1;
        } else {
            softMissing += 1;
            score += 5;
        }
        checks.push({
            criterion: 'Education Requirement',
            passed: hasEdu ? passed : true,
            note: `Required education: ${el.education.join(', ')}`,
            value: profile.education || 'Not Provided',
        });
    }

    const matchPercentage =
        maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 100;
    const isEligible = hardFails === 0;

    let status = 'Directly Eligible';
    if (!isEligible) status = 'Potentially Ineligible';
    else if (softMissing > 0) status = 'Potentially Eligible (missing info)';
    else if (matchPercentage < 80) status = 'Partial Match';

    const explanationParts = [
        isEligible ? '✅ Eligible' : '❌ Not Eligible',
        `Score: ${score}/${maxScore} (${matchPercentage}%)`,
    ];
    const failed = checks.filter((c) => !c.passed).map((c) => c.criterion);
    const passed = checks.filter((c) => c.passed).map((c) => c.criterion);
    if (passed.length) explanationParts.push(`✓ ${passed.join(', ')}`);
    if (failed.length) explanationParts.push(`✗ ${failed.join(', ')}`);

    return {
        isEligible,
        checks,
        matchPercentage,
        score,
        maxScore,
        status,
        softMissing,
        explanation: explanationParts.join('\n'),
    };
}

/**
 * Optional Gemini-powered plain-language explanation. Never throws —
 * falls back to the rule-based explanation on any AI failure.
 */
async function generateEligibilityExplanation(scheme, profile, results) {
    const prompt = `You are a legal expert explaining Indian government scheme eligibility in plain language.

Scheme: ${scheme.name}
Description: ${scheme.description || 'N/A'}

User Profile:
- Age: ${profile.age ?? 'Not provided'}
- State: ${profile.state ?? 'Not provided'}
- Occupation: ${profile.occupation ?? 'Not provided'}
- Income: ${profile.income ?? 'Not provided'}
- Category: ${profile.category ?? 'Not provided'}
- Education: ${profile.education ?? 'Not provided'}

Eligibility Results:
${results.explanation}

Provide a friendly 2-3 sentence explanation focused on what the citizen should do next.
Do not invent eligibility rules that are not already in the results above.`;

    try {
        return await generateResponse(prompt);
    } catch (error) {
        console.warn('AI eligibility explanation skipped:', error.message);
        return results.explanation;
    }
}

module.exports = {
    evaluateSchemeEligibility,
    checkEligibility: evaluateSchemeEligibility, // backward-compatible alias
    generateEligibilityExplanation,
};
