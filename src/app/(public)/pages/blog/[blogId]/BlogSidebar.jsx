"use client";

import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function BlogSidebar({ category, date, author }) {
    return (
        <aside className="lg:sticky top-24 h-fit border rounded-xl bg-white shadow-sm p-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Article Info</h3>

            <div className="space-y-4 text-sm text-gray-600">
                <div>
                    <p className="font-medium text-gray-800">Author:</p>
                    <p>{author}</p>
                </div>

                <div>
                    <p className="font-medium text-gray-800">Published:</p>
                    <p>{date}</p>
                </div>

                <div>
                    <p className="font-medium text-gray-800 mb-2">Category:</p>
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-md">
                        {category}
                    </span>
                </div>
            </div>

            <hr className="my-6" />

            <h4 className="font-semibold text-gray-800 mb-3">Share:</h4>
            <div className="flex gap-3">
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-100"><FaFacebook /></button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-100"><FaTwitter /></button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-100"><FaLinkedin /></button>
            </div>
        </aside>
    );
}
