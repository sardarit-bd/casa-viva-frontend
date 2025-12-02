"use client";

import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function BlogFilters({
    search, setSearch,
    category, setCategory,
    clearFilters
}) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(!open);

    const handleSelect = (value) => {
        setCategory(value);
        setOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

            {/* SEARCH BAR */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full md:w-1/3 border rounded-lg px-4 py-2 text-[#05314A] focus:border-[#E7C464] focus:ring-2 focus:ring-[#E7C464]/40"
            />

            <div className="flex items-center gap-3">

                {/* CUSTOM CATEGORY DROPDOWN */}
                <div className="relative w-40">
                    <div
                        onClick={toggle}
                        className="custom-box"
                    >
                        <span>
                            {category === "all"
                                ? "All Categories"
                                : category}
                        </span>
                        <FaCaretDown />
                    </div>

                    {open && (
                        <div className="dropdown-panel">
                            <div className="dropdown-item" onClick={() => handleSelect("all")}>
                                All Categories
                            </div>
                            <div className="dropdown-item" onClick={() => handleSelect("REAL ESTATE")}>
                                Real Estate
                            </div>
                            <div className="dropdown-item" onClick={() => handleSelect("GUIDE")}>
                                Guide
                            </div>
                            <div className="dropdown-item" onClick={() => handleSelect("DESIGN")}>
                                Design
                            </div>
                        </div>
                    )}
                </div>

                {/* CLEAR BUTTON */}
                <button
                    onClick={clearFilters}
                    className="text-sm underline text-gray-600 hover:text-gray-900"
                >
                    Clear
                </button>
            </div>

            {/* STYLES */}
            <style>{`
                .custom-box {
                    background: #fff;
                    border: 1px solid #ddd;
                    padding: 10px 12px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #05314A;
                    transition: 0.2s;
                }
                .custom-box:hover {
                    border-color: #E7C464;
                }

                .dropdown-panel {
                    position: absolute;
                    top: 110%;
                    width: 100%;
                    background: white;
                    border-radius: 12px;
                    padding: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 20;
                }

                .dropdown-item {
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #05314A;
                    transition: 0.15s;
                }
                .dropdown-item:hover {
                    background: #E7C464;
                    color: #05314A;
                }
            `}</style>
        </div>
    );
}
