"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Calendar,
  MessageSquare,
  ChevronRight,
  Filter,
  Search,
  Home,
  User,
  Phone,
  Download,
  Eye,
  Edit,
  XCircle,
  Paperclip,
  AlertTriangle
} from "lucide-react";
import toast from 'react-hot-toast';
import { RequestDetailsModal } from "./RequestDetailsModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    priority: "medium",
    images: []
  });

  // Sample initial data
  useEffect(() => {
    const sampleRequests = [
      {
        id: 1,
        category: "Plumbing",
        title: "Leaking Kitchen Faucet",
        description: "The kitchen faucet has been leaking for 2 days. Water is dripping constantly and making the floor wet.",
        priority: "high",
        status: "Pending",
        date: "2024-03-15",
        property: "123 Main St, Apt 4B",
        assignedTo: "Maintenance Team",
        estimatedDate: "2024-03-18",
        comments: [
          { id: 1, user: "Admin", text: "We've scheduled a plumber for Monday", date: "2024-03-16" }
        ],
        images: []
      },
      {
        id: 2,
        category: "Electrical",
        title: "Living Room Outlet Not Working",
        description: "One of the electrical outlets in the living room has stopped working completely.",
        priority: "medium",
        status: "In Progress",
        date: "2024-03-10",
        property: "123 Main St, Apt 4B",
        assignedTo: "Electrician",
        estimatedDate: "2024-03-12",
        comments: [],
        images: []
      },
      {
        id: 3,
        category: "AC / Cooling",
        title: "Air Conditioner Not Cooling",
        description: "AC is running but not cooling the bedroom properly.",
        priority: "high",
        status: "Completed",
        date: "2024-03-01",
        property: "123 Main St, Apt 4B",
        assignedTo: "HVAC Specialist",
        estimatedDate: "2024-03-03",
        completedDate: "2024-03-02",
        comments: [],
        images: [],
        rating: 5
      }
    ];
    setRequests(sampleRequests);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRequest = {
        id: Date.now(),
        category: form.category,
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: "Pending",
        date: new Date().toISOString().split('T')[0],
        property: "123 Main St, Apt 4B",
        assignedTo: null,
        estimatedDate: null,
        comments: [],
        images: form.images
      };

      setRequests([newRequest, ...requests]);
      setForm({
        category: "",
        title: "",
        description: "",
        priority: "medium",
        images: []
      });
      setShowForm(false);

      toast.success('Maintenance request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addComment = (requestId, commentText) => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          comments: [...req.comments, {
            id: req.comments.length + 1,
            user: "Tenant",
            text: commentText,
            date: new Date().toISOString().split('T')[0]
          }]
        };
      }
      return req;
    }));
    toast.success('Comment added successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'In Progress': return <AlertCircle className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter !== 'all' && req.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(query) ||
        req.description.toLowerCase().includes(query) ||
        req.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Completed').length
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Maintenance Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Report and track maintenance issues for your property
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#004087] text-white px-5 py-2.5 rounded-lg hover:bg-[#003366] transition whitespace-nowrap"
        >
          <PlusCircle size={18} />
          New Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">

            <Select
              value={filter}
              onValueChange={(value) => setFilter(value)}
            >
              <SelectTrigger className="w-[180px] rounded-lg">
                <SelectValue placeholder="Filter requests" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Submit New Request
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Home className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-900">Property</p>
                  <p className="text-blue-700">123 Main St, Apt 4B</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>

                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                  required
                >
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="AC / Cooling">AC / Cooling</SelectItem>
                    <SelectItem value="Appliances">Appliances</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Pest Control">Pest Control</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'urgent'].map((level) => (
                    <label key={level} className="relative">
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={form.priority === level}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`p-3 text-center border rounded-lg cursor-pointer ${form.priority === level ? 'border-[#004087] ring-2 ring-blue-200' : 'border-gray-300'}`}>
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(level)} mx-auto mb-1`}></div>
                        <span className="text-sm font-medium capitalize">{level}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#004087] focus:border-transparent"
                placeholder="e.g. Bathroom pipe leaking, Kitchen sink clogged"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#004087] focus:border-transparent"
                placeholder="Describe the issue in detail. Include when it started, specific location, and any other relevant information."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload photos</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </label>
              </div>

              {form.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Uploaded Photos:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Access Time (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Morning', 'Afternoon', 'Evening', 'Anytime'].map(time => (
                  <button
                    type="button"
                    key={time}
                    className={`py-2 text-sm rounded-lg ${form.preferredTime === time ? 'bg-blue-100 text-blue-700 border-blue-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setForm({ ...form, preferredTime: time })}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#004087] text-white rounded-lg hover:bg-[#003366] disabled:opacity-50 flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Issue</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{req.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{req.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {req.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(req.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(req.priority)}`}></div>
                        <span className="capitalize">{req.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        {req.status === 'Pending' && (
                          <button
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                        {req.comments && req.comments.length > 0 && (
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative"
                            title="View Comments"
                          >
                            <MessageSquare className="h-4 w-4 text-gray-600" />
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {req.comments.length}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        !showForm && (
          <div className="bg-white border rounded-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Wrench className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No maintenance requests found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || filter !== 'all'
                ? 'No requests match your search criteria. Try adjusting your filters.'
                : 'You haven\'t submitted any maintenance requests yet. Report an issue to get started.'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#004087] text-white px-6 py-3 rounded-lg hover:bg-[#003366] transition"
            >
              <PlusCircle size={18} />
              Submit First Request
            </button>
            {(searchQuery || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="ml-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )
      )}

      {/* Emergency Contact Card */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Emergency Contact</h3>
            <p className="text-red-700 mb-4">
              For emergency issues (flooding, gas leak, electrical hazard, no power), contact immediately:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-900">Emergency Hotline</p>
                  <p className="text-red-700">(555) 123-EMER</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-900">Property Manager</p>
                  <p className="text-red-700">John Smith - (555) 987-6543</p>
                </div>
              </div>
            </div>
            <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Call Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAddComment={addComment}
        />
      )}
    </div>
  );
}