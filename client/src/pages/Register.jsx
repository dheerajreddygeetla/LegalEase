import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, BrainCircuit, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const perks = ['AI legal assistant', 'Instant document analysis', 'Risk detection on every clause'];
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, _id, name: userName } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', _id);
      localStorage.setItem('userName', userName);
      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] grid lg:grid-cols-2">
      {/* Left: branding */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-app border-r border-border overflow-hidden">
        <div className="absolute inset-0 bg-grad-radial pointer-events-none" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-ink">LegalEase AI</span>
        </Link>

        <div className="relative flex-1 flex items-center justify-center">
          <div className="glass-card p-6 w-64 shadow-glow-violet animate-float">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-grad-primary flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink">AI summary ready</p>
                <p className="text-[11px] text-ink-dim">6-point breakdown</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2.5 rounded-full bg-white/10 w-full" />
              <div className="h-2.5 rounded-full bg-violet/40 w-3/4" />
              <div className="h-2.5 rounded-full bg-white/10 w-5/6" />
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-display text-2xl font-bold text-ink mb-4 leading-snug">
            Understand every document you sign.
          </h2>
          <ul className="space-y-2.5">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-ink-dim">
                <CheckCircle2 className="w-4 h-4 text-cyan shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-6 py-16 bg-base">
        <div className="w-full max-w-sm">
          <span className="kicker mb-4">Get started</span>
          <h2 className="font-display text-2xl font-bold text-ink mt-3 mb-8">
            Create your account
          </h2>

          {error && (
            <p className="rounded-lg border border-risk-high/30 bg-risk-high/10 text-risk-high text-sm px-4 py-3 mb-5">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Full name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Creating account…' : (<>Create account <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm text-ink-faint mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
