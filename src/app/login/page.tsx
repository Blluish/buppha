"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(searchParams.get("error") ? "เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่" : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google?callbackUrl=/";
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#4A3F35] tracking-wide mb-2">เข้าสู่ระบบ</h1>
            <p className="text-sm text-[#9B8B7E]">ยินดีต้อนรับกลับมา</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DDD5] p-8">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#E8DDD5] py-3.5 rounded-xl text-sm font-medium text-[#4A3F35] hover:bg-[#FDF8F4] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              เข้าสู่ระบบด้วย Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[#E8DDD5]"></div>
              <span className="px-4 text-xs text-[#9B8B7E]">หรือ</span>
              <div className="flex-1 border-t border-[#E8DDD5]"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">อีเมลหรือชื่อผู้ใช้</label>
                  <input
                    type="text"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                    placeholder="อีเมลหรือชื่อผู้ใช้"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">รหัสผ่าน</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
                    placeholder="••••••••"
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
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#9B8B7E]">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-[#8B6F5E] hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-[#9B8B7E]">กำลังโหลด...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
