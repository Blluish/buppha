import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    const totalProducts = (db.prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1").get() as any).count;
    const totalOrders = (db.prepare("SELECT COUNT(*) as count FROM orders").get() as any).count;
    const totalRevenue = (db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'paid'").get() as any).total;
    const pendingOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as any).count;
    const totalCustomers = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get() as any).count;
    const lowStock = (db.prepare("SELECT COUNT(*) as count FROM products WHERE stock < 10 AND is_active = 1").get() as any).count;

    const recentOrders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5").all();

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalCustomers,
        lowStock,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
