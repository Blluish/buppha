import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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

    const db = getDb();
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as any[];

    const ordersWithItems = orders.map((order) => {
      const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
      return { ...order, items };
    });

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

    const body = await request.json();
    const db = getDb();

    if (body.status) {
      db.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(body.status, body.id);
    }
    if (body.payment_status) {
      db.prepare("UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(body.payment_status, body.id);
    }
    if (body.tracking_number !== undefined) {
      db.prepare("UPDATE orders SET tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(body.tracking_number, body.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin orders PUT error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
