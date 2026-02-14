export interface Product {
  id: string;
  name: string;
  name_th: string;
  description: string;
  description_th: string;
  price: number;
  compare_price: number;
  category: string;
  image_url: string;
  images: string;
  stock: number;
  is_active: number;
  is_featured: number;
  material: string;
  weight: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_proof: string;
  tracking_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  address: string;
  created_at: string;
}

export type Category = "all" | "necklaces" | "earrings" | "bracelets" | "rings";

export const CATEGORIES: { value: Category; label: string; label_th: string }[] = [
  { value: "all", label: "All", label_th: "ทั้งหมด" },
  { value: "necklaces", label: "Necklaces", label_th: "สร้อยคอ" },
  { value: "earrings", label: "Earrings", label_th: "ต่างหู" },
  { value: "bracelets", label: "Bracelets", label_th: "กำไล" },
  { value: "rings", label: "Rings", label_th: "แหวน" },
];

export const ORDER_STATUSES = [
  { value: "pending", label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-800" },
  { value: "processing", label: "กำลังจัดเตรียม", color: "bg-indigo-100 text-indigo-800" },
  { value: "shipped", label: "จัดส่งแล้ว", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "ส่งถึงแล้ว", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-red-100 text-red-800" },
];

export const PAYMENT_STATUSES = [
  { value: "pending", label: "รอชำระ", color: "bg-yellow-100 text-yellow-800" },
  { value: "paid", label: "ชำระแล้ว", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "ล้มเหลว", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "คืนเงิน", color: "bg-gray-100 text-gray-800" },
];
