// server/services/aiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }
  return new GoogleGenerativeAI(key);
}

// Models confirmed by Google's own API error messages (404s cite these as replacements)
// gemini-3.5-flash-lite listed first as it's the most consistently available
const MODEL_NAMES = [
  process.env.GEMINI_MODEL,
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.0-flash',
].filter(Boolean);

// Generation config for focused, faster responses
const GENERATION_CONFIG = {
  temperature: 0.25,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

// System prompt for Indian legal context
const LEGAL_SYSTEM_PROMPT = `You are LegalEase AI, an expert legal assistant specializing in Indian law. 
You provide accurate, structured, and practical legal guidance grounded in Indian statutes, acts, regulations, and case law precedents.
When answering:
- Be structured and clear: use bullet points or numbered lists for procedural steps
- Always cite the relevant Indian Act, Section, or Scheme accurately (e.g., "Under Section 12 of the Consumer Protection Act, 2019...", "As per Section 138 of the Negotiable Instruments Act, 1881...", "Under the Bharatiya Nyaya Sanhita (BNS), 2023...")
- Highlight time-bound limitation periods and dispute escalation forums (District Consumer Commission, RERA Tribunal, DLSA, High Court, Labour Commissioner)
- Clarify when a question requires a locally licensed advocate for jurisdiction-specific litigation
- Do NOT fabricate case laws; reference real, recognized statutory provisions
- Keep responses citizen-centric, empowering, and actionable for Indian citizens`;

// Safe timeout wrapper: clears timer on resolution to prevent memory & handle leaks
function withTimeout(promise, ms = 30000) {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error('AI response timed out. Please try again.'));
    }, ms);
  });

  return Promise.race([
    promise.then(
      (res) => {
        clearTimeout(timerId);
        return res;
      },
      (err) => {
        clearTimeout(timerId);
        throw err;
      }
    ),
    timeoutPromise,
  ]);
}

/**
 * Generate AI legal response with multi-model fallback and conversational memory
 * @param {string} prompt - Current user query
 * @param {string} context - Retrieved RAG context (statutes, acts, scheme rules)
 * @param {Array<{role: string, content: string}>} conversationHistory - Prior conversation turns
 */
async function generateWithFallback(prompt, context = '', conversationHistory = []) {
  let lastError = null;

  // Build prompt incorporating history and context
  let promptParts = [];

  if (context && context.trim()) {
    promptParts.push(`--- RELEVANT INDIAN LEGAL STATUTES & SCHEME CONTEXT ---\n${context.trim()}\n------------------------------------------------------`);
  }

  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    const historyText = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    promptParts.push(`--- RECENT CONVERSATION HISTORY ---\n${historyText}\n----------------------------------`);
  }

  promptParts.push(`User Query:\n${prompt}`);
  const fullPrompt = promptParts.join('\n\n');
  const genAI = getGenAI();

  for (const modelName of MODEL_NAMES) {
    // Retry once with a short delay on 503 (model exists but is temporarily overloaded)
    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: GENERATION_CONFIG,
          systemInstruction: LEGAL_SYSTEM_PROMPT,
        });

        const result = await withTimeout(model.generateContent(fullPrompt), 30000);
        const response = await result.response;
        return response.text();
      } catch (error) {
        const is503 = error.message && error.message.includes('503');
        const is404 = error.message && error.message.includes('404');

        if (is404) {
          // Model doesn't exist — skip immediately, no retry
          console.warn(`⚠️ Model ${modelName} not found (404), skipping.`);
          lastError = error;
          break;
        }

        if (is503 && attempt < maxAttempts) {
          // Model exists but busy — wait 500ms and retry once
          console.warn(`⚠️ Model ${modelName} busy (503), retrying in 500ms...`);
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }

        console.warn(`⚠️ Model ${modelName} failed: ${error.message}`);
        lastError = error;
        break;
      }
    }
  }

  console.error('All AI models failed. Last error:', lastError?.message);
  throw new Error(`AI legal service is temporarily unavailable. Please try again shortly.`);
}

/**
 * Summarize and analyze legal documents with deep clause extraction
 * @param {string} text - Extracted document text
 */
async function summarizeWithFallback(text) {
  let lastError = null;

  const prompt = `You are an expert legal document analyst specializing in Indian corporate, civil, property, and consumer law.
Analyze the following legal document thoroughly and provide a structured, high-accuracy analysis with these clear markdown sections:

### 1. Document Identity & Purpose
- Document Type (e.g., Residential Lease Agreement, Service Contract, Employment Agreement, NDA)
- Primary Objective and governing law jurisdiction

### 2. Parties Involved
- Identification of all executing parties, designations, and addresses (if mentioned)

### 3. Key Financial Terms & Considerations
- Monetary amounts, security deposits, payment schedules, interest, and late payment penalties

### 4. Critical Dates & Deadlines
- Commencement date, expiration, renewal notice windows, and cure periods

### 5. Rights & Core Obligations
- What each party is legally mandated to perform or refrain from doing

### 6. Risk Assessment & Unfavorable Clauses
- Identify one-sided indemnity clauses, unreasonable non-compete/lock-in terms, unilateral termination rights, or problematic dispute resolution venues

### 7. Citizen Guidance & Actionable Recommendations
- Concrete, plain-language legal advice on what to verify or renegotiate under relevant Indian laws (e.g., Model Tenancy Act, Indian Contract Act 1872, Consumer Protection Act)

Document Excerpt:
${text.substring(0, 14000)}

Deliver a clear, professional, plain-language analysis for an Indian citizen or business owner.`;

  const genAI = getGenAI();
  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: GENERATION_CONFIG,
      });
      const result = await withTimeout(model.generateContent(prompt), 45000);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Document summarization model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }

  console.error('All summarization models failed. Last error:', lastError?.message);
  throw new Error(`Document analysis failed. Please verify file format and try again.`);
}

module.exports = {
  generateResponse: generateWithFallback,
  summarizeDocument: summarizeWithFallback,
};