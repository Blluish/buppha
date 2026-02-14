"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, Building2, QrCode } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "bank_transfer",
    notes: "",
  });

  const shippingFee = total >= 2000 ? 0 : 100;
  const grandTotal = total + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      await clearCart();
      router.push(`/order-success?id=${data.order_id}`);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-20 px-4 text-center">
          <p className="text-[#9B8B7E] text-lg mb-4">ไม่มีสินค้าในตะกร้า</p>
          <Link
            href="/shop"
            className="text-[#8B6F5E] text-sm hover:underline"
          >
            กลับไปเลือกสินค้า
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
        <div className="max-w-5xl mx-auto">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-sm text-[#9B8B7E] hover:text-[#8B6F5E] mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> กลับไปตะกร้าสินค้า
          </Link>

          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] text-[#C4A882] uppercase mb-3">Checkout</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#4A3F35] tracking-wide">
              ชำระเงิน
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-2xl border border-[#E8DDD5] p-6">
                  <h3 className="text-lg font-serif text-[#4A3F35] mb-6">ข้อมูลผู้สั่งซื้อ</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#9B8B7E] mb-1.5">ชื่อ-นามสกุล *</label>
                      <input
                        type="text"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9B8B7E] mb-1.5">อีเมล *</label>
                      <input
                        type="email"
                        name="customer_email"
                        value={form.customer_email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#9B8B7E] mb-1.5">เบอร์โทรศัพท์</label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={form.customer_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl border border-[#E8DDD5] p-6">
                  <h3 className="text-lg font-serif text-[#4A3F35] mb-6">ที่อยู่จัดส่ง</h3>
                  <textarea
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                    className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] placeholder:text-[#B8A89A] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882] resize-none"
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl border border-[#E8DDD5] p-6">
                  <h3 className="text-lg font-serif text-[#4A3F35] mb-6">วิธีชำระเงิน</h3>
                  <div className="space-y-3">
                    {[
                      { value: "bank_transfer", label: "โอนเงินผ่านธนาคาร", icon: Building2 },
                      { value: "promptpay", label: "พร้อมเพย์ (PromptPay)", icon: QrCode },
                      { value: "credit_card", label: "บัตรเครดิต/เดบิต", icon: CreditCard },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          form.payment_method === method.value
                            ? "border-[#C4A882] bg-[#FDF8F4]"
                            : "border-[#E8DDD5] hover:border-[#D4C4B4]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.value}
                          checked={form.payment_method === method.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.payment_method === method.value
                              ? "border-[#C4A882]"
                              : "border-[#D4C4B4]"
                          }`}
                        >
                          {form.payment_method === method.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C4A882]" />
                          )}
                        </div>
                        <method.icon size={18} className="text-[#9B8B7E]" />
                        <span className="text-sm text-[#4A3F35]">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {form.payment_method === "bank_transfer" && (
                    <div className="mt-4 p-4 bg-[#F5EDE6] rounded-xl text-sm text-[#6B5B4E]">
                      <p className="font-medium mb-2">ข้อมูลบัญชีธนาคาร:</p>
                      <p>ธนาคารกสิกรไทย</p>
                      <p>ชื่อบัญชี: บริษัท บุปผา จำกัด</p>
                      <p>เลขที่บัญชี: xxx-x-xxxxx-x</p>
                    </div>
                  )}

                  {form.payment_method === "promptpay" && (
                    <div className="mt-4 p-4 bg-[#F5EDE6] rounded-xl text-sm text-[#6B5B4E] text-center">
                      <p className="font-medium mb-2">สแกน QR Code เพื่อชำระเงิน</p>
                      <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                        <QrCode size={120} className="text-[#4A3F35]" />
                      </div>
                      <p className="mt-2 text-xs text-[#9B8B7E]">พร้อมเพย์: 0xx-xxx-xxxx</p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl border border-[#E8DDD5] p-6">
                  <h3 className="text-lg font-serif text-[#4A3F35] mb-4">หมายเหตุ</h3>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                    className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] placeholder:text-[#B8A89A] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882] resize-none"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-[#E8DDD5] p-6 sticky top-24">
                  <h3 className="text-lg font-serif text-[#4A3F35] mb-6">สรุปคำสั่งซื้อ</h3>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F5EDE6] shrink-0">
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                          <span className="absolute -top-1 -right-1 bg-[#8B6F5E] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#4A3F35] line-clamp-1">
                            {item.product.name_th || item.product.name}
                          </p>
                          <p className="text-xs text-[#8B6F5E] mt-0.5">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm border-t border-[#E8DDD5] pt-4">
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
                    <div className="border-t border-[#E8DDD5] pt-3 flex justify-between font-semibold">
                      <span className="text-[#4A3F35]">ยอดรวม</span>
                      <span className="text-[#8B6F5E] text-lg">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full bg-[#8B6F5E] text-white py-4 rounded-xl text-sm font-medium tracking-wider hover:bg-[#7A5F4E] transition-colors disabled:opacity-50"
                  >
                    {loading ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
