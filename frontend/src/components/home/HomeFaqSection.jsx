import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const homeFaqs = [
  {
    q: 'Is my uploaded document or legal question kept private and confidential?',
    a: 'Absolutely. We enforce a strict privacy-by-design policy. Uploaded documents are processed ephemerally on secure servers and streamed only to authenticated owners. We never sell citizen data, nor do we train public AI models on your personal agreements or notices.',
  },
  {
    q: 'Does LegalEase replace a practicing advocate or lawyer in court?',
    a: 'No. LegalEase serves as an informational empowerment tool. It demystifies statutory law, breaks down contracts, and reveals welfare benefits you are entitled to. For active litigation, courtroom filing, or formal representation, we always recommend consulting a licensed legal practitioner or contacting NALSA at 15100 for free legal aid.',
  },
  {
    q: 'How does LegalEase evaluate my welfare scheme eligibility?',
    a: 'Our eligibility algorithm cross-checks your demographic inputs (state of domicile, age, annual household income, occupation, land ownership, and social category) against official gazette criteria for central and state welfare initiatives. It produces a clear breakdown of qualifications and lists any missing criteria.',
  },
  {
    q: 'Can I use LegalEase in my local language?',
    a: 'Yes. LegalEase fully supports English, Hindi (हिंदी), and Telugu (తెలుగు). You can switch languages anytime in the top navigation bar, and you can even speak your legal queries directly using the voice input feature.',
  },
  {
    q: 'What types of legal documents can I upload for analysis?',
    a: 'You can upload PDF, Word (DOCX), or plain text files up to 10MB. Common documents include Residential & Commercial Leases, Employment Offer Letters & Non-Compete Agreements, Bank Loan Sanction Letters, Consumer Terms, and Legal Demand Notices.',
  },
];

const HomeFaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold"
            style={{
              background: 'rgba(212,164,58,0.1)',
              border: '1px solid rgba(212,164,58,0.25)',
              color: 'var(--accent-gold)',
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Citizen Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-sans mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
            Everything you need to know about statutory grounding, security guarantees, and using our platform.
          </p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl transition-all duration-300 overflow-hidden"
                style={{
                  background: isOpen
                    ? 'linear-gradient(135deg, rgba(22, 28, 48, 0.75) 0%, rgba(13, 17, 30, 0.65) 100%)'
                    : 'rgba(12, 16, 28, 0.55)',
                  border: isOpen
                    ? '1px solid rgba(212,164,58,0.35)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-base text-primary font-sans">
                    {faq.q}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                    style={{
                      background: isOpen ? 'rgba(212,164,58,0.2)' : 'rgba(255,255,255,0.05)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: isOpen ? 'var(--accent-gold)' : 'var(--text-muted)',
                    }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-sm text-muted leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-xs text-muted">
          <span>Have more specific questions? </span>
          <Link to="/help" className="text-amber-400 font-semibold hover:underline">
            Visit our Complete Knowledge & Help Center &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFaqSection;
