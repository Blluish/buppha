import Database from "better-sqlite3";
import path from "path";
import bcryptjs from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "buppha.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_th TEXT,
      description TEXT,
      description_th TEXT,
      price REAL NOT NULL,
      compare_price REAL,
      category TEXT NOT NULL,
      image_url TEXT,
      images TEXT DEFAULT '[]',
      stock INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      material TEXT,
      weight TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping_fee REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
      payment_proof TEXT,
      tracking_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_image TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // Seed admin user if not exists
  const adminExists = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
    const hashedPassword = bcryptjs.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)"
    ).run("admin-001", "admin@buppha.com", hashedPassword, "Admin", "admin");
  }

  // Seed sample products if none exist
  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (productCount.count === 0) {
    seedProducts(db);
  }
}

function seedProducts(db: Database.Database) {
  const products = [
    {
      id: "prod-001",
      name: "Lotus Bloom Necklace",
      name_th: "สร้อยคอดอกบัว",
      description: "Elegant lotus-inspired pendant necklace crafted in sterling silver with rose gold plating. Features intricate petal details.",
      description_th: "สร้อยคอจี้ดอกบัวสุดหรู ทำจากเงินสเตอร์ลิงชุบทองคำสีชมพู ตกแต่งด้วยลายกลีบดอกอย่างประณีต",
      price: 2990,
      compare_price: 3590,
      category: "necklaces",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
      stock: 25,
      is_featured: 1,
      material: "Sterling Silver, Rose Gold Plating",
      weight: "8g",
    },
    {
      id: "prod-002",
      name: "Cherry Blossom Earrings",
      name_th: "ต่างหูดอกซากุระ",
      description: "Delicate cherry blossom drop earrings with pearl accents. Perfect for everyday elegance.",
      description_th: "ต่างหูห้อยดอกซากุระประดับไข่มุก สวยงามสำหรับทุกวัน",
      price: 1890,
      compare_price: 2290,
      category: "earrings",
      image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      stock: 40,
      is_featured: 1,
      material: "Sterling Silver, Freshwater Pearl",
      weight: "4g",
    },
    {
      id: "prod-003",
      name: "Rose Garden Bracelet",
      name_th: "กำไลสวนกุหลาบ",
      description: "A stunning bracelet featuring miniature rose charms linked together. Adjustable chain for perfect fit.",
      description_th: "กำไลข้อมือสุดสวยประดับจี้กุหลาบขนาดเล็ก ปรับขนาดได้",
      price: 2490,
      compare_price: 0,
      category: "bracelets",
      image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      stock: 30,
      is_featured: 1,
      material: "18K Gold Plated Brass",
      weight: "12g",
    },
    {
      id: "prod-004",
      name: "Daisy Chain Ring",
      name_th: "แหวนเดซี่",
      description: "Minimalist daisy flower ring with adjustable band. A charming addition to any jewelry collection.",
      description_th: "แหวนดอกเดซี่สไตล์มินิมอล ปรับขนาดได้ เพิ่มเสน่ห์ให้คอลเลกชันเครื่องประดับของคุณ",
      price: 990,
      compare_price: 1290,
      category: "rings",
      image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      stock: 50,
      is_featured: 0,
      material: "Sterling Silver",
      weight: "3g",
    },
    {
      id: "prod-005",
      name: "Orchid Drop Necklace",
      name_th: "สร้อยคอกล้วยไม้",
      description: "Exquisite orchid pendant with cubic zirconia stones. A statement piece for special occasions.",
      description_th: "จี้กล้วยไม้ประดับเพชร CZ สุดหรู เหมาะสำหรับโอกาสพิเศษ",
      price: 4590,
      compare_price: 5490,
      category: "necklaces",
      image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=600&fit=crop",
      stock: 15,
      is_featured: 1,
      material: "Sterling Silver, CZ Stones",
      weight: "10g",
    },
    {
      id: "prod-006",
      name: "Sunflower Stud Earrings",
      name_th: "ต่างหูดอกทานตะวัน",
      description: "Bright and cheerful sunflower stud earrings. Gold-plated with enamel detail.",
      description_th: "ต่างหูดอกทานตะวันสดใส ชุบทองประดับอีนาเมล",
      price: 1290,
      compare_price: 0,
      category: "earrings",
      image_url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop",
      stock: 60,
      is_featured: 0,
      material: "Gold Plated, Enamel",
      weight: "3g",
    },
    {
      id: "prod-007",
      name: "Jasmine Vine Bracelet",
      name_th: "กำไลเถาดอกมะลิ",
      description: "Delicate jasmine vine-inspired bracelet with tiny flower details winding around the wrist.",
      description_th: "กำไลข้อมือลายเถาดอกมะลิ ประดับดอกไม้ขนาดเล็กพันรอบข้อมือ",
      price: 3290,
      compare_price: 3890,
      category: "bracelets",
      image_url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
      stock: 20,
      is_featured: 0,
      material: "Sterling Silver",
      weight: "15g",
    },
    {
      id: "prod-008",
      name: "Peony Bloom Ring",
      name_th: "แหวนดอกโบตั๋น",
      description: "Bold peony flower ring with layered petals. A luxurious statement piece.",
      description_th: "แหวนดอกโบตั๋นขนาดใหญ่ กลีบดอกซ้อนกัน ชิ้นงานหรูหรา",
      price: 1790,
      compare_price: 0,
      category: "rings",
      image_url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop",
      stock: 35,
      is_featured: 0,
      material: "Rose Gold Plated Silver",
      weight: "5g",
    },
  ];

  const stmt = db.prepare(`
    INSERT INTO products (id, name, name_th, description, description_th, price, compare_price, category, image_url, stock, is_featured, material, weight)
    VALUES (@id, @name, @name_th, @description, @description_th, @price, @compare_price, @category, @image_url, @stock, @is_featured, @material, @weight)
  `);

  for (const product of products) {
    stmt.run(product);
  }
}
