import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "What is LegalEase AI?",
      answer: "LegalEase AI is an AI-powered platform that helps Indian citizens understand their legal rights, analyze legal documents, and discover government schemes they qualify for. It uses advanced AI to provide simple, easy-to-understand explanations of complex legal concepts."
    },
    {
      question: "Is LegalEase AI free to use?",
      answer: "Yes, LegalEase AI is completely free to use for all citizens. Our mission is to make legal information accessible to everyone in India."
    },
    {
      question: "What types of documents can I upload?",
      answer: "You can upload PDF, DOCX, and TXT files. The system supports legal documents, contracts, agreements, and other text-based documents up to 10MB in size."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI is trained on Indian legal data and provides highly accurate analysis. However, for critical legal matters, we always recommend consulting with a qualified legal professional."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use industry-standard encryption and security protocols. Your documents and conversations are never shared with third parties and are deleted after processing unless you choose to save them."
    },
    {
      question: "Can I use LegalEase AI in different languages?",
      answer: "Yes! LegalEase AI supports multiple languages including English, Hindi, Telugu, and more. You can change the language preference in the AI Chat section."
    },
    {
      question: "How do government scheme recommendations work?",
      answer: "Based on your profile information and the details you provide, our AI matches you with relevant government schemes you may qualify for. We provide information about eligibility, benefits, and application processes."
    },
    {
      question: "Can I trust the legal information provided?",
      answer: "Our AI is trained on verified legal sources including government websites, legal databases, and official documents. Each answer includes source references so you can verify the information independently."
    },
    {
      question: "What should I do if I find incorrect information?",
      answer: "Please report any incorrect information through our Help Center. Our team reviews all reports and updates our knowledge base regularly to ensure accuracy."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account from the Profile page. Once deleted, all your data including documents and conversations will be permanently removed from our servers."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="flex items-center gap-2 text-ink-dim hover:text-ink transition-colors mb-6 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="kicker">
          <Sparkles className="w-3.5 h-3.5 text-cyan" />
          Frequently Asked Questions
        </span>
      </div>
      <h1 className="font-display text-3xl font-bold text-ink mt-3 mb-8">FAQ's</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <GlassCard key={index}>
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
            >
              <span className="font-medium text-ink pr-4">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-ink-dim shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-ink-dim shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 pt-0">
                <p className="text-ink-dim text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-12 shadow-glow-violet">
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Still have questions?</h2>
        <p className="text-ink-dim mb-4">Can't find the answer you're looking for? Our support team is here to help.</p>
        <Link to="/help" className="btn-primary inline-flex items-center gap-2">
          Contact Support
        </Link>
      </GlassCard>
    </div>
  );
};

export default Faq;
