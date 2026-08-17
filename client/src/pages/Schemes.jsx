import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, Sparkles, Landmark, CheckCircle2, XCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Confetti state
  // const [showConfetti, setShowConfetti] = useState(false);

  // Profile form for recommendations
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

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/schemes');
      setSchemes(res.data.data);
    } catch (error) {
      console.error('Failed to load schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (stateFilter) params.append('state', stateFilter);
      const res = await api.get(`/schemes?${params.toString()}`);
      setSchemes(res.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!profile.age || !profile.state) {
        alert('Please provide at least age and state');
        setLoading(false);
        return;
      }
      const res = await api.post('/schemes/recommend', profile);
      setRecommendations(res.data.data);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Recommendation failed:', error);
      alert(error.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (schemeId) => {
    try {
      const res = await api.post(`/schemes/${schemeId}/check-eligibility`, { profile });
      const result = res.data.data;
      setEligibilityResult(result);

      // 🎉 Show confetti if eligible
      // if (result.eligible) {
      //   setShowConfetti(true);
      //   setTimeout(() => setShowConfetti(false), 4000);
      // }
    } catch (error) {
      console.error('Eligibility check failed:', error);
      alert('Failed to check eligibility');
    }
  };

  const viewScheme = (scheme) => {
    setSelectedScheme(scheme);
    checkEligibility(scheme._id);
  };

  const closeModal = () => {
    setSelectedScheme(null);
    setEligibilityResult(null);
    // setShowConfetti(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-2">
        <span className="kicker">
          <Sparkles className="w-3.5 h-3.5 text-cyan" />
          Government schemes
        </span>
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink mt-3 mb-8">Benefits you may qualify for</h1>

      {/* Search / Filter */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
            <Search className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Search schemes</h2>
            <p className="text-xs text-ink-dim mt-0.5">Find government benefits by name or state</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="field-label">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description"
              className="input-field"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="field-label">State</label>
            <input
              type="text"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              placeholder="e.g., Telangana"
              className="input-field"
            />
          </div>
          <button onClick={searchSchemes} className="btn-primary">
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => { setSearchTerm(''); setStateFilter(''); loadSchemes(); }}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </GlassCard>

      {/* Profile & Recommendations */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
            <Filter className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Find schemes for you</h2>
            <p className="text-xs text-ink-dim mt-0.5">Get personalized recommendations based on your profile</p>
          </div>
        </div>
        <form onSubmit={getRecommendations} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={profile.age}
            onChange={handleProfileChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={profile.state}
            onChange={handleProfileChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={profile.occupation}
            onChange={handleProfileChange}
            className="input-field"
          />
          <input
            type="number"
            name="income"
            placeholder="Annual income"
            value={profile.income}
            onChange={handleProfileChange}
            className="input-field"
          />
          <input
            type="text"
            name="education"
            placeholder="Education"
            value={profile.education}
            onChange={handleProfileChange}
            className="input-field"
          />
          <input
            type="text"
            name="category"
            placeholder="Category (SC/ST/OBC/General/EWS)"
            value={profile.category}
            onChange={handleProfileChange}
            className="input-field"
          />
          <div className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isFarmer"
              checked={profile.isFarmer}
              onChange={handleProfileChange}
              id="farmer"
              className="accent-blue"
            />
            <label htmlFor="farmer" className="text-ink-dim">Farmer</label>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isStudent"
              checked={profile.isStudent}
              onChange={handleProfileChange}
              id="student"
              className="accent-blue"
            />
            <label htmlFor="student" className="text-ink-dim">Student</label>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isRural"
              checked={profile.isRural}
              onChange={handleProfileChange}
              id="rural"
              className="accent-blue"
            />
            <label htmlFor="rural" className="text-ink-dim">Rural</label>
          </div>
          <button type="submit" className="btn-primary col-span-1">
            Get recommendations
          </button>
        </form>
      </GlassCard>

      {/* Recommendations List */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Top recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec, idx) => (
              <GlassCard key={idx} lift className="border-l-[3px] border-l-blue">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
                    <Landmark className="w-5 h-5 text-white" strokeWidth={1.75} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    rec.score > 70 ? 'bg-risk-low/10 text-risk-low' : rec.score > 40 ? 'bg-risk-medium/10 text-risk-medium' : 'bg-risk-high/10 text-risk-high'
                  }`}>
                    Score: {rec.score}
                  </div>
                </div>
                <h3 className="font-semibold text-ink mb-2">{rec.scheme.name}</h3>
                <p className="text-sm text-ink-dim mb-3">{rec.scheme.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-dim">Match: {rec.result}</span>
                  <button onClick={() => viewScheme(rec.scheme)} className="btn-secondary text-xs py-2">
                    View details
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* All Schemes */}
      <h2 className="font-display text-lg font-semibold text-ink mb-4">All schemes</h2>
      {loading ? (
        <div className="text-center text-ink-dim text-sm py-12">
          <div className="w-8 h-8 mx-auto mb-3 rounded-lg border-2 border-border border-t-blue/50 animate-spin" />
          Loading schemes…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <GlassCard key={scheme._id} lift>
              <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow mb-4">
                <Landmark className="w-5 h-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-ink mb-2">{scheme.name}</h3>
              <p className="text-sm text-ink-dim mb-3">{scheme.description.substring(0, 100)}...</p>
              <p className="text-xs text-ink-faint font-mono mb-4">State: {scheme.state}</p>
              <button onClick={() => viewScheme(scheme)} className="btn-secondary text-xs w-full">
                Check eligibility
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <GlassCard 
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
                  <Landmark className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">{selectedScheme.name}</h2>
                  <p className="text-xs text-ink-dim font-mono mt-0.5">State: {selectedScheme.state}</p>
                </div>
              </div>
              <button 
                onClick={closeModal} 
                className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-faint hover:text-ink hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-ink-dim text-sm mb-4">{selectedScheme.description}</p>
            <div className="mt-4 text-sm space-y-3">
              <p><span className="font-semibold text-ink">Ministry:</span> <span className="text-ink-dim">{selectedScheme.ministry}</span></p>
              {selectedScheme.benefits && selectedScheme.benefits.length > 0 && (
                <div>
                  <p className="font-semibold text-ink mb-1">Benefits</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-ink-dim">
                    {selectedScheme.benefits.map((ben, idx) => <li key={idx}>{ben}</li>)}
                  </ul>
                </div>
              )}
              {selectedScheme.requiredDocuments && selectedScheme.requiredDocuments.length > 0 && (
                <div>
                  <p className="font-semibold text-ink mb-1">Required documents</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-ink-dim">
                    {selectedScheme.requiredDocuments.map((doc, idx) => <li key={idx}>{doc}</li>)}
                  </ul>
                </div>
              )}
              {selectedScheme.applicationProcess && selectedScheme.applicationProcess.length > 0 && (
                <div>
                  <p className="font-semibold text-ink mb-1">Application process</p>
                  <ol className="list-decimal pl-5 space-y-0.5 text-ink-dim">
                    {selectedScheme.applicationProcess.map((step, idx) => <li key={idx}>{step}</li>)}
                  </ol>
                </div>
              )}
              {selectedScheme.officialUrl && (
                <p>
                  <span className="font-semibold text-ink">Official link:</span>{' '}
                  <a
                    href={selectedScheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline"
                  >
                    {selectedScheme.officialUrl}
                  </a>
                </p>
              )}
            </div>

            {/* Eligibility Result - Updated to show full details from backend */}
            {eligibilityResult && (
              <div className="mt-5">
                <div className={`glass-card p-5 ${
                  eligibilityResult.eligible 
                    ? 'border-l-[3px] border-l-risk-low bg-risk-low/5' 
                    : 'border-l-[3px] border-l-risk-high bg-risk-high/5'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {eligibilityResult.eligible ? (
                      <CheckCircle2 className="w-6 h-6 text-risk-low" />
                    ) : (
                      <XCircle className="w-6 h-6 text-risk-high" />
                    )}
                    <p className="font-semibold text-base text-ink">
                      {eligibilityResult.eligible ? 'You are eligible for this scheme!' : 'Not eligible'}
                    </p>
                  </div>
                  <p className="text-sm mt-1 font-mono text-ink-dim">
                    Score: {eligibilityResult.score}/{eligibilityResult.maxScore}
                  </p>

                  {/* Passed checks */}
                  {eligibilityResult.passed && eligibilityResult.passed.length > 0 && (
                    <div className="mt-3">
                      <span className="font-semibold text-risk-low text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Passed:
                      </span>
                      <ul className="list-disc pl-6 text-sm text-ink-dim mt-1">
                        {eligibilityResult.passed.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Failed checks */}
                  {eligibilityResult.failed && eligibilityResult.failed.length > 0 && (
                    <div className="mt-3">
                      <span className="font-semibold text-risk-high text-sm flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Failed:
                      </span>
                      <ul className="list-disc pl-6 text-sm text-ink-dim mt-1">
                        {eligibilityResult.failed.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Missing info */}
                  {eligibilityResult.missing && eligibilityResult.missing.length > 0 && (
                    <div className="mt-3">
                      <span className="font-semibold text-risk-medium text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Missing information:
                      </span>
                      <ul className="list-disc pl-6 text-sm text-ink-dim mt-1">
                        {eligibilityResult.missing.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Explanation */}
                  {eligibilityResult.explanation && (
                    <div className="mt-3 pt-3 border-t border-border text-sm text-ink-dim whitespace-pre-wrap">
                      {eligibilityResult.explanation}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button onClick={closeModal} className="btn-secondary">
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Schemes;