import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-base-2/60 mt-24">
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-grad-primary flex items-center justify-center">
          <Scale className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <span className="font-display text-base font-bold text-ink">LegalEase AI</span>
      </Link>
      <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-dim">
        <Link to="/faq" className="hover:text-ink transition-colors">FAQ</Link>
        <Link to="/help" className="hover:text-ink transition-colors">Help</Link>
      </nav>
      <p className="text-xs text-ink-faint">© {new Date().getFullYear()} LegalEase AI. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
