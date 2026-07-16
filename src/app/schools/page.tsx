'use client';

import { useState } from 'react';
import {
  School,
  Search,
  Download,
  Upload,
  Plus,
  MapPin,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { School as SchoolType } from '@/types';

const mockSchools: SchoolType[] = [
  {
    id: '1',
    project_id: '1',
    name: 'مدرسة الرياض الابتدائية',
    region: 'الرياض',
    governorate: 'القويعية',
    city: 'القويعية',
    district: 'حي النخيل',
    school_type: 'government',
    stage: 'primary',
    size: 'medium',
    students_count: 450,
    buildings_count: 3,
    floors_count: 2,
    total_area: 3500,
    cl_owner: 'أحمد محمد',
    om_owner: 'خالد عبدالله',
    hvac_owner: 'سعد العتيبي',
    status: 'active',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: '2',
    project_id: '1',
    name: 'مدرسة النور المتوسطة',
    region: 'الرياض',
    governorate: 'القويعية',
    city: 'القويعية',
    district: 'حي الورود',
    school_type: 'government',
    stage: 'intermediate',
    size: 'large',
    students_count: 800,
    buildings_count: 5,
    floors_count: 3,
    total_area: 6200,
    cl_owner: 'محمد علي',
    om_owner: 'فهد السالم',
    hvac_owner: 'عبدالرحمن',
    status: 'active',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
];

export default function SchoolsPage() {
  const [schools] = useState<SchoolType[]>(mockSchools);
  const [searchTerm, setSearchTerm] = useState('');
  const [governorateFilter, setGovernorateFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGovernorate = governorateFilter === 'all' || school.governorate === governorateFilter;
    const matchesStage = stageFilter === 'all' || school.stage === stageFilter;
    return matchesSearch && matchesGovernorate && matchesStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المدارس</h1>
          <p className="text-gray-500 mt-1">إدارة بيانات المدارس</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            استيراد Excel
          </button>
          <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
            <Plus className="w-4 h-4" />
            مدرسة جديدة
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث باسم المدرسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
            />
          </div>
          <select
            value={governorateFilter}
            onChange={(e) => setGovernorateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          >
            <option value="all">جميع المحافظات</option>
            <option value="القويعية">القويعية</option>
            <option value="الدرعية">الدرعية</option>
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          >
            <option value="all">جميع المراحل</option>
            <option value="kindergarten">رياض أطفال</option>
            <option value="primary">ابتدائي</option>
            <option value="intermediate">متوسط</option>
            <option value="secondary">ثانوي</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المدرسة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الموقع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المرحلة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الطلاب</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الملاك</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ayla-100 rounded-lg flex items-center justify-center">
                        <School className="w-5 h-5 text-ayla-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{school.name}</p>
                        <p className="text-sm text-gray-500">{school.school_type === 'government' ? 'حكومي' : 'تطوير'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {school.governorate} - {school.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {school.stage === 'primary' ? 'ابتدائي' :
                       school.stage === 'intermediate' ? 'متوسط' :
                       school.stage === 'secondary' ? 'ثانوي' : 'رياض'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      {school.students_count}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">CL:</span> {school.cl_owner}</p>
                      <p><span className="text-gray-500">O&M:</span> {school.om_owner}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      school.status === 'active' ? 'bg-green-100 text-green-800' :
                      school.status === 'under_maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {school.status === 'active' ? 'نشطة' :
                       school.status === 'under_maintenance' ? 'تحت الصيانة' : 'غير نشطة'}
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
