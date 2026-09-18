import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  FileText,
  Award,
  ShieldCheck,
  PhoneCall,
  ChevronDown,
  Mail,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useLanguage } from '../hooks/useLanguage';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] },
  }),
};

const HELP_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen, color: '#D4A43A' },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, color: '#6B8FD4' },
  { id: 'documents', label: 'Document Analyzer', icon: FileText, color: '#22A870' },
  { id: 'schemes', label: 'Schemes & Eligibility', icon: Award, color: '#E07A5F' },
  { id: 'security', label: 'Privacy & Security', icon: ShieldCheck, color: '#9B7DD4' },
];

const FAQS = [
  {
    category: 'getting-started',
    question: 'What is LegalEase and who is it for?',
    answer:
      'LegalEase is an AI-powered legal empowerment platform designed for citizens, students, and businesses across India. It simplifies complex legal concepts, helps you understand your constitutional & statutory rights, analyzes contracts and legal notices, and discovers government welfare schemes tailored to your profile.',
  },
  {
    category: 'getting-started',
    question: 'Do I need to pay to use LegalEase?',
    answer:
      'Core features of LegalEase—including exploring help resources, accessing the AI Legal Assistant, and checking government schemes—are free for citizens to ensure legal knowledge is universally accessible.',
  },
  {
    category: 'getting-started',
    question: 'In which languages is LegalEase available?',
    answer:
      'LegalEase supports English, Hindi (हिंदी), and Telugu (తెలుగు), with more regional Indian languages being added continuously. You can toggle your preferred language anytime using the language selector in the top navigation bar.',
  },
  {
    category: 'assistant',
    question: 'How does the AI Legal Assistant work?',
    answer:
      'The AI Assistant uses specialized large language models grounded in Indian law, including the Constitution of India, Bharatiya Nyaya Sanhita (BNS), Consumer Protection Act, Labor laws, and central/state regulations. It provides clear, plain-language answers with relevant legal citations.',
  },
  {
    category: 'assistant',
    question: 'Can I use voice to ask questions?',
    answer:
      'Yes! The AI Assistant supports voice interaction. Simply click the microphone icon in the chat interface to speak your legal query in your chosen language, and listen to the voice response if desired.',
  },
  {
    category: 'assistant',
    question: 'Is the advice provided by LegalEase legally binding?',
    answer:
      'No. LegalEase provides informational and educational guidance to help you understand your legal standing and options. It does not establish an attorney-client relationship and should not substitute formal representation by an advocate or licensed legal practitioner.',
  },
  {
    category: 'documents',
    question: 'What file formats can I upload for document analysis?',
    answer:
      'LegalEase supports PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) documents up to 10MB in size. We can analyze rental agreements, employment contracts, loan agreements, terms of service, NDAs, and legal notices.',
  },
  {
    category: 'documents',
    question: 'What insights does the Document Analyzer generate?',
    answer:
      'Our analyzer breaks down complex legal jargon into an executive plain-language summary, identifies your key obligations and deadlines, flags potential risks or unfair clauses, and outlines recommended actions you should take.',
  },
  {
    category: 'schemes',
    question: 'How does government scheme recommendation work?',
    answer:
      'Once logged in, you can browse hundreds of central and state government schemes across healthcare, agriculture, housing, education, and women empowerment. By providing basic demographic criteria (state, age, income category, occupation), our system calculates match percentages and identifies whether you meet the eligibility criteria.',
  },
  {
    category: 'schemes',
    question: 'Why do I need to register or log in to view and check schemes?',
    answer:
      'Government welfare schemes and eligibility checks are personalized to your profile attributes and allow bookmarking schemes for later tracking. Creating a free account safeguards your data and provides tailored recommendations.',
  },
  {
    category: 'security',
    question: 'Is my uploaded document data private and secure?',
    answer:
      'Yes. All uploaded documents are transmitted over SSL/TLS 256-bit encryption and stored securely. Your documents are only accessible by you and are never sold or shared with third parties. You can delete any uploaded document from your account at any time.',
  },
  {
    category: 'security',
    question: 'How do I delete my account and data?',
    answer:
      'You have complete sovereignty over your data. Go to your Profile settings, scroll down to the Danger Zone, and click "Delete Account". This permanently removes your account, chat sessions, and uploaded documents from our servers.',
  },
];

