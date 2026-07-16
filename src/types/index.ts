export interface School {
  id: string;
  project_id?: string;
  name: string;
  region: string;
  governorate: string;
  city: string;
  district: string;
  school_type: 'government' | 'development';
  stage: 'primary' | 'intermediate' | 'secondary' | 'kindergarten' | 'special';
  size: 'small' | 'medium' | 'large';
  students_count: number;
  buildings_count: number;
  floors_count: number;
  total_area: number;
  cl_owner?: string;
  om_owner?: string;
  hvac_owner?: string;
  status: 'active' | 'inactive' | 'under_maintenance';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  contract_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'suspended';
  region: string;
  governorate: string;
  schools_count: number;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  project_id?: string;
  school_id: string;
  school_name: string;
  category: ComplaintCategory;
  sub_category: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  source: 'whatsapp' | 'education_portal' | 'phone' | 'direct' | 'ai_detection';
  reported_by: string;
  assigned_to?: string;
  technician_name?: string;
  images_before?: string[];
  images_after?: string[];
  ai_analysis?: string;
  ai_confidence?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type ComplaintCategory =
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'cleaning'
  | 'firefighting'
  | 'alarm'
  | 'carpentry'
  | 'painting'
  | 'masonry'
  | 'flooring'
  | 'roofing'
  | 'glass'
  | 'metalwork'
  | 'landscaping'
  | 'pest_control'
  | 'waste_management'
  | 'security'
  | 'it_equipment'
  | 'furniture'
  | 'other';

export interface Employee {
  id: string;
  project_id?: string;
  name: string;
  nationality: string;
  job_title: string;
  department: string;
  id_number: string;
  phone: string;
  email?: string;
  whatsapp_numbers?: { number: string; is_primary: boolean; label: string }[];
  residency_expiry: string;
  license_expiry?: string;
  passport_expiry?: string;
  salary: number;
  status: 'active' | 'on_leave' | 'terminated';
  documents: string[];
  created_at: string;
}

export interface Vehicle {
  id: string;
  project_id?: string;
  plate_number: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  insurance_expiry: string;
  registration_expiry: string;
  oil_change_date: string;
  oil_change_km: number;
  current_km: number;
  status: 'active' | 'maintenance' | 'inactive';
  assigned_driver?: string;
  equipment: string[];
  created_at: string;
}

export interface Warehouse {
  id: string;
  project_id?: string;
  name: string;
  location: string;
  manager: string;
  items: InventoryItem[];
  created_at: string;
}

export interface InventoryItem {
  id: string;
  warehouse_id: string;
  name: string;
  category: string;
  quantity: number;
  min_quantity: number;
  unit: string;
  unit_price: number;
  supplier?: string;
  created_at: string;
}

export interface FinancialRecord {
  id: string;
  project_id?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  approved_by?: string;
  receipt_url?: string;
  created_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  project_id?: string;
  school_id: string;
  school_name: string;
  type: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  last_date: string;
  next_date: string;
  assigned_team: string[];
  assigned_vehicles: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  notes?: string;
  created_at: string;
}

export interface CleaningReport {
  id: string;
  project_id?: string;
  school_id: string;
  school_name: string;
  date: string;
  inspector: string;
  areas: {
    area: string;
    score: number;
    notes: string;
  }[];
  total_score: number;
  status: 'pass' | 'fail' | 'needs_improvement';
  images: string[];
  created_at: string;
}

export interface OMReport {
  id: string;
  project_id?: string;
  school_id: string;
  school_name: string;
  date: string;
  inspector: string;
  systems: {
    system: string;
    status: 'operational' | 'needs_repair' | 'critical';
    notes: string;
  }[];
  critical_count: number;
  status: 'pass' | 'fail';
  created_at: string;
}

export interface HVACReport {
  id: string;
  project_id?: string;
  school_id: string;
  school_name: string;
  date: string;
  inspector: string;
  units: {
    unit_id: string;
    location: string;
    pressure: number;
    filter_status: 'clean' | 'dirty' | 'needs_replacement';
    temperature: number;
    notes: string;
  }[];
  status: 'pass' | 'fail';
  created_at: string;
}

export interface PhotoReport {
  id: string;
  project_id?: string;
  school_id: string;
  school_name: string;
  date: string;
  photographer: string;
  sections: {
    title: string;
    description: string;
    before_images: string[];
    after_images: string[];
  }[];
  status: 'draft' | 'completed';
  created_at: string;
}

export interface AppSettings {
  whatsapp_enabled: boolean;
  ai_analysis_enabled: boolean;
  auto_assign_enabled: boolean;
  notification_enabled: boolean;
  language: 'ar' | 'en';
  currency: 'SAR' | 'USD';
  date_format: string;
}
