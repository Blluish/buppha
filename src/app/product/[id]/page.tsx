"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
            <div className="bg-[#F5EDE6] rounded-3xl aspect-square" />
            <div className="space-y-4 py-8">
              <div className="h-4 bg-[#F5EDE6] rounded w-24" />
              <div className="h-8 bg-[#F5EDE6] rounded w-3/4" />
              <div className="h-6 bg-[#F5EDE6] rounded w-1/3" />
              <div className="h-20 bg-[#F5EDE6] rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-20 px-4 text-center">
          <p className="text-[#9B8B7E] text-lg">ไม่พบสินค้า</p>
          <Link href="/shop" className="text-[#8B6F5E] text-sm mt-4 inline-block hover:underline">
            กลับไปหน้าสินค้า
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm text-[#9B8B7E] hover:text-[#8B6F5E] mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> กลับไปหน้าสินค้า
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-3xl bg-[#F5EDE6] aspect-square">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.compare_price > 0 && product.compare_price > product.price && (
                <span className="absolute top-4 left-4 bg-[#C4A882] text-white text-sm px-4 py-1.5 rounded-full">
                  ลด {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="py-4 lg:py-8">
              <p className="text-xs tracking-[0.2em] text-[#C4A882] uppercase mb-3">
                {product.category}
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#4A3F35] mb-2">
                {product.name_th || product.name}
              </h1>
              <p className="text-sm text-[#9B8B7E] mb-6">{product.name}</p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-2xl font-semibold text-[#8B6F5E]">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price > 0 && product.compare_price > product.price && (
                  <span className="text-lg text-[#B8A89A] line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#6B5B4E] leading-relaxed mb-8">
                {product.description_th || product.description}
              </p>

              {/* Product Details */}
              <div className="border-t border-b border-[#E8DDD5] py-6 mb-8 space-y-3">
                {product.material && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9B8B7E]">วัสดุ</span>
                    <span className="text-[#4A3F35]">{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9B8B7E]">น้ำหนัก</span>
                    <span className="text-[#4A3F35]">{product.weight}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B8B7E]">สถานะ</span>
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                    {product.stock > 0 ? "มีสินค้า" : "สินค้าหมด"}
                  </span>
                </div>
              </div>

              <AddToCartButton productId={product.id} stock={product.stock} />

              {/* Shipping info */}
              <div className="mt-8 p-4 bg-[#F5EDE6] rounded-xl">
                <p className="text-xs text-[#6B5B4E]">
                  🚚 จัดส่งฟรีสำหรับคำสั่งซื้อ ฿2,000 ขึ้นไป
                </p>
                <p className="text-xs text-[#9B8B7E] mt-1">
                  จัดส่งภายใน 2-3 วันทำการ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