const HELPLINES = [
  {
    title: 'National Legal Services Authority (NALSA)',
    description: 'Free legal aid and advice for eligible citizens across India',
    number: '15100',
    tag: 'Toll-Free 24/7',
    color: '#D4A43A',
  },
  {
    title: 'Tele-Law Service (Dept. of Justice)',
    description: 'Pre-litigation legal advice connecting citizens with panel lawyers',
    number: '14430 / tele-law.in',
    tag: 'Govt. Service',
    color: '#6B8FD4',
  },
  {
    title: 'National Cyber Crime Helpline',
    description: 'Reporting online financial fraud, cyber stalking, and harassment',
    number: '1930',
    tag: 'National Toll-Free',
    color: '#22A870',
  },
  {
    title: 'Women in Distress Helpline',
    description: 'Emergency assistance for domestic abuse and women rights violations',
    number: '1091 / 181',
    tag: 'Emergency Support',
    color: '#E07A5F',
  },
];

const Help = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (idx) => {
    setExpandedFaq((prev) => (prev === idx ? null : idx));
  };

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'all') return FAQS;
    return FAQS.filter((faq) => faq.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-transparent"
    >
      {/* ── HERO SECTION ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Ambient glow orbs */}
        <div
          className="absolute orb orb-1"
          style={{
            width: 650,
            height: 650,
            top: '-25%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(184,135,30,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute orb orb-2"
          style={{
            width: 450,
            height: 450,
            bottom: '-15%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(107,143,212,0.10) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(184,135,30,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,135,30,0.025) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(184,135,30,0.10)',
                border: '1px solid rgba(184,135,30,0.25)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-gold)' }} />
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: 'var(--accent-gold)' }}
              >
                Help & Support Center
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary font-sans">
              How can we{' '}
              <span className="gold-shimmer">help you?</span>
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Find answers to frequent queries, discover how to utilize our AI legal tools, or connect with national legal assistance services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── QUICK FEATURE GUIDES ── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary font-sans mb-3">
            Quick Guides & Resources
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Get started easily with step-by-step guidance on how to maximize your LegalEase experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Card hover style={{ height: '100%' }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(212,164,58,0.12)', border: '1px solid rgba(212,164,58,0.25)' }}
              >
                <MessageSquare className="w-6 h-6" style={{ color: '#D4A43A' }} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-primary font-sans">
                Using AI Assistant
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Ask any legal question in plain language or your regional dialect. The AI references current Indian statutes and judicial precedents to explain your legal rights.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--accent-gold)' }}>
                <CheckCircle2 className="w-4 h-4" /> Multilingual & Voice Ready
              </div>
            </Card>
          </motion.div>

          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Card hover style={{ height: '100%' }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(107,143,212,0.12)', border: '1px solid rgba(107,143,212,0.25)' }}
              >
                <FileText className="w-6 h-6" style={{ color: '#6B8FD4' }} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-primary font-sans">
                Document Analyzer
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Upload agreements, contracts, or notices. LegalEase scans each clause, identifies high-risk commitments, and highlights what you should negotiate before signing.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#6B8FD4' }}>
                <CheckCircle2 className="w-4 h-4" /> PDF, DOCX, TXT Support
              </div>
            </Card>
          </motion.div>

          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Card hover style={{ height: '100%' }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(34,168,112,0.12)', border: '1px solid rgba(34,168,112,0.25)' }}
              >
                <Award className="w-6 h-6" style={{ color: '#22A870' }} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-primary font-sans">
                Welfare Schemes
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Sign in to explore hundreds of state and central schemes. Answer simple questions to determine your eligibility and required documentation.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#22A870' }}>
                <CheckCircle2 className="w-4 h-4" /> Tailored Profile Matching
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary font-sans mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Browse through common questions organized by category or use search to locate answers immediately.
          </p>
        </motion.div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {HELP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(212,164,58,0.25) 0%, rgba(212,164,58,0.12) 100%)'
                    : 'var(--bg-surface)',
                  border: isSelected
                    ? '1px solid rgba(212,164,58,0.5)'
                    : '1px solid var(--border-color)',
                  color: isSelected ? '#D4A43A' : 'var(--text-secondary)',
                  boxShadow: isSelected ? '0 2px 12px rgba(212,164,58,0.15)' : 'none',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-20">
          {filteredFaqs.length === 0 ? (
            <div
              className="text-center py-16 px-4 rounded-2xl"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-500" />
              <h3 className="text-base font-semibold text-primary mb-1">No matching questions found</h3>
              <p className="text-xs text-gray-400">
                Please select a different category above.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="rounded-2xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: isExpanded
                      ? 'rgba(14, 18, 34, 0.85)'
                      : 'rgba(12, 16, 28, 0.68)',
                    border: isExpanded
                      ? '1px solid rgba(212,164,58,0.45)'
                      : '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(28px) saturate(170%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(170%)',
                    boxShadow: isExpanded
                      ? '0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,164,58,0.15), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-sm sm:text-base text-primary font-sans leading-snug">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        className="w-5 h-5"
                        style={{ color: isExpanded ? '#D4A43A' : 'var(--text-muted)' }}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div
                          className="px-5 pb-5 pt-1 text-sm leading-relaxed"
                          style={{
                            color: 'var(--text-secondary)',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* ── OFFICIAL NATIONAL HELPLINES ── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(212,164,58,0.1)', border: '1px solid rgba(212,164,58,0.25)' }}
          >
            <PhoneCall className="w-3.5 h-3.5" style={{ color: 'var(--accent-gold)' }} />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent-gold)' }}>
              Emergency & Legal Support
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary font-sans mb-2">
            Government Legal Helplines
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            If you require direct assistance from government authorities or emergency legal aid, these national helplines are available to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {HELPLINES.map((helpline, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card hover className="flex flex-col justify-between" style={{ height: '100%', padding: '24px 20px' }}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${helpline.color}15`, border: `1px solid ${helpline.color}30` }}
                    >
                      <PhoneCall style={{ width: 18, height: 18, color: helpline.color }} />
                    </div>
                    <Badge variant="outline" size="sm">
                      {helpline.tag}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-primary mb-2 font-sans">
                    {helpline.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {helpline.description}
                  </p>
                </div>
                <div
                  className="pt-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border-color)' }}
                >
                  <span className="text-xs font-semibold text-gray-400">Dial:</span>
                  <span className="text-sm font-bold tracking-wide" style={{ color: helpline.color }}>
                    {helpline.number}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STILL NEED HELP? CTA ── */}
      <section className="pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="relative rounded-3xl p-10 sm:p-14 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(184,135,30,0.12) 0%, rgba(107,143,212,0.08) 100%)',
              border: '1px solid rgba(184,135,30,0.22)',
            }}
          >
            {/* Shimmer line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '15%',
                right: '15%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.8), transparent)',
              }}
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-primary font-sans">
                Still have questions?
              </h2>
              <p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Our team is here to assist you with any platform issues, feature inquiries, or feedback.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="mailto:support@legalease.in">
                  <Button variant="primary" iconLeft={<Mail className="w-4 h-4" />}>
                    Email Support
                  </Button>
                </a>
                <Link to="/register">
                  <Button variant="outline" iconRight={<ArrowRight className="w-4 h-4" />}>
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Help;
