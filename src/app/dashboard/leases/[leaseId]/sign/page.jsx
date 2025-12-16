"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import SignPad from "@/components/dashboard/leases/SignPad";

export default function LeaseSignPage() {
  const { leaseId } = useParams();
  const router = useRouter();

  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState(null);

  const handleSaveSignature = (img) => {
    setSignature(img);
  };

  const handleSubmit = () => {
    if (!agreed) {
      alert("Please agree to the lease terms before signing.");
      return;
    }
    if (!signature) {
      alert("Please provide your signature.");
      return;
    }

    // frontend-only save
    const payload = {
      leaseId,
      signature,
      signedAt: new Date().toISOString(),
    };

    localStorage.setItem(`lease_signature_${leaseId}`, JSON.stringify(payload));

    alert("Lease signed successfully (frontend demo).");
    router.push("/dashboard/leases");
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F3A34]">Sign Lease</h1>
          <p className="text-sm text-gray-600">
            Review the lease agreement and sign below.
          </p>
        </div>

        <Link
          href={`/dashboard/leases/${leaseId}`}
          className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50"
        >
          ← Back
        </Link>
      </div>

      {/* Lease preview (placeholder) */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1F3A34]">
          Lease Agreement Preview
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          This is a frontend-only preview. Final PDF will be generated after backend integration.
        </p>

        <div className="mt-4 h-[160px] overflow-y-auto rounded-xl border border-gray-200 p-4 text-sm text-gray-700">
          <p className="mb-3 font-semibold">Residential Lease Agreement</p>
          <p>
            This Lease Agreement is entered into between the Owner and the Tenant
            for the rental of the property identified in this agreement...
          </p>
          <p className="mt-3">
            The tenant agrees to pay rent on time, maintain the property, and comply
            with all terms stated herein.
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1F3A34]">Your Signature</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please sign using your mouse or touch screen.
        </p>

        <div className="mt-4">
          <SignPad onSave={handleSaveSignature} />
        </div>

        {signature && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Signature Preview:
            </p>
            <img
              src={signature}
              alt="Signature preview"
              className="h-[80px] border border-gray-200 rounded-lg bg-white"
            />
          </div>
        )}

        {/* Agreement */}
        <div className="mt-6 flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <p className="text-sm text-gray-700">
            I confirm that I have reviewed the lease agreement and agree to all
            terms and conditions.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-2xl bg-[#004087] text-white font-medium hover:opacity-95"
          >
            Sign & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
