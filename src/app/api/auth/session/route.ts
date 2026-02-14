import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const db = getDb();
    const user = db.prepare("SELECT id, email, name, role, phone, address FROM users WHERE id = ?").get(session.userId) as any;

    return NextResponse.json({ user: user || null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
