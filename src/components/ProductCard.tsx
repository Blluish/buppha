"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-[#F5EDE6] aspect-square mb-4">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.compare_price > 0 && product.compare_price > product.price && (
          <span className="absolute top-3 left-3 bg-[#C4A882] text-white text-xs px-3 py-1 rounded-full">
            ลด {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
          </span>
        )}
        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#6B5B4E] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C4A882] hover:text-white disabled:opacity-50 shadow-lg"
        >
          <ShoppingBag size={18} />
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white text-[#6B5B4E] px-4 py-2 rounded-full text-sm font-medium">
              สินค้าหมด
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1 px-1">
        <p className="text-xs text-[#9B8B7E] uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm font-medium text-[#4A3F35] group-hover:text-[#8B6F5E] transition-colors">
          {product.name_th || product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#8B6F5E]">{formatPrice(product.price)}</span>
          {product.compare_price > 0 && product.compare_price > product.price && (
            <span className="text-xs text-[#B8A89A] line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
