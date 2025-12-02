"use client";

import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function FiltersSidebar({
    query, setQuery,
    city, setCity,
    type, setType,
    bedrooms, setBedrooms,
    clearFilters
}) {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (field) => {
        setOpenDropdown(openDropdown === field ? null : field);
    };

    const handleSelect = (field, value) => {
        if (field === "city") setCity(value);
        if (field === "type") setType(value);
        if (field === "bedrooms") setBedrooms(value);
        setOpenDropdown(null);
    };

    return (
        <aside className="lg:sticky top-24 h-fit border rounded-xl p-5 bg-white shadow-sm">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#05314A]">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-[#E7C464] hover:text-[#d2ab54]"
                >
                    Clear all
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">Search</label>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-[#05314A] focus:border-[#E7C464] focus:ring-2 focus:ring-[#E7C464]/30"
                    placeholder="Search by keyword..."
                />
            </div>

            {/* -------- CUSTOM DROPDOWN: CITY -------- */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">City</label>

                <div className="relative mt-1">
                    <div
                        className="custom-box"
                        onClick={() => toggleDropdown("city")}
                    >
                        <span>
                            {city === "all" ? "All Cities" : city}
                        </span>
                        <FaCaretDown />
                    </div>

                    {openDropdown === "city" && (
                        <div className="dropdown-panel">
                            {["all", "punta-cana", "bavaro", "cocotal", "cap-cana"].map((item) => (
                                <div
                                    key={item}
                                    className="dropdown-item"
                                    onClick={() => handleSelect("city", item)}
                                >
                                    {item === "all" ? "All Cities" : item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* -------- CUSTOM DROPDOWN: TYPE -------- */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">Type</label>

                <div className="relative mt-1">
                    <div
                        className="custom-box"
                        onClick={() => toggleDropdown("type")}
                    >
                        <span>
                            {type === "all"
                                ? "All Types"
                                : type === "rent"
                                ? "For Rent"
                                : "For Sale"}
                        </span>
                        <FaCaretDown />
                    </div>

                    {openDropdown === "type" && (
                        <div className="dropdown-panel">
                            <div className="dropdown-item" onClick={() => handleSelect("type", "all")}>All Types</div>
                            <div className="dropdown-item" onClick={() => handleSelect("type", "rent")}>For Rent</div>
                            <div className="dropdown-item" onClick={() => handleSelect("type", "sale")}>For Sale</div>
                        </div>
                    )}
                </div>
            </div>

            {/* -------- CUSTOM DROPDOWN: BEDROOMS -------- */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">Bedrooms</label>

                <div className="relative mt-1">
                    <div
                        className="custom-box"
                        onClick={() => toggleDropdown("bedrooms")}
                    >
                        <span>
                            {
                                {
                                    all: "Any",
                                    1: "1 Bedroom",
                                    2: "2 Bedrooms",
                                    3: "3 Bedrooms",
                                    4: "4+ Bedrooms",
                                }[bedrooms]
                            }
                        </span>
                        <FaCaretDown />
                    </div>

                    {openDropdown === "bedrooms" && (
                        <div className="dropdown-panel">
                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "all")}>Any</div>
                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "1")}>1 Bedroom</div>
                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "2")}>2 Bedrooms</div>
                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "3")}>3 Bedrooms</div>
                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "4")}>4+ Bedrooms</div>
                        </div>
                    )}
                </div>
            </div>

            {/* STYLE */}
            <style>{`
                .custom-box {
                    background: #fff;
                    border: 1px solid #ddd;
                    padding: 12px 14px;
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
                    z-index: 50;
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
        </aside>
    );
}
