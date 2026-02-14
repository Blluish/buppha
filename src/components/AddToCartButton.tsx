"use client";

import { useState } from "react";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addToCart(productId, quantity);
    setAdded(true);
    setLoading(false);
    setTimeout(() => setAdded(false), 2000);
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl text-sm font-medium cursor-not-allowed"
      >
        สินค้าหมด
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#6B5B4E]">จำนวน:</span>
        <div className="flex items-center border border-[#E8DDD5] rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-[#6B5B4E] hover:bg-[#F5EDE6] transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-2 text-sm font-medium text-[#4A3F35] min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            className="px-3 py-2 text-[#6B5B4E] hover:bg-[#F5EDE6] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-xs text-[#9B8B7E]">เหลือ {stock} ชิ้น</span>
      </div>

      <button
        onClick={handleAdd}
        disabled={loading || added}
        className={`w-full py-4 rounded-xl text-sm font-medium tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
          added
            ? "bg-green-500 text-white"
            : "bg-[#8B6F5E] text-white hover:bg-[#7A5F4E] active:scale-[0.98]"
        } disabled:opacity-70`}
      >
        {added ? (
          <>
            <Check size={18} /> เพิ่มลงตะกร้าแล้ว
          </>
        ) : loading ? (
          <span className="animate-pulse">กำลังเพิ่ม...</span>
        ) : (
          <>
            <ShoppingBag size={18} /> เพิ่มลงตะกร้า
          </>
        )}
      </button>
    </div>
  );
}
