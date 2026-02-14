import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initializeDb();
    const sql = getDb();
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initializeDb();
    const sql = getDb();
    const body = await request.json();
    const id = uuidv4();

    await sql`INSERT INTO products (id, name, name_th, description, description_th, price, compare_price, category, image_url, stock, is_active, is_featured, material, weight)
      VALUES (${id}, ${body.name}, ${body.name_th || ""}, ${body.description || ""}, ${body.description_th || ""}, ${body.price}, ${body.compare_price || 0}, ${body.category}, ${body.image_url || ""}, ${body.stock || 0}, ${body.is_active ?? 1}, ${body.is_featured ?? 0}, ${body.material || ""}, ${body.weight || ""})`;

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initializeDb();
    const sql = getDb();
    const body = await request.json();

    await sql`UPDATE products SET name=${body.name}, name_th=${body.name_th || ""}, description=${body.description || ""}, description_th=${body.description_th || ""}, price=${body.price}, compare_price=${body.compare_price || 0}, category=${body.category}, image_url=${body.image_url || ""}, stock=${body.stock || 0}, is_active=${body.is_active ?? 1}, is_featured=${body.is_featured ?? 0}, material=${body.material || ""}, weight=${body.weight || ""}, updated_at=CURRENT_TIMESTAMP WHERE id=${body.id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin products PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initializeDb();
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
