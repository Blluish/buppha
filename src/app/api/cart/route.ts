import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
    const sessionId = await getSessionId();
    const db = getDb();
    const items = db
      .prepare(
        `SELECT ci.id, ci.product_id, ci.quantity, 
                p.id as p_id, p.name, p.name_th, p.price, p.image_url, p.stock, p.category
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.session_id = ? AND p.is_active = 1`
      )
      .all(sessionId)
      .map((row: any) => ({
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
    const sessionId = await getSessionId();
    const { product_id, quantity = 1 } = await request.json();
    const db = getDb();

    const product = db.prepare("SELECT id, stock FROM products WHERE id = ? AND is_active = 1").get(product_id) as { id: string; stock: number } | undefined;
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = db
      .prepare("SELECT id, quantity FROM cart_items WHERE session_id = ? AND product_id = ?")
      .get(sessionId, product_id) as { id: string; quantity: number } | undefined;

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
      }
      db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(newQty, existing.id);
    } else {
      if (quantity > product.stock) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
      }
      db.prepare("INSERT INTO cart_items (id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)").run(
        uuidv4(),
        sessionId,
        product_id,
        quantity
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const { item_id, quantity } = await request.json();
    const db = getDb();

    if (quantity <= 0) {
      db.prepare("DELETE FROM cart_items WHERE id = ? AND session_id = ?").run(item_id, sessionId);
    } else {
      db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND session_id = ?").run(quantity, item_id, sessionId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("item_id");
    const all = searchParams.get("all");
    const db = getDb();

    if (all === "true") {
      db.prepare("DELETE FROM cart_items WHERE session_id = ?").run(sessionId);
    } else if (itemId) {
      db.prepare("DELETE FROM cart_items WHERE id = ? AND session_id = ?").run(itemId, sessionId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
