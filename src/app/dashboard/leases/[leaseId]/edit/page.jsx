"use client";

import LeaseForm from "@/components/dashboard/leases/LeaseForm";
import { useParams, useRouter } from "next/navigation";

export default function EditLeasePage() {
  const { leaseId } = useParams();
  const router = useRouter();

  const handleSubmit = async (data) => {
    alert(`Lease ${leaseId} updated (frontend demo).`);
    router.push("/dashboard/leases");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Edit Lease</h1>
      <p className="text-sm text-gray-600 mt-1">Lease ID: {leaseId}</p>

      <LeaseForm mode="edit" onSubmit={handleSubmit} />
    </div>
  );
}
