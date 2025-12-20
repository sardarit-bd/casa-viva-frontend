'use client';

import LeaseStatusBadge, { LeaseStatusTimeline } from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import { dummyLeases } from "@/store/dummyLeases";
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
  Clock
} from "lucide-react";

export default function LeaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundLease = dummyLeases.find(l => l.id === params.id);
    setLease(foundLease);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]"></div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#1F3A34]">Lease Not Found</h1>
        <p className="text-gray-600 mt-2">The requested lease does not exist.</p>
        <button 
          onClick={() => router.push('/dashboard/owner/leases')}
          className="mt-4 px-4 py-2 bg-[#1F3A34] text-white rounded-lg"
        >
          Back to Leases
        </button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for lease:', lease.id);
  };

  const handleSendForSignature = () => {
    console.log('Sending lease for signature:', lease.id);
  };

  const handleBack = () => {
    router.push('/dashboard/owner/leases');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
          <h1 className="text-2xl font-bold text-[#1F3A34]">{lease.id} - {lease.propertyTitle}</h1>
          <p className="text-gray-600">{lease.propertyAddress}</p>
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
              onClick={() => router.push(`/dashboard/owner/leases/${lease.id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              Edit Lease
            </button>
          )}
          
          {lease.status === 'sent_to_tenant' && (
            <button
              onClick={handleSendForSignature}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              Send for Signature
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-8">
        <LeaseStatusBadge status={lease.status} size="lg" />
        {lease.signedDate && (
          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Signed on {lease.signedDate}</span>
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
                    <span className="font-medium">{lease.propertyTitle}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.propertyAddress}</p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500">Tenant</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.tenantName}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.tenantEmail}</p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500">Landlord</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.landlordName}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">Lease Term</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {lease.startDate} to {lease.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {lease.leaseType === 'fixed_term' ? 'Fixed Term Lease' : 'Month-to-Month Lease'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500">Monthly Rent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formatCurrency(lease.rent)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Due on day {lease.paymentDay} of each month</p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500">Security Deposit</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formatCurrency(lease.securityDeposit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          {lease.additionalTerms && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1F3A34] mb-4">Additional Terms</h2>
              <p className="text-gray-700 whitespace-pre-line">{lease.additionalTerms}</p>
            </div>
          )}
        </div>

        {/* Right Column - Status Timeline & Actions */}
        <div className="space-y-8">
          {/* Status Timeline */}
          <LeaseStatusTimeline lease={lease} />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span>Download Lease PDF</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => console.log('Email lease')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>Email to Tenant</span>
                </div>
              </button>
              
              <button
                onClick={() => console.log('Print lease')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Printer className="h-5 w-5 text-gray-500" />
                  <span>Print</span>
                </div>
              </button>
              
              <button
                onClick={() => console.log('Share lease')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-gray-500" />
                  <span>Share</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}