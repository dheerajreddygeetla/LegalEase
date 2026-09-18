import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ShieldCheck, ArrowRight, FileCheck, CheckSquare, Info, Sparkles, CreditCard, ExternalLink, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { STATES, OCCUPATIONS, EDUCATION_LEVELS, CATEGORIES } from '../utils/constants';
import * as schemeService from '../services/schemeService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';

const STANDARD_DOCUMENTS = [
  { id: 'aadhaar', name: 'Aadhaar Card', desc: 'Must be linked with your active mobile number for OTP e-KYC', mandatory: true },
  { id: 'income', name: 'Income Certificate', desc: 'Issued by Tehsildar / Sub-Divisional Magistrate within last 12 months', mandatory: true },
  { id: 'domicile', name: 'Domicile / Residence Certificate', desc: 'Proof of continuous state residence for state-specific quotas', mandatory: true },
  { id: 'bank', name: 'Bank Passbook (NPCI Seeded)', desc: 'Active bank account mapped with Aadhaar on NPCI mapper for DBT transfers', mandatory: true },
  { id: 'caste', name: 'Category / Caste Certificate', desc: 'SC / ST / OBC Non-Creamy Layer / EWS certificate where applicable', mandatory: false },
  { id: 'land', name: 'Land Records (RoR / Khatauni / 7/12)', desc: 'Required for PM-KISAN, PMFBY, and state agriculture subsidies', mandatory: false },
  { id: 'ration', name: 'Ration Card (NFSA / BPL)', desc: 'Required for PDS food security, housing, and state health cards', mandatory: false },
];

