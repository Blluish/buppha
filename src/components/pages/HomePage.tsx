"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, Shield, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((d) => setFeatured(d.products || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE6] via-[#FDF8F4] to-[#EDE0D4]" />
        
        {/* Decorative floral SVG pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <circle cx="400" cy="400" r="200" stroke="#8B6F5E" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="250" stroke="#8B6F5E" strokeWidth="0.3" />
            <circle cx="400" cy="400" r="300" stroke="#8B6F5E" strokeWidth="0.2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="400"
                cy="400"
                rx="80"
                ry="180"
                stroke="#8B6F5E"
                strokeWidth="0.5"
                transform={`rotate(${angle} 400 400)`}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <p className="text-sm tracking-[0.4em] text-[#C4A882] uppercase mb-6">
            Floral Jewelry Collection
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-[0.15em] text-[#8B6F5E] mb-6">
            BUPPHA
          </h1>
          <p className="text-lg sm:text-xl text-[#9B8B7E] max-w-2xl mx-auto mb-4 leading-relaxed">
            เครื่องประดับลวดลายดอกไม้
          </p>
          <p className="text-sm text-[#B8A89A] max-w-xl mx-auto mb-10 leading-relaxed">
            ออกแบบด้วยแรงบันดาลใจจากธรรมชาติ สร้างสรรค์ด้วยความประณีตในทุกชิ้นงาน
            เพื่อเพิ่มเสน่ห์ให้กับทุกช่วงเวลาพิเศษของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#8B6F5E] text-white px-8 py-4 rounded-full text-sm tracking-wider hover:bg-[#7A5F4E] transition-all duration-300 hover:shadow-lg"
            >
              เลือกซื้อสินค้า <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop?category=necklaces"
              className="inline-flex items-center gap-2 border border-[#C4A882] text-[#8B6F5E] px-8 py-4 rounded-full text-sm tracking-wider hover:bg-[#C4A882] hover:text-white transition-all duration-300"
            >
              คอลเลกชันใหม่
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#C4A882] rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-[#C4A882] rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] text-[#C4A882] uppercase mb-3">Collections</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#4A3F35] tracking-wide">
              หมวดหมู่สินค้า
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "สร้อยคอ",
                nameEn: "Necklaces",
                category: "necklaces",
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop",
              },
              {
                name: "ต่างหู",
                nameEn: "Earrings",
                category: "earrings",
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
              },
              {
                name: "กำไล",
                nameEn: "Bracelets",
                category: "bracelets",
                image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop",
              },
              {
                name: "แหวน",
                nameEn: "Rings",
                category: "rings",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop",
              },
            ].map((cat) => (
              <Link
                key={cat.category}
                href={`/shop?category=${cat.category}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-1">
                    {cat.nameEn}
                  </p>
                  <h3 className="text-lg sm:text-xl font-serif text-white">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-sm tracking-[0.3em] text-[#C4A882] uppercase mb-3">Featured</p>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#4A3F35] tracking-wide">
                สินค้าแนะนำ
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-sm text-[#8B6F5E] hover:text-[#6B5B4E] transition-colors"
            >
              ดูทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="sm:hidden text-center mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-[#8B6F5E] hover:text-[#6B5B4E]"
            >
              ดูสินค้าทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "งานฝีมือประณีต",
                desc: "ทุกชิ้นงานผ่านการออกแบบและผลิตอย่างพิถีพิถัน",
              },
              {
                icon: Truck,
                title: "จัดส่งฟรี",
                desc: "ฟรีค่าจัดส่งสำหรับคำสั่งซื้อ 2,000 บาทขึ้นไป",
              },
              {
                icon: Shield,
                title: "รับประกันคุณภาพ",
                desc: "รับประกันสินค้าทุกชิ้น 1 ปีเต็ม",
              },
              {
                icon: Gift,
                title: "บรรจุภัณฑ์พิเศษ",
                desc: "แพ็คเกจสวยงาม พร้อมเป็นของขวัญ",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-[#F5EDE6] rounded-2xl flex items-center justify-center">
                  <feature.icon size={24} className="text-[#C4A882]" />
                </div>
                <h3 className="text-sm font-semibold text-[#4A3F35] mb-2">{feature.title}</h3>
                <p className="text-xs text-[#9B8B7E] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-[#8B6F5E]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] text-[#E8DDD5] uppercase mb-4">Special Offer</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-wide mb-4">
            สมัครสมาชิกรับส่วนลด 10%
          </h2>
          <p className="text-sm text-[#D4C4B4] mb-8">
            สมัครสมาชิกวันนี้ รับส่วนลด 10% สำหรับการสั่งซื้อครั้งแรก
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-[#8B6F5E] px-8 py-4 rounded-full text-sm tracking-wider hover:bg-[#F5EDE6] transition-all duration-300"
          >
            สมัครสมาชิก <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
