'use client';

import { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  MapPin,
  CheckCircle,
  PauseCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'مشروع صيانة مدارس القويعية',
    description: 'صيانة دورية لـ 12 مدرسة حكومية في محافظة القويعية',
    contract_value: 2500000,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    region: 'الرياض',
    governorate: 'القويعية',
    schools_count: 12,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: '2',
    name: 'مشروع صيانة مدارس الدرعية',
    description: 'صيانة دورية لـ 8 مدارس في محافظة الدرعية',
    contract_value: 1800000,
    start_date: '2026-03-01',
    end_date: '2026-12-31',
    status: 'active',
    region: 'الرياض',
    governorate: 'الدرعية',
    schools_count: 8,
    created_at: '2026-03-01',
    updated_at: '2026-03-01',
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
    completed: { label: 'مكتمل', className: 'bg-blue-100 text-blue-800' },
    suspended: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' },
  };
  const { label, className } = config[status] || config.active;
  return (
    <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium', className)}>
      {label}
    </span>
  );
}

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.governorate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = projects.reduce((sum, p) => sum + p.contract_value, 0);
  const activeCount = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المشاريع</h1>
          <p className="text-gray-500 mt-1">إدارة مشاريع الصيانة</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700 transition-colors">
          <Plus className="w-5 h-5" />
          مشروع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المشاريع</p>
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="bg-ayla-100 p-3 rounded-lg">
              <FolderKanban className="w-6 h-6 text-ayla-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المشاريع النشطة</p>
              <p className="text-3xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي العقود</p>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat('ar-SA').format(totalValue)} ر.س
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث باسم المشروع أو المحافظة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="completed">مكتمل</option>
            <option value="suspended">معلق</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-ayla-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-ayla-600" />
                </div>
                <StatusBadge status={project.status} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{project.region} - {project.governorate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{project.schools_count} مدرسة</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{project.start_date} → {project.end_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>{new Intl.NumberFormat('ar-SA').format(project.contract_value)} ر.س</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-ayla-600 bg-ayla-50 rounded-lg hover:bg-ayla-100 transition-colors">
                  <Eye className="w-4 h-4" />
                  عرض
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
