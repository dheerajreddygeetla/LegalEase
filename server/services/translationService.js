// server/services/translationService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Language code to name mapping
const languageNames = {
  'en': 'English',
  'hi': 'Hindi',
  'te': 'Telugu'
};

// Translate text to target language using Gemini
async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const languageName = languageNames[targetLang] || targetLang;
    const prompt = `Translate the following text to ${languageName}. Only output the translation, nothing else. Do not include any explanations or additional text.\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();
    console.log(`Translated to ${targetLang}:`, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // fallback to original
  }
}

module.exports = { translateText };