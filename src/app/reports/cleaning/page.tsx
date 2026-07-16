'use client';

import { useState } from 'react';
import { Sparkles, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const areas = [
  'الفصول الدراسية', 'الممرات', 'دورات المياه', 'المكتبة',
  'المختبرات', 'المطبخ', 'الملعب', 'المواقف', 'الحديقة', 'المكاتب الإدارية',
];

export default function CleaningReportPage() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const avgScore = Object.keys(scores).length > 0 ? (totalScore / Object.keys(scores).length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقرير النظافة</h1>
          <p className="text-gray-500 mt-1">تقييم النظافة لـ 10 مناطق</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          تقرير جديد
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">التقييم العام</p>
            <p className="text-4xl font-bold text-gray-900">{avgScore}<span className="text-lg text-gray-400">/5</span></p>
          </div>
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold',
            parseFloat(avgScore) >= 4 ? 'bg-green-100 text-green-600' :
            parseFloat(avgScore) >= 3 ? 'bg-yellow-100 text-yellow-600' :
            'bg-red-100 text-red-600'
          )}>
            {parseFloat(avgScore) >= 4 ? 'ممتاز' :
             parseFloat(avgScore) >= 3 ? 'جيد' : 'يحتاج تحسين'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">تقييم المناطق</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {areas.map((area) => (
            <div key={area} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{area}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setScores({ ...scores, [area]: star })}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                        (scores[area] || 0) >= star ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      )}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="ملاحظات..."
                value={notes[area] || ''}
                onChange={(e) => setNotes({ ...notes, [area]: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
