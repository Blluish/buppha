"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  lowStock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecentOrders(d.recentOrders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#F5EDE6] rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "สินค้าทั้งหมด",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/products",
    },
    {
      label: "คำสั่งซื้อทั้งหมด",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
      href: "/admin/orders",
    },
    {
      label: "รายได้รวม",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "bg-[#F5EDE6] text-[#8B6F5E]",
      href: "/admin/orders",
    },
    {
      label: "รอดำเนินการ",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      href: "/admin/orders",
    },
    {
      label: "ลูกค้า",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      href: "#",
    },
    {
      label: "สินค้าใกล้หมด",
      value: stats?.lowStock || 0,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      href: "/admin/products",
    },
  ];

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-800" },
    processing: { label: "กำลังจัดเตรียม", color: "bg-indigo-100 text-indigo-800" },
    shipped: { label: "จัดส่งแล้ว", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "ส่งถึงแล้ว", color: "bg-green-100 text-green-800" },
    cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800" },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#4A3F35]">แดชบอร์ด</h1>
        <p className="text-sm text-[#9B8B7E] mt-1">ภาพรวมร้าน Buppha</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-[#E8DDD5] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#4A3F35]">{card.value}</p>
            <p className="text-xs text-[#9B8B7E] mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-[#E8DDD5] overflow-hidden">
        <div className="p-5 border-b border-[#E8DDD5] flex items-center justify-between">
          <h2 className="text-lg font-serif text-[#4A3F35]">คำสั่งซื้อล่าสุด</h2>
          <Link href="/admin/orders" className="text-sm text-[#8B6F5E] hover:underline">
            ดูทั้งหมด
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#9B8B7E]">ยังไม่มีคำสั่งซื้อ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[#9B8B7E] border-b border-[#E8DDD5]">
                  <th className="text-left px-5 py-3 font-medium">หมายเลข</th>
                  <th className="text-left px-5 py-3 font-medium">ลูกค้า</th>
                  <th className="text-left px-5 py-3 font-medium">ยอดรวม</th>
                  <th className="text-left px-5 py-3 font-medium">สถานะ</th>
                  <th className="text-left px-5 py-3 font-medium">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-[#F5EDE6] hover:bg-[#FDF8F4]">
                    <td className="px-5 py-3 text-sm font-mono text-[#8B6F5E]">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#4A3F35]">{order.customer_name}</td>
                    <td className="px-5 py-3 text-sm text-[#4A3F35]">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          statusMap[order.status]?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusMap[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#9B8B7E]">
                      {new Date(order.created_at).toLocaleDateString("th-TH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
