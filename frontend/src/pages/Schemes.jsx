import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle, XCircle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { STATES, SCHEME_CATEGORIES, OCCUPATIONS } from '../utils/constants';
import * as schemeService from '../services/schemeService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SchemeCard from '../components/schemes/SchemeCard';
import SchemeRecommendationCard from '../components/schemes/SchemeRecommendationCard';

const SCHEMES_CACHE_KEY = 'legalease_schemes_cache';

const getInitialCache = () => {
  try {
    const raw = sessionStorage.getItem(SCHEMES_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const Schemes = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const initialCache = getInitialCache();

  const [schemes, setSchemes] = useState(initialCache?.schemes || []);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(!initialCache?.schemes?.length);
  const [searchKeyword, setSearchKeyword] = useState(initialCache?.searchKeyword || '');
  const [selectedState, setSelectedState] = useState(initialCache?.selectedState || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCache?.selectedCategory || '');

  const [recommendations, setRecommendations] = useState(initialCache?.recommendations || null);
  const [isRecommending, setIsRecommending] = useState(false);

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [checkingSchemeId, setCheckingSchemeId] = useState(null);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState(null);

  const [profile, setProfile] = useState(
    initialCache?.profile || {
      age: '',
      state: '',
      occupation: '',
      income: '',
      education: '',
      category: '',
      isFarmer: false,
      isStudent: false,
      isRural: false,
    }
  );

  useEffect(() => {
    if (user?.profile && !initialCache?.profile) {
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

  const loadSchemes = useCallback(async (params = {}) => {
    setIsLoadingSchemes(true);
    try {
      const response = await schemeService.getSchemes(params);
      const data = response.data.data || [];
      setSchemes(data);
      try {
        const current = getInitialCache() || {};
        sessionStorage.setItem(
          SCHEMES_CACHE_KEY,
          JSON.stringify({
            ...current,
            schemes: data,
            appliedParams: params,
          })
        );
      } catch (e) {
        console.warn('Cache write error:', e);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load schemes.');
    } finally {
      setIsLoadingSchemes(false);
    }
  }, []);

  useEffect(() => {
    // Only load from server if not already restored from session cache
    if (!initialCache?.schemes?.length) {
      loadSchemes();
    }
  }, [loadSchemes]);

  // Restore scroll position when returning from details
  useEffect(() => {
    if (initialCache?.scrollY) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: initialCache.scrollY, behavior: 'instant' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  // Persist filter inputs in real time
  useEffect(() => {
    try {
      const current = getInitialCache() || {};
      sessionStorage.setItem(
        SCHEMES_CACHE_KEY,
        JSON.stringify({
          ...current,
          searchKeyword,
          selectedState,
          selectedCategory,
        })
      );
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }, [searchKeyword, selectedState, selectedCategory]);

  // Persist recommendations
  useEffect(() => {
    if (recommendations !== null) {
      try {
        const current = getInitialCache() || {};
        sessionStorage.setItem(
          SCHEMES_CACHE_KEY,
          JSON.stringify({
            ...current,
            recommendations,
          })
        );
      } catch (e) {
        console.warn('Cache write error:', e);
      }
    }
  }, [recommendations]);

  // Persist profile recommendation form inputs
  useEffect(() => {
    try {
      const current = getInitialCache() || {};
      sessionStorage.setItem(
        SCHEMES_CACHE_KEY,
        JSON.stringify({
          ...current,
          profile,
        })
      );
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }, [profile]);

  const handleSearch = () => {
    loadSchemes({
      q: searchKeyword || undefined,
      state: selectedState || undefined,
      category: selectedCategory || undefined,
    });
  };

  const handleReset = () => {
    try {
      sessionStorage.removeItem(SCHEMES_CACHE_KEY);
    } catch (e) {
      console.warn('Cache remove error:', e);
    }
    setSearchKeyword('');
    setSelectedState('');
    setSelectedCategory('');
    setRecommendations(null);
    loadSchemes({});
  };

  const handleViewDetails = (s) => {
    try {
      const current = getInitialCache() || {};
      sessionStorage.setItem(
        SCHEMES_CACHE_KEY,
        JSON.stringify({
          ...current,
          scrollY: window.scrollY || window.pageYOffset,
        })
      );
    } catch (e) {
      console.warn('Cache write error:', e);
    }
    navigate(`/schemes/${s._id}`);
  };

  const cleanProfilePayload = (prof = {}) => {
    const payload = {};
    if (prof.age !== '' && prof.age !== undefined && prof.age !== null && !isNaN(prof.age)) {
      payload.age = Number(prof.age);
    }
    if (prof.income !== '' && prof.income !== undefined && prof.income !== null && !isNaN(prof.income)) {
      payload.income = Number(prof.income);
    }
    if (prof.state && String(prof.state).trim()) payload.state = String(prof.state).trim();
    if (prof.occupation && String(prof.occupation).trim()) payload.occupation = String(prof.occupation).trim();
    if (prof.education && String(prof.education).trim()) payload.education = String(prof.education).trim();
    if (prof.category && String(prof.category).trim()) payload.category = String(prof.category).trim();
    if (prof.gender && String(prof.gender).trim()) payload.gender = String(prof.gender).trim();
    payload.isFarmer = Boolean(prof.isFarmer);
    payload.isStudent = Boolean(prof.isStudent);
    payload.isRural = Boolean(prof.isRural);
    return payload;
  };

  const handleGetRecommendations = async () => {
    setIsRecommending(true);
    try {
      const payload = cleanProfilePayload(profile);
      const response = await schemeService.recommendSchemes(payload);
      setRecommendations(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch recommendations.');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleCheckEligibility = async (scheme) => {
    if (!scheme?._id) return;
    setCheckingSchemeId(scheme._id);
    setSelectedScheme(scheme);
    setEligibilityResult(null);
    setEligibilityError(null);
    setShowSchemeModal(true);
    setIsCheckingEligibility(true);
    try {
      const payload = cleanProfilePayload(profile);
      const response = await schemeService.checkEligibility(scheme._id, payload);
      setEligibilityResult(response.data.data);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to check eligibility.';
      setEligibilityError(msg);
      toast.error(msg);
    } finally {
      setIsCheckingEligibility(false);
      setCheckingSchemeId(null);
    }
  };

  const stateOptions = [{ value: '', label: 'All States' }, ...STATES.map((s) => ({ value: s, label: s }))];
  const categoryOptions = [{ value: '', label: 'All Categories' }, ...SCHEME_CATEGORIES.map((c) => ({ value: c, label: c }))];
  const occupationOptions = [{ value: '', label: 'Select' }, ...OCCUPATIONS.map((o) => ({ value: o, label: o }))];

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary font-sans">
          {t('findSchemes') || 'Government Schemes & Entitlements'}
        </h1>
        <p className="text-sm text-muted mt-1">
          Explore verified central and state welfare initiatives, subsidies, and citizen rights matching your profile.
        </p>
      </div>

      {/* Citizen Eligibility Callout Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Citizen Multi-Scheme Eligibility Evaluator</h3>
            <p className="text-xs text-muted mt-0.5">Want to check all schemes at once? Fill your citizen profile once and get evaluated across all 50+ central & state welfare programs.</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/eligibility')}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="flex-shrink-0"
        >
          Check All Schemes
        </Button>
      </div>

      <Card variant="glass-strong" radius="2xl" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search schemes..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            iconLeft={<Search className="w-5 h-5 text-gray-400" />}
          />
          <Select
            placeholder="Select State"
            options={stateOptions}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          />
          <Select
            placeholder="Select Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSearch} iconLeft={<Search className="w-5 h-5" />} fullWidth>
              Search
            </Button>
            <Button onClick={handleReset} variant="ghost">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card variant="glass-strong" radius="2xl" className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Get Personalized Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Age"
            type="number"
            placeholder="Enter your age"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />
          <Select
            label="State"
            placeholder="Select your state"
            options={stateOptions}
            value={profile.state}
            onChange={(e) => setProfile({ ...profile, state: e.target.value })}
          />
          <Select
            label="Occupation"
            placeholder="Select occupation"
            options={occupationOptions}
            value={profile.occupation}
            onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Annual Income (₹)"
            type="number"
            placeholder="e.g., 250000"
            value={profile.income}
            onChange={(e) => setProfile({ ...profile, income: e.target.value })}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={profile.isFarmer}
              onChange={(e) => setProfile({ ...profile, isFarmer: e.target.checked })}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Farmer</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={profile.isStudent}
              onChange={(e) => setProfile({ ...profile, isStudent: e.target.checked })}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Student</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={profile.isRural}
              onChange={(e) => setProfile({ ...profile, isRural: e.target.checked })}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Rural Resident</span>
          </label>
        </div>
        <Button onClick={handleGetRecommendations} loading={isRecommending} iconLeft={<Filter className="w-5 h-5" />}>
          Get Recommendations
        </Button>
      </Card>

      {recommendations && (
        <Card variant="glass-strong" radius="2xl" className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('recommendations')}
          </h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No matching schemes found.</p>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 10).map(({ scheme, matchPercentage, status }) => (
                <SchemeRecommendationCard
                  key={scheme._id}
                  scheme={scheme}
                  matchPercentage={matchPercentage}
                  status={status}
                  checkLabel={t('checkEligibility')}
                  loading={checkingSchemeId === scheme._id}
                  onCheckEligibility={handleCheckEligibility}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      <Card variant="glass-strong" radius="2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('allSchemes')}
        </h2>
        {isLoadingSchemes ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : schemes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">No schemes found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme._id}
                scheme={scheme}
                checkLabel={t('checkEligibility')}
                loading={checkingSchemeId === scheme._id}
                onCheckEligibility={handleCheckEligibility}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showSchemeModal}
        onClose={() => {
          setShowSchemeModal(false);
          setCheckingSchemeId(null);
        }}
        title={selectedScheme?.name || 'Scheme Eligibility Evaluation'}
        size="lg"
      >
        {isCheckingEligibility ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted font-medium">Checking your eligibility criteria against statutory rules...</p>
          </div>
        ) : eligibilityError ? (
          <div className="space-y-5 py-3">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400">
              <XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-primary">Eligibility Evaluation Error</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{eligibilityError}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowSchemeModal(false)}>
                Close
              </Button>
              <Button onClick={() => handleCheckEligibility(selectedScheme)} iconLeft={<RefreshCw className="w-4 h-4" />}>
                Try Again
              </Button>
            </div>
          </div>
        ) : selectedScheme && eligibilityResult ? (
          <div className="space-y-6">
            <div className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all ${
              eligibilityResult.isEligible
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.1)]'
                : 'bg-rose-500/10 border-rose-500/25 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.1)]'
            }`}>
              {eligibilityResult.isEligible ? (
                <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <p className={`font-semibold text-base ${
                  eligibilityResult.isEligible ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {eligibilityResult.isEligible ? t('eligible') : t('notEligible')}
                </p>
                {eligibilityResult.financialBenefit && (
                  <p className="text-sm text-stone-300 mt-0.5 font-medium">
                    {eligibilityResult.financialBenefit}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2.5 text-sm tracking-wide uppercase text-stone-300">
                Eligibility Criteria
              </h3>
              <div className="space-y-2">
                {(eligibilityResult.checks || []).map((check, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    {check.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-sm text-stone-200 font-medium">
                        {check.criterion}
                      </span>
                      <p className="text-xs text-stone-400 mt-0.5">{check.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(eligibilityResult.requiredDocuments || []).length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-2.5 text-sm tracking-wide uppercase text-stone-300">
                  {t('requiredDocuments')}
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-stone-300 bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
                  {eligibilityResult.requiredDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              fullWidth
              onClick={() => {
                setShowSchemeModal(false);
                navigate(`/schemes/${selectedScheme._id}`);
              }}
            >
              View Full Details
            </Button>
          </div>
        ) : (
          <div className="py-8 text-center text-muted text-sm">
            No eligibility details available.
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Schemes;
