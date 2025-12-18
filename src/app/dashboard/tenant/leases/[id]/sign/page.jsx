"use client";

import { useParams, useRouter } from "next/navigation";
import SignatureView from "@/components/dashboard/Owner/leases/LeaseForm/SignatureView";
import { dummyLeases } from "@/store/dummyLeases";
import { ArrowLeft } from "lucide-react";

export default function TenantSignLeasePage() {
    const { id } = useParams();
    const router = useRouter();

    const lease = dummyLeases.find((l) => l.id === id);

    if (!lease) return <p className="p-6">Lease not found</p>;

    const handleSigned = () => {
        alert("Lease signed successfully");
        router.push(`/dashboard/tenant/leases/${id}`);
    };

    return (
        <div className="p-6">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 border px-3 py-2 rounded-md"
            >
                <ArrowLeft size={16} />
                Back
            </button>
            <SignatureView
                data={lease}
                onSign={handleSigned}
                loading={false}
            />
        </div>
    );
}
