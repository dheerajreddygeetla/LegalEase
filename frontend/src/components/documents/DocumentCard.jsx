import { FileText, Calendar, Eye, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';

const statusVariant = (status) => {
  if (status === 'processed') return 'success';
  if (status === 'processing' || status === 'uploaded') return 'warning';
  if (status === 'failed') return 'danger';
  return 'default';
};

const DocumentCard = ({ document, onView, onDelete, isDeleting }) => {
  return (
    <Card hover variant="hover">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <Badge variant={statusVariant(document.status)}>{document.status}</Badge>
        </div>
        <h3
          className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate"
          title={document.filename}
        >
          {document.filename}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          {formatDate(document.createdAt)}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            fullWidth
            iconLeft={<Eye className="w-4 h-4" />}
            onClick={() => onView(document)}
          >
            View Analysis
          </Button>
          <Button
            size="sm"
            variant="ghost"
            loading={isDeleting}
            iconLeft={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(document)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;
