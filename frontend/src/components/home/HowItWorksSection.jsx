import { motion } from 'framer-motion';
import { UploadCloud, Cpu, FileCheck2, ArrowRight, ShieldCheck, Sparkles, Scale, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    title: 'Ask or Upload Agreement',
    description:
      'Type your question, speak using voice input in Hindi, Telugu, or English, or upload any legal notice, rental lease, or employment contract (PDF, DOCX, TXT).',
    icon: UploadCloud,
    badge: 'Input & Ingestion',
    color: '#D4A43A',
    features: ['Voice recognition in 3 languages', 'Up to 10MB document support', 'Encrypted ephemeral ingestion'],
  },
  {
    step: '02',
    title: 'Semantic RAG & Legal Indexing',
    description:
      'Our local neural embedding model (all-MiniLM-L6-v2) indexes your query against the Constitution of India, BNS, Consumer Protection Act, and 50+ Welfare Scheme databases.',
    icon: Cpu,
    badge: 'Vector Intelligence',
    color: '#6B8FD4',
    features: ['On-premise embedding pipeline', 'Zero model training on user files', 'Grounded against official gazettes'],
  },
  {
    step: '03',
    title: 'Plain-Language Analysis & Risk Flags',
    description:
      'Gemini AI decomposes dense legalese into an executive breakdown. Hidden penalties, unfair lock-in clauses, and statutory citations are flagged with complete clarity.',
    icon: FileCheck2,
    badge: 'Statutory Synthesis',
    color: '#22A870',
    features: ['Clause-by-clause risk severity rating', 'Verifiable legal section citations', 'Plain language translation'],
  },
  {
    step: '04',
    title: 'Actionable Redressal & Scheme Benefits',
    description:
      'Receive immediate step-by-step guidance: check qualification for central/state grants, prepare RTI applications, or connect with free legal aid and government portals.',
    icon: Scale,
    badge: 'Citizen Empowerment',
    color: '#E07A5F',
    features: ['Direct official portal redirection', 'Eligibility match calculators', 'Emergency legal helpline numbers'],
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,164,58,0.06) 0%, rgba(107,143,212,0.04) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold"
            style={{
              background: 'rgba(212,164,58,0.1)',
              border: '1px solid rgba(212,164,58,0.25)',
              color: 'var(--accent-gold)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Workflow</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-sans mb-4"
          >
            How LegalEase Works in{' '}
            <span className="gold-shimmer">Four Precise Steps</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted leading-relaxed"
          >
            Combining local neural retrieval with state-of-the-art language models to turn complex Indian law and welfare schemes into immediate, actionable knowledge.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col h-full rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(11, 15, 28, 0.55) 100%)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Step badge and icon */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}35`,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-2xl font-black tracking-tighter opacity-40 font-mono"
                    style={{ color: item.color }}
                  >
                    {item.step}
                  </span>
                </div>

                <div className="mb-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: `${item.color}12`,
                      color: item.color,
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-primary mb-2 font-sans">
                  {item.title}
                </h3>

                <p className="text-xs text-muted leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                {/* Micro checklist */}
                <div className="space-y-1.5 pt-4 border-t border-white/5">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="mt-12 text-center">
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #B8871E 100%)',
              boxShadow: '0 8px 24px rgba(184, 135, 30, 0.35)',
            }}
          >
            <span>Try AI Legal Consultation Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
