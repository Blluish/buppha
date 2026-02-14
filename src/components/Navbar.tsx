"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, User, LogOut, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl lg:text-3xl font-serif tracking-[0.2em] text-[#8B6F5E]">
              BUPPHA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              หน้าแรก
            </Link>
            <Link
              href="/shop"
              className="text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              สินค้า
            </Link>
            <Link
              href="/shop?category=necklaces"
              className="text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              สร้อยคอ
            </Link>
            <Link
              href="/shop?category=earrings"
              className="text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              ต่างหู
            </Link>
            <Link
              href="/shop?category=bracelets"
              className="text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              กำไล
            </Link>
            <Link
              href="/shop?category=rings"
              className="text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              แหวน
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/shop" className="text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors">
              <Search size={20} />
            </Link>

            {user ? (
              <div className="relative group">
                <button className="text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E8DDD5] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-[#E8DDD5]">
                    <p className="text-sm font-medium text-[#6B5B4E]">{user.name}</p>
                    <p className="text-xs text-[#9B8B7E]">{user.email}</p>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-sm text-[#6B5B4E] hover:bg-[#F5EDE6]"
                    >
                      แผงควบคุม
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-[#6B5B4E] hover:bg-[#F5EDE6] flex items-center gap-2"
                  >
                    <LogOut size={14} /> ออกจากระบบ
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors">
                <User size={20} />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-[#6B5B4E] hover:text-[#8B6F5E] transition-colors"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C4A882] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-[#6B5B4E]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8DDD5]">
          <div className="px-4 py-4 space-y-3">
            {[
              { href: "/", label: "หน้าแรก" },
              { href: "/shop", label: "สินค้าทั้งหมด" },
              { href: "/shop?category=necklaces", label: "สร้อยคอ" },
              { href: "/shop?category=earrings", label: "ต่างหู" },
              { href: "/shop?category=bracelets", label: "กำไล" },
              { href: "/shop?category=rings", label: "แหวน" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm tracking-wider text-[#6B5B4E] hover:text-[#8B6F5E] py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
