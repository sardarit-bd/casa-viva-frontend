export default function LeaseStatusBadge({ status = "draft" }) {
  const map = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200" },
    sent_to_tenant: { label: "Sent to Tenant", className: "bg-blue-50 text-blue-700 border-blue-200" },
    changes_requested: { label: "Changes Requested", className: "bg-amber-50 text-amber-700 border-amber-200" },
    signed_by_tenant: { label: "Signed by Tenant", className: "bg-purple-50 text-purple-700 border-purple-200" },
    fully_executed: { label: "Fully Executed", className: "bg-green-50 text-green-700 border-green-200" },
    cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
    expired: { label: "Expired", className: "bg-zinc-50 text-zinc-700 border-zinc-200" },
  };

  const meta = map[status] ?? map.draft;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${meta.className}`}>
      {meta.label}
    </span>
  );
}
