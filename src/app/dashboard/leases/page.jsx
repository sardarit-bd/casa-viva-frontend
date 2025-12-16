"use client";

import LeaseStatusBadge from "@/components/dashboard/leases/LeaseStatusBadge";
import { dummyLeases } from "@/store/dummyLeases";
import Link from "next/link";
import { useMemo, useState } from "react";


const FILTERS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent_to_tenant", label: "Sent" },
  { key: "changes_requested", label: "Changes" },
  { key: "signed_by_tenant", label: "Tenant Signed" },
  { key: "fully_executed", label: "Executed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "expired", label: "Expired" },
];

function formatMoney(v) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
  } catch {
    return `$${v}`;
  }
}

export default function LeasesPage() {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const text = q.trim().toLowerCase();

    return dummyLeases
      .filter((l) => (filter === "all" ? true : l.status === filter))
      .filter((l) => {
        if (!text) return true;
        return (
          l.id.toLowerCase().includes(text) ||
          l.propertyTitle.toLowerCase().includes(text) ||
          l.propertyAddress.toLowerCase().includes(text) ||
          l.tenantName.toLowerCase().includes(text)
        );
      })
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [filter, q]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F3A34]">Leases</h1>
          <p className="text-sm text-gray-600">Manage lease drafts, signatures, and executed contracts.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard/leases/create"
            className="px-4 py-2 rounded-full bg-[#004087] text-white text-sm font-medium hover:opacity-95"
          >
            + Create Lease
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${filter === f.key ? "bg-[#1F3A34] text-white border-[#1F3A34]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-full lg:w-[360px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by lease ID, tenant, address..."
            className="w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                <th className="px-5 py-4">Lease</th>
                <th className="px-5 py-4">Property</th>
                <th className="px-5 py-4">Tenant</th>
                <th className="px-5 py-4">Term</th>
                <th className="px-5 py-4">Rent</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-gray-500" colSpan={7}>
                    No leases found.
                  </td>
                </tr>
              ) : (
                rows.map((l) => (
                  <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#1F3A34]">{l.id}</div>
                      <div className="text-xs text-gray-500">Updated: {l.updatedAt}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{l.propertyTitle}</div>
                      <div className="text-xs text-gray-500">{l.propertyAddress}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{l.tenantName}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-800">
                        {l.startDate} → {l.endDate}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800">{formatMoney(l.rent)}</div>
                    </td>

                    <td className="px-5 py-4">
                      <LeaseStatusBadge status={l.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/leases/${l.id}`}
                          className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white"
                        >
                          View
                        </Link>

                        {(l.status === "draft" || l.status === "changes_requested") && (
                          <Link
                            href={`/dashboard/leases/${l.id}/edit`}
                            className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white"
                          >
                            Edit
                          </Link>
                        )}

                        {(l.status === "sent_to_tenant" || l.status === "signed_by_tenant") && (
                          <Link
                            href={`/dashboard/leases/${l.id}/sign`}
                            className="px-3 py-2 rounded-full text-sm bg-[#004087] text-white hover:opacity-95"
                          >
                            Sign
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 text-xs text-gray-500 bg-white border-t border-gray-100">
          Showing <span className="font-semibold">{rows.length}</span> lease(s)
        </div>
      </div>
    </div>
  );
}
