"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaCaretDown } from "react-icons/fa";

export default function LuxuryHero() {
    const router = useRouter();

    // States
    const [city, setCity] = useState("all");
    const [type, setType] = useState("all");
    const [bedrooms, setBedrooms] = useState("all");

    // Dropdown toggles
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

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (city !== "all") params.set("city", city);
        if (type !== "all") params.set("type", type);
        if (bedrooms !== "all") params.set("bedrooms", bedrooms);

        router.push(`/pages/properties?${params.toString()}`);
    };

    return (
        <section
            className="relative w-full min-h-[75vh] bg-center bg-cover bg-no-repeat flex items-center"
            style={{ backgroundImage: "url('/images/home-3.webp')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative max-w-7xl mx-auto px-6 py-20 w-full text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                    Discover Your <span className="text-[#E7C464]">Luxury Home</span>
                </h1>

                <p className="text-gray-200 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
                    Explore premium villas, ocean-view apartments & luxury residential properties.
                </p>

                {/* SEARCH CARD */}
                <div className="mt-12 bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* ---------- CUSTOM DROPDOWNS ---------- */}

                        {/* CITY */}
                        <div className="text-left text-white">
                            <label className="text-sm mb-2 block">City</label>
                            <div className="relative">
                                <div
                                    onClick={() => toggleDropdown("city")}
                                    className="custom-box"
                                >
                                    <span>{city === "all" ? "All Cities" : city}</span>
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

                        {/* TYPE */}
                        <div className="text-left text-white">
                            <label className="text-sm mb-2 block">Type</label>
                            <div className="relative">
                                <div
                                    onClick={() => toggleDropdown("type")}
                                    className="custom-box"
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
                                        <div className="dropdown-item" onClick={() => handleSelect("type", "all")}>
                                            All Types
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSelect("type", "rent")}>
                                            For Rent
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSelect("type", "sale")}>
                                            For Sale
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BEDROOMS */}
                        <div className="text-left text-white">
                            <label className="text-sm mb-2 block">Bedrooms</label>
                            <div className="relative">
                                <div
                                    onClick={() => toggleDropdown("bedrooms")}
                                    className="custom-box"
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
                    </div>

                    {/* SEARCH BUTTON */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSearch}
                            className="luxury-btn"
                        >
                            <FaSearch /> Search Properties
                        </button>
                    </div>
                </div>
            </div>

            {/* EXTRA CSS */}
            <style>{`
                .custom-box {
                    background: rgba(255,255,255,0.9);
                    color: #05314A;
                    padding: 14px 18px;
                    border-radius: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    border: 1px solid #ddd;
                    font-weight: 500;
                    transition: 0.2s;
                }
                .custom-box:hover {
                    border-color: #E7C464;
                }
                .dropdown-panel {
                    position: absolute;
                    width: 100%;
                    margin-top: 5px;
                    background: white;
                    border-radius: 12px;
                    padding: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    z-index: 20;
                }
                .dropdown-item {
                    padding: 10px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #05314A;
                    font-weight: 500;
                }
                .dropdown-item:hover {
                    background: #E7C464;
                    color: black;
                }
                .luxury-btn {
                    padding: 14px 30px;
                    background: #E7C464;
                    color: #05314A;
                    font-weight: 600;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 15px;
                    transition: 0.2s;
                    box-shadow: 0 4px 20px rgba(231,196,100,0.4);
                }
                .luxury-btn:hover {
                    background: #d9b452;
                }
            `}</style>
        </section>
    );
}
