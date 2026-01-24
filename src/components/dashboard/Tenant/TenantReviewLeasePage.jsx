"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Loader2, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  Home,
  User,
  MapPin,
  Clock,
  Send,
  Edit,
  XCircle
} from "lucide-react";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";

export default function TenantReviewLeasePage() {
  const { id } = useParams();
  const router = useRouter();

  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(""); // "approve" or "request_changes"
  const [changes, setChanges] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const res = await leaseService.getLeaseById(id);

      if (res.success) {
        setLease(res.data);
        // Check if lease is in correct status for review
        if (res.data.status !== "sent_to_tenant") {
          router.push(`/dashboard/tenant/leases/${id}`);
          toast.error("This lease is not available for review");
        }
      } else {
        setError("Lease not found");
      }
    } catch (err) {
      setError(err.message || "Failed to load lease");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!action) {
      toast.error("Please select an action");
      return;
    }

    if (action === "request_changes" && !changes.trim()) {
      toast.error("Please describe the changes you're requesting");
      return;
    }

    try {
      setSubmitting(true);
      
      const res = await leaseService.tenantReviewLease(
        id,
        action,
        changes,
        message
      );

      if (res.success) {
        if (action === "approve") {
          toast.success("Lease approved and sent to landlord!");
          router.push(`/dashboard/tenant/leases/${id}`);
        } else {
          toast.success("Change request submitted!");
          router.push(`/dashboard/tenant/leases/${id}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A34]" />
          <p className="text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">{error || "Lease not found"}</p>
          <button
            onClick={() => router.push("/dashboard/tenant/leases")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Leases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/dashboard/tenant/leases/${id}`)}
        className="mb-6 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Lease Details
      </button>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F3A34] mb-3">
          Review Lease Agreement
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please review the lease terms below. You can either approve and send to landlord, or request changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Lease Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease Summary Card */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1F3A34]">
                  {lease.property?.title}
                </h2>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin size={16} />
                  {lease.property?.address}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                <p className="text-2xl font-bold text-[#1F3A34]">
                  ${lease.rentAmount?.toLocaleString() ?? "0"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                <p className="text-2xl font-bold text-[#1F3A34]">
                  ${lease.securityDeposit?.toLocaleString() ?? "0"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Lease Start</p>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="font-medium">
                    {lease.startDate
                      ? new Date(lease.startDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Lease End</p>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="font-medium">
                    {lease.endDate
                      ? new Date(lease.endDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Terms */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Key Terms</h3>
              <div className="space-y-3">
                {lease.utilities?.includedInRent?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-700">Utilities Included</p>
                      <p className="text-sm text-gray-600">
                        {lease.utilities.includedInRent.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {lease.utilities?.paidByTenant?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-700">Tenant Pays</p>
                      <p className="text-sm text-gray-600">
                        {lease.utilities.paidByTenant.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {lease.lateFee && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-700">Late Fee</p>
                      <p className="text-sm text-gray-600">
                        ${lease.lateFee} after {lease.gracePeriod || 5} days grace period
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Selection */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Select Your Action</h3>
            
            <div className="space-y-4">
              {/* Approve Option */}
              <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${action === "approve" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="action"
                    value="approve"
                    checked={action === "approve"}
                    onChange={(e) => setAction(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`w-5 h-5 ${action === "approve" ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`font-medium ${action === "approve" ? "text-green-800" : "text-gray-900"}`}>
                        Approve and Send to Landlord
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      I accept all terms and conditions. The lease will be sent to the landlord for their signature first.
                    </p>
                  </div>
                </div>
              </label>

              {/* Request Changes Option */}
              <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${action === "request_changes" ? "border-yellow-500 bg-yellow-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="action"
                    value="request_changes"
                    checked={action === "request_changes"}
                    onChange={(e) => setAction(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit className={`w-5 h-5 ${action === "request_changes" ? "text-yellow-600" : "text-gray-400"}`} />
                      <span className={`font-medium ${action === "request_changes" ? "text-yellow-800" : "text-gray-900"}`}>
                        Request Changes
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      I need some changes before I can approve. The landlord will update the lease and send it back.
                    </p>
                    
                    {action === "request_changes" && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Describe the changes you need
                        </label>
                        <textarea
                          rows={4}
                          value={changes}
                          onChange={(e) => setChanges(e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Example: Please update the rent amount from $1500 to $1450. Also, I would like to add a pet clause..."
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>

            {/* Additional Message */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional comments or notes for the landlord..."
              />
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Submit */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Property</span>
                <span className="font-medium">{lease.property?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Monthly Rent</span>
                <span className="font-medium">${lease.rentAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">
                  {lease.startDate && lease.endDate
                    ? `${new Date(lease.startDate).toLocaleDateString()} - ${new Date(lease.endDate).toLocaleDateString()}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Landlord</span>
                <span className="font-medium">{lease.landlord?.name}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  {action === "approve" 
                    ? "After approval, the lease goes to landlord for signature"
                    : action === "request_changes"
                    ? "Landlord will review your changes and update the lease"
                    : "Select an action to proceed"}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Card */}
          <div className="bg-white border rounded-xl p-6">
            <div className="space-y-4">
              <button
                onClick={handleSubmit}
                disabled={!action || submitting || (action === "request_changes" && !changes.trim())}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : action === "approve" ? (
                  <>
                    <Send className="w-5 h-5" />
                    Approve & Send to Landlord
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    Request Changes
                  </>
                )}
              </button>

              <button
                onClick={() => router.push(`/dashboard/tenant/leases/${id}`)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel and Go Back
              </button>

              <p className="text-xs text-gray-500 text-center">
                By proceeding, you acknowledge that you have reviewed all terms
              </p>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700">
                  If you have questions about any terms, please contact the landlord before making a decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}