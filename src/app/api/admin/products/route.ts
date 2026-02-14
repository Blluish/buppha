import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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

    const db = getDb();
    const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
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

    const body = await request.json();
    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO products (id, name, name_th, description, description_th, price, compare_price, category, image_url, stock, is_active, is_featured, material, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.name,
      body.name_th || "",
      body.description || "",
      body.description_th || "",
      body.price,
      body.compare_price || 0,
      body.category,
      body.image_url || "",
      body.stock || 0,
      body.is_active ?? 1,
      body.is_featured ?? 0,
      body.material || "",
      body.weight || ""
    );

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

    const body = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE products SET name=?, name_th=?, description=?, description_th=?, price=?, compare_price=?, category=?, image_url=?, stock=?, is_active=?, is_featured=?, material=?, weight=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(
      body.name,
      body.name_th || "",
      body.description || "",
      body.description_th || "",
      body.price,
      body.compare_price || 0,
      body.category,
      body.image_url || "",
      body.stock || 0,
      body.is_active ?? 1,
      body.is_featured ?? 0,
      body.material || "",
      body.weight || "",
      body.id
    );

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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const db = getDb();

    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
