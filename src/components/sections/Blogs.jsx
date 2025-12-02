"use client";

import BlogCard from "@/components/cards/Blog";

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      image: "/images/6.jpg",
      title: "Top 10 Property Investment Tips for Beginners",
      excerpt:
        "Learn the essential strategies to maximize your real-estate investment profits with expert-approved techniques.",
      author: "Admin",
      date: "Jan 10, 2025",
      category: "REAL ESTATE",
    },
    {
      id: 2,
      image: "/images/1.jpg",
      title: "How to Choose the Right Location for Your Dream Home",
      excerpt:
        "Location plays the most important part when buying a house. Here’s how to choose the perfect one.",
      author: "Sarah",
      date: "Jan 15, 2025",
      category: "GUIDE",
    },
    {
      id: 3,
      image: "/images/3.jpg",
      title: "Best Interior Designs That Increase Property Value",
      excerpt:
        "These modern interior trends not only beautify your home but also boost resale value significantly.",
      author: "Michael",
      date: "Jan 20, 2025",
      category: "DESIGN",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-[#1F1F1F]">
          Latest From Our Blog
        </h2>
        <p className="text-gray-500 mt-1">
          Stay updated with expert real-estate tips, guides, and trends.
        </p>
      </div>

      {/* BLOG GRID */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </section>
  );
}
