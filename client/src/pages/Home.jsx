import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Shield, FileText, Sparkles, AlertTriangle, Search,
  UserCheck, Lock, Zap, BrainCircuit, Upload, ScanSearch, MessageSquareText,
  CheckCircle2, Send, Copy, ThumbsUp,
} from 'lucide-react';
import FloatingCard from '../components/ui/FloatingCard';
import FeatureCard from '../components/ui/FeatureCard';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import RiskBadge from '../components/ui/RiskBadge';

const features = [
  { icon: MessageSquareText, title: 'AI Legal Assistant', description: 'Ask legal questions in plain language and get grounded, context-aware answers.' },
  { icon: ScanSearch, title: 'Document Analysis', description: 'Upload contracts and agreements for instant AI-powered summaries and insights.' },
  { icon: FileText, title: 'Document Simplification', description: 'Dense legal language rewritten into explanations anyone can understand.' },
  { icon: AlertTriangle, title: 'Risk Detection', description: 'Important clauses, obligations, and red flags surfaced automatically.' },
  { icon: Search, title: 'Case Insights', description: 'Extract dates, parties, and key facts from lengthy legal documents.' },
  { icon: UserCheck, title: 'Personalized Guidance', description: 'Recommendations shaped by your documents, history, and jurisdiction.' },
];

const steps = [
  { n: '01', title: 'Upload', desc: 'Add your legal document — contracts, agreements, notices, or filings.', icon: Upload },
  { n: '02', title: 'Analyze', desc: 'LegalEase AI reads the document and maps its structure and clauses.', icon: BrainCircuit },
  { n: '03', title: 'Understand', desc: 'Key terms, risks, and obligations are extracted and explained.', icon: ScanSearch },
  { n: '04', title: 'Act', desc: 'Get clear, actionable next steps grounded in your document.', icon: CheckCircle2 },
];

