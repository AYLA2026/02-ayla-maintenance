'use client';

import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Warehouse, InventoryItem } from '@/types';

const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    project_id: '1',
    name: 'مخزن القويعية الرئيسي',
    location: 'حي النخيل، القويعية',
    manager: 'أحمد العتيبي',
    items: [
      { id: '1', warehouse_id: '1', name: 'لمبات LED', category: 'كهرباء', quantity: 150, min_quantity: 50, unit: 'قطعة', unit_price: 15, supplier: 'شركة النور', created_at: '2026-01-01' },
      { id: '2', warehouse_id: '1', name: 'شريط لاصق كهربائي', category: 'كهرباء', quantity: 30, min_quantity: 20, unit: 'رول', unit_price: 5, supplier: 'شركة النور', created_at: '2026-01-01' },
    ],
    created_at: '2026-01-01',
  },
];

export default function InventoryPage() {
  const [warehouses] = useState<Warehouse[]>(mockWarehouses);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allItems = warehouses.flatMap((w) => w.items);
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.includes(searchTerm) || item.category.includes(searchTerm);
    const matchesWarehouse = selectedWarehouse === 'all' || item.warehouse_id === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  const lowStock = allItems.filter((item) => item.quantity <= item.min_quantity);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المخازن</h1>
          <p className="text-gray-500 mt-1">إدارة المخزون والمواد</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          صنف جديد
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">تنبيه: {lowStock.length} صنف تحت الحد الأدنى</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">المخازن</p>
          <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">الأصناف</p>
          <p className="text-2xl font-bold text-gray-900">{allItems.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">قيمة المخزون</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('ar-SA').format(allItems.reduce((s, i) => s + i.quantity * i.unit_price, 0))} ر.س
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">تحت الحد</p>
          <p className="text-2xl font-bold text-red-600">{lowStock.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث باسم الصنف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
            />
          </div>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          >
            <option value="all">جميع المخازن</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الصنف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الكمية</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحد الأدنى</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">السعر</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المورد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ayla-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-ayla-600" />
                      </div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      item.quantity <= item.min_quantity ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    )}>
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.min_quantity} {item.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.unit_price} ر.س</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
