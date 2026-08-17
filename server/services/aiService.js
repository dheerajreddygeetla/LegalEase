// server/services/aiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY is not set');
}
const genAI = new GoogleGenerativeAI(apiKey || '');

// ✅ Models confirmed available from your list
const MODEL_NAMES = [
  'gemini-2.5-flash',      // Fast, good for chat & summarization
  'gemini-2.5-pro',        // More capable
  'gemini-flash-latest',   // Alias fallback
];

// Generate with fallback
async function generateWithFallback(prompt, context = '') {
  let lastError = null;
  for (const modelName of MODEL_NAMES) {
    try {
      console.log(`🔄 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      let fullPrompt = prompt;
      if (context) {
        fullPrompt = `Context information:\n${context}\n\nBased on the above context, answer this question: ${prompt}`;
      }

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      console.log(`✅ Model ${modelName} succeeded`);
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }
  throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

// Summarize with fallback
async function summarizeWithFallback(text) {
  let lastError = null;
  const prompt = `
    You are a legal document summarizer. Summarize the following document in simple language.
    Focus on: document type, important parties, key dates, financial terms, obligations, risk areas.
    Document text:
    ${text.substring(0, 15000)}
    Provide a structured summary with clear headings.
  `;
  for (const modelName of MODEL_NAMES) {
    try {
      console.log(`🔄 Trying model for summarization: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(`✅ Model ${modelName} succeeded for summarization`);
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed for summarization: ${error.message}`);
      lastError = error;
      continue;
    }
  }
  throw new Error(`All models failed for summarization. Last error: ${lastError?.message}`);
}

module.exports = {
  generateResponse: generateWithFallback,
  summarizeDocument: summarizeWithFallback,
};