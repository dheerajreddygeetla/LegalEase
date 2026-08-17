// server/services/ragService.js
const { pipeline } = require('@xenova/transformers');

// Local embedding pipeline (runs on CPU, no API key needed)
let embedder = null;

// Sample knowledge base (expand this with real legal sources)
const knowledgeBase = [
  {
    id: '1',
    title: 'Rent Control Act - Security Deposit',
    content: 'In India, the security deposit is typically one month\'s rent, but can be up to three months in some states. The deposit must be returned within a reasonable time after the tenant vacates, subject to deductions for damages.'
  },
  {
    id: '2',
    title: 'Salary Payment - Labour Law',
    content: 'Under the Payment of Wages Act, 1936, an employer must pay wages on time. If an employer delays payment, the employee can approach the Labour Commissioner or file a complaint with the labour court.'
  },
  {
    id: '3',
    title: 'Income Tax Slabs (2025-26)',
    content: 'For individuals below 60 years, the tax slab: up to ₹2.5 lakh – nil; ₹2.5–5 lakh – 5%; ₹5–10 lakh – 20%; above ₹10 lakh – 30%. A rebate of ₹12,500 is available for income up to ₹5 lakh under section 87A.'
  },
  {
    id: '4',
    title: 'Right to Information Act',
    content: 'Under RTI Act 2005, any citizen can request information from a public authority. The authority must respond within 30 days. If not, an appeal can be made to the First Appellate Authority.'
  },
  {
    id: '5',
    title: 'Marriage Registration - Special Marriage Act',
    content: 'The Special Marriage Act, 1954 allows marriage registration regardless of religion. The notice must be published, and if no objections, the marriage is registered after 30 days.'
  },
  {
    id: '6',
    title: 'Consumer Protection Act - Refund',
    content: 'Under the Consumer Protection Act, 2019, a consumer can claim a refund for defective goods or services within 30 days of purchase. If the seller refuses, a complaint can be filed with the District Consumer Forum.'
  },
  {
    id: '7',
    title: 'Divorce - Hindu Marriage Act',
    content: 'Under the Hindu Marriage Act, 1955, divorce can be sought on grounds like cruelty, adultery, desertion, or mutual consent. A petition must be filed in the family court, and a decree is usually granted after one year of marriage.'
  },
  {
    id: '8',
    title: 'Property Registration - Indian Registration Act',
    content: 'Under the Indian Registration Act, 1908, sale deeds and gift deeds must be registered with the sub-registrar within four months of execution. Registration ensures legal validity and a public record of ownership.'
  }
];

// In-memory vector store
let vectors = [];

// Initialize the embedding pipeline once (cached)
async function getEmbedder() {
  if (!embedder) {
    console.log('🔄 Loading local embedding model... (first time may take a few seconds)');
    try {
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('✅ Embedding model loaded.');
    } catch (err) {
      console.error('❌ Failed to load embedding model:', err);
      throw err;
    }
  }
  return embedder;
}

// Get embedding for a text using local model
async function getEmbedding(text) {
  const embedderInstance = await getEmbedder();
  const result = await embedderInstance(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

// Build the vector store (call this on server start)
async function initVectorStore() {
  console.log('🔄 Building vector store...');
  try {
    vectors = [];
    for (const entry of knowledgeBase) {
      const embedding = await getEmbedding(entry.content);
      vectors.push({ ...entry, embedding });
    }
    console.log(`✅ Vector store built with ${vectors.length} documents.`);
  } catch (error) {
    console.error('❌ Failed to build vector store:', error);
    // Keep vectors empty – retrieval will return empty array
    vectors = [];
  }
}

// Retrieve top‑k relevant documents for a query
async function retrieveRelevantDocs(query, k = 3) {
  if (vectors.length === 0) {
    // Attempt to rebuild on the fly (if not built yet)
    await initVectorStore();
  }
  if (vectors.length === 0) {
    // If still empty, return empty array (fallback)
    console.warn('⚠️ Vector store is empty – returning no sources.');
    return [];
  }

  // Compute embedding for query
  const queryEmbedding = await getEmbedding(query);

  // Calculate cosine similarity with each document
  const similarities = vectors.map(doc => {
    const dot = doc.embedding.reduce((sum, val, i) => sum + val * queryEmbedding[i], 0);
    const normDoc = Math.sqrt(doc.embedding.reduce((s, v) => s + v * v, 0));
    const normQuery = Math.sqrt(queryEmbedding.reduce((s, v) => s + v * v, 0));
    return { ...doc, similarity: dot / (normDoc * normQuery) };
  });

  // Sort by similarity descending
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, k);
}

module.exports = { initVectorStore, retrieveRelevantDocs };