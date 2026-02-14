"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F5EDE6] border-t border-[#E8DDD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif tracking-[0.2em] text-[#8B6F5E] mb-4">BUPPHA</h3>
            <p className="text-sm text-[#9B8B7E] leading-relaxed">
              เครื่องประดับลวดลายดอกไม้ ออกแบบด้วยแรงบันดาลใจจากธรรมชาติ
              สร้างสรรค์ด้วยความประณีตในทุกชิ้นงาน
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-[#6B5B4E] mb-4">
              เมนู
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "หน้าแรก" },
                { href: "/shop", label: "สินค้าทั้งหมด" },
                { href: "/cart", label: "ตะกร้าสินค้า" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9B8B7E] hover:text-[#8B6F5E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-[#6B5B4E] mb-4">
              หมวดหมู่
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/shop?category=necklaces", label: "สร้อยคอ" },
                { href: "/shop?category=earrings", label: "ต่างหู" },
                { href: "/shop?category=bracelets", label: "กำไล" },
                { href: "/shop?category=rings", label: "แหวน" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9B8B7E] hover:text-[#8B6F5E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-[#6B5B4E] mb-4">
              ติดต่อเรา
            </h4>
            <ul className="space-y-2 text-sm text-[#9B8B7E]">
              <li>Email: contact@buppha.com</li>
              <li>โทร: 02-xxx-xxxx</li>
              <li>Line: @buppha</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#E8DDD5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9B8B7E]">
            © 2026 Buppha. All rights reserved.
          </p>
          <p className="text-xs text-[#9B8B7E] flex items-center gap-1">
            Made with <Heart size={12} className="text-[#C4A882]" /> in Thailand
          </p>
        </div>
      </div>
    </footer>
  );
}
