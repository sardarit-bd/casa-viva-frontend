// frontend/src/app/dashboard/owner/leases/[id]/page.js
"use client";

import LeaseStatusBadge, { LeaseStatusTimeline } from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Download,
  Send,
  Edit,
  Printer,
  Share2,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Home,
  User,
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";
import { leaseService } from "@/services/lease.service";

export default function LeaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLease();
  }, [params.id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching lease details for ID:', params.id);

      const response = await leaseService.getLeaseById(params.id);

      console.log('Lease details response:', {
        success: response.success,
        data: response.data
      });

      if (response.success) {
        setLease(response.data);
      } else {
        setError(response.message || 'Failed to fetch lease');
      }
    } catch (err) {
      console.error('Error fetching lease:', err);
      setError(err.message || 'Failed to fetch lease details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for lease:', params.id);
  };

  const handleSendForSignature = async () => {
    try {
      const response = await leaseService.sendToTenant(params.id, "Please review and sign the lease agreement.");
      if (response.success) {
        alert('Lease sent to tenant successfully!');
        fetchLease(); // Refresh lease data
      }
    } catch (error) {
      console.error('Error sending lease:', error);
      alert(error.response?.data?.message || 'Failed to send lease');
    }
  };

  const handleBack = () => {
    router.push('/dashboard/owner/leases');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#1F3A34]" />
          <p className="text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Lease</h3>
          </div>

          <p className="text-red-600 mb-4">{error}</p>

          <div className="flex gap-3">
            <button
              onClick={fetchLease}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Leases
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#004087]">Lease Not Found</h1>
        <p className="text-gray-600 mt-2">The requested lease does not exist.</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-[#004087] text-white rounded-lg"
        >
          Back to Leases
        </button>
      </div>
    );
  }

  const isSignedByLandlord = lease.signatures?.landlord?.signedAt;
  const isSignedByTenant = lease.signatures?.tenant?.signedAt;
  const isFullySigned = isSignedByLandlord && isSignedByTenant;

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 border border-gray-300 p-2 rounded-md text-[#1F3A34] hover:text-[#2a4d45]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Leases
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#004087]">{lease.property?.title || 'Lease Agreement'}</h1>
          <p className="text-gray-600">{lease.property?.address || 'Address not available'}</p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>

          {(lease.status === 'draft' || lease.status === 'changes_requested') && (
            <button
              onClick={() => router.push(`/dashboard/owner/leases/${params.id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              Edit Lease
            </button>
          )}

          {lease.status === 'draft' && (
            <button
              onClick={handleSendForSignature}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              Send to Tenant
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-8">
        <LeaseStatusBadge status={lease.status} size="lg" />
        {isFullySigned && (
          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Fully signed</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Lease Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-[#1F3A34] mb-6">Lease Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">Property</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Home className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.property?.title || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.property?.address || 'Address not available'}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Tenant</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.tenant?.name || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.tenant?.email || 'Email not available'}</p>
                  <p className="text-sm text-gray-600">{lease.tenant?.phone || ''}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Landlord</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.landlord?.name || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.landlord?.email || 'Email not available'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">Lease Term</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {lease.startDate ? new Date(lease.startDate).toLocaleDateString() : 'Not set'} to
                      {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {lease.rentFrequency === 'monthly' ? 'Monthly Lease' : 'Other'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Monthly Rent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formatCurrency(lease.rentAmount)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Payment frequency: {lease.rentFrequency}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Security Deposit</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formatCurrency(lease.securityDeposit)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Signatures</label>
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${isSignedByLandlord ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Landlord: {isSignedByLandlord ? 'Signed' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${isSignedByTenant ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Tenant: {isSignedByTenant ? 'Signed' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {lease.description && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1F3A34] mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{lease.description}</p>
            </div>
          )}

          {/* Tenant Change Requests */}
          {lease.requestedChanges?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Change Requests from Tenant
              </h3>

              <div className="space-y-4">
                {lease.requestedChanges.map((req, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <p className="text-sm text-gray-800 whitespace-pre-line">
                      {req.changes}
                    </p>

                    <div className="text-xs text-gray-500 mt-2">
                      Requested on: {new Date(req.requestedAt).toLocaleDateString()}
                    </div>

                    {!req.resolved && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => router.push(`/dashboard/owner/leases/${lease._id}/edit`)}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg"
                        >
                          Edit Lease
                        </button>

                        {/* <button
                          onClick={() => handleResolveChange(index)}
                          className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg"
                        >
                          Mark as Resolved
                        </button> */}
                      </div>
                    )}

                    {req.resolved && (
                      <p className="text-xs text-green-600 mt-3">
                        ✔ Resolved on {new Date(req.resolvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status Timeline & Actions */}
        <div className="space-y-8">
          {/* Status Timeline */}
          <LeaseStatusTimeline lease={lease} />

          {/* Lease Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Lease Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lease ID</span>
                <span className="font-mono">{lease._id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span>{lease.createdAt ? new Date(lease.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Updated</span>
                <span>{lease.updatedAt ? new Date(lease.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <LeaseStatusBadge status={lease.status} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}