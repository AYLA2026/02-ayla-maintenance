'use client';

import { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Calendar,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/types';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    project_id: '1',
    plate_number: 'أ ب ج 1234',
    type: 'بيك أب',
    brand: 'تويوتا',
    model: 'هايلوكس',
    year: 2023,
    insurance_expiry: '2026-12-15',
    registration_expiry: '2026-11-20',
    oil_change_date: '2026-06-01',
    oil_change_km: 5000,
    current_km: 12500,
    status: 'active',
    assigned_driver: 'أحمد العتيبي',
    equipment: ['أدوات كهرباء', 'سلالم'],
    created_at: '2025-01-01',
  },
  {
    id: '2',
    project_id: '1',
    plate_number: 'د هـ و 5678',
    type: 'فان',
    brand: 'مرسيدس',
    model: 'سبرينتر',
    year: 2022,
    insurance_expiry: '2026-10-10',
    registration_expiry: '2026-09-15',
    oil_change_date: '2026-05-15',
    oil_change_km: 8000,
    current_km: 45000,
    status: 'maintenance',
    assigned_driver: 'خالد السالم',
    equipment: ['أدوات سباكة', 'مواد نظافة'],
    created_at: '2025-01-01',
  },
];

export default function VehiclesPage() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter((v) =>
    v.plate_number.includes(searchTerm) || v.brand.includes(searchTerm)
  );

  const today = new Date();
  const expiringSoon = vehicles.filter((v) => {
    const insurance = new Date(v.insurance_expiry);
    const reg = new Date(v.registration_expiry);
    const diff1 = (insurance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    const diff2 = (reg.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff1 <= 60 || diff2 <= 60;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المركبات</h1>
          <p className="text-gray-500 mt-1">إدارة المركبات والمعدات</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-ayla-600 text-white px-4 py-2 rounded-lg hover:bg-ayla-700">
          <Plus className="w-4 h-4" />
          مركبة جديدة
        </button>
      </div>

      {expiringSoon.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">تنبيه: {expiringSoon.length} مركبة تنتهي وثائقها قريباً</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث برقم اللوحة أو الماركة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ayla-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-ayla-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-ayla-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.plate_number}</h3>
                  <p className="text-sm text-gray-500">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                </div>
              </div>
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              )}>
                {vehicle.status === 'active' ? 'نشط' :
                 vehicle.status === 'maintenance' ? 'صيانة' : 'غير نشط'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>تأمين: {vehicle.insurance_expiry}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>استمارة: {vehicle.registration_expiry}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Gauge className="w-4 h-4 text-gray-400" />
                <span>{vehicle.current_km.toLocaleString('ar-SA')} كم</span>
              </div>
            </div>

            {vehicle.assigned_driver && (
              <p className="text-sm text-gray-500">السائق: {vehicle.assigned_driver}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
