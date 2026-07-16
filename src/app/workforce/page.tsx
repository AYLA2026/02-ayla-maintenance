'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';

const mockEmployees: Employee[] = [
  {
    id: '1',
    project_id: '1',
    name: 'أحمد محمد العتيبي',
    nationality: 'سعودي',
    job_title: 'مشرف صيانة',
    department: 'O&M',
    id_number: '1087654321',
    phone: '0501234567',
    whatsapp_numbers: [{ number: '+966501234567', is_primary: true, label: 'رسمي' }],
    residency_expiry: '2027-05-15',
    license_expiry: '2026-12-20',
    salary: 8500,
    status: 'active',
    documents: ['إقامة', 'رخصة قيادة'],
    created_at: '2025-01-01',
  },
  {
    id: '2',
    project_id: '1',
    name: 'خالد عبدالله السالم',
    nationality: 'مصري',
    job_title: 'فني كهرباء',
    department: 'كهرباء',
    id_number: '2456789012',
    phone: '0559876543',
    whatsapp_numbers: [{ number: '+966559876543', is_primary: true, label: 'رسمي' }],
    residency_expiry: '2026-09-10',
    salary: 4500,
    status: 'active',
    documents: ['إقامة', 'شهادة مهنية'],
    created_at: '2025-03-01',
  },
];

export default function WorkforcePage() {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter((e) =>
    e.name.includes(searchTerm) || e.job_title.includes(searchTerm)
  );

  const today = new Date();
  const expiringSoon = employees.filter((e) => {
    const expiry = new Date(e.residency_expiry);
    const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 90 && diff > 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">القوى العاملة</h1>
          <p className="text-gray-500 mt-1">إدارة فريق العمل</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          موظف جديد
        </button>
      </div>

      {expiringSoon.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">تنبيه: {expiringSoon.length} إقامة تنتهي خلال 90 يوم</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث باسم الموظف أو المسمى الوظيفي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الموظف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الوظيفة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الجوال</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإقامة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ayla-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-ayla-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.nationality}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{employee.job_title}</p>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {employee.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className={cn(
                        new Date(employee.residency_expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                          ? 'text-red-600 font-medium'
                          : 'text-gray-600'
                      )}>
                        {employee.residency_expiry}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      employee.status === 'active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {employee.status === 'active' ? 'نشط' :
                       employee.status === 'on_leave' ? 'إجازة' : 'منتهي'}
                    </span>
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
