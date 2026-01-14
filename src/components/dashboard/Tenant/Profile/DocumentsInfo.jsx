import axios from "axios";
import { AlertCircle, Download, Upload, Plus, FileText } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';

export function DocumentsInfo({ documents, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate PDF only
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadedFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/document`,
        formData,
        { withCredentials: true }
      );
      setDocumentUrl(res?.data?.data?.url || '');
      toast.success('PDF uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload PDF');
      setUploadedFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleAddDocument = async () => {
    if (!documentName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    if (!documentUrl.trim()) {
      toast.error('Please upload a PDF file first');
      return;
    }

    // Create document object with the provided info
    const newDocument = {
      name: documentName.trim(),
      url: documentUrl.trim(),
    };

    try {
      // Pass the document to the parent component
      await onUpload(newDocument);
      
      // Reset form
      setDocumentName("");
      setDocumentUrl("");
      setUploadedFileName("");
      
      // Reset file input
      const fileInput = document.getElementById('document-upload');
      if (fileInput) fileInput.value = '';
      
      toast.success('Document added successfully');
    } catch (error) {
      toast.error('Failed to add document');
    }
  };

  const handleChangeFile = () => {
    // Reset upload state and trigger file input click
    setDocumentUrl("");
    setUploadedFileName("");
    const fileInput = document.getElementById('document-upload');
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Upload Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="document-name" className="block text-sm font-medium text-gray-700 mb-2">
            Document Name *
          </label>
          <input
            type="text"
            id="document-name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004087] focus:border-transparent"
            placeholder="e.g., Lease Agreement, ID Proof, etc."
            disabled={uploading}
          />
        </div>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
          <input
            type="file"
            id="document-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,application/pdf"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004087]"></div>
              </div>
              <p className="text-gray-900 font-medium">Uploading {uploadedFileName}...</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          ) : documentUrl ? (
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">PDF uploaded: {uploadedFileName}</span>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => window.open(documentUrl, '_blank')}
                  className="px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#003066] flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  View PDF
                </button>
                <button
                  onClick={handleChangeFile}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Change File
                </button>
              </div>
            </div>
          ) : (
            <label htmlFor="document-upload" className="cursor-pointer block">
              <FileText className="h-12 w-12 text-[#004087] mx-auto mb-3" />
              <p className="text-gray-900 font-medium mb-1">Click to upload PDF</p>
              <p className="text-sm text-gray-500">Only PDF files up to 10MB</p>
            </label>
          )}
        </div>

        <button
          onClick={handleAddDocument}
          disabled={!documentName?.trim() || !documentUrl?.trim() || uploading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#004087] text-white font-medium rounded-lg hover:bg-[#003066] focus:outline-none focus:ring-2 focus:ring-[#004087] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Add Document'}
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Your Documents</span>
        </div>
      </div>

      {/* Documents List */}
      <div>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload your first PDF document above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {console.log(doc.uploadedAt)}
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-500 hover:text-[#004087] transition-colors"
                    onClick={() => window.open(doc.url, '_blank')}
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete document"
                  >
                    <AlertCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}