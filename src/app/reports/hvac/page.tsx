'use client';

import { useState } from 'react';
import { Wind, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockUnits = [
  { id: 'HVAC-001', location: 'مكتب المدير', type: 'سبليت', capacity: '2 طن' },
  { id: 'HVAC-002', location: 'الفصل 101', type: 'سبليت', capacity: '1.5 طن' },
  { id: 'HVAC-003', location: 'الفصل 102', type: 'سبليت', capacity: '1.5 طن' },
  { id: 'HVAC-004', location: 'المختبر', type: 'مركزي', capacity: '5 طن' },
  { id: 'HVAC-005', location: 'المكتبة', type: 'سبليت', capacity: '3 طن' },
];

export default function HVACReportPage() {
  const [units, setUnits] = useState(mockUnits.map((u) => ({ ...u, pressure: 0, temperature: 0, filter_status: 'clean' as const })));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقرير التكييف</h1>
          <p className="text-gray-500 mt-1">فحص وحدات التكييف والضغط</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          تقرير جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الوحدة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الموقع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الضغط (PSI)</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحرارة (°C)</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الفلتر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {units.map((unit, idx) => (
                <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Wind className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{unit.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{unit.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{unit.type} ({unit.capacity})</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={unit.pressure}
                      onChange={(e) => {
                        const newUnits = [...units];
                        newUnits[idx].pressure = Number(e.target.value);
                        setUnits(newUnits);
                      }}
                      className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={unit.temperature}
                      onChange={(e) => {
                        const newUnits = [...units];
                        newUnits[idx].temperature = Number(e.target.value);
                        setUnits(newUnits);
                      }}
                      className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={unit.filter_status}
                      onChange={(e) => {
                        const newUnits = [...units];
                        newUnits[idx].filter_status = e.target.value as any;
                        setUnits(newUnits);
                      }}
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        unit.filter_status === 'clean' ? 'bg-green-100 text-green-800' :
                        unit.filter_status === 'dirty' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )}
                    >
                      <option value="clean">نظيف</option>
                      <option value="dirty">متسخ</option>
                      <option value="needs_replacement">يحتاج تغيير</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
