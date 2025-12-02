"use client";

import Image from "next/image";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";

export default function BlogCard({
    image,
    title,
    excerpt,
    author,
    date,
    category,
    id,
}) {
    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">

            {/* IMAGE */}
            <div className="relative w-full h-48">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />

                {/* CATEGORY BADGE */}
                <span className="absolute top-3 left-3 bg-[#0FA958] text-white text-xs px-3 py-1 rounded-md">
                    {category}
                </span>
            </div>

            {/* CONTENT */}
            <div className="p-4">

                {/* TITLE */}
                <h3 className="text-[18px] font-semibold text-[#1F2328] leading-snug hover:text-[#0FA958] transition">
                    <Link href={`/pages/blog/${id}`}>
                        {title}
                    </Link>
                </h3>

                {/* EXCERPT */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {excerpt}
                </p>

                {/* AUTHOR + DATE */}
                <div className="mt-4 flex items-center justify-between text-gray-500 text-xs">

                    <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{author}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
