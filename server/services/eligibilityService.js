// server/services/eligibilityService.js
const { generateResponse } = require('./aiService');

/**
 * Check eligibility for a specific scheme against a user profile
 * Uses rule-based logic + AI explanation
 */
function checkEligibility(scheme, profile) {
  const eligibility = scheme.eligibility || {};
  const results = {
    passed: [],
    failed: [],
    missing: [],
    score: 0,
    maxScore: 0,
    eligible: false,
    explanation: '',
  };

  // 1. Age check
  if (eligibility.ageMin !== undefined && eligibility.ageMin !== null) {
    results.maxScore += 10;
    if (profile.age >= eligibility.ageMin) {
      results.passed.push(`Age is ${profile.age} (min ${eligibility.ageMin})`);
      results.score += 10;
    } else {
      results.failed.push(`Age ${profile.age} is below minimum ${eligibility.ageMin}`);
    }
  }
  if (eligibility.ageMax !== undefined && eligibility.ageMax !== null) {
    results.maxScore += 10;
    if (profile.age <= eligibility.ageMax) {
      results.passed.push(`Age is ${profile.age} (max ${eligibility.ageMax})`);
      results.score += 10;
    } else {
      results.failed.push(`Age ${profile.age} exceeds maximum ${eligibility.ageMax}`);
    }
  }

  // 2. State check
  if (eligibility.state) {
    results.maxScore += 15;
    if (eligibility.state === 'All India' || eligibility.state === profile.state) {
      results.passed.push(`State matches (${profile.state})`);
      results.score += 15;
    } else {
      results.failed.push(`State ${profile.state} does not match required: ${eligibility.state}`);
    }
  }

  // 3. Occupation
  if (eligibility.occupation && eligibility.occupation.length > 0) {
    results.maxScore += 10;
    if (eligibility.occupation.includes(profile.occupation)) {
      results.passed.push(`Occupation matches (${profile.occupation})`);
      results.score += 10;
    } else {
      results.failed.push(`Occupation ${profile.occupation} not eligible (requires ${eligibility.occupation.join(', ')})`);
    }
  }

  // 4. Income
  if (eligibility.incomeMax !== undefined && eligibility.incomeMax !== null) {
    results.maxScore += 15;
    if (profile.income && profile.income <= eligibility.incomeMax) {
      results.passed.push(`Income ${profile.income} within limit ${eligibility.incomeMax}`);
      results.score += 15;
    } else if (!profile.income) {
      results.missing.push('Income information missing');
    } else {
      results.failed.push(`Income ${profile.income} exceeds limit ${eligibility.incomeMax}`);
    }
  }

  // 5. Category (SC/ST/OBC/General/EWS)
  if (eligibility.category && eligibility.category.length > 0) {
    results.maxScore += 10;
    if (profile.category && eligibility.category.includes(profile.category)) {
      results.passed.push(`Category matches (${profile.category})`);
      results.score += 10;
    } else if (!profile.category) {
      results.missing.push('Category information missing');
    } else {
      results.failed.push(`Category ${profile.category} not eligible (requires ${eligibility.category.join(', ')})`);
    }
  }

  // 6. Education
  if (eligibility.education && eligibility.education.length > 0) {
    results.maxScore += 10;
    if (profile.education) {
      const matched = eligibility.education.some(edu =>
        profile.education.toLowerCase().includes(edu.toLowerCase()) ||
        edu.toLowerCase().includes(profile.education.toLowerCase())
      );
      if (matched) {
        results.passed.push(`Education matches (${profile.education})`);
        results.score += 10;
      } else {
        results.failed.push(`Education ${profile.education} not eligible (requires ${eligibility.education.join(', ')})`);
      }
    } else {
      results.missing.push('Education information missing');
    }
  }

  // 7. Boolean flags
  const flags = ['isFarmer', 'isStudent', 'isRural', 'isBelowPovertyLine'];
  flags.forEach(flag => {
    if (eligibility[flag]) {
      results.maxScore += 5;
      if (profile[flag]) {
        results.passed.push(`${flag} = true`);
        results.score += 5;
      } else if (profile[flag] === undefined) {
        results.missing.push(`${flag} information missing`);
      } else {
        results.failed.push(`${flag} is false but required`);
      }
    }
  });

  // 8. Determine eligibility
  const percentage = results.maxScore > 0 ? (results.score / results.maxScore) * 100 : 0;
  results.eligible = percentage >= 50 && results.failed.length === 0;

  // Generate human-readable explanation
  const status = results.eligible ? '✅ Eligible' :
    results.failed.length > 0 ? '❌ Not Eligible' :
    '⚠️ Potentially Eligible (missing info)';

  const scoreSummary = `Score: ${results.score}/${results.maxScore} (${Math.round(percentage)}%)`;

  let details = [];
  if (results.passed.length > 0) {
    details.push(`✓ ${results.passed.join('\n✓ ')}`);
  }
  if (results.failed.length > 0) {
    details.push(`✗ ${results.failed.join('\n✗ ')}`);
  }
  if (results.missing.length > 0) {
    details.push(`? Missing: ${results.missing.join(', ')}`);
  }

  results.explanation = `${status}\n${scoreSummary}\n\n${details.join('\n')}`;

  return results;
}

/**
 * Generate AI-powered explanation for eligibility (optional enhancement)
 */
async function generateEligibilityExplanation(scheme, profile, results) {
  const prompt = `
    You are a legal expert explaining government scheme eligibility.
    
    Scheme: ${scheme.name}
    Description: ${scheme.description}
    
    User Profile:
    - Age: ${profile.age || 'Not provided'}
    - State: ${profile.state || 'Not provided'}
    - Occupation: ${profile.occupation || 'Not provided'}
    - Income: ${profile.income || 'Not provided'}
    - Category: ${profile.category || 'Not provided'}
    - Education: ${profile.education || 'Not provided'}
    
    Eligibility Results:
    ${results.explanation}
    
    Please provide a simple, friendly explanation in plain language (2-3 sentences).
    Focus on what the user needs to do next.
  `;
  try {
    const response = await generateResponse(prompt);
    return response;
  } catch (error) {
    console.error('AI explanation failed:', error);
    return results.explanation;
  }
}

module.exports = {
  checkEligibility,
  generateEligibilityExplanation,
};