"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product, CATEGORIES } from "@/lib/types";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState(categoryParam);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] text-[#C4A882] uppercase mb-3">Shop</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#4A3F35] tracking-wide">
              สินค้าทั้งหมด
            </h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    category === cat.value
                      ? "bg-[#8B6F5E] text-white"
                      : "bg-[#F5EDE6] text-[#6B5B4E] hover:bg-[#E8DDD5]"
                  }`}
                >
                  {cat.label_th}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8B7E]" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DDD5] rounded-full text-sm text-[#4A3F35] placeholder:text-[#B8A89A] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#F5EDE6] rounded-2xl aspect-square mb-4" />
                  <div className="space-y-2 px-1">
                    <div className="h-3 bg-[#F5EDE6] rounded w-16" />
                    <div className="h-4 bg-[#F5EDE6] rounded w-3/4" />
                    <div className="h-4 bg-[#F5EDE6] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#9B8B7E] text-lg">ไม่พบสินค้า</p>
              <p className="text-[#B8A89A] text-sm mt-2">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && products.length > 0 && (
            <p className="text-center text-sm text-[#9B8B7E] mt-8">
              แสดง {products.length} สินค้า
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
