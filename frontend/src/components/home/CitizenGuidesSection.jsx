import { motion } from 'framer-motion';
import { Home, Briefcase, ShoppingBag, Users, ShieldAlert, Wheat, ArrowUpRight, BookOpen, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const guides = [
  {
    icon: Home,
    title: 'Tenancy & Rental Rights',
    category: 'Property Law',
    color: '#D4A43A',
    statute: 'Model Tenancy Act & State Rent Control',
    highlights: [
      'Landlord cannot enter without 24-hour prior written notice',
      'Security deposit capped at 2 months for residential properties',
      'Protection against arbitrary eviction without Rent Court orders',
    ],
    sampleQuery: 'Can my landlord withhold my deposit for normal wear and tear?',
  },
  {
    icon: Briefcase,
    title: 'Labor & Employment Rights',
    category: 'Employment Law',
    color: '#6B8FD4',
    statute: 'Payment of Gratuity Act 1972 & Industrial Disputes',
    highlights: [
      'Gratuity is mandatory upon completion of 5 continuous years of service',
      'Full and final settlement must be settled within statutory timelines',
      'Protection against summary termination without contractual notice',
    ],
    sampleQuery: 'What are my rights if my company delays my salary settlement?',
  },
  {
    icon: ShoppingBag,
    title: 'Consumer Grievance & Refunds',
    category: 'Consumer Protection',
    color: '#22A870',
    statute: 'Consumer Protection Act 2019',
    highlights: [
      'Right to file complaints electronically via e-Daakhil portal',
      'Strict liability for e-commerce platforms selling counterfeit or defective items',
      'Protection against misleading advertisements and unfair contract terms',
    ],
    sampleQuery: 'How do I lodge a formal complaint against an e-commerce platform?',
  },
  {
    icon: Users,
    title: 'Inheritance & Succession Rights',
    category: 'Civil & Family Law',
    color: '#E07A5F',
    statute: 'Hindu Succession (Amendment) Act 2005 & MWPSC Act',
    highlights: [
      'Daughters possess equal coparcenary rights by birth in ancestral property',
      'Parents & senior citizens can reclaim gifted property under Section 23 of MWPSC Act if neglected',
      'Nominees are custodians, not sole owners of ancestral bank deposits',
    ],
    sampleQuery: 'Do married daughters have equal rights in ancestral property in India?',
  },
  {
    icon: ShieldAlert,
    title: 'Cyber Fraud & Digital Safety',
    category: 'Cyber Law',
    color: '#9B7DD4',
    statute: 'Information Technology Act 2000 & RBI Circulars',
    highlights: [
      'Golden Hour Reporting: Call 1930 immediately to freeze fraudulent bank transfers',
      'Zero liability for unauthorized bank transactions reported within 3 working days',
      'Protection against harassment by illegal digital instant-loan apps',
    ],
    sampleQuery: 'What is the procedure if money was debited through an online scam?',
  },
  {
    icon: Wheat,
    title: 'Farmers & Agri-Welfare Aid',
    category: 'Welfare Schemes',
    color: '#48CAE4',
    statute: 'PM-KISAN, PMFBY & Kisan Credit Scheme',
    highlights: [
      '₹6,000 per year direct income support in three equal DBT installments',
      'Comprehensive risk cover against crop damage from non-preventable natural risks',
      'Subsidized 4% interest rate on timely repayment of Kisan Credit Card loans',
    ],
    sampleQuery: 'How to update e-KYC and land seeding for PM-KISAN benefits?',
  },
];

const CitizenGuidesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold"
            style={{
              background: 'rgba(34,168,112,0.1)',
              border: '1px solid rgba(34,168,112,0.25)',
              color: '#22A870',
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Essential Citizen Legal Knowledge</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-sans mb-4"
          >
            Real-World Legal Guides for{' '}
            <span className="gold-shimmer">Everyday Indian Life</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted leading-relaxed"
          >
            From rental contracts to salary settlements and consumer rights, explore synthesized Indian statutes with direct citations and actionable steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col h-full rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 30, 0.55) 100%)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
                }}
              >
                {/* Card Top */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${guide.color}15`,
                      border: `1px solid ${guide.color}35`,
                      color: guide.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{
                      background: `${guide.color}15`,
                      color: guide.color,
                      border: `1px solid ${guide.color}30`,
                    }}
                  >
                    {guide.category}
                  </span>
                </div>

                {/* Title & Statute */}
                <h3 className="text-lg font-bold text-primary mb-1 font-sans group-hover:text-amber-400 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[11px] font-mono text-gray-400 mb-4 flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-amber-500" />
                  <span>{guide.statute}</span>
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6 flex-1">
                  {guide.highlights.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: guide.color }}
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom interactive action */}
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <div className="text-[11px] text-gray-400 mb-2 italic">
                    Example Query: &quot;{guide.sampleQuery}&quot;
                  </div>
                  <Link
                    to="/assistant"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{ color: guide.color }}
                  >
                    <span>Consult on this topic</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CitizenGuidesSection;
