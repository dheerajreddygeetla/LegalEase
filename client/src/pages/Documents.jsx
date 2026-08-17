import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, FileText, Trash2, Sparkles, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import RiskBadge from '../components/ui/RiskBadge';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [viewingDoc, setViewingDoc] = useState(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF, DOCX, or TXT files only.');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSummary(res.data.data.summary);
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
      loadDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      loadDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const viewSummary = (doc) => {
    setViewingDoc(doc);
    setSummary(doc.summary || 'No summary available.');
  };

  const closeSummary = () => {
    setViewingDoc(null);
    setSummary('');
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-2">
        <span className="kicker">
          <Sparkles className="w-3.5 h-3.5 text-cyan" />
          Document analyzer
        </span>
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink mt-3 mb-8">Your documents</h1>

      {/* Upload Form */}
      <GlassCard className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
            <Upload className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Upload a legal document</h2>
            <p className="text-xs text-ink-dim mt-0.5">Supports PDF, DOCX, TXT (max 10MB)</p>
          </div>
        </div>
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="input-field"
              disabled={uploading}
            />
          </div>
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="btn-primary shrink-0 w-full md:w-auto"
          >
            {uploading ? 'Uploading…' : 'Upload & analyze'}
          </button>
        </form>
        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-dim bg-blue/10 border border-blue/25 rounded-lg px-4 py-3">
            <Sparkles className="w-4 h-4 text-blue animate-pulse" />
            Processing document with AI…
          </div>
        )}
      </GlassCard>

      {/* Summary Display */}
      {summary && !viewingDoc && (
        <GlassCard className="mb-8 border-l-[3px] border-l-blue">
          <div className="flex items-center justify-between mb-3">
            <h3 className="kicker flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan" />
              AI Summary
            </h3>
            <button onClick={() => setSummary('')} className="btn-ghost text-xs">
              Close
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm text-ink leading-relaxed bg-white/[0.03] rounded-lg p-4">{summary}</div>
        </GlassCard>
      )}

      {/* Document List */}
      <h2 className="font-display text-lg font-semibold text-ink mb-4">Uploaded files</h2>
      {loading ? (
        <div className="text-center text-ink-dim text-sm py-12">
          <div className="w-8 h-8 mx-auto mb-3 rounded-lg border-2 border-border border-t-blue/50 animate-spin" />
          Loading documents…
        </div>
      ) : documents.length === 0 ? (
        <GlassCard className="border-dashed p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
            <FileText className="w-8 h-8 text-ink-faint" strokeWidth={1.5} />
          </div>
          <p className="text-ink-dim text-sm">No documents uploaded yet.</p>
          <p className="text-ink-faint text-xs mt-1">Upload your first legal document to get started</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <GlassCard key={doc._id} lift className="group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
                  <FileText className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  doc.status === 'processed' 
                    ? 'bg-risk-low/10 text-risk-low ring-1 ring-inset ring-risk-low/25' 
                    : 'bg-risk-medium/10 text-risk-medium ring-1 ring-inset ring-risk-medium/25'
                }`}>
                  {doc.status === 'processed' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {doc.status}
                </div>
              </div>
              <h3 className="font-semibold text-sm text-ink truncate mb-2">{doc.filename}</h3>
              <p className="text-xs text-ink-dim font-mono mb-4">
                {doc.fileType?.toUpperCase() || 'PDF'} · {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button 
                  onClick={() => viewSummary(doc)} 
                  className="flex-1 btn-secondary text-xs py-2"
                >
                  View Summary
                </button>
                <button
                  onClick={() => deleteDocument(doc._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-faint hover:text-risk-high hover:bg-risk-high/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Summary Modal/Popup */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeSummary}>
          <GlassCard 
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
                  <FileText className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">{viewingDoc.filename}</h2>
                  <p className="text-xs text-ink-dim font-mono mt-0.5">
                    Uploaded {new Date(viewingDoc.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={closeSummary} 
                className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-faint hover:text-ink hover:bg-white/[0.05] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm text-ink leading-relaxed bg-white/[0.03] rounded-lg p-5 border border-border">
              {viewingDoc.summary || 'No summary available.'}
            </div>
            <div className="flex justify-end mt-5">
              <button onClick={closeSummary} className="btn-secondary">
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Documents;
