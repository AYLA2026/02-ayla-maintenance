'use client';

import { useState } from 'react';
import { Wrench, Plus, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const systems = [
  'الكهرباء', 'السباكة', 'التكييف', 'الإطفاء', 'الإنذار',
  'المصاعد', 'الإنارة الخارجية', 'المولدات', 'لوحات التوزيع', 'نظام UPS',
];

export default function OMReportPage() {
  const [status, setStatus] = useState<Record<string, 'operational' | 'needs_repair' | 'critical'>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const operational = Object.values(status).filter((s) => s === 'operational').length;
  const needsRepair = Object.values(status).filter((s) => s === 'needs_repair').length;
  const critical = Object.values(status).filter((s) => s === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقرير O&M</h1>
          <p className="text-gray-500 mt-1">فحص 10 أنظمة تشغيل وصيانة</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          تقرير جديد
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{operational}</p>
          <p className="text-sm text-green-700">يعمل</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-600">{needsRepair}</p>
          <p className="text-sm text-yellow-700">يحتاج صيانة</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-600">{critical}</p>
          <p className="text-sm text-red-700">حرج</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">فحص الأنظمة</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {systems.map((system) => (
            <div key={system} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{system}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus({ ...status, [system]: 'operational' })}
                    className={cn('px-3 py-1 rounded-lg text-sm transition-colors',
                      status[system] === 'operational' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                    )}
                  >
                    يعمل
                  </button>
                  <button
                    onClick={() => setStatus({ ...status, [system]: 'needs_repair' })}
                    className={cn('px-3 py-1 rounded-lg text-sm transition-colors',
                      status[system] === 'needs_repair' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                    )}
                  >
                    يحتاج صيانة
                  </button>
                  <button
                    onClick={() => setStatus({ ...status, [system]: 'critical' })}
                    className={cn('px-3 py-1 rounded-lg text-sm transition-colors',
                      status[system] === 'critical' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                    )}
                  >
                    حرج
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="ملاحظات..."
                value={notes[system] || ''}
                onChange={(e) => setNotes({ ...notes, [system]: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
