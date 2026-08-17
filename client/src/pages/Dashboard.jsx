import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, MessageSquareText, FileText, Landmark, Sparkles, FolderOpen, MessagesSquare, Star, Shield, BrainCircuit } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';

const quickAccess = [
  { title: 'AI Legal Assistant', desc: 'Ask legal questions in plain language.', path: '/assistant', icon: MessageSquareText },
  { title: 'Document Analyzer', desc: 'Upload and get instant risk-aware summaries.', path: '/documents', icon: FileText },
  { title: 'Government Schemes', desc: 'Find schemes you may be eligible for.', path: '/schemes', icon: Landmark },
];

const Dashboard = () => {
  const [userName, setUserName] = useState('User');
  const [status, setStatus] = useState('Checking…');
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/health');
        setStatus(res.data.message);
      } catch {
        setStatus('Backend not reachable');
      }
      setUserName(localStorage.getItem('userName') || 'User');
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-white/5 rounded-xl w-1/3" />
          <div className="h-6 bg-white/5 rounded-xl w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white/5 rounded-xl2" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Greeting */}
      <section className="glass-card relative overflow-hidden p-8 md:p-10 mb-8">
        <div className="absolute inset-0 bg-grad-radial pointer-events-none" />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <span className="kicker mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan" /> Status: {status}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-2">
              Good to see you, {userName}.
            </h1>
            <p className="text-ink-dim">Your legal AI assistant is ready to help.</p>
          </div>
          {/* Floating 3D element */}
          <div className="hidden md:block w-20 h-20 rounded-2xl bg-grad-primary flex items-center justify-center shadow-glow animate-float">
            <BrainCircuit className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="mb-10">
        <div className="mb-5">
          <span className="text-xs font-semibold text-blue uppercase tracking-wider">Quick access</span>
          <h2 className="font-display text-2xl font-bold mt-1.5 text-ink">Get started</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickAccess.map((f) => (
            <Link key={f.title} to={f.path}>
              <GlassCard lift className="group h-full">
                <div className="w-12 h-12 rounded-xl bg-grad-primary flex items-center justify-center mb-4 shadow-glow transition-transform group-hover:scale-110">
                  <f.icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-base font-semibold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-dim mb-4">{f.desc}</p>
                <span className="inline-flex items-center text-sm font-medium text-blue opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section>
        <h2 className="font-display text-lg font-semibold text-ink mb-5">Your activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon={FolderOpen} label="Documents analyzed" value="0" />
          <StatCard icon={MessagesSquare} label="AI conversations" value="0" />
          <StatCard icon={Star} label="Saved schemes" value="0" />
        </div>
      </section>

      {/* Floating security indicator */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
        <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-float animate-float-slow">
          <Shield className="w-5 h-5 text-cyan" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-ink">Secure Connection</p>
            <p className="text-[11px] text-ink-dim">End-to-end encrypted</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
