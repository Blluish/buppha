import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const db = getDb();

    let query = "SELECT * FROM products WHERE is_active = 1";
    const params: any[] = [];

    if (category && category !== "all") {
      query += " AND category = ?";
      params.push(category);
    }

    if (featured === "true") {
      query += " AND is_featured = 1";
    }

    if (search) {
      query += " AND (name LIKE ? OR name_th LIKE ? OR description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC";

    const products = db.prepare(query).all(...params);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
