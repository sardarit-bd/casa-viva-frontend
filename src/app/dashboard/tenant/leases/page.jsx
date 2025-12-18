"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, PenTool, LayoutGrid, List } from "lucide-react";
import { dummyLeases } from "@/store/dummyLeases";
import LeaseStatusBadge from "@/components/dashboard/Owner/leases/LeaseStatusBadge";

export default function TenantLeasesPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState("list");

    const leases = useMemo(() => {
        return dummyLeases.filter(
            (l) => l.status !== "draft"
        );
    }, []);

    const handleView = (id) => {
        router.push(`/dashboard/tenant/leases/${id}`);
    };

    const handleSign = (id) => {
        router.push(`/dashboard/tenant/leases/${id}/sign`);
    };

    const handleDownload = (id) => {
        console.log("Download lease PDF:", id);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1F3A34]">
                        My Leases
                    </h1>
                    <p className="text-sm text-gray-600">
                        View and manage your lease agreements
                    </p>
                </div>

                {/* View toggle */}
                <button
                    onClick={() =>
                        setViewMode(viewMode === "list" ? "card" : "list")
                    }
                    className="px-4 py-2 rounded-full border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
                >
                    {viewMode === "list" ? (
                        <LayoutGrid className="w-4 h-4" />
                    ) : (
                        <List className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Empty state */}
            {leases.length === 0 && (
                <div className="bg-white border rounded-xl p-10 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-600">No leases assigned to you yet.</p>
                </div>
            )}

            {/* ================= LIST VIEW ================= */}
            {viewMode === "list" && leases.length > 0 && (
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-4 text-left">Property</th>
                                <th className="px-5 py-4 text-left">Term</th>
                                <th className="px-5 py-4 text-left">Rent</th>
                                <th className="px-5 py-4 text-left">Status</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leases.map((lease) => (
                                <tr
                                    key={lease.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-[#1F3A34]">
                                            {lease.propertyTitle}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {lease.propertyAddress}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm">
                                        {lease.startDate} → {lease.endDate}
                                    </td>

                                    <td className="px-5 py-4 font-medium">
                                        ${lease.rent}
                                    </td>

                                    <td className="px-5 py-4">
                                        <LeaseStatusBadge status={lease.status} />
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleView(lease.id)}
                                                className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                                            >
                                                View
                                            </button>

                                            {lease.status === "sent_to_tenant" && (
                                                <button
                                                    onClick={() => handleSign(lease.id)}
                                                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                                                >
                                                    <PenTool className="w-4 h-4" />
                                                    Sign
                                                </button>
                                            )}

                                            {lease.status === "fully_executed" && (
                                                <button
                                                    onClick={() => handleDownload(lease.id)}
                                                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    PDF
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= CARD VIEW ================= */}
            {viewMode === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leases.map((lease) => (
                        <div
                            key={lease.id}
                            className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                        >
                            <div className="flex justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-[#1F3A34]">
                                        {lease.propertyTitle}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {lease.propertyAddress}
                                    </p>
                                </div>
                                <LeaseStatusBadge status={lease.status} />
                            </div>

                            <div className="text-sm space-y-1 mb-4">
                                <p>
                                    <span className="text-gray-500">Term:</span>{" "}
                                    {lease.startDate} → {lease.endDate}
                                </p>
                                <p>
                                    <span className="text-gray-500">Rent:</span> $
                                    {lease.rent}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleView(lease.id)}
                                    className="px-3 py-2 rounded-full border text-sm"
                                >
                                    View
                                </button>

                                {lease.status === "sent_to_tenant" && (
                                    <button
                                        onClick={() => handleSign(lease.id)}
                                        className="px-3 py-2 rounded-full bg-green-600 text-white text-sm"
                                    >
                                        Sign
                                    </button>
                                )}

                                {lease.status === "fully_executed" && (
                                    <button
                                        onClick={() => handleDownloadPDF(lease.id)}
                                        className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm"
                                    >
                                        PDF
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
