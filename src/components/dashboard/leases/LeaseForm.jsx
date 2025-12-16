"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "Digital Payment", "Other"];

export default function LeaseForm({
    initialValues = {},
    mode = "create",
    onSubmit,
}) {
    const defaults = useMemo(
        () => ({
            propertyTitle: "",
            propertyAddress: "",
            startDate: "",
            endDate: "",
            rent: "",
            paymentMethod: "Bank Transfer",
            deposit: "",
            utilitiesIncluded: [],
            utilitiesPaidByTenant: [],
            occupants: "",
            additionalTerms: "",
            ...initialValues,
        }),
        [initialValues]
    );

    const [form, setForm] = useState(defaults);
    const [saving, setSaving] = useState(false);

    const UTILITIES = ["Electricity", "Water", "Internet", "Gas", "Maintenance Fees", "Trash"];

    const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

    const toggleArrayValue = (key, value) => {
        setForm((prev) => {
            const arr = prev[key] || [];
            return arr.includes(value)
                ? { ...prev, [key]: arr.filter((x) => x !== value) }
                : { ...prev, [key]: [...arr, value] };
        });
    };

    const validate = () => {
        if (!form.propertyAddress.trim()) return "Property address is required.";
        if (!form.startDate) return "Start date is required.";
        if (!form.endDate) return "End date is required.";
        if (!form.rent) return "Monthly rent is required.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return alert(err);

        try {
            setSaving(true);
            await onSubmit?.(form);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Main form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#1F3A34]">
                    {mode === "edit" ? "Edit Lease" : "Create Lease"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Fill in the lease details. You can edit this later while it’s in Draft or Changes Requested.
                </p>

                {/* Property */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Property Title</label>
                        <input
                            value={form.propertyTitle}
                            onChange={(e) => setField("propertyTitle", e.target.value)}
                            placeholder="e.g., 2BR Apartment, Punta Cana"
                            className="mt-2 w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Property Address *</label>
                        <input
                            value={form.propertyAddress}
                            onChange={(e) => setField("propertyAddress", e.target.value)}
                            placeholder="Full address"
                            className="mt-2 w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
                            required
                        />
                    </div>
                </div>

                {/* Term */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Start Date *</label>
                        <input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => setField("startDate", e.target.value)}
                            className="mt-2 w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">End Date *</label>
                        <input
                            type="date"
                            value={form.endDate}
                            onChange={(e) => setField("endDate", e.target.value)}
                            className="mt-2 w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
                            required
                        />
                    </div>
                </div>

                {/* Money */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Monthly Rent (USD) *</label>
                        <input
                            type="number"
                            value={form.rent}
                            onChange={(e) => setField("rent", e.target.value)}
                            placeholder="e.g., 1200"
                            className="mt-2 w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Security Deposit (USD)</label>
                        <input
                            type="number"
                            value={form.deposit}
                            onChange={(e) => setField("deposit", e.target.value)}
                            placeholder="e.g., 1200"
                            className="mt-2 w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                        <Select
                            value={form.paymentMethod}
                            onValueChange={(value) => setField("paymentMethod", value)}
                        >
                            <SelectTrigger className="mt-2 w-full rounded-2xl border border-gray-200 focus:border-[#004087]">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>

                            <SelectContent>
                                {PAYMENT_METHODS.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                </div>

                {/* Utilities */}
                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700 block">Utilities</label>
                    <p className="text-xs text-gray-500 mt-1">
                        Select which utilities are included and which are paid by the tenant.
                    </p>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-200 p-4">
                            <div className="text-sm font-semibold text-gray-800">Included in Rent</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {UTILITIES.map((u) => (
                                    <button
                                        type="button"
                                        key={u}
                                        onClick={() => toggleArrayValue("utilitiesIncluded", u)}
                                        className={`px-3 py-2 rounded-full text-sm border transition
                      ${form.utilitiesIncluded.includes(u)
                                                ? "bg-[#1F3A34] text-white border-[#1F3A34]"
                                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 p-4">
                            <div className="text-sm font-semibold text-gray-800">Paid by Tenant</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {UTILITIES.map((u) => (
                                    <button
                                        type="button"
                                        key={u}
                                        onClick={() => toggleArrayValue("utilitiesPaidByTenant", u)}
                                        className={`px-3 py-2 rounded-full text-sm border transition
                      ${form.utilitiesPaidByTenant.includes(u)
                                                ? "bg-[#004087] text-white border-[#004087]"
                                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Occupants */}
                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700">Occupants</label>
                    <textarea
                        value={form.occupants}
                        onChange={(e) => setField("occupants", e.target.value)}
                        placeholder="List occupants (e.g., John Smith, Jane Smith)"
                        className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#004087] min-h-[90px]"
                    />
                </div>

                {/* Additional Terms */}
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Additional Terms</label>
                    <textarea
                        value={form.additionalTerms}
                        onChange={(e) => setField("additionalTerms", e.target.value)}
                        placeholder="Add custom terms here..."
                        className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#004087] min-h-[120px]"
                    />
                </div>
            </div>

            {/* Right: Preview / Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
                <h3 className="text-lg font-semibold text-[#1F3A34]">Quick Preview</h3>
                <p className="text-sm text-gray-600 mt-1">
                    This preview is frontend-only for now. Final PDF will be generated after backend is added.
                </p>

                <div className="mt-5 rounded-2xl border border-gray-200 p-4 text-sm text-gray-800 space-y-2">
                    <div>
                        <span className="font-semibold">Property:</span> {form.propertyTitle || "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Address:</span> {form.propertyAddress || "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Term:</span>{" "}
                        {form.startDate ? form.startDate : "—"} → {form.endDate ? form.endDate : "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Rent:</span> {form.rent ? `$${form.rent}` : "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Deposit:</span> {form.deposit ? `$${form.deposit}` : "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Payment:</span> {form.paymentMethod || "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Included:</span>{" "}
                        {form.utilitiesIncluded.length ? form.utilitiesIncluded.join(", ") : "—"}
                    </div>
                    <div>
                        <span className="font-semibold">Paid by Tenant:</span>{" "}
                        {form.utilitiesPaidByTenant.length ? form.utilitiesPaidByTenant.join(", ") : "—"}
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full px-4 py-3 rounded-2xl bg-[#004087] text-white font-medium hover:opacity-95 disabled:opacity-60"
                    >
                        {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Save as Draft"}
                    </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                    Tip: later we’ll add “Send to Tenant” after saving draft.
                </div>
            </div>
        </form>
    );
}
