'use client';

import { dummyLeases } from "@/store/dummyLeases";
import { useAuth } from "@/hooks/userAuth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import LeaseForm from "@/components/dashboard/Owner/leases/LeaseForm/LeaseForm";

export default function EditLeasePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lease, setLease] = useState(null);

  useEffect(() => {
    // Find lease from dummy data or fetch from API
    const foundLease = dummyLeases.find(l => l.id === params.id);
    setLease(foundLease);
    setLoading(false);
  }, [params.id]);

  const landlordData = {
    name: user?.name || 'John Smith',
    email: user?.email || 'john@example.com'
  };

  const handleSuccess = (updatedLease) => {
    // Navigate back to lease details
    router.push(`/dashboard/owner/leases/${params.id}`);
  };

  const handleBack = () => {
    router.back();
  };

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

  // Prepare data for form
  const formInitialData = {
    propertyAddress: lease.propertyAddress,
    landlordName: lease.landlordName,
    tenantName: lease.tenantName,
    startDate: lease.startDate,
    endDate: lease.endDate,
    monthlyRent: lease.rent.toString(),
    paymentDay: lease.paymentDay?.toString() || '1',
    securityDeposit: lease.securityDeposit?.toString() || '',
    paymentMethod: lease.paymentMethod || 'bank_transfer',
    utilitiesIncluded: lease.utilitiesIncluded || ['water', 'electricity'],
    utilitiesTenantPaid: lease.utilitiesTenantPaid || ['internet', 'cable'],
    occupants: Array.isArray(lease.occupants) ? lease.occupants.join(', ') : lease.occupants || '',
    noticeDays: lease.noticeDays?.toString() || '30',
    additionalTerms: lease.additionalTerms || '',
    leaseType: lease.leaseType || 'fixed_term',
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 border border-gray-300 p-2 rounded-md text-[#1F3A34] hover:text-[#2a4d45]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Lease Details
      </button>

      <LeaseForm
        propertyData={{
          address: lease.propertyAddress,
          rent: lease.rent
        }}
        tenantData={{
          name: lease.tenantName,
          email: lease.tenantEmail
        }}
        landlordData={landlordData}
        mode="edit"
        initialData={formInitialData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}