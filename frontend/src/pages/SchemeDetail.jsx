import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, ExternalLink, Phone } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as schemeService from '../services/schemeService';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadScheme = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await schemeService.getScheme(id);
      setScheme(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this scheme.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadScheme();
  }, [loadScheme]);

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" className="py-24" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="space-y-6">
        <Button
          variant="glow"
          iconLeft={<ArrowLeft className="w-4 h-4" />}
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/schemes');
            }
          }}
        >
          Back to Schemes
        </Button>
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <p className="text-muted">{error || 'Scheme not found.'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="glow"
        iconLeft={<ArrowLeft className="w-4 h-4" />}
        onClick={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate('/schemes');
          }
        }}
      >
        Back to Schemes
      </Button>

      <Card>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="info">{scheme.categoryTag}</Badge>
            <Badge variant="secondary">{scheme.state}</Badge>
            {scheme.ministry && <Badge variant="default">{scheme.ministry}</Badge>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {scheme.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{scheme.description}</p>
          {scheme.financialBenefit && (
            <p className="mt-2 text-brand-700 dark:text-brand-400 font-medium">
              {scheme.financialBenefit}
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
          {scheme.benefits?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Benefits
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {scheme.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {scheme.requiredDocuments?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Required Documents
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {scheme.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {scheme.applicationProcess?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Application Process
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {scheme.applicationProcess.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {scheme.eligibility && (
            <div className="flex items-center gap-3.5 p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-stone-100">
                  Check your eligibility
                </p>
                <p className="text-sm text-stone-400">
                  Head to the Schemes page and use "Check Eligibility" with your profile details.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {scheme.officialUrl && (
              <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[200px]">
                <Button fullWidth size="lg" iconRight={<ExternalLink className="w-4 h-4" />}>
                  Apply on Official Portal
                </Button>
              </a>
            )}
            {scheme.helpline && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Helpline: {scheme.helpline}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SchemeDetail;