const trustItems = [
  { icon: Zap, label: 'AI-Powered' },
  { icon: Lock, label: 'Secure' },
  { icon: FileText, label: 'Document Intelligence' },
  { icon: Sparkles, label: 'Fast Analysis' },
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative overflow-hidden px-6 md:px-10 pt-16 pb-24 md:pt-24 md:pb-32"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="kicker mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan" />
              AI-Powered Legal Intelligence
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-ink mb-6">
              Legal help,
              <br />
              <span className="text-transparent bg-clip-text bg-grad-primary">simplified by AI.</span>
            </h1>
            <p className="text-lg text-ink-dim max-w-lg leading-relaxed mb-10">
              LegalEase AI reads your documents, explains your rights, flags risk, and
              answers legal questions in plain language — backed by sources you can trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={isLoggedIn ? '/dashboard' : '/register'} className="btn-primary">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-secondary">Explore Features</a>
            </div>
          </motion.div>

          {/* Right: 3D floating document scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="relative h-[420px] md:h-[480px] overflow-hidden"
            style={{ perspective: '1200px' }}
          >
            {/* ambient glow */}
            <div className="absolute inset-0 bg-grad-glow blur-3xl opacity-70" />

            {/* central document card */}
            <div
              className="absolute left-1/2 top-1/2 w-64 md:w-72 -translate-x-1/2 -translate-y-1/2 animate-float"
              style={{
                transform: `translate(-50%, -50%) rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 14}deg)`,
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="glass-card p-6 shadow-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-grad-primary flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="badge-risk-low">Analyzed</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 rounded-full bg-white/10 w-full" />
                  <div className="h-2.5 rounded-full bg-white/10 w-5/6" />
                  <div className="h-2.5 rounded-full bg-white/10 w-4/6" />
                  <div className="h-2.5 rounded-full bg-blue/40 w-2/3" />
                  <div className="h-2.5 rounded-full bg-white/10 w-full" />
                  <div className="h-2.5 rounded-full bg-white/10 w-3/6" />
                </div>
              </div>
            </div>

            {/* orbiting floating panels */}
            <FloatingCard
              icon={Shield}
              label="Risk flagged"
              sub="Clause 4.2 — liability"
              delay="0s"
              className="!absolute top-8 left-8 md:left-16 w-36"
            />
            <FloatingCard
              icon={BrainCircuit}
              label="AI summary ready"
              sub="6-point breakdown"
              delay="1.2s"
              className="!absolute bottom-6 right-0 md:right-2 w-48"
            />
            <FloatingCard
              icon={Lock}
              label="Encrypted"
              sub="E2E secure"
              delay="0.6s"
              className="!absolute bottom-0 left-8 md:left-20 w-32 hidden sm:flex"
            />
          </motion.div>
        </div>
      </section>

      {/* ===================== TRUST STRIP ===================== */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium text-ink-faint tracking-wide mb-8">
            Built for smarter legal decisions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((t) => (
              <div key={t.label} className="glass-panel flex items-center gap-3 px-5 py-4">
                <t.icon className="w-4 h-4 text-cyan shrink-0" />
                <span className="text-sm font-medium text-ink-dim">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="features" className="px-6 md:px-10 py-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <SectionHeading
            kicker="Capabilities"
            title="Everything you need to understand the law"
            description="From plain-language answers to automated risk detection, LegalEase AI covers the full arc of a legal question."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14 w-full">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <SectionHeading
            kicker="Process"
            title="From document to clarity, in four steps"
          />
          <div className="relative grid md:grid-cols-4 gap-6 mt-16 w-full">
            <div className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-border-hi to-transparent overflow-hidden">
              <div className="h-full w-1/3 bg-grad-primary animate-drift" />
            </div>
            {steps.map((s) => (
              <div key={s.n} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-[72px] h-[72px] rounded-2xl bg-card border border-border-hi flex items-center justify-center mb-5 shadow-card">
                  <s.icon className="w-6 h-6 text-blue" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-mono text-ink-faint mb-1">{s.n}</span>
                <h3 className="font-display text-base font-semibold text-ink mb-1.5">{s.title}</h3>
                <p className="text-sm text-ink-dim leading-relaxed max-w-[220px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AI ASSISTANT PREVIEW ===================== */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <SectionHeading
            align="left"
            kicker="AI Assistant"
            title="Talk to your documents like a colleague"
            description="Ask follow-up questions, get definitions of legal terms, and receive answers grounded in your uploaded documents with visible sources and confidence."
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-5 shadow-float"
          >
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-risk-low" />
              <span className="text-xs text-ink-dim">LegalEase Assistant · live preview</span>
            </div>

            <div className="flex justify-end mb-4">
              <div className="bubble-user">Can you explain this agreement in simple language?</div>
            </div>

            <div className="flex justify-start mb-4">
              <div className="bubble-ai">
                This agreement establishes a 12-month service arrangement with automatic
                renewal. The <span className="text-blue font-medium">indemnity clause</span> in
                Section 4.2 places broader liability on your side than is typical —
                worth reviewing before signing.
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 pl-1">
              <button className="text-ink-faint hover:text-ink transition-colors"><Copy className="w-3.5 h-3.5" /></button>
              <button className="text-ink-faint hover:text-ink transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
              <span className="text-[11px] text-ink-faint ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" /> 94% confidence · 2 sources
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {['What does Section 4.2 mean?', 'Is this clause negotiable?'].map((q) => (
                <span key={q} className="text-xs px-3 py-1.5 rounded-full border border-border-hi text-ink-dim">{q}</span>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-ink-faint flex-1">Ask a follow-up question…</span>
              <Send className="w-4 h-4 text-blue" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== DOCUMENT ANALYSIS ===================== */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <SectionHeading
            kicker="Document Analysis"
            title="See exactly what matters in your document"
            description="Upload once. LegalEase AI highlights the clauses that carry risk and explains each one in context."
          />
          <div className="grid lg:grid-cols-2 gap-6 mt-14 w-full">
            <GlassCard className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                <FileText className="w-4 h-4 text-ink-dim" />
                <span className="text-sm font-medium text-ink-dim">service_agreement.pdf</span>
              </div>
              <div className="p-6 space-y-3 text-sm text-ink-faint leading-relaxed">
                <p className="text-ink-dim">4. Indemnification</p>
                <p className="bg-risk-high/10 ring-1 ring-inset ring-risk-high/25 rounded-lg px-3 py-2 text-ink-dim">
                  4.2 The Client shall indemnify and hold harmless the Provider from any and
                  all claims arising from use of the delivered services...
                </p>
                <p>5. Termination</p>
                <p className="bg-risk-medium/10 ring-1 ring-inset ring-risk-medium/25 rounded-lg px-3 py-2 text-ink-dim">
                  5.1 Either party may terminate with 30 days written notice...
                </p>
                <p>6. Confidentiality</p>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Indemnification clause</p>
                  <p className="text-xs text-ink-faint">Section 4.2</p>
                </div>
                <RiskBadge level="high" />
              </div>
              <p className="text-sm text-ink-dim leading-relaxed">
                This clause shifts most liability onto you, including claims arising from
                the provider's own service delivery — broader than standard practice.
              </p>
              <div className="rounded-lg bg-white/[0.03] border border-border px-4 py-3">
                <p className="text-xs font-medium text-ink-dim mb-1">Recommendation</p>
                <p className="text-xs text-ink-faint leading-relaxed">
                  Ask to narrow indemnity to claims caused by your own use of the service.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Explain', 'Summarize', 'Simplify', 'Analyze Risk'].map((a) => (
                  <button key={a} className="text-xs px-3.5 py-2 rounded-lg border border-border-hi text-ink-dim hover:text-ink hover:bg-white/[0.05] transition-colors">
                    {a}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-4xl mx-auto glass-card p-10 md:p-14 text-center shadow-glow-violet">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            Ready to understand your legal documents?
          </h2>
          <p className="text-ink-dim mb-8 max-w-xl mx-auto">
            Create a free account and upload your first document in under a minute.
          </p>
          <Link to={isLoggedIn ? '/dashboard' : '/register'} className="btn-primary">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
