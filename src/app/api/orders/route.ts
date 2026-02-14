import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
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

    const cartItems = await sql`
      SELECT ci.*, p.name, p.price, p.image_url, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ${sessionId}
    `;

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "ตะกร้าสินค้าว่าง" }, { status: 400 });
    }

    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 2000 ? 0 : 100;
    const total = subtotal + shippingFee;

    const orderId = uuidv4();
    const pm = payment_method || "bank_transfer";

    await sql`INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, subtotal, shipping_fee, total, payment_method, notes)
      VALUES (${orderId}, ${customer_name}, ${customer_email}, ${customer_phone || null}, ${shipping_address}, ${subtotal}, ${shippingFee}, ${total}, ${pm}, ${notes || null})`;

    for (const item of cartItems) {
      const itemId = uuidv4();
      await sql`INSERT INTO order_items (id, order_id, product_id, product_name, product_image, price, quantity)
        VALUES (${itemId}, ${orderId}, ${item.product_id}, ${item.name}, ${item.image_url}, ${item.price}, ${item.quantity})`;
      await sql`UPDATE products SET stock = stock - ${item.quantity} WHERE id = ${item.product_id}`;
    }

    await sql`DELETE FROM cart_items WHERE session_id = ${sessionId}`;

    return NextResponse.json({ order_id: orderId, total });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ error: "ไม่สามารถสร้างคำสั่งซื้อได้" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (orderId) {
      const orderRows = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
      if (orderRows.length === 0) {
        return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
      }
      const items = await sql`SELECT * FROM order_items WHERE order_id = ${orderId}`;
      return NextResponse.json({ order: { ...orderRows[0], items } });
    }

    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
