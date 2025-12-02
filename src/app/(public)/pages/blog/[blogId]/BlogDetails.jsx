"use client";

import Image from "next/image";

export default function BlogDetails({ blog }) {
    return (
        <div className="bg-white rounded-xl border shadow-sm p-6 overflow-hidden fade-up">

            {/* IMAGE */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden mb-8">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                {blog.title}
            </h1>

            {/* META */}
            <div className="text-sm text-gray-500 mb-6 flex items-center gap-4">
                <span>By {blog.author}</span>
                <span>•</span>
                <span>{blog.date}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">{blog.category}</span>
            </div>

            {/* CONTENT */}
            <div className="max-w-none text-[16px] leading-relaxed space-y-8">

                {/* INTRO PARAGRAPH */}
                <p className="text-gray-700 text-[17px] leading-[1.75]">
                    {blog.excerpt}
                    This article dives deeper into strategies, insights, and expert
                    recommendations to help you understand this topic more clearly.
                </p>

                {/* DIVIDER */}
                <div className="border-l-4 border-emerald-600 pl-4 py-2 bg-emerald-50 rounded-md text-gray-800 text-[15px]">
                    💡 <strong className="font-medium">Quick Insight:</strong>
                    Good decisions in real estate often start with well-researched information.
                </div>

                {/* PARAGRAPH BLOCK */}
                <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et orci
                    quis mauris placerat suscipit. Integer vel dolor quis sapien auctor tincidunt.
                    Aliquam erat volutpat. Sed luctus libero ut sapien eleifend, vel pulvinar magna
                    ultrices. Etiam ac ligula id nulla facilisis maximus sit amet vitae magna.
                </p>

                <p className="text-gray-700">
                    Morbi aliquet hendrerit fringilla. Cras vitae lacus ac justo euismod imperdiet vel
                    vel erat. Vestibulum eleifend porttitor consequat. Sed sollicitudin neque tellus, at
                    mattis ex posuere eget. Duis laoreet dignissim leo, eget vulputate urna fermentum vitae.
                </p>

                {/* SECTION HEADER */}
                <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
                    Why This Topic Matters
                </h2>

                <p className="text-gray-700">
                    Maecenas gravida eros et est facilisis, vitae interdum ante auctor. Integer id dictum
                    ligula. Praesent laoreet libero nec massa bibendum, eget vestibulum libero posuere.
                    Nulla nec urna feugiat, pretium lectus in, fermentum eros.
                </p>

                {/* PULL QUOTE */}
                <blockquote className="border-l-4 border-emerald-600 pl-6 italic text-gray-700 text-[17px] bg-emerald-50 py-4 rounded-md">
                    Real estate becomes powerful when knowledge and timing align.
                </blockquote>

                {/* SUBHEADER */}
                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    Key Takeaways
                </h3>

                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                    <li>Well-structured guidance helps buyers make smarter choices.</li>
                    <li>SEO-rich articles boost visibility and attract more readers.</li>
                    <li>User-friendly layouts improve reading experience and retention.</li>
                    <li>Visual and interactive content increases engagement rates.</li>
                </ul>

                <p className="text-gray-700">
                    In conclusion, high-quality articles not only educate your audience but also build
                    trust and authority — a key metric in the real-estate market.
                    With the right combination of insights and presentation, your blog becomes a
                    powerful tool for brand growth and user engagement.
                </p>
            </div>

        </div>
    );
}
