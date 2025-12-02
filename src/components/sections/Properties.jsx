"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/cards/Property";
import { usePropertyStore } from "@/store/propertyStore";

export default function Properties() {

    const properties = usePropertyStore((s) => s.properties);


    // 👉 FILTER LOGIC
    const [filter, setFilter] = useState("all");

    const filteredProperties =
        filter === "all"
            ? properties
            : properties.filter((item) => item.type === filter);

    return (
        <section className="max-w-7xl mx-auto px-5 py-16">

            {/* TOP SECTION */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-semibold text-[#1F1F1F]">
                        Featured Properties
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Browse the latest properties available for sale and rent.
                    </p>
                </div>

                {/* FILTER BUTTONS */}
                <div className="flex gap-3 text-sm">

                    <button
                        onClick={() => setFilter("all")}
                        className={`px-5 py-2 rounded-full border 
                            ${filter === "all" ? "bg-black text-white" : "border-gray-300 text-gray-700"}`}
                    >
                        All Properties
                    </button>

                    <button
                        onClick={() => setFilter("sale")}
                        className={`px-5 py-2 rounded-full border 
                            ${filter === "sale" ? "bg-black text-white" : "border-gray-300 text-gray-700"}`}
                    >
                        For Sale
                    </button>

                    <button
                        onClick={() => setFilter("rent")}
                        className={`px-5 py-2 rounded-full border 
                            ${filter === "rent" ? "bg-black text-white" : "border-gray-300 text-gray-700"}`}
                    >
                        For Rent
                    </button>

                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {filteredProperties.map((item) => (
                    <Link
                        key={item.id}
                        href={`/public/property/${item.id}`}
                        className="block"
                    >
                        <PropertyCard
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            address={item.address}
                            beds={item.beds}
                            baths={item.baths}
                            sqft={item.sqft}
                            isFeatured={item.isFeatured}
                            isForSale={item.type === "sale"}
                        />
                    </Link>
                ))}
            </div>

        </section>
    );
}
