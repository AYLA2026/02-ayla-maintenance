'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Phone,
  Globe,
  Bot,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Complaint } from '@/types';

const mockComplaints: Complaint[] = [
  {
    id: '1',
    project_id: '1',
    school_id: '1',
    school_name: 'مدرسة الرياض الابتدائية',
    category: 'electrical',
    sub_category: 'إنارة الفصول',
    description: 'عدم عمل الإنارة في الفصول الدراسية 101 و 102',
    priority: 'high',
    status: 'pending',
    source: 'whatsapp',
    reported_by: 'أحمد المشرف',
    created_at: '2026-07-15T08:00:00Z',
    updated_at: '2026-07-15T08:00:00Z',
  },
  {
    id: '2',
    project_id: '1',
    school_id: '2',
    school_name: 'مدرسة النور المتوسطة',
    category: 'plumbing',
    sub_category: 'تسرب مياه',
    description: 'تسرب مياه في دورات المياه الطابق الأول',
    priority: 'critical',
    status: 'in_progress',
    source: 'education_portal',
    reported_by: 'نظام التعليم',
    assigned_to: 'فني سباكة 1',
    technician_name: 'خالد العتيبي',
    created_at: '2026-07-14T10:00:00Z',
    updated_at: '2026-07-15T09:00:00Z',
  },
];

const categoryLabels: Record<string, string> = {
  electrical: 'كهرباء', plumbing: 'سباكة', hvac: 'تكييف', cleaning: 'نظافة',
  firefighting: 'إطفاء', alarm: 'إنذار', carpentry: 'نجارة', painting: 'دهان',
  masonry: 'بناء', flooring: 'أرضيات', roofing: 'سقف', glass: 'زجاج',
  metalwork: 'حدادة', landscaping: 'زراعة', pest_control: 'مكافحة آفات',
  waste_management: 'نفايات', security: 'أمن', it_equipment: 'تقنية',
  furniture: 'أثاث', other: 'أخرى',
};

function SourceBadge({ source }: { source: string }) {
  const config: Record<string, { label: string; className: string }> = {
    whatsapp: { label: 'واتساب', className: 'bg-green-100 text-green-800' },
    education_portal: { label: 'التعليم', className: 'bg-blue-100 text-blue-800' },
    ai_detection: { label: 'AI', className: 'bg-purple-100 text-purple-800' },
    direct: { label: 'مباشر', className: 'bg-gray-100 text-gray-800' },
    phone: { label: 'هاتف', className: 'bg-yellow-100 text-yellow-800' },
  };
  const { label, className } = config[source] || config.direct;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', className)}>
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };
  const labels: Record<string, string> = {
    critical: 'حرج', high: 'عالي', medium: 'متوسط', low: 'منخفض',
  };
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium border', styles[priority])}>
      {labels[priority]}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  const labels: Record<string, string> = {
    pending: 'معلق', assigned: 'معين', in_progress: 'قيد التنفيذ',
    completed: 'مكتمل', closed: 'مغلق',
  };
  return (
    <span className={cn('px-3 py-1 rounded-full text-sm font-medium', styles[status])}>
      {labels[status]}
    </span>
  );
}

export default function ComplaintsPage() {
  const [complaints] = useState<Complaint[]>(mockComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.school_name.includes(searchTerm) || c.description.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">البلاغات</h1>
          <p className="text-gray-500 mt-1">إدارة بلاغات الصيانة</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          بلاغ جديد
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'الكل', value: complaints.length },
          { label: 'معلقة', value: complaints.filter((c) => c.status === 'pending').length },
          { label: 'قيد التنفيذ', value: complaints.filter((c) => c.status === 'in_progress').length },
          { label: 'مكتملة', value: complaints.filter((c) => c.status === 'completed').length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
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
            <option value="pending">معلقة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">مكتملة</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          >
            <option value="all">جميع الأنواع</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{complaint.school_name}</h3>
                  <PriorityBadge priority={complaint.priority} />
                  <SourceBadge source={complaint.source} />
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {categoryLabels[complaint.category]} - {complaint.sub_category}
                </p>
                <p className="text-gray-700 mb-3">{complaint.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {complaint.reported_by}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(complaint.created_at).toLocaleDateString('ar-SA')}
                  </span>
                  {complaint.technician_name && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      {complaint.technician_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={complaint.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
