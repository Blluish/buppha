"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, total, loading, updateQuantity, removeItem } = useCart();

  const shippingFee = total >= 2000 ? 0 : 100;
  const grandTotal = total + shippingFee;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] text-[#C4A882] uppercase mb-3">Shopping Cart</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#4A3F35] tracking-wide">
              ตะกร้าสินค้า
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-[#D4C4B4] mb-4" />
              <p className="text-[#9B8B7E] text-lg mb-2">ตะกร้าสินค้าว่าง</p>
              <p className="text-[#B8A89A] text-sm mb-6">เลือกสินค้าที่คุณชื่นชอบเพิ่มลงตะกร้า</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#8B6F5E] text-white px-6 py-3 rounded-full text-sm hover:bg-[#7A5F4E] transition-colors"
              >
                เลือกซื้อสินค้า <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white rounded-2xl p-4 border border-[#E8DDD5]"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F5EDE6] shrink-0">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product_id}`}
                        className="text-sm font-medium text-[#4A3F35] hover:text-[#8B6F5E] transition-colors line-clamp-1"
                      >
                        {item.product.name_th || item.product.name}
                      </Link>
                      <p className="text-xs text-[#9B8B7E] mt-1 capitalize">{item.product.category}</p>
                      <p className="text-sm font-semibold text-[#8B6F5E] mt-2">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E8DDD5] rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                            className="px-2 py-1 text-[#6B5B4E] hover:bg-[#F5EDE6] transition-colors disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-xs font-medium text-[#4A3F35]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="px-2 py-1 text-[#6B5B4E] hover:bg-[#F5EDE6] transition-colors disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="text-[#B8A89A] hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-[#E8DDD5] p-6 sticky top-24">
                  <h3 className="text-lg font-serif text-[#4A3F35] mb-6">สรุปคำสั่งซื้อ</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#9B8B7E]">ราคาสินค้า</span>
                      <span className="text-[#4A3F35]">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9B8B7E]">ค่าจัดส่ง</span>
                      <span className="text-[#4A3F35]">
                        {shippingFee === 0 ? "ฟรี" : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {shippingFee > 0 && (
                      <p className="text-xs text-[#C4A882]">
                        สั่งซื้อเพิ่มอีก {formatPrice(2000 - total)} เพื่อรับจัดส่งฟรี
                      </p>
                    )}
                    <div className="border-t border-[#E8DDD5] pt-3 flex justify-between font-semibold">
                      <span className="text-[#4A3F35]">ยอดรวม</span>
                      <span className="text-[#8B6F5E] text-lg">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#8B6F5E] text-white py-4 rounded-xl text-sm font-medium tracking-wider hover:bg-[#7A5F4E] transition-colors"
                  >
                    ดำเนินการชำระเงิน <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/shop"
                    className="mt-3 w-full inline-flex items-center justify-center text-sm text-[#9B8B7E] hover:text-[#8B6F5E] transition-colors"
                  >
                    เลือกซื้อสินค้าเพิ่ม
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
