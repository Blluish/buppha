import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart-session")?.value;
  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set("cart-session", sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return sessionId;
}

export async function GET() {
  try {
    await initializeDb();
    const sql = getDb();
    const sessionId = await getSessionId();

    const rows = await sql`
      SELECT ci.id, ci.product_id, ci.quantity,
             p.id as p_id, p.name, p.name_th, p.price, p.image_url, p.stock, p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ${sessionId} AND p.is_active = 1
    `;

    const items = rows.map((row: any) => ({
      id: row.id,
      product_id: row.product_id,
      quantity: row.quantity,
      product: {
        id: row.p_id,
        name: row.name,
        name_th: row.name_th,
        price: row.price,
        image_url: row.image_url,
        stock: row.stock,
        category: row.category,
      },
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const sessionId = await getSessionId();
    const { product_id, quantity = 1 } = await request.json();

    const productRows = await sql`SELECT id, stock FROM products WHERE id = ${product_id} AND is_active = 1`;
    if (productRows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const product = productRows[0];

    const existingRows = await sql`SELECT id, quantity FROM cart_items WHERE session_id = ${sessionId} AND product_id = ${product_id}`;

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
      }
      await sql`UPDATE cart_items SET quantity = ${newQty} WHERE id = ${existing.id}`;
    } else {
      if (quantity > product.stock) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
      }
      const id = uuidv4();
      await sql`INSERT INTO cart_items (id, session_id, product_id, quantity) VALUES (${id}, ${sessionId}, ${product_id}, ${quantity})`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const sessionId = await getSessionId();
    const { item_id, quantity } = await request.json();

    if (quantity <= 0) {
      await sql`DELETE FROM cart_items WHERE id = ${item_id} AND session_id = ${sessionId}`;
    } else {
      await sql`UPDATE cart_items SET quantity = ${quantity} WHERE id = ${item_id} AND session_id = ${sessionId}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const sessionId = await getSessionId();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("item_id");
    const all = searchParams.get("all");

    if (all === "true") {
      await sql`DELETE FROM cart_items WHERE session_id = ${sessionId}`;
    } else if (itemId) {
      await sql`DELETE FROM cart_items WHERE id = ${itemId} AND session_id = ${sessionId}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
