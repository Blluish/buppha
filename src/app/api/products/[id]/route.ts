import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb();
    const sql = getDb();
    const { id } = await params;
    const rows = await sql`SELECT * FROM products WHERE id = ${id} AND is_active = 1`;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: rows[0] });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
