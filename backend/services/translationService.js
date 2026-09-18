// server/services/translationService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Indian language mapping
const languageNames = {
  'en': 'English',
  'hi': 'Hindi (हिन्दी)',
  'te': 'Telugu (తెలుగు)',
  'ta': 'Tamil (தமிழ்)',
  'kn': 'Kannada (ಕನ್ನಡ)',
  'mr': 'Marathi (मराठी)',
  'bn': 'Bengali (বাংলা)',
  'gu': 'Gujarati (ગુજરાતી)',
  'ml': 'Malayalam (മലയാളം)',
  'pa': 'Punjabi (ਪੰਜਾਬੀ)',
  'or': 'Odia (ଓଡ଼ିଆ)',
};

// Models confirmed by Google's own API error messages (404s cite these as replacements)
const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.0-flash',
].filter(Boolean);

// Helper timeout
function withTimeout(promise, ms = 15000) {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => reject(new Error('Translation timed out')), ms);
  });
  return Promise.race([
    promise.then(
      (res) => { clearTimeout(timerId); return res; },
      (err) => { clearTimeout(timerId); throw err; }
    ),
    timeoutPromise,
  ]);
}

/**
 * Translate legal text to target regional Indian language using Gemini
 * Preserves legal terminology, section numbers, and monetary figures accurately.
 */
async function translateText(text, targetLang) {
  if (!text || !targetLang || targetLang === 'en') return text;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return text;

  const genAI = new GoogleGenerativeAI(apiKey);
  const languageName = languageNames[targetLang] || targetLang;

  const prompt = `You are a professional legal translator specializing in Indian legal acts, rights, and government schemes.
Translate the following legal text accurately into ${languageName}.
Rules:
- Output ONLY the translated text, with no explanations, disclaimers, or intro phrases.
- Retain official Act names, Section numbers (e.g. "Section 12", "RTI Act"), and statutory figures (₹ amounts) clearly.
- Keep the tone respectful, clear, and easy for ordinary citizens to read.

Text to translate:
${text}`;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      });

      const result = await withTimeout(model.generateContent(prompt), 15000);
      const response = await result.response;
      const translated = response.text().trim();
      if (translated) {
        return translated;
      }
    } catch (err) {
      console.warn(`Translation attempt with ${modelName} failed: ${err.message}`);
    }
  }

  // Fallback to original text if all translation models fail
  return text;
}

module.exports = {
  translateText,
  supportedLanguages: languageNames,
};