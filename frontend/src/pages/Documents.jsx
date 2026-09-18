import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, AlertTriangle, ShieldCheck, Lock, CheckCircle2, HelpCircle, FileCheck2, Scale, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import * as documentService from '../services/documentService';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentCard from '../components/documents/DocumentCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Documents = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, docId: null, docName: '' });

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments();
      setDocuments(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load documents.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await documentService.uploadDocument(formData);
    const newDocument = response.data.data;
    setDocuments((prev) => [newDocument, ...prev]);
    // Navigate immediately to the detail page so the analysis is visible right away
    navigate(`/documents/${newDocument._id}`);
  };

  // Open the styled confirm dialog instead of browser confirm()
  const requestDelete = (doc) => {
    setConfirmModal({ open: true, docId: doc._id, docName: doc.filename });
  };

  const cancelDelete = () => {
    setConfirmModal({ open: false, docId: null, docName: '' });
  };

  const confirmDelete = async () => {
    const id = confirmModal.docId;
    setConfirmModal({ open: false, docId: null, docName: '' });
    setDeletingId(id);
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete document.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary font-sans">
          {t('documents') || 'Document Repository'}
        </h1>
        <p className="text-sm text-muted mt-1">
          Upload and review legal notices, lease agreements, and official paperwork with instant AI risk breakdown.
        </p>
      </div>

      <DocumentUpload onUpload={handleUpload} />

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          padding: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold shimmer top line */}
        <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(212,164,58,0.5),transparent)', pointerEvents:'none' }} />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Your Documents
          </h2>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(42,48,74,0.6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
              <FileText className="w-6 h-6" style={{ color:'rgba(100,116,139,0.6)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>
              {documents.length === 0 ? 'No documents uploaded yet' : 'No documents match your search'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onView={(d) => navigate(`/documents/${d._id}`)}
                onDelete={(d) => requestDelete(d)}
                isDeleting={deletingId === doc._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── SUPPORTED DOCUMENTS & SCAN CAPABILITIES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
            border: '1px solid rgba(212,164,58,0.25)',
          }}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">
            <FileCheck2 className="w-4 h-4" />
            <span>Supported Contracts</span>
          </div>
          <h3 className="text-base font-bold text-primary mb-3">
            What Can You Analyze?
          </h3>
          <ul className="space-y-2 text-xs text-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Residential & Commercial Leases:</strong> Lock-in clauses, deposit deduction terms, and maintenance liabilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Employment Letters & NDAs:</strong> Post-employment non-compete clauses (Section 27 Contract Act), notice buyout terms.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Loan & Mortgage Sanctions:</strong> Pre-payment penalty charges, floating interest benchmarks, and foreclosure rights.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Legal Notices & Demand Letters:</strong> Response deadlines, statutory references, and dispute background.</span>
            </li>
          </ul>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
            border: '1px solid rgba(224,122,95,0.25)',
          }}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
            <AlertOctagon className="w-4 h-4" />
            <span>Risk Detection</span>
          </div>
          <h3 className="text-base font-bold text-primary mb-3">
            Unfair Clauses We Flag
          </h3>
          <ul className="space-y-2 text-xs text-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Unilateral Indemnity Clauses:</strong> Shifting unlimited third-party damages solely onto you.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Distant Jurisdiction Traps:</strong> Forcing court or arbitration venues thousands of miles away.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Automatic Silent Renewals:</strong> Binding you into another financial term without prior explicit consent.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Arbitrary Termination:</strong> Immediate termination rights reserved by one party with no right to cure.</span>
            </li>
          </ul>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 26, 48, 0.65) 0%, rgba(12, 16, 28, 0.55) 100%)',
            border: '1px solid rgba(34,168,112,0.25)',
          }}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Security Guarantee</span>
          </div>
          <h3 className="text-base font-bold text-primary mb-3">
            Enterprise-Grade Privacy
          </h3>
          <ul className="space-y-2 text-xs text-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>No Public Directory Exposure:</strong> Uploads are never served via public static URLs; files are streamed only to verified owners.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Zero AI Training:</strong> Your agreements and notices are never used to train or fine-tune commercial models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Instant Permanent Deletion:</strong> Deleting a document removes both the file from disk and its metadata from the database immediately.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Styled delete confirmation modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={cancelDelete}
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
                <span className="text-white font-medium break-all">{confirmModal.docName}</span> will be
                permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              variant="danger"
              iconLeft={<Trash2 className="w-4 h-4" />}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Documents;
