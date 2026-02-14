import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { signToken } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();
    const db = getDb();

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const userId = uuidv4();

    db.prepare(
      "INSERT INTO users (id, email, password, name, phone, role) VALUES (?, ?, ?, ?, ?, 'customer')"
    ).run(userId, email, hashedPassword, name, phone || null);

    const token = signToken({ userId, email, role: "customer" });
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      user: { id: userId, email, name, role: "customer" },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
