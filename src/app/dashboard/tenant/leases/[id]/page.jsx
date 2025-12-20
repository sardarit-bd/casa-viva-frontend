"use client";

import { useParams, useRouter } from "next/navigation";
import { dummyLeases } from "@/store/dummyLeases";
import { ArrowLeft } from "lucide-react";

export default function TenantLeaseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const lease = dummyLeases.find((l) => l.id === id);

  if (!lease) return <p className="p-6">Lease not found</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 border px-3 py-2 rounded-md"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">
        Lease for {lease.propertyTitle}
      </h1>
      <p className="text-gray-600 mb-6">{lease.propertyAddress}</p>

      <div className="bg-white border rounded-xl p-6 space-y-3">
        <p><b>Tenant:</b> {lease.tenantName}</p>
        <p><b>Rent:</b> ${lease.rent}</p>
        <p><b>Term:</b> {lease.startDate} → {lease.endDate}</p>
        <p><b>Status:</b> {lease.status}</p>
      </div>
    </div>
  );
}
