// server/services/ragService.js
const { pipeline } = require('@xenova/transformers');

// Local embedding pipeline (runs on CPU, no API key needed)
let embedder = null;
let embedderLoading = false;

// Comprehensive, authoritative Indian legal knowledge base
const knowledgeBase = [
  {
    id: '1',
    title: 'Model Tenancy Act & Rent Control - Security Deposit & Eviction',
    content: 'Under the Model Tenancy Act, 2021 and State Rent Control Acts, security deposits for residential premises are capped at a maximum of two months rent (and one month for commercial). The landlord must refund the deposit within one month of the tenant vacating, subject to valid deductions for agreed damages with written receipts. Landlords cannot evict tenants without obtaining an eviction order from the Rent Court or Rent Tribunal.'
  },
  {
    id: '2',
    title: 'Payment of Wages Act & Labour Code - Delay and Withholding',
    content: 'Under Section 5 of the Payment of Wages Act, 1936 and Code on Wages, 2019, wages must be disbursed before the 7th or 10th day of the succeeding wage period depending on workforce size. Employers cannot withhold salary unlawfully. Aggrieved employees may file an application before the Labour Commissioner, Authority under the Minimum Wages Act, or the Labour Court with claims for delayed wages plus statutory compensation.'
  },
  {
    id: '3',
    title: 'Consumer Protection Act 2019 - Defective Goods, Refunds & E-Commerce',
    content: 'Under the Consumer Protection Act, 2019, consumers have the statutory right to seek replacement, repair, or 100% refund for defective goods or deficient services. Complaints can be filed digitally via the E-Daakhil portal without an advocate. Jurisdiction: District Consumer Disputes Redressal Commission handles claims up to ₹50 Lakhs; State Commission handles ₹50 Lakhs to ₹2 Crores; National Commission (NCDRC) handles claims exceeding ₹2 Crores.'
  },
  {
    id: '4',
    title: 'Right to Information (RTI) Act 2005 - Citizen Inquiries & Appeals',
    content: 'Under Section 6 of the RTI Act, 2005, any Indian citizen may submit a written or online request to a Public Information Officer (PIO) with a nominal ₹10 fee. The PIO must provide the requested information within 30 days (or 48 hours if it concerns life or liberty). If rejected or ignored, a First Appeal lies with the departmental First Appellate Authority within 30 days, followed by a Second Appeal to the Central or State Information Commission.'
  },
  {
    id: '5',
    title: 'Special Marriage Act 1954 - Court Marriage & 30-Day Notice',
    content: 'Under the Special Marriage Act, 1954, individuals of any religion or nationality can solemnize a civil marriage without conversion. Parties must submit a 30-day advance notice of intended marriage to the Marriage Officer of the district where at least one party resided for 30 days. If no legitimate legal objections are sustained during the 30-day public notice period, marriage is solemnized in the presence of three witnesses.'
  },
  {
    id: '6',
    title: 'Hindu Marriage Act 1955 - Divorce Grounds & Mutual Consent',
    content: 'Under the Hindu Marriage Act, 1955, divorce by Mutual Consent is governed by Section 13B, requiring both spouses to have lived separately for at least one year and jointly petition the Family Court. Contested divorce grounds under Section 13(1) include cruelty, desertion for 2+ continuous years, adultery, religious conversion, or incurable mental disorder. The Supreme Court under Article 142 can also dissolve irretrievably broken marriages.'
  },
  {
    id: '7',
    title: 'Real Estate (Regulation and Development) Act 2016 (RERA) - Builder Delays',
    content: 'Under Section 18 of RERA 2016, if a real estate promoter/builder fails to give possession of an apartment or plot in accordance with the terms of the sale agreement by the specified date, the allottee has the right to withdraw from the project with full refund plus interest at SBI MCLR + 2%. If the allottee stays in the project, they are entitled to monthly delay interest until possession is handed over.'
  },
  {
    id: '8',
    title: 'Negotiable Instruments Act 1881 - Section 138 Cheque Bounce',
    content: 'Under Section 138 of the Negotiable Instruments Act, 1881, dishonour of a cheque due to insufficient funds or exceeding arrangement is a criminal offense punishable with up to 2 years imprisonment or fine up to double the cheque amount. A statutory legal demand notice must be served to the drawer within 30 days of receiving the bank memo. If payment is not made within 15 days of notice receipt, a criminal complaint must be filed before the Judicial Magistrate within 30 days.'
  },
  {
    id: '9',
    title: 'Information Technology Act 2000 - Cyber Fraud, Phishing & Identity Theft',
    content: 'Under Sections 66C and 66D of the IT Act, 2000, identity theft and cheating by personation using computer resources (UPI fraud, phishing, SIM swap, online banking scams) are cognizable offenses punishable with imprisonment up to 3 years and fines. Victims can lodge complaints immediately on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call the National Cyber Helpline 1930 to freeze unauthorized bank transactions.'
  },
  {
    id: '10',
    title: 'POSH Act 2013 - Prevention of Workplace Sexual Harassment',
    content: 'Under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, any establishment employing 10 or more employees must constitute an Internal Complaints Committee (ICC) headed by a senior woman employee. An aggrieved woman can submit a written complaint within 3 months of the incident. The inquiry must be completed within 90 days, and the employer must act on the recommendations within 60 days.'
  },
  {
    id: '11',
    title: 'Bharatiya Nyaya Sanhita (BNS) 2023 & IPC - FIR, Zero FIR & Cyber Crime',
    content: 'Under the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, every citizen has the right to register a Zero FIR at any police station regardless of territorial jurisdiction where the cognizable offense occurred. The police must immediately transmit the case to the jurisdictional police station. Citizens are entitled to a free copy of the FIR immediately upon registration under Section 173(2) of BNSS.'
  },
  {
    id: '12',
    title: 'Legal Services Authorities Act 1987 - Section 12 Free Legal Aid',
    content: 'Under Section 12 of the Legal Services Authorities Act, 1987, free legal counsel and court fee exemption are statutory entitlements for: (a) women and children, (b) members of SC and ST communities, (c) industrial workmen, (d) victims of trafficking or disaster, (e) persons with disabilities, (f) persons in custody, and (g) citizens with annual income below the state-notified ceiling (typically ₹3,00,000). Applications are made to NALSA or the local District Legal Services Authority (DLSA).'
  },
  {
    id: '13',
    title: 'Motor Vehicles (Amendment) Act 2019 - Accident Compensation & MACT',
    content: 'Under the Motor Vehicles Act, 1988 (as amended in 2019), victims of road accidents or legal heirs of deceased victims can claim statutory compensation before the Motor Accident Claims Tribunal (MACT) without limitation period. The Act provides for cashless treatment during the Golden Hour and no-fault liability compensation of ₹5 Lakhs for death and ₹2.5 Lakhs for grievous hurt in road accidents involving motor vehicles.'
  },
  {
    id: '14',
    title: 'Protection of Women from Domestic Violence Act 2005 (PWDVA)',
    content: 'Under the Domestic Violence Act, 2005, an aggrieved woman living in a shared household can seek urgent civil remedies from the Magistrate: Protection Orders against abuse (Sec 18), Residence Orders preventing eviction from the shared household (Sec 19), Monetary Relief for maintenance and medical costs (Sec 20), and Temporary Child Custody Orders (Sec 21). Protection Officers and Service Providers provide free assistance.'
  },
  {
    id: '15',
    title: 'Income Tax Slabs & Rebates (FY 2024-25 & 2025-26)',
    content: 'Under the New Tax Regime (Section 115BAC), individual income up to ₹3,00,000 is tax-free. Under Section 87A, resident individuals with total taxable income up to ₹7,00,000 receive full tax rebate (effective tax is zero). Standard deduction of ₹75,000 is available for salaried employees. Tax rates: ₹3L-₹7L: 5%, ₹7L-₹10L: 10%, ₹10L-₹12L: 15%, ₹12L-₹15L: 20%, above ₹15L: 30%.'
  },
  {
    id: '16',
    title: 'Indian Registration Act 1908 - Sale Deeds & Gift Deeds',
    content: 'Under Section 17 of the Registration Act, 1908, instruments of gift of immovable property and non-testamentary instruments transferring or extinguishing rights worth over ₹100 must be compulsorily registered with the Sub-Registrar within four months of execution. Unregistered property sale deeds do not confer legal title or ownership under Section 49.'
  },
  {
    id: '17',
    title: 'Maintenance and Welfare of Parents and Senior Citizens Act 2007',
    content: 'Under Section 4 and Section 9 of the Senior Citizens Act, 2007, senior citizens or parents unable to maintain themselves can petition the Maintenance Tribunal against children or relatives for monthly maintenance allowances (up to ₹10,000 or as revised by state). Under Section 23, if a senior citizen transfers property by gift or otherwise with the condition of care and the recipient fails to provide basic amenities, the transfer can be declared void by the Tribunal.'
  },
  {
    id: '18',
    title: 'Medical Negligence & Patient Rights - Consumer Protection Act 2019',
    content: 'Under the Consumer Protection Act, 2019 and Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, patients and family members can file complaints for medical negligence or deficiency in service against private hospitals and healthcare practitioners before the Consumer Commission. Bolam Test as interpreted by the Supreme Court of India requires proof of failure to exercise ordinary medical competence and reasonable care.'
  },
  {
    id: '19',
    title: 'Payment of Gratuity Act 1972 & Employee Provident Fund (EPFO)',
    content: 'Under the Payment of Gratuity Act, 1972, employees completing 5 or more years of continuous service are legally entitled to gratuity upon resignation, retirement, or termination, calculated as (15 * Last Drawn Basic + DA * Years of Service) / 26, up to a statutory ceiling of ₹20 Lakhs. EPF contributions under the Employees Provident Funds and Miscellaneous Provisions Act, 1952 are mandatory for establishments with 20+ employees.'
  },
  {
    id: '20',
    title: 'Intellectual Property Rights - Trademarks, Copyrights & Patents in India',
    content: 'Under the Trade Marks Act, 1999, registered trademarks are protected for 10 years from the date of application and renewable indefinitely; infringement suits lie before the Commercial Court. Under the Copyright Act, 1957, literary, dramatic, musical, and artistic works are protected for the author’s lifetime plus 60 years. Under the Patents Act, 1970, patent grants provide a 20-year statutory monopoly from filing date.'
  }
];

// In-memory vector store
let vectors = [];

// Initialize the embedding pipeline once (cached)
async function getEmbedder() {
  if (embedder) return embedder;
  if (embedderLoading) {
    // Wait a brief moment if already in progress
    await new Promise(r => setTimeout(r, 1000));
    if (embedder) return embedder;
  }

  embedderLoading = true;
  console.log('🔄 Loading local embedding model (Xenova/all-MiniLM-L6-v2)...');
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('✅ Embedding model ready.');
    return embedder;
  } catch (err) {
    console.warn('⚠️ Could not load neural embedding pipeline (fallback lexical search will be used):', err.message);
    embedder = null;
    return null;
  } finally {
    embedderLoading = false;
  }
}

// Get embedding for a text using local model
async function getEmbedding(text) {
  const embedderInstance = await getEmbedder();
  if (!embedderInstance) return null;
  const result = await embedderInstance(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

// Build the vector store (called on server start)
async function initVectorStore() {
  console.log('🔄 Indexing legal knowledge base...');
  vectors = [];

  try {
    const embedderInstance = await getEmbedder();
    if (embedderInstance) {
      for (const entry of knowledgeBase) {
        const embedding = await getEmbedding(`${entry.title}: ${entry.content}`);
        if (embedding) {
          vectors.push({ ...entry, embedding });
        } else {
          vectors.push({ ...entry, embedding: null });
        }
      }
      console.log(`✅ Vector store initialized with ${vectors.length} legal reference documents.`);
      return;
    }
  } catch (error) {
    console.warn('⚠️ Vector store neural initialization partial; lexical fallback active:', error.message);
  }

  // Populate vectors even without embeddings for lexical search
  vectors = knowledgeBase.map(entry => ({ ...entry, embedding: null }));
  console.log(`✅ Knowledge base ready with ${vectors.length} documents (lexical index).`);
}

/**
 * Keyword / lexical overlap scoring (high-speed fallback)
 */
function calculateLexicalScore(query, docText) {
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  if (queryWords.length === 0) return 0;

  const target = docText.toLowerCase();
  let matches = 0;
  for (const word of queryWords) {
    if (target.includes(word)) {
      matches += 1;
    }
  }
  return matches / queryWords.length;
}

/**
 * Retrieve top-k relevant legal documents for a query
 * Combines neural cosine similarity with lexical overlap resilience
 */
async function retrieveRelevantDocs(query, k = 3) {
  if (!query || !query.trim()) return [];

  if (vectors.length === 0) {
    await initVectorStore();
  }

  if (vectors.length === 0) {
    return [];
  }

  try {
    const queryEmbedding = await getEmbedding(query);

    if (queryEmbedding && vectors.some(v => v.embedding !== null)) {
      // Neural Cosine Similarity
      const scored = vectors
        .filter(doc => doc.embedding !== null)
        .map(doc => {
          const dot = doc.embedding.reduce((sum, val, i) => sum + val * queryEmbedding[i], 0);
          const normDoc = Math.sqrt(doc.embedding.reduce((s, v) => s + v * v, 0));
          const normQuery = Math.sqrt(queryEmbedding.reduce((s, v) => s + v * v, 0));
          const similarity = normDoc && normQuery ? dot / (normDoc * normQuery) : 0;
          return { ...doc, similarity };
        });

      // Filter by reasonable similarity threshold to eliminate noise
      const filtered = scored.filter(d => d.similarity >= 0.20);
      filtered.sort((a, b) => b.similarity - a.similarity);

      if (filtered.length > 0) {
        return filtered.slice(0, k);
      }
    }
  } catch (neuralErr) {
    console.warn('Neural retrieval failed, utilizing keyword lexical search:', neuralErr.message);
  }

  // Resilient Lexical Matching Fallback
  const lexicalScored = vectors.map(doc => {
    const score = calculateLexicalScore(query, `${doc.title} ${doc.content}`);
    return { ...doc, similarity: score };
  });

  lexicalScored.sort((a, b) => b.similarity - a.similarity);
  const relevant = lexicalScored.filter(d => d.similarity > 0.15);

  return relevant.slice(0, k);
}

module.exports = {
  initVectorStore,
  retrieveRelevantDocs,
  knowledgeBaseCount: knowledgeBase.length,
};