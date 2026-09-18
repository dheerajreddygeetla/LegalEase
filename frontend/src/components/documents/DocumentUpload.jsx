import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { DOCUMENT_TYPES, MAX_FILE_SIZE } from '../../utils/constants';
import { formatFileSize } from '../../utils/helpers';
import Card from '../common/Card';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const DocumentUpload = ({ onUpload }) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    if (!Object.values(DOCUMENT_TYPES).includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, DOCX, or TXT files.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const [uploadStage, setUploadStage] = useState('idle'); // idle | uploading | analyzing

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setUploadStage('uploading');
    // Switch message after ~1s to reflect the AI analysis phase
    const stageTimer = setTimeout(() => setUploadStage('analyzing'), 1200);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      clearTimeout(stageTimer);
      setIsUploading(false);
      setUploadStage('idle');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="mb-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-gray-600'}
        `}
      >
        {!selectedFile ? (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('dragDrop')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('or')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              {t('browseFiles')}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              {t('supportedFormats')} • {t('maxSize')}
            </p>
          </>
        ) : (
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button
                  onClick={handleRemoveFile}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {isUploading ? (
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #D4A43A, #E8C05C)',
                      width: uploadStage === 'analyzing' ? '80%' : '35%',
                      transition: 'width 1.2s ease',
                      boxShadow: '0 0 8px rgba(212,164,58,0.5)',
                    }}
                  />
                </div>
                <div className="text-center">
                  {uploadStage === 'analyzing' ? (
                    <>
                      <p className="text-sm font-semibold" style={{ color: '#D4A43A' }}>
                        🔍 Generating AI Analysis...
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Extracting risks, obligations, and key clauses — this takes a few seconds.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ⬆ Uploading document...
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Securely transferring your file.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Button onClick={handleUpload} fullWidth>
                Upload Document
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DocumentUpload;
