'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  Users,
  Truck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MaintenanceSchedule } from '@/types';

const mockSchedules: MaintenanceSchedule[] = [
  {
    id: '1',
    project_id: '1',
    school_id: '1',
    school_name: 'مدرسة الرياض الابتدائية',
    type: 'صيانة دورية كهرباء',
    frequency: 'monthly',
    last_date: '2026-06-15',
    next_date: '2026-07-15',
    assigned_team: ['فني كهرباء 1', 'فني كهرباء 2'],
    assigned_vehicles: ['سيارة 1'],
    status: 'scheduled',
    created_at: '2026-01-01',
  },
  {
    id: '2',
    project_id: '1',
    school_id: '2',
    school_name: 'مدرسة النور المتوسطة',
    type: 'تنظيف شامل',
    frequency: 'weekly',
    last_date: '2026-07-08',
    next_date: '2026-07-15',
    assigned_team: ['عامل نظافة 1', 'عامل نظافة 2'],
    assigned_vehicles: ['سيارة 2'],
    status: 'in_progress',
    created_at: '2026-01-01',
  },
];

const frequencyLabels: Record<string, string> = {
  daily: 'يومي', weekly: 'أسبوعي', monthly: 'شهري', quarterly: 'ربع سنوي', yearly: 'سنوي',
};

export default function SchedulePage() {
  const [schedules] = useState<MaintenanceSchedule[]>(mockSchedules);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التخطيط الدوري</h1>
          <p className="text-gray-500 mt-1">جدولة مهام الصيانة الدورية</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          مهمة جديدة
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
          </h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{schedule.type}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {frequencyLabels[schedule.frequency]}
                  </span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    schedule.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                    schedule.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    schedule.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  )}>
                    {schedule.status === 'scheduled' ? 'مجدول' :
                     schedule.status === 'in_progress' ? 'قيد التنفيذ' :
                     schedule.status === 'completed' ? 'مكتمل' : 'متأخر'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{schedule.school_name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    التالي: {schedule.next_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {schedule.assigned_team.length} فني
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    {schedule.assigned_vehicles.length} مركبة
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 text-sm text-ayla-600 bg-ayla-50 rounded-lg hover:bg-ayla-100">
                  تفاصيل
                </button>
                <button className="px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                  إتمام
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
