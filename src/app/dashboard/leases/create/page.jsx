"use client";

import LeaseForm from "@/components/dashboard/leases/LeaseForm";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function CreateLeasePage() {
  const router = useRouter();

  const initialValues = {
    propertyTitle: "2BR Apartment, Punta Cana",
    propertyAddress: "Bavaro, Punta Cana, Dominican Republic",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    rent: 1200,
    deposit: 1200,
    paymentMethod: "Bank Transfer",
    utilitiesIncluded: ["Water"],
    utilitiesPaidByTenant: ["Electricity", "Internet"],
    occupants: "John Smith",
    additionalTerms: "No smoking. No pets without written permission.",
  };

  const handleSubmit = async (data) => {
    const existing = JSON.parse(localStorage.getItem("leases_draft") || "[]");
    const newLease = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      ...data,
      status: "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    localStorage.setItem("leases_draft", JSON.stringify([newLease, ...existing]));

    alert("Saved as Draft (frontend-only).");
    router.push("/dashboard/leases");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F3A34]">Create Lease</h1>
          <p className="text-sm text-gray-600">Create a draft lease. You can send it to the tenant later.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard/leases"
            className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50"
          >
            ← Back
          </Link>
        </div>
      </div>

      <LeaseForm initialValues={initialValues} mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
