"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders?id=${orderId}`)
        .then((r) => r.json())
        .then((d) => setOrder(d.order))
        .catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-fade-in">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-serif text-[#4A3F35] mb-3">สั่งซื้อสำเร็จ!</h1>
          <p className="text-[#9B8B7E] mb-2">ขอบคุณสำหรับการสั่งซื้อ</p>
          {orderId && (
            <p className="text-sm text-[#B8A89A]">
              หมายเลขคำสั่งซื้อ: <span className="font-mono text-[#8B6F5E]">{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
        </div>

        {order && (
          <div className="mt-8 bg-white rounded-2xl border border-[#E8DDD5] p-6 text-left">
            <h3 className="text-lg font-serif text-[#4A3F35] mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#C4A882]" /> รายละเอียดคำสั่งซื้อ
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9B8B7E]">ชื่อผู้สั่ง</span>
                <span className="text-[#4A3F35]">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9B8B7E]">อีเมล</span>
                <span className="text-[#4A3F35]">{order.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9B8B7E]">วิธีชำระเงิน</span>
                <span className="text-[#4A3F35]">
                  {order.payment_method === "bank_transfer"
                    ? "โอนเงินผ่านธนาคาร"
                    : order.payment_method === "promptpay"
                    ? "พร้อมเพย์"
                    : "บัตรเครดิต"}
                </span>
              </div>
              <div className="border-t border-[#E8DDD5] pt-3 flex justify-between font-semibold">
                <span className="text-[#4A3F35]">ยอดรวม</span>
                <span className="text-[#8B6F5E] text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.payment_method === "bank_transfer" && (
              <div className="mt-4 p-4 bg-[#F5EDE6] rounded-xl text-sm text-[#6B5B4E]">
                <p className="font-medium mb-2">กรุณาโอนเงินไปที่:</p>
                <p>ธนาคารกสิกรไทย</p>
                <p>ชื่อบัญชี: บริษัท บุปผา จำกัด</p>
                <p>เลขที่บัญชี: xxx-x-xxxxx-x</p>
                <p className="mt-2 text-xs text-[#9B8B7E]">
                  กรุณาโอนเงินภายใน 24 ชั่วโมง มิฉะนั้นคำสั่งซื้อจะถูกยกเลิกอัตโนมัติ
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#8B6F5E] text-white px-6 py-3 rounded-full text-sm hover:bg-[#7A5F4E] transition-colors"
          >
            เลือกซื้อสินค้าเพิ่ม <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[#E8DDD5] text-[#6B5B4E] px-6 py-3 rounded-full text-sm hover:bg-[#F5EDE6] transition-colors"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="pt-24 pb-20 px-4 text-center text-[#9B8B7E]">กำลังโหลด...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
