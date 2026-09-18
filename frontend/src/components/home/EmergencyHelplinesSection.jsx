import { motion } from 'framer-motion';
import { PhoneCall, Shield, AlertTriangle, ExternalLink, LifeBuoy, HeartHandshake, PhoneForwarded } from 'lucide-react';

const helplines = [
  {
    name: 'NALSA Free Legal Aid',
    number: '15100',
    description: 'National Legal Services Authority. Free legal advice, advocates, and representation for women, children, SC/ST, and low-income citizens under Article 39A.',
    authority: 'Ministry of Law and Justice, Govt of India',
    badge: 'Toll-Free 24x7',
    color: '#D4A43A',
  },
  {
    name: 'National Cyber Crime Portal',
    number: '1930',
    description: 'Immediate citizen reporting of online banking fraud, UPI scams, identity theft, and malicious applications. Call within the golden hour to freeze transfers.',
    authority: 'Ministry of Home Affairs (I4C)',
    badge: 'Urgent Fraud Reporting',
    color: '#E07A5F',
  },
  {
    name: 'National Consumer Helpline',
    number: '1915',
    description: 'Direct lodging of grievances against unfair trade practices, non-delivery of products, defective services, and e-commerce refund failures.',
    authority: 'Department of Consumer Affairs',
    badge: 'Toll-Free Grievance',
    color: '#22A870',
  },
  {
    name: 'Women in Distress Helpline',
    number: '181',
    description: 'Emergency response and rescue for women facing domestic violence, harassment, dowry abuse, or workplace hostility. Offers legal and counseling support.',
    authority: 'Ministry of Women & Child Development',
    badge: 'Confidential 24x7',
    color: '#D47C6D',
  },
  {
    name: 'National Emergency Service',
    number: '112',
    description: 'Single pan-India emergency number for all crisis services including Police, Fire Brigade, Ambulance, and Disaster Management teams.',
    authority: 'Emergency Response Support System (ERSS)',
    badge: 'Pan-India Emergency',
    color: '#6B8FD4',
  },
  {
    name: 'Kisan Agri-Advisory Helpline',
    number: '1800-180-1551',
    description: 'Free expert consultations for farmers regarding crop insurance (PMFBY), PM-KISAN installment issues, soil health, and state agriculture schemes.',
    authority: 'Ministry of Agriculture & Farmers Welfare',
    badge: 'Multi-Language Support',
    color: '#48CAE4',
  },
];

const EmergencyHelplinesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(24, 30, 52, 0.75) 0%, rgba(14, 18, 34, 0.85) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(212,164,58,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: 'rgba(224,122,95,0.15)',
                  border: '1px solid rgba(224,122,95,0.3)',
                  color: '#E07A5F',
                }}
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Immediate Citizen Support</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary font-sans">
                Official 24x7 Government & Legal Helplines
              </h2>
              <p className="text-sm text-muted mt-2 max-w-2xl">
                When you face an urgent legal emergency, financial cyber scam, or domestic crisis, connect directly with official government authorities at zero cost.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-4 py-2.5 rounded-xl border border-amber-500/20 flex-shrink-0">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Free, Toll-Free & Verified Numbers</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {helplines.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 hover:border-amber-500/40"
                style={{
                  background: 'rgba(10, 14, 26, 0.65)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${item.color}15`,
                        color: item.color,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate max-w-[140px]">
                      {item.authority}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 font-sans">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-transform group-hover:scale-105"
                    style={{
                      background: `${item.color}20`,
                      color: item.color,
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial {item.number}</span>
                  </a>
                  <span className="text-[11px] text-gray-400">Available 24x7</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyHelplinesSection;
