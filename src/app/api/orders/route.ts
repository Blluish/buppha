import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method,
      notes,
    } = body;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart-session")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "ไม่พบตะกร้าสินค้า" }, { status: 400 });
    }

    const db = getDb();

    const cartItems = db
      .prepare(
        `SELECT ci.*, p.name, p.price, p.image_url, p.stock
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.session_id = ?`
      )
      .all(sessionId) as any[];

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "ตะกร้าสินค้าว่าง" }, { status: 400 });
    }

    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 2000 ? 0 : 100;
    const total = subtotal + shippingFee;

    const orderId = uuidv4();

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, subtotal, shipping_fee, total, payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, product_image, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

    const transaction = db.transaction(() => {
      insertOrder.run(
        orderId,
        customer_name,
        customer_email,
        customer_phone || null,
        shipping_address,
        subtotal,
        shippingFee,
        total,
        payment_method || "bank_transfer",
        notes || null
      );

      for (const item of cartItems) {
        insertItem.run(uuidv4(), orderId, item.product_id, item.name, item.image_url, item.price, item.quantity);
        updateStock.run(item.quantity, item.product_id);
      }

      db.prepare("DELETE FROM cart_items WHERE session_id = ?").run(sessionId);
    });

    transaction();

    return NextResponse.json({ order_id: orderId, total });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ error: "ไม่สามารถสร้างคำสั่งซื้อได้" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    const db = getDb();

    if (orderId) {
      const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as any;
      if (!order) {
        return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
      }
      const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId);
      return NextResponse.json({ order: { ...order, items } });
    }

    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
