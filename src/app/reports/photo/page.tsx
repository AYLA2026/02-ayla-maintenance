'use client';

import { useState } from 'react';
import { Camera, Plus, Image as ImageIcon, ArrowRight } from 'lucide-react';

const mockSections = [
  { title: 'فصل الرياضيات', description: 'صيانة أرضية ودهان' },
  { title: 'دورات المياه', description: 'تغيير سيراميك وسباكة' },
  { title: 'المكتبة', description: 'تجديد رفوف وإضاءة' },
  { title: 'الملعب', description: 'صيانة أرضية مطاطية' },
];

export default function PhotoReportPage() {
  const [sections] = useState(mockSections);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقرير مصور</h1>
          <p className="text-gray-500 mt-1">صور قبل/بعد للصيانة</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          تقرير جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{section.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-ayla-400 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">قبل</p>
                <p className="text-xs text-gray-400 mt-1">اضغط لإضافة صورة</p>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">بعد</p>
                <p className="text-xs text-gray-400 mt-1">اضغط لإضافة صورة</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center text-gray-400">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