const Eligibility = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkedDocs, setCheckedDocs] = useState({
    aadhaar: true,
    bank: true,
  });
  const [profile, setProfile] = useState({
    age: '',
    state: '',
    occupation: '',
    income: '',
    education: '',
    category: '',
    isFarmer: false,
    isStudent: false,
    isRural: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.profile) {
      setProfile((prev) => ({
        ...prev,
        age: user.profile.age !== undefined && user.profile.age !== null ? String(user.profile.age) : prev.age,
        state: user.state || user.profile.state || prev.state,
        occupation: user.profile.occupation || prev.occupation,
        income: user.profile.income !== undefined && user.profile.income !== null ? String(user.profile.income) : prev.income,
        education: user.profile.education || prev.education,
        category: user.profile.category || prev.category,
        isFarmer: user.profile.isFarmer ?? prev.isFarmer,
        isStudent: user.profile.isStudent ?? prev.isStudent,
        isRural: user.profile.isRural ?? prev.isRural,
      }));
    }
  }, [user]);

  const handleCheckEligibility = async () => {
    const errors = {};
    if (!profile.age) errors.age = 'Age is required to evaluate schemes.';
    if (!profile.state) errors.state = 'State is required to check jurisdiction.';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please enter your age and state to evaluate eligibility.');
      return;
    }

    setValidationErrors({});
    setIsChecking(true);
    setError(null);

    try {
      const payload = {
        age: Number(profile.age),
        state: profile.state,
        occupation: profile.occupation || undefined,
        income: profile.income ? Number(profile.income) : undefined,
        education: profile.education || undefined,
        category: profile.category || undefined,
        isFarmer: Boolean(profile.isFarmer),
        isStudent: Boolean(profile.isStudent),
        isRural: Boolean(profile.isRural),
      };

      const response = await schemeService.recommendSchemes(payload);
      let resultsData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        resultsData = response.data.data;
      } else if (Array.isArray(response?.data)) {
        resultsData = response.data;
      }

      setResults(resultsData);
    } catch (err) {
      let errorMessage = 'Failed to evaluate eligibility. Please verify your connection.';
      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'Invalid details provided. Please review inputs.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred during eligibility evaluation. Please try again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!err.response) {
        errorMessage = 'Unable to reach backend server. Please check if the service is running.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  const stateOptions = [{ value: '', label: 'Select State' }, ...STATES.map((s) => ({ value: s, label: s }))];
  const occupationOptions = [{ value: '', label: 'Select Occupation' }, ...OCCUPATIONS.map((o) => ({ value: o, label: o }))];
  const educationOptions = [{ value: '', label: 'Select Education' }, ...EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))];
  const categoryOptions = [{ value: '', label: 'Select Category' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];

  const topEligible = (results || []).filter((r) => (r.disqualifiedReasons?.length || 0) === 0).slice(0, 10);
  const partialMatches = (results || []).filter((r) => (r.disqualifiedReasons?.length || 0) > 0).slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary font-sans flex items-center gap-2.5">
          <ShieldCheck className="w-8 h-8 text-amber-500" />
          {t('checkEligibility') || 'Citizen Eligibility Evaluator'}
        </h1>
        <p className="text-sm text-muted mt-1">
          Check your eligibility across every central and state welfare scheme in one pass.
        </p>
      </div>

      <Card variant="glass-strong" radius="2xl" className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Your Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              label="Age *"
              type="number"
              placeholder="Enter your age (e.g. 28)"
              value={profile.age}
              error={validationErrors.age}
              onChange={(e) => {
                setProfile({ ...profile, age: e.target.value });
                if (validationErrors.age) setValidationErrors((prev) => ({ ...prev, age: undefined }));
                setError(null);
              }}
            />
          </div>
          <div>
            <Select
              label="State *"
              placeholder="Select your state"
              options={stateOptions}
              value={profile.state}
              error={validationErrors.state}
              onChange={(e) => {
                setProfile({ ...profile, state: e.target.value });
                if (validationErrors.state) setValidationErrors((prev) => ({ ...prev, state: undefined }));
                setError(null);
              }}
            />
          </div>
          <Select
            label="Occupation"
            placeholder="Select occupation"
            options={occupationOptions}
            value={profile.occupation}
            onChange={(e) => {
              setProfile({ ...profile, occupation: e.target.value });
              setError(null);
            }}
          />
          <Input
            label="Annual Income (₹)"
            type="number"
            placeholder="e.g. 250000"
            value={profile.income}
            onChange={(e) => {
              setProfile({ ...profile, income: e.target.value });
              setError(null);
            }}
          />
          <Select
            label="Education"
            placeholder="Select education"
            options={educationOptions}
            value={profile.education}
            onChange={(e) => {
              setProfile({ ...profile, education: e.target.value });
              setError(null);
            }}
          />
          <Select
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            value={profile.category}
            onChange={(e) => {
              setProfile({ ...profile, category: e.target.value });
              setError(null);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.isFarmer}
              onChange={(e) => {
                setProfile({ ...profile, isFarmer: e.target.checked });
                setError(null);
              }}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Farmer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.isStudent}
              onChange={(e) => {
                setProfile({ ...profile, isStudent: e.target.checked });
                setError(null);
              }}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Student</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.isRural}
              onChange={(e) => {
                setProfile({ ...profile, isRural: e.target.checked });
                setError(null);
              }}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Rural Resident</span>
          </label>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handleCheckEligibility}
          loading={isChecking}
          iconRight={!isChecking && <ArrowRight className="w-4 h-4" />}
        >
          {isChecking ? 'Evaluating Eligibility Across 50+ Schemes...' : 'Check Eligibility'}
        </Button>
      </Card>

      {isChecking && (
        <Card variant="glass-strong" radius="2xl">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-center text-sm text-muted">Checking eligibility across all schemes...</p>
          </div>
        </Card>
      )}

      {error && !isChecking && (
        <Card variant="glass-strong" radius="2xl" className="border-danger">
          <div className="flex items-center justify-between gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-danger" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Error</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        </Card>
      )}

      {!isChecking && results && (
        <Card variant="glass-strong" radius="2xl">
          <div className={`flex items-center gap-3.5 p-4 rounded-xl border mb-6 transition-all ${
            topEligible.length > 0
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.1)]'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.1)]'
          }`}>
            {topEligible.length > 0 ? (
              <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <p className={`font-semibold text-base ${
                topEligible.length > 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {topEligible.length > 0
                  ? `You appear eligible for ${topEligible.length} scheme${topEligible.length === 1 ? '' : 's'}`
                  : t('notEligible')}
              </p>
              <p className="text-sm text-stone-300 mt-0.5">
                Evaluated against {results.length} government schemes
              </p>
            </div>
          </div>

          {topEligible.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Best Matches
              </h3>
              <div className="space-y-3">
                {topEligible.map((item) => {
                  const { scheme, matchPercentage, advantages } = item;
                  if (!scheme || !scheme._id) return null;
                  return (
                    <div
                      key={scheme._id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-300 dark:hover:border-brand-600"
                      onClick={() => navigate(`/schemes/${scheme._id}`)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{scheme.name}</span>
                        <Badge variant="success">{matchPercentage}% match</Badge>
                      </div>
                      {advantages?.[0] && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{advantages[0]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {partialMatches.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Partial Matches
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    These schemes are close, but one or more criteria don't line up yet:
                  </p>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    {partialMatches.map((item) => {
                      const { scheme, disqualifiedReasons } = item;
                      if (!scheme || !scheme._id) return null;
                      return (
                        <li key={scheme._id}>
                          <span className="font-medium">{scheme.name}:</span> {disqualifiedReasons?.[0] || 'Criteria not met'}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── INTERACTIVE DOCUMENT READINESS CHECKLIST ── */}
      <Card variant="glass-strong" radius="2xl" className="overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-500 mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Application Readiness Check</span>
            </div>
            <h2 className="text-xl font-bold text-primary font-sans">
              Standard Citizen Documents Checklist
            </h2>
            <p className="text-xs text-muted mt-1">
              Check off your ready documents. Over 85% of welfare applications in India require these core certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {Object.values(checkedDocs).filter(Boolean).length} of {STANDARD_DOCUMENTS.length} Ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {STANDARD_DOCUMENTS.map((doc) => {
            const isChecked = !!checkedDocs[doc.id];
            return (
              <label
                key={doc.id}
                className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: isChecked ? 'rgba(212,164,58,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isChecked ? '1px solid rgba(212,164,58,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    setCheckedDocs((prev) => ({ ...prev, [doc.id]: e.target.checked }))
                  }
                  className="mt-1 rounded border-gray-400 text-amber-500 focus:ring-amber-400"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      {doc.name}
                    </span>
                    {doc.mandatory && (
                      <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/15 px-1.5 py-0.5 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    {doc.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Missing documents? Download digital verified copies directly from the official DigiLocker repository.</span>
          </div>
          <a
            href="https://www.digilocker.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:underline flex-shrink-0"
          >
            <span>Open DigiLocker</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </Card>

      {/* ── DIRECT BENEFIT TRANSFER (DBT) SUCCESS GUIDE ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
            border: '1px solid rgba(212,164,58,0.25)',
          }}
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-amber-500/15 text-amber-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-1">
              1. NPCI Aadhaar-Bank Seeding
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Linking Aadhaar for KYC is not enough. You must request your bank branch to seed your account on the <strong>NPCI Aadhaar Payment Bridge (APB)</strong> mapper to receive government transfers.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
            border: '1px solid rgba(107,143,212,0.25)',
          }}
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-blue-500/15 text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-1">
              2. Exact Name Matching
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Ensure your spelling, middle initials, and date of birth match across your Aadhaar, Bank Passbook, and Ration Card. Discrepancies cause automatic DBT batch rejections.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
            border: '1px solid rgba(34,168,112,0.25)',
          }}
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-emerald-500/15 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-1">
              3. Track on PFMS Portal
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              You can track pending scholarship, pension, or PM-KISAN disbursements directly via the Public Financial Management System (PFMS) &quot;Know Your Payment&quot; citizen portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eligibility;
