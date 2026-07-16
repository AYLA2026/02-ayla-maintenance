'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import type { FinancialRecord } from '@/types';

const mockRecords: FinancialRecord[] = [
  { id: '1', project_id: '1', type: 'income', category: 'عقد صيانة', amount: 2500000, description: 'دفعة أولى عقد القويعية', date: '2026-01-15', approved_by: 'المدير المالي', created_at: '2026-01-15' },
  { id: '2', project_id: '1', type: 'expense', category: 'رواتب', amount: 450000, description: 'رواتب يناير', date: '2026-01-31', approved_by: 'المدير المالي', created_at: '2026-01-31' },
  { id: '3', project_id: '1', type: 'expense', category: 'مواد', amount: 120000, description: 'شراء مواد كهرباء', date: '2026-02-10', approved_by: 'مشرف المشتريات', created_at: '2026-02-10' },
  { id: '4', project_id: '1', type: 'expense', category: 'وقود', amount: 35000, description: 'وقود مركبات فبراير', date: '2026-02-15', approved_by: 'مدير التشغيل', created_at: '2026-02-15' },
  { id: '5', project_id: '1', type: 'expense', category: 'سكن', amount: 80000, description: 'إيجار سكن العمال', date: '2026-02-20', approved_by: 'المدير المالي', created_at: '2026-02-20' },
  { id: '6', project_id: '1', type: 'income', category: 'عقد صيانة', amount: 1800000, description: 'عقد الدرعية', date: '2026-03-01', approved_by: 'المدير المالي', created_at: '2026-03-01' },
];

const expenseData = [
  { name: 'رواتب', value: 450000, color: '#0ea5e9' },
  { name: 'مواد', value: 120000, color: '#22c55e' },
  { name: 'وقود', value: 35000, color: '#f59e0b' },
  { name: 'سكن', value: 80000, color: '#ef4444' },
];

const monthlyData = [
  { month: 'يناير', income: 2500000, expense: 450000 },
  { month: 'فبراير', income: 0, expense: 235000 },
  { month: 'مارس', income: 1800000, expense: 150000 },
];

export default function FinancePage() {
  const [records] = useState<FinancialRecord[]>(mockRecords);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const totalIncome = records.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpense = records.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const filteredRecords = filter === 'all' ? records : records.filter((r) => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التحليل المالي</h1>
          <p className="text-gray-500 mt-1">إدارة الإيرادات والمصاريف</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Download className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الإيرادات</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('ar-SA').format(totalIncome)} ر.س
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المصاريف</p>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('ar-SA').format(totalExpense)} ر.س
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">صافي الربح</p>
              <p className={cn('text-2xl font-bold', netProfit >= 0 ? 'text-green-600' : 'text-red-600')}>
                {new Intl.NumberFormat('ar-SA').format(netProfit)} ر.س
              </p>
            </div>
            <div className={cn('p-3 rounded-lg', netProfit >= 0 ? 'bg-green-100' : 'bg-red-100')}>
              <DollarSign className={cn('w-6 h-6', netProfit >= 0 ? 'text-green-600' : 'text-red-600')} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات vs المصاريف</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => new Intl.NumberFormat('ar-SA').format(value) + ' ر.س'} />
              <Bar dataKey="income" fill="#22c55e" name="إيرادات" />
              <Bar dataKey="expense" fill="#ef4444" name="مصاريف" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع المصاريف</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie data={expenseData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => new Intl.NumberFormat('ar-SA').format(value) + ' ر.س'} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <button onClick={() => setFilter('all')} className={cn('px-4 py-2 rounded-lg text-sm', filter === 'all' ? 'bg-ayla-600 text-white' : 'bg-gray-100 text-gray-700')}>
            الكل
          </button>
          <button onClick={() => setFilter('income')} className={cn('px-4 py-2 rounded-lg text-sm', filter === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700')}>
            إيرادات
          </button>
          <button onClick={() => setFilter('expense')} className={cn('px-4 py-2 rounded-lg text-sm', filter === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700')}>
            مصاريف
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المبلغ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الوصف</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المعتمد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                      {record.type === 'income' ? 'إيراد' : 'مصروف'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.category}</td>
                  <td className={cn(
                    'px-6 py-4 text-sm font-bold',
                    record.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {new Intl.NumberFormat('ar-SA').format(record.amount)} ر.س
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.approved_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
