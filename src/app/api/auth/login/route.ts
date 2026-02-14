import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { signToken } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const { email, password } = await request.json();

    const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }
    const user = rows[0];

    const valid = bcryptjs.compareSync(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
