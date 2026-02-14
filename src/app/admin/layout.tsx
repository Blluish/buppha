"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/products", label: "สินค้า", icon: Package },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") {
          router.push("/login");
        } else {
          setUser(d.user);
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F4]">
        <div className="text-[#9B8B7E] animate-pulse">กำลังโหลด...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8DDD5] px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="text-[#6B5B4E]">
          <Menu size={24} />
        </button>
        <span className="text-lg font-serif tracking-[0.15em] text-[#8B6F5E]">BUPPHA</span>
        <div className="w-6" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E8DDD5] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif tracking-[0.15em] text-[#8B6F5E]">BUPPHA</h1>
            <p className="text-[10px] tracking-[0.2em] text-[#C4A882] uppercase mt-0.5">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#9B8B7E]"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 mt-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[#8B6F5E] text-white"
                    : "text-[#6B5B4E] hover:bg-[#F5EDE6]"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E8DDD5]">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#6B5B4E] hover:bg-[#F5EDE6] transition-colors mb-1"
          >
            <Store size={18} /> ไปหน้าร้าน
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#6B5B4E] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
          <div className="mt-3 px-4">
            <p className="text-xs text-[#9B8B7E]">{user.name}</p>
            <p className="text-[10px] text-[#B8A89A]">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
