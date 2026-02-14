"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#4A3F35] tracking-wide mb-2">สมัครสมาชิก</h1>
            <p className="text-sm text-[#9B8B7E]">สร้างบัญชีเพื่อรับสิทธิพิเศษ</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8DDD5] p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#9B8B7E] mb-1.5">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B8B7E] mb-1.5">อีเมล *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B8B7E] mb-1.5">รหัสผ่าน *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B8B7E] mb-1.5">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-[#8B6F5E] text-white py-3.5 rounded-xl text-sm font-medium tracking-wider hover:bg-[#7A5F4E] transition-colors disabled:opacity-50"
            >
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>

            <p className="mt-6 text-center text-sm text-[#9B8B7E]">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="text-[#8B6F5E] hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
