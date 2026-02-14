import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, initializeDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    await initializeDb();
    const sql = getDb();
    const rows = await sql`SELECT id, email, name, role, phone, address, image, provider FROM users WHERE id = ${session.userId}`;

    return NextResponse.json({ user: rows[0] || null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
