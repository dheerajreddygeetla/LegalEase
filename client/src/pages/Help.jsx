import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, MessageCircle, BookOpen, Phone, Sparkles } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="flex items-center gap-2 text-ink-dim hover:text-ink transition-colors mb-6 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="kicker">
          <Sparkles className="w-3.5 h-3.5 text-cyan" />
          Help Center
        </span>
      </div>
      <h1 className="font-display text-3xl font-bold text-ink mt-3 mb-8">How can we help you?</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <GlassCard lift>
          <div className="w-12 h-12 rounded-xl bg-blue/10 ring-1 ring-inset ring-blue/25 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue" strokeWidth={1.75} />
          </div>
          <h3 className="font-semibold text-lg text-ink mb-2">Documentation</h3>
          <p className="text-ink-dim text-sm mb-4 leading-relaxed">Learn how to use LegalEase AI features step by step.</p>
          <Link to="/faq" className="text-blue hover:text-blue-2 font-medium text-sm inline-flex items-center gap-1">
            View guides <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>

        <GlassCard lift>
          <div className="w-12 h-12 rounded-xl bg-risk-low/10 ring-1 ring-inset ring-risk-low/25 flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-risk-low" strokeWidth={1.75} />
          </div>
          <h3 className="font-semibold text-lg text-ink mb-2">Live Chat</h3>
          <p className="text-ink-dim text-sm mb-4 leading-relaxed">Chat with our support team for immediate assistance.</p>
          <button className="text-risk-low hover:opacity-80 font-medium text-sm inline-flex items-center gap-1">
            Start chat <ArrowRight className="w-4 h-4" />
          </button>
        </GlassCard>

        <GlassCard lift>
          <div className="w-12 h-12 rounded-xl bg-violet/10 ring-1 ring-inset ring-violet/25 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-violet" strokeWidth={1.75} />
          </div>
          <h3 className="font-semibold text-lg text-ink mb-2">Email Support</h3>
          <p className="text-ink-dim text-sm mb-4 leading-relaxed">Send us an email and we'll respond within 24 hours.</p>
          <a href="mailto:support@legalease.ai" className="text-violet hover:opacity-80 font-medium text-sm inline-flex items-center gap-1">
            support@legalease.ai <ArrowRight className="w-4 h-4" />
          </a>
        </GlassCard>

        <GlassCard lift>
          <div className="w-12 h-12 rounded-xl bg-risk-medium/10 ring-1 ring-inset ring-risk-medium/25 flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-risk-medium" strokeWidth={1.75} />
          </div>
          <h3 className="font-semibold text-lg text-ink mb-2">Phone Support</h3>
          <p className="text-ink-dim text-sm mb-4 leading-relaxed">Call us for urgent issues during business hours.</p>
          <a href="tel:+911800123456" className="text-risk-medium hover:opacity-80 font-medium text-sm inline-flex items-center gap-1">
            1800-123-456 <ArrowRight className="w-4 h-4" />
          </a>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">Common Issues</h2>
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h3 className="font-medium text-ink mb-2">How do I upload a document?</h3>
            <p className="text-ink-dim text-sm leading-relaxed">Go to the Documents page, click "Choose File", select your PDF, DOCX, or TXT file, and click "Upload & Analyze". The AI will process your document and provide a summary.</p>
          </div>
          <div className="border-b border-border pb-4">
            <h3 className="font-medium text-ink mb-2">How do I use the AI Legal Assistant?</h3>
            <p className="text-ink-dim text-sm leading-relaxed">Navigate to AI Chat, type your legal question in the input box, and press Enter or click Send. You can also use voice input by clicking the microphone button.</p>
          </div>
          <div className="border-b border-border pb-4">
            <h3 className="font-medium text-ink mb-2">How do I find government schemes?</h3>
            <p className="text-ink-dim text-sm leading-relaxed">Visit the Schemes page, and our AI will recommend schemes based on your profile. You can also search for specific schemes using the search bar.</p>
          </div>
          <div>
            <h3 className="font-medium text-ink mb-2">Is my data secure?</h3>
            <p className="text-ink-dim text-sm leading-relaxed">Yes, we use industry-standard encryption and security measures. Your documents and conversations are never shared with third parties.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Help;
