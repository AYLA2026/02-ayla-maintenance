'use client';

import {
  School,
  MessageSquare,
  Users,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const stats = [
  { title: 'المدارس', value: 24, icon: School, color: 'bg-blue-500' },
  { title: 'البلاغات النشطة', value: 12, icon: MessageSquare, color: 'bg-yellow-500' },
  { title: 'الفريق', value: 45, icon: Users, color: 'bg-green-500' },
  { title: 'المركبات', value: 8, icon: Truck, color: 'bg-purple-500' },
];

const recentComplaints = [
  { id: '1', school: 'مدرسة الرياض الابتدائية', category: 'كهرباء', status: 'pending', time: 'منذ ساعة' },
  { id: '2', school: 'مدرسة النور المتوسطة', category: 'سباكة', status: 'in_progress', time: 'منذ 3 ساعات' },
  { id: '3', school: 'مدرسة الفجر الثانوية', category: 'تكييف', status: 'completed', time: 'منذ يوم' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };
  const labels: Record<string, string> = {
    pending: 'معلق',
    in_progress: 'قيد التنفيذ',
    completed: 'مكتمل',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100'}`}>
      {labels[status] || status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الرئيسية</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على نظام الصيانة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">آخر البلاغات</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentComplaints.map((complaint) => (
            <div key={complaint.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-ayla-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-ayla-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{complaint.school}</p>
                  <p className="text-sm text-gray-500">{complaint.category} · {complaint.time}</p>
                </div>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-ayla-500 to-ayla-600 rounded-xl p-6 text-white">
          <AlertTriangle className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">بلاغ جديد</h3>
          <p className="text-ayla-100 text-sm mt-1">تسجيل بلاغ صيانة جديد</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <CheckCircle className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">تقرير يومي</h3>
          <p className="text-green-100 text-sm mt-1">إنشاء تقرير النظافة اليومي</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">التحليل المالي</h3>
          <p className="text-purple-100 text-sm mt-1">عرض التقارير المالية</p>
        </div>
      </div>
    </div>
  );
}
