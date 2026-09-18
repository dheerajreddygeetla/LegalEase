import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const SchemeCard = ({
  scheme,
  onCheckEligibility,
  onViewDetails,
  checkLabel = 'Check Eligibility',
  loading = false,
}) => {
  return (
    <Card hover variant="hover">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="info">{scheme.categoryTag}</Badge>
          <Badge variant="secondary">{scheme.state}</Badge>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{scheme.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {scheme.description}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            fullWidth
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
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SchemeCard;
