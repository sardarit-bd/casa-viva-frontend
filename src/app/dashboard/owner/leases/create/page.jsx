'use client';

import LeaseForm from "@/components/dashboard/Owner/leases/LeaseForm/LeaseForm";
import { useAuth } from "@/hooks/userAuth";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data - in real app, fetch from API
const mockPropertyData = {
  id: 'PROP-001',
  title: 'Sunset Apartment #304',
  address: '123 Beach Rd, Santa Monica, CA',
  rent: 1200,
  bedrooms: 2,
  bathrooms: 1,
  size: '850 sq ft'
};

const mockTenantData = {
  id: 'TEN-001',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+1 234 567 8900'
};

export default function CreateLeasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const prefill = searchParams.get('prefill') === 'true';

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]"></div>
      </div>
    );
  }

  const landlordData = {
    name: user?.name || 'John Smith',
    email: user?.email || 'john@example.com'
  };

  const handleSuccess = (leaseData) => {
    // Navigate to the new lease details
    router.push(`/dashboard/owner/leases/${leaseData.id}`);
  };

  const handleBack = () => {
    router.push('/dashboard/owner/leases');
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

      <LeaseForm
        propertyData={prefill ? mockPropertyData : null}
        tenantData={prefill ? mockTenantData : null}
        landlordData={landlordData}
        mode="create"
        onSuccess={handleSuccess}
      />

    </div>
  );
}