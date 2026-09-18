import Badge from '../common/Badge';
import Button from '../common/Button';

const matchVariant = (matchPercentage) => {
  if (matchPercentage >= 80) return 'success';
  if (matchPercentage >= 50) return 'warning';
  return 'default';
};

const SchemeRecommendationCard = ({
  scheme,
  matchPercentage,
  status,
  onCheckEligibility,
  onViewDetails,
  checkLabel = 'Check Eligibility',
  loading = false,
}) => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{scheme.name}</h3>
        <Badge variant={matchVariant(matchPercentage)}>
          {status} • {matchPercentage}%
        </Badge>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scheme.description}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          loading={loading}
          onClick={(e) => {
            e.stopPropagation();
            onCheckEligibility(scheme);
          }}
        >
          {loading ? 'Checking...' : checkLabel}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(scheme);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default SchemeRecommendationCard;
