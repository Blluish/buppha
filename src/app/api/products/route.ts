import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    let products;

    if (category && category !== "all" && search) {
      const searchTerm = `%${search}%`;
      products = await sql`SELECT * FROM products WHERE is_active = 1 AND category = ${category} AND (name ILIKE ${searchTerm} OR name_th ILIKE ${searchTerm} OR description ILIKE ${searchTerm}) ORDER BY created_at DESC`;
    } else if (category && category !== "all") {
      products = await sql`SELECT * FROM products WHERE is_active = 1 AND category = ${category} ORDER BY created_at DESC`;
    } else if (featured === "true") {
      products = await sql`SELECT * FROM products WHERE is_active = 1 AND is_featured = 1 ORDER BY created_at DESC`;
    } else if (search) {
      const searchTerm = `%${search}%`;
      products = await sql`SELECT * FROM products WHERE is_active = 1 AND (name ILIKE ${searchTerm} OR name_th ILIKE ${searchTerm} OR description ILIKE ${searchTerm}) ORDER BY created_at DESC`;
    } else {
      products = await sql`SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC`;
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
