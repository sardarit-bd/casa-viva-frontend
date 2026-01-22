// frontend/src/app/dashboard/tenant/leases/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { leaseService } from "@/services/lease.service";

export default function TenantLeaseViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeText, setChangeText] = useState("");
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const response = await leaseService.getLeaseById(id);
      if (response.success) {
        setLease(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch lease details');
      console.error('Error fetching lease:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeText.trim()) return;

    try {
      setSubmitting(true);

      const res = await leaseService.requestChanges(
        lease._id,
        changeText
      );

      if (res.success) {
        alert("Change request sent to landlord");
        setShowChangeModal(false);
        setChangeText("");
        fetchLease(); // refresh data
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request changes");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Lease not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-gray-50"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">
        Lease Agreement: {lease.property?.title || 'N/A'}
      </h1>
      <p className="text-gray-600 mb-6 flex items-center gap-1">
        <MapPin size={16} />
        {lease.property?.address || 'Address not available'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lease Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{lease.status.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rent Amount</p>
                <p className="font-medium">${lease.rentAmount} / {lease.rentFrequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Security Deposit</p>
                <p className="font-medium">${lease.securityDeposit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lease Duration</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar size={16} />
                  {lease.startDate ? new Date(lease.startDate).toLocaleDateString() : '—'} to
                  {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Signatures</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Landlord</h3>
                <p className="text-sm text-gray-600">
                  {lease.signatures?.landlord?.signedAt
                    ? `Signed on ${new Date(lease.signatures.landlord.signedAt).toLocaleDateString()}`
                    : 'Pending signature'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tenant (You)</h3>
                <p className="text-sm text-gray-600">
                  {lease.signatures?.tenant?.signedAt
                    ? `Signed on ${new Date(lease.signatures.tenant.signedAt).toLocaleDateString()}`
                    : 'Pending signature'}
                </p>
              </div>
            </div>
          </div>

          {lease.status === "sent_to_tenant" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Need changes before signing?
              </h3>
              <p className="text-sm text-yellow-700 mb-4">
                You can request changes to this lease before signing.
              </p>

              <button
                onClick={() => setShowChangeModal(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Request Changes
              </button>
            </div>
          )}

        </div>

        {/* Right Column - Parties Information */}
        <div className="space-y-6">
          {/* Landlord Info */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Landlord</h2>
            <div className="space-y-3">
              <p className="font-medium">{lease.landlord?.name || 'N/A'}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                {lease.landlord?.email || 'Email not available'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                {lease.landlord?.phone || 'Phone not available'}
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Property Details</h2>
            <div className="space-y-2">
              <p className="font-medium">{lease.property?.title || 'N/A'}</p>
              <p className="text-sm text-gray-600">{lease.property?.address || 'Address not available'}</p>
              <p className="text-sm text-gray-600">{lease.property?.city}, {lease.property?.state} {lease.property?.zipCode}</p>
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {lease.property?.amenities?.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">
              Request Changes
            </h3>

            <textarea
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
              rows={4}
              placeholder="Describe the changes you want..."
              className="w-full border rounded-lg p-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={!changeText.trim() || submitting}
                onClick={handleRequestChanges}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}