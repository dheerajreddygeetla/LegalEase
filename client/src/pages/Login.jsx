import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Shield, FileText, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = () => {
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
      const res = await api.post('/auth/login', { email, password });
      const { token, _id, name } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', _id);
      localStorage.setItem('userName', name);
      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <div className="glass-card p-6 w-64 shadow-float animate-float">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-grad-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="badge-risk-low">Secure</span>
            </div>
            <div className="space-y-2">
              <div className="h-2.5 rounded-full bg-white/10 w-full" />
              <div className="h-2.5 rounded-full bg-white/10 w-5/6" />
              <div className="h-2.5 rounded-full bg-blue/40 w-2/3" />
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-display text-2xl font-bold text-ink mb-3 leading-snug">
            Legal help, simplified by AI.
          </h2>
          <p className="text-sm text-ink-dim max-w-sm leading-relaxed flex items-start gap-2">
            <Shield className="w-4 h-4 text-cyan mt-0.5 shrink-0" />
            Your documents stay encrypted and private, every step of the way.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-6 py-16 bg-base">
        <div className="w-full max-w-sm">
          <span className="kicker mb-4">Welcome back</span>
          <h2 className="font-display text-2xl font-bold text-ink mt-3 mb-8">
            Log in to your account
          </h2>

          {error && (
            <p className="rounded-lg border border-risk-high/30 bg-risk-high/10 text-risk-high text-sm px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Logging in…' : (<>Log in <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm text-ink-faint mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
