import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initializeDb();
    const sql = getDb();
    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;

    const ordersWithItems = [];
    for (const order of orders) {
      const items = await sql`SELECT * FROM order_items WHERE order_id = ${order.id}`;
      ordersWithItems.push({ ...order, items });
    }

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initializeDb();
    const sql = getDb();
    const body = await request.json();

    if (body.status) {
      await sql`UPDATE orders SET status = ${body.status}, updated_at = CURRENT_TIMESTAMP WHERE id = ${body.id}`;
    }
    if (body.payment_status) {
      await sql`UPDATE orders SET payment_status = ${body.payment_status}, updated_at = CURRENT_TIMESTAMP WHERE id = ${body.id}`;
    }
    if (body.tracking_number !== undefined) {
      await sql`UPDATE orders SET tracking_number = ${body.tracking_number}, updated_at = CURRENT_TIMESTAMP WHERE id = ${body.id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin orders PUT error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
