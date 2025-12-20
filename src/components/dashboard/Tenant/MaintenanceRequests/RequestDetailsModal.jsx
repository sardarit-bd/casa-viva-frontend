import { AlertCircle, Calendar, CheckCircle, Clock, Download, Home, MessageSquare, Phone, XCircle } from "lucide-react";
import { useState } from "react";

export function RequestDetailsModal({ request, onClose, onAddComment }) {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(request.id, newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {request.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {request.priority} priority
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{request.title}</h2>
              <p className="text-gray-600 mt-1">
                <Home className="inline h-4 w-4 mr-1" />
                {request.property}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{request.description}</p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reported</p>
                      <p className="text-gray-600">{formatDate(request.date)}</p>
                    </div>
                  </div>
                  
                  {request.estimatedDate && (
                    <div className="flex items-start">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Estimated Resolution</p>
                        <p className="text-gray-600">{formatDate(request.estimatedDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  {request.completedDate && (
                    <div className="flex items-start">
                      <div className="p-2 bg-green-100 rounded-lg mr-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Completed</p>
                        <p className="text-gray-600">{formatDate(request.completedDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Updates & Comments
                </h3>
                <div className="space-y-4">
                  {request.comments?.map(comment => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">{comment.user}</span>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                  
                  {request.comments?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                  )}
                </div>
                
                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or update..."
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#003366]"
                  >
                    Add Comment
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Info & Actions */}
            <div className="space-y-6">
              {/* Details Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{request.category}</p>
                  </div>
                  {request.assignedTo && (
                    <div>
                      <p className="text-sm text-gray-600">Assigned To</p>
                      <p className="font-medium text-gray-900">{request.assignedTo}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Reported Date</p>
                    <p className="font-medium text-gray-900">{formatDate(request.date)}</p>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                  
                  {request.status === 'Pending' && (
                    <button className="w-full flex items-center justify-center p-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Mark as Urgent
                    </button>
                  )}
                  
                  {request.status === 'In Progress' && (
                    <button className="w-full flex items-center justify-center p-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Maintenance
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center p-3 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Maintenance
                  </button>
                  <button className="w-full flex items-center justify-center p-3 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}