"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function LeaseDetailsPage() {
  const { leaseId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Lease Details</h1>
      <p className="mt-2 text-gray-600">Lease ID: {leaseId}</p>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/dashboard/leases/${leaseId}/edit`}
          className="px-4 py-2 rounded-full border"
        >
          Edit
        </Link>

        <Link
          href={`/dashboard/leases/${leaseId}/sign`}
          className="px-4 py-2 rounded-full bg-blue-600 text-white"
        >
          Sign
        </Link>
      </div>
    </div>
  );
}
