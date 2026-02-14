"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ChevronDown, ChevronUp, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (orderId: string, updates: Record<string, string>) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, ...updates }),
    });
    await fetchOrders();
  };

  const filtered = orders.filter((order) => {
    const matchSearch =
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#4A3F35]">จัดการคำสั่งซื้อ</h1>
        <p className="text-sm text-[#9B8B7E] mt-1">{orders.length} คำสั่งซื้อ</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8B7E]" />
          <input
            type="text"
            placeholder="ค้นหาคำสั่งซื้อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] placeholder:text-[#B8A89A] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
        >
          <option value="all">สถานะทั้งหมด</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDD5] p-8 text-center text-sm text-[#9B8B7E]">
          ไม่พบคำสั่งซื้อ
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status);
            const paymentInfo = PAYMENT_STATUSES.find((s) => s.value === order.payment_status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#E8DDD5] overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FDF8F4] transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div>
                      <p className="text-sm font-mono text-[#8B6F5E] font-medium">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#9B8B7E] mt-0.5">
                        {new Date(order.created_at).toLocaleString("th-TH")}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm text-[#4A3F35]">{order.customer_name}</p>
                      <p className="text-xs text-[#9B8B7E]">{order.customer_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${statusInfo?.color || "bg-gray-100 text-gray-800"}`}>
                      {statusInfo?.label || order.status}
                    </span>
                    <span className={`hidden sm:inline text-xs px-2.5 py-1 rounded-full ${paymentInfo?.color || "bg-gray-100 text-gray-800"}`}>
                      {paymentInfo?.label || order.payment_status}
                    </span>
                    <span className="text-sm font-semibold text-[#8B6F5E]">
                      {formatPrice(order.total)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-[#9B8B7E]" />
                    ) : (
                      <ChevronDown size={16} className="text-[#9B8B7E]" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#E8DDD5] px-5 py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="text-sm font-medium text-[#4A3F35] mb-3">รายการสินค้า</h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-[#FDF8F4] rounded-lg">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F5EDE6] shrink-0">
                                {item.product_image && (
                                  <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#4A3F35] line-clamp-1">{item.product_name}</p>
                                <p className="text-xs text-[#9B8B7E]">
                                  {formatPrice(item.price)} × {item.quantity}
                                </p>
                              </div>
                              <p className="text-xs font-medium text-[#8B6F5E]">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#E8DDD5] space-y-1 text-sm">
                          <div className="flex justify-between text-[#9B8B7E]">
                            <span>ราคาสินค้า</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-[#9B8B7E]">
                            <span>ค่าจัดส่ง</span>
                            <span>{order.shipping_fee === 0 ? "ฟรี" : formatPrice(order.shipping_fee)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-[#4A3F35]">
                            <span>ยอดรวม</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer & Actions */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-[#4A3F35] mb-2">ข้อมูลลูกค้า</h4>
                          <div className="text-xs text-[#6B5B4E] space-y-1 bg-[#FDF8F4] p-3 rounded-lg">
                            <p>{order.customer_name}</p>
                            <p>{order.customer_email}</p>
                            {order.customer_phone && <p>{order.customer_phone}</p>}
                            <p className="mt-2 text-[#9B8B7E]">{order.shipping_address}</p>
                          </div>
                        </div>

                        {order.notes && (
                          <div>
                            <h4 className="text-sm font-medium text-[#4A3F35] mb-2">หมายเหตุ</h4>
                            <p className="text-xs text-[#6B5B4E] bg-[#FDF8F4] p-3 rounded-lg">{order.notes}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-[#4A3F35] mb-2">อัปเดตสถานะ</h4>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FDF8F4] border border-[#E8DDD5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-[#4A3F35] mb-2">สถานะการชำระเงิน</h4>
                          <select
                            value={order.payment_status}
                            onChange={(e) => updateOrder(order.id, { payment_status: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FDF8F4] border border-[#E8DDD5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                          >
                            {PAYMENT_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-[#4A3F35] mb-2 flex items-center gap-1">
                            <Truck size={14} /> เลขพัสดุ
                          </h4>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={order.tracking_number || ""}
                              placeholder="กรอกเลขพัสดุ"
                              id={`tracking-${order.id}`}
                              className="flex-1 px-3 py-2 bg-[#FDF8F4] border border-[#E8DDD5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                updateOrder(order.id, { tracking_number: input.value });
                              }}
                              className="px-3 py-2 bg-[#8B6F5E] text-white rounded-lg text-xs hover:bg-[#7A5F4E] transition-colors"
                            >
                              บันทึก
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
