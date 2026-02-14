import { NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeDb();
    const sql = getDb();

    const [prodCount] = await sql`SELECT COUNT(*) as count FROM products WHERE is_active = 1`;
    const [orderCount] = await sql`SELECT COUNT(*) as count FROM orders`;
    const [revenueRow] = await sql`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'paid'`;
    const [pendingCount] = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`;
    const [customerCount] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`;
    const [lowStockCount] = await sql`SELECT COUNT(*) as count FROM products WHERE stock < 10 AND is_active = 1`;

    const recentOrders = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`;

    return NextResponse.json({
      stats: {
        totalProducts: Number(prodCount.count),
        totalOrders: Number(orderCount.count),
        totalRevenue: Number(revenueRow.total),
        pendingOrders: Number(pendingCount.count),
        totalCustomers: Number(customerCount.count),
        lowStock: Number(lowStockCount.count),
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
