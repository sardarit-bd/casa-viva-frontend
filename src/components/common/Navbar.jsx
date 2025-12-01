"use client";

import { Phone, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-[#F8F4F1] py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LEFT: LOGO + MENUS */}
        <div className="flex items-center gap-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="JustHome Logo"
              width={500}
              height={500}
              className="w-[150px]"
            />
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#1F3A34]">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <Link href="/about" className="hover:text-black flex items-center gap-1">
              About
              <ChevronDown size={14} />
            </Link>
            <Link href="/services" className="hover:text-black flex items-center gap-1">
              Services
              <ChevronDown size={14} />
            </Link>
            <Link href="/properties" className="hover:text-black flex items-center gap-1">
              Properties
              <ChevronDown size={14} />
            </Link>
            <Link href="/blog" className="hover:text-black">
              Blog  
            </Link>
            <Link href="/contact" className="hover:text-black">
              Contact
            </Link>
          </nav>
        </div>

        {/* RIGHT: PHONE + ICON + BUTTON */}
        <div className="flex items-center gap-6">

          {/* Phone */}
          <div className="flex items-center gap-2 text-[#1F3A34]">
            <Phone size={18} />
            <span className="text-sm font-medium">+68 685 88666</span>
          </div>

          {/* User Icon */}
          <button className="p-2 border rounded-full border-[#1F3A34]">
            <User size={16} />
          </button>

          {/* Button */}
          <Link
            href="/add-property"
            className="px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium hover:bg-[#1F3A34] hover:text-white transition"
          >
            Add Property
          </Link>
        </div>

      </div>
    </header>
  );
}

