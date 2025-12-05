"use client";

import { useState } from "react";
import { Search, ArrowUpDown, Filter, Calendar, FileDown } from "lucide-react";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const transactions = [
    {
      id: "TXN-8734",
      user: "John Miller",
      amount: 24.99,
      type: "Featured Listing",
      date: "2025-01-14",
      status: "Completed",
    },
    {
      id: "TXN-8735",
      user: "Sarah Khan",
      amount: 24.99,
      type: "Featured Listing",
      date: "2025-01-10",
      status: "Failed",
    },
    {
      id: "TXN-8736",
      user: "Carlos Perez",
      amount: 24.99,
      type: "Featured Listing",
      date: "2025-01-08",
      status: "Completed",
    },
  ];

  const sortedData = [...transactions].sort((a, b) => {
    if (sortOrder === "asc") return a[sortField] > b[sortField] ? 1 : -1;
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const filteredData = sortedData.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-semibold text-[#05314A] mb-4">Transactions</h1>
      <p className="text-gray-500 mb-6">View and manage all platform payments.</p>

      {/* TOP CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 w-full md:w-80 shadow-sm">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by ID or User"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl shadow-sm hover:border-[#E7C464] transition"
          >
            <Filter size={16} /> Filters
          </button>

          <button className="flex items-center gap-2 bg-[#05314A] text-white px-4 py-2 rounded-xl shadow-sm hover:bg-[#074469] transition">
            <FileDown size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      {filterOpen && (
        <div className="bg-white border rounded-xl p-4 shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full md:w-60">
              <label className="text-sm text-gray-600 mb-1">Transaction Type</label>
              <select className="border rounded-lg px-3 py-2 outline-none text-sm">
                <option>All</option>
                <option>Featured Listing</option>
              </select>
            </div>

            <div className="flex flex-col w-full md:w-60">
              <label className="text-sm text-gray-600 mb-1">Status</label>
              <select className="border rounded-lg px-3 py-2 outline-none text-sm">
                <option>All</option>
                <option>Completed</option>
                <option>Failed</option>
              </select>
            </div>

            <div className="flex flex-col w-full md:w-60">
              <label className="text-sm text-gray-600 mb-1">Date Range</label>
              <div className="border rounded-lg px-3 py-2 flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <input type="date" className="outline-none text-sm w-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F7FBFC] text-[#05314A]">
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("id")}>ID <ArrowUpDown size={14} className="inline-block ml-1" /></th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("user")}>User <ArrowUpDown size={14} className="inline-block ml-1" /></th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("amount")}>Amount <ArrowUpDown size={14} className="inline-block ml-1" /></th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("date")}>Date <ArrowUpDown size={14} className="inline-block ml-1" /></th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((t) => (
              <tr key={t.id} className="border-t hover:bg-[#F8F8F8] transition">
                <td className="py-3 px-4 font-medium text-[#05314A]">{t.id}</td>
                <td className="py-3 px-4">{t.user}</td>
                <td className="py-3 px-4">${t.amount.toFixed(2)}</td>
                <td className="py-3 px-4">{t.type}</td>
                <td className="py-3 px-4">{t.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function toggleSort(field) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }
}
