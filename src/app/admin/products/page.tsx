"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { Product, CATEGORIES } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const emptyProduct = {
  id: "",
  name: "",
  name_th: "",
  description: "",
  description_th: "",
  price: 0,
  compare_price: 0,
  category: "necklaces",
  image_url: "",
  stock: 0,
  is_active: 1,
  is_featured: 0,
  material: "",
  weight: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        setShowModal(false);
        setEditing(null);
        await fetchProducts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบสินค้านี้หรือไม่?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    await fetchProducts();
  };

  const openCreate = () => {
    setEditing({ ...emptyProduct });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing({ ...product });
    setShowModal(true);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.name_th && p.name_th.includes(search))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#4A3F35]">จัดการสินค้า</h1>
          <p className="text-sm text-[#9B8B7E] mt-1">{products.length} สินค้า</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#8B6F5E] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#7A5F4E] transition-colors"
        >
          <Plus size={16} /> เพิ่มสินค้า
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72 mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8B7E]" />
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DDD5] rounded-xl text-sm text-[#4A3F35] placeholder:text-[#B8A89A] focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8DDD5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[#9B8B7E] border-b border-[#E8DDD5]">
                  <th className="text-left px-5 py-3 font-medium">สินค้า</th>
                  <th className="text-left px-5 py-3 font-medium">หมวดหมู่</th>
                  <th className="text-left px-5 py-3 font-medium">ราคา</th>
                  <th className="text-left px-5 py-3 font-medium">สต็อก</th>
                  <th className="text-left px-5 py-3 font-medium">สถานะ</th>
                  <th className="text-right px-5 py-3 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-[#F5EDE6] hover:bg-[#FDF8F4]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F5EDE6] shrink-0">
                          {product.image_url && (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#4A3F35] line-clamp-1">
                            {product.name_th || product.name}
                          </p>
                          <p className="text-xs text-[#9B8B7E] line-clamp-1">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#6B5B4E] capitalize">{product.category}</td>
                    <td className="px-5 py-3 text-sm text-[#4A3F35]">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-sm ${
                          product.stock < 10 ? "text-red-500 font-medium" : "text-[#4A3F35]"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          product.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.is_active ? "เปิดขาย" : "ปิดขาย"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-[#9B8B7E] hover:text-[#8B6F5E] hover:bg-[#F5EDE6] rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-[#9B8B7E] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-[#9B8B7E]">ไม่พบสินค้า</div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E8DDD5] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-serif text-[#4A3F35]">
                {editing.id ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="text-[#9B8B7E] hover:text-[#4A3F35]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">ชื่อสินค้า (EN) *</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">ชื่อสินค้า (TH)</label>
                  <input
                    type="text"
                    value={editing.name_th}
                    onChange={(e) => setEditing({ ...editing, name_th: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9B8B7E] mb-1.5">รายละเอียด (EN)</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9B8B7E] mb-1.5">รายละเอียด (TH)</label>
                <textarea
                  value={editing.description_th}
                  onChange={(e) => setEditing({ ...editing, description_th: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">ราคา (฿) *</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">ราคาเปรียบเทียบ</label>
                  <input
                    type="number"
                    value={editing.compare_price}
                    onChange={(e) => setEditing({ ...editing, compare_price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">สต็อก *</label>
                  <input
                    type="number"
                    value={editing.stock}
                    onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">หมวดหมู่ *</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  >
                    {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label_th}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">URL รูปภาพ</label>
                  <input
                    type="text"
                    value={editing.image_url}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">วัสดุ</label>
                  <input
                    type="text"
                    value={editing.material}
                    onChange={(e) => setEditing({ ...editing, material: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9B8B7E] mb-1.5">น้ำหนัก</label>
                  <input
                    type="text"
                    value={editing.weight}
                    onChange={(e) => setEditing({ ...editing, weight: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FDF8F4] border border-[#E8DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active === 1}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded border-[#E8DDD5] text-[#8B6F5E] focus:ring-[#C4A882]"
                  />
                  <span className="text-sm text-[#6B5B4E]">เปิดขาย</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_featured === 1}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded border-[#E8DDD5] text-[#8B6F5E] focus:ring-[#C4A882]"
                  />
                  <span className="text-sm text-[#6B5B4E]">สินค้าแนะนำ</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#E8DDD5] px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="px-5 py-2.5 border border-[#E8DDD5] text-[#6B5B4E] rounded-xl text-sm hover:bg-[#F5EDE6] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.name || !editing.price}
                className="px-5 py-2.5 bg-[#8B6F5E] text-white rounded-xl text-sm hover:bg-[#7A5F4E] transition-colors disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
