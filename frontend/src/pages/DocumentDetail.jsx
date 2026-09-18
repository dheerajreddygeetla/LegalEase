import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Trash2, AlertCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as documentService from '../services/documentService';
import { formatDateTime } from '../utils/helpers';
import { API_BASE_URL } from '../utils/constants';

// The AI analysis comes back as markdown with "### N. Title" section headers.
// Split it into sections so we can render each as its own card instead of a raw blob.
const parseAnalysisSections = (summary) => {
  if (!summary) return [];
  const parts = summary.split(/(?=^###\s+\d+\.\s+)/m).filter(Boolean);
  return parts.map((part) => {
    const headingMatch = part.match(/^###\s+\d+\.\s+(.+)$/m);
    const title = headingMatch ? headingMatch[1].trim() : 'Analysis';
    const body = part.replace(/^###\s+\d+\.\s+.+$/m, '').trim();
    return { title, body };
  });
};

// Light markdown-ish rendering: turns "- bullet" lines into a list, keeps everything else as paragraphs.
const renderBody = (body) => {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  const elements = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc list-inside space-y-1.5 text-gray-600 dark:text-gray-400">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      currentList.push(line.slice(2).replace(/\*\*/g, ''));
    } else {
      flushList(index);
      elements.push(
        <p key={index} className="text-gray-600 dark:text-gray-400">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    }
  });
  flushList('end');

  return elements;
};

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentService.getDocument(id);
      setDoc(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this doc.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const requestDelete = () => setShowDeleteModal(true);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      await documentService.deleteDocument(id);
      navigate('/documents');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doc.');
      setIsDeleting(false);
    }
  };

  const fileOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  const downloadUrl = doc?.fileUrl
    ? `${fileOrigin}/uploads/${doc.fileUrl.split(/[\\/]/).pop()}`
    : null;

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="glow"
          iconLeft={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/documents')}
        >
          Back to Documents
        </Button>
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <p className="text-muted">{error}</p>
        </Card>
      </div>
    );
  }

  const sections = parseAnalysisSections(doc.summary);

  return (
    <div className="space-y-6">
      <Button
        variant="glow"
        iconLeft={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/documents')}
      >
        Back to Documents
      </Button>

      <Card className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 break-all">
                {doc.filename}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Badge variant={doc.status === 'processed' ? 'success' : 'warning'} size="sm">
                  {doc.status}
                </Badge>
                <span>{doc.fileType?.toUpperCase()}</span>
                <span>•</span>
                <span>Uploaded {formatDateTime(doc.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" iconLeft={<Download className="w-4 h-4" />}>
                  Download
                </Button>
              </a>
            )}
            <Button
              variant="danger"
              loading={isDeleting}
              iconLeft={<Trash2 className="w-4 h-4" />}
              onClick={requestDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {sections.length === 0 ? (
        <Card>
          <p className="text-gray-600 dark:text-gray-400">
            No analysis is available for this doc yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {section.title}
              </h2>
              <div className="space-y-2">{renderBody(section.body)}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Styled delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Document"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">Are you sure?</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                <span className="text-white font-medium break-all">{doc?.filename}</span> will be
                permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              iconLeft={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentDetail;
