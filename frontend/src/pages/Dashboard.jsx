import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Search, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, TrendingUp, Bell, PhoneCall, Scale, ShieldAlert, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getGreeting } from '../utils/helpers';
import * as userService from '../services/userService';
import * as documentService from '../services/documentService';
import * as chatService from '../services/chatService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/dashboard/StatCard';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import ActivityItem from '../components/dashboard/ActivityItem';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [statsRes, docsRes, conversationsRes] = await Promise.all([
          userService.getStats(),
          documentService.getDocuments(),
          chatService.getConversations(),
        ]);

        setStats(statsRes.data.data);

        const docActivity = (docsRes.data.data || []).slice(0, 3).map((d) => ({
          action: `Document uploaded: ${d.filename}`,
          time: d.createdAt,
          type: 'document',
        }));
        const chatActivity = (conversationsRes.data.data || []).slice(0, 3).map((c) => ({
          action: `Consultation: ${c.title}`,
          time: c.createdAt,
          type: 'chat',
        }));

        const combined = [...docActivity, ...chatActivity]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);

        setRecentActivity(combined);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const quickStats = [
    { label: 'Documents Uploaded', value: stats?.docCount ?? '—', icon: FileText, color: 'brand' },
    { label: 'AI Consultations', value: stats?.chatCount ?? '—', icon: MessageSquare, color: 'primary' },
    { label: 'Saved Welfare Schemes', value: stats?.savedSchemesCount ?? '—', icon: Search, color: 'success' },
  ];

  const quickActions = [
    {
      title: 'Analyze Document',
      description: 'Upload notice or contract for instant risk analysis',
      icon: FileText,
      link: '/documents',
      color: 'brand',
    },
    {
      title: 'Ask Legal AI',
      description: 'Consult on tenancy, employment, or consumer rights',
      icon: MessageSquare,
      link: '/assistant',
      color: 'primary',
    },
    {
      title: 'Scheme Matcher',
      description: 'Check your eligibility across 50+ government schemes',
      icon: Search,
      link: '/schemes',
      color: 'success',
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              {getGreeting()}
            </span>
            <span className="text-xs text-muted">
              • Real-time statutory assistance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary font-sans">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}.
          </h1>
          <p className="text-sm text-muted mt-1">
            Here is the current status of your active documents, consultations, and entitlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/assistant">
            <Button variant="primary" size="md" iconRight={<ArrowRight className="w-4 h-4" />}>
              Start Consultation
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {quickStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            isLoading={isLoading}
            delay={index * 0.08}
          />
        ))}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left 8 Cols: Quick Actions & Entitlement Banner */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-primary tracking-tight">
                Quick Actions
              </h2>
              <span className="text-xs text-muted">Recommended for you</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  link={action.link}
                  color={action.color}
                  delay={0.2 + index * 0.08}
                />
              ))}
            </div>
          </div>

          {/* Citizen Verification Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative overflow-hidden"
            style={{
              borderRadius: 20,
              padding: '28px',
              background: 'linear-gradient(135deg, rgba(22, 28, 48, 0.68) 0%, rgba(13, 17, 30, 0.58) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(212,164,58,0.28)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.38), 0 0 24px rgba(212,164,58,0.08), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            {/* Gold shimmer top inset line */}
            <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(212,164,58,0.6),rgba(232,192,92,0.8),rgba(212,164,58,0.6),transparent)', pointerEvents:'none' }} />
            <div
              className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-20"
              style={{
                background: 'radial-gradient(circle at top right, #D4A43A 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Profile Grounding</span>
                </div>
                <h3 className="text-lg font-bold text-primary tracking-tight">
                  Optimize Your Eligibility Matching
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Complete your citizen profile with occupation, state of residence, and annual household income to get 99% verified scheme matches.
                </p>
              </div>

              <Link to="/profile" className="flex-shrink-0 w-full sm:w-auto">
                <Button variant="secondary" size="md" className="w-full sm:w-auto">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right 4 Cols: Recent Activity */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-primary tracking-tight">
              Recent Activity
            </h2>
            <Link to="/documents" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">
              View all
            </Link>
          </div>

          <div style={{ borderRadius: 20, padding: 20, background: 'linear-gradient(135deg, rgba(20, 26, 45, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
            {isLoading ? (
              <LoadingSpinner size="md" className="py-10" />
            ) : recentActivity.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/40 border border-border flex items-center justify-center mx-auto text-muted">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-primary">No activity yet</p>
                <p className="text-xs text-muted max-w-[200px] mx-auto">
                  Upload a document or ask a legal question to see your timeline here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentActivity.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    action={activity.action}
                    time={activity.time}
                    type={activity.type}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CITIZEN STATUTORY UPDATES & NOTICES ── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-primary tracking-tight">
              Verified Statutory & Welfare Updates
            </h2>
          </div>
          <span className="text-xs text-muted">Updated weekly from official gazettes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            className="rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
              border: '1px solid rgba(212,164,58,0.2)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2 inline-block">
                Criminal Law Reform
              </span>
              <h3 className="text-sm font-bold text-primary mb-1.5 font-sans">
                Bharatiya Nyaya Sanhita (BNS) Transition
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Mandatory electronic summons, audio-video recording during search and seizures, and nationwide Zero FIR registration rights are now operational across all police stations.
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>Section 173 BNSS</span>
              <Link to="/assistant" className="text-amber-400 hover:underline">Ask AI &rarr;</Link>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
              border: '1px solid rgba(34,168,112,0.2)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2 inline-block">
                Welfare Directives
              </span>
              <h3 className="text-sm font-bold text-primary mb-1.5 font-sans">
                PM-KISAN & e-Shram Social Security
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Unorganized sector workers registered on e-Shram can now access accidental insurance up to ₹2 Lakh and unified application pathways for 12 central social security schemes.
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>Ministry of Labour</span>
              <Link to="/schemes" className="text-emerald-400 hover:underline">View Schemes &rarr;</Link>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
              border: '1px solid rgba(107,143,212,0.2)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2 inline-block">
                Consumer Courts
              </span>
              <h3 className="text-sm font-bold text-primary mb-1.5 font-sans">
                E-Commerce Misleading Ads & Dark Patterns
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                CCPA has declared 13 deceptive dark pattern tactics illegal, including forced continuations and drip pricing, empowering consumers to claim immediate refunds via e-Daakhil.
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>Consumer Protection Act</span>
              <Link to="/assistant" className="text-blue-400 hover:underline">Learn More &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── EMERGENCY CONTACTS QUICK STRIP ── */}
      <div
        className="rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{
          background: 'rgba(10, 14, 26, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Emergency Citizen Helplines</h4>
            <p className="text-xs text-muted">24x7 toll-free assistance backed by government ministries.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="tel:15100"
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold hover:scale-105 transition-transform"
          >
            NALSA Legal Aid: 15100
          </a>
          <a
            href="tel:1930"
            className="px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold hover:scale-105 transition-transform"
          >
            Cyber Crime: 1930
          </a>
          <a
            href="tel:1915"
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:scale-105 transition-transform"
          >
            Consumer: 1915
          </a>
          <a
            href="tel:181"
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold hover:scale-105 transition-transform"
          >
            Women Helpline: 181
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
