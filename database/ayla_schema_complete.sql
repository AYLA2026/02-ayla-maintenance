-- ============================================
-- Ayla Maintenance Database Schema - Complete
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Projects Table (المشاريع)
-- ============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contract_value DECIMAL(15, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
    region VARCHAR(100),
    governorate VARCHAR(100),
    schools_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE projects IS 'جدول المشاريع - كل مشروع صيانة يحتوي على عدة مدارس';
COMMENT ON COLUMN projects.contract_value IS 'قيمة العقد بالريال السعودي';
COMMENT ON COLUMN projects.status IS 'حالة المشروع: active نشط, completed مكتمل, suspended معلق';

-- ============================================
-- 2. Schools Table (المدارس)
-- ============================================
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    governorate VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    school_type VARCHAR(50) CHECK (school_type IN ('government', 'development')),
    stage VARCHAR(50) CHECK (stage IN ('primary', 'intermediate', 'secondary', 'kindergarten', 'special')),
    size VARCHAR(50) CHECK (size IN ('small', 'medium', 'large')),
    students_count INTEGER DEFAULT 0,
    buildings_count INTEGER DEFAULT 0,
    floors_count INTEGER DEFAULT 0,
    total_area DECIMAL(10, 2) DEFAULT 0,
    cl_owner VARCHAR(255),
    om_owner VARCHAR(255),
    hvac_owner VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE schools IS 'جدول المدارس - كل مدرسة تنتمي لمشروع واحد';
COMMENT ON COLUMN schools.cl_owner IS 'مسؤول النظافة (Cleaning Leader)';
COMMENT ON COLUMN schools.om_owner IS 'مسؤول التشغيل والصيانة (O&M)';
COMMENT ON COLUMN schools.hvac_owner IS 'مسؤول التكييف (HVAC)';

-- ============================================
-- 3. Employees Table (الموظفين)
-- ============================================
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    job_title VARCHAR(255),
    department VARCHAR(100),
    id_number VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(255),
    residency_expiry DATE,
    license_expiry DATE,
    passport_expiry DATE,
    salary DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE employees IS 'جدول الموظفين والفنيين';
COMMENT ON COLUMN employees.residency_expiry IS 'تاريخ انتهاء الإقامة - يستخدم للتنبيه';
COMMENT ON COLUMN employees.documents IS 'قائمة الوثائق المرفقة (إقامة، رخصة، شهادات)';

-- ============================================
-- 4. Employee WhatsApp Numbers (أرقام واتساب الموظفين)
-- ============================================
CREATE TABLE employee_whatsapp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    whatsapp_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    label VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE employee_whatsapp IS 'أرقام واتساب الموظفين - يمكن لكل موظف عدة أرقام';

-- ============================================
-- 5. Complaints Table (البلاغات)
-- ============================================
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    category VARCHAR(50),
    sub_category VARCHAR(255),
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'closed')),
    source VARCHAR(50) DEFAULT 'direct' CHECK (source IN ('whatsapp', 'education_portal', 'phone', 'direct', 'ai_detection')),
    reported_by VARCHAR(255),
    assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
    ai_analysis TEXT,
    ai_confidence DECIMAL(5, 2),
    images_before JSONB DEFAULT '[]',
    images_after JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE complaints IS 'جدول بلاغات الصيانة - يستقبل من واتساب والتعليم والمباشر';
COMMENT ON COLUMN complaints.priority IS 'low منخفض, medium متوسط, high عالي, critical حرج';
COMMENT ON COLUMN complaints.source IS 'whatsapp, education_portal, phone, direct, ai_detection';

-- ============================================
-- 6. Vehicles Table (المركبات)
-- ============================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    plate_number VARCHAR(50) NOT NULL,
    type VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    insurance_expiry DATE,
    registration_expiry DATE,
    oil_change_date DATE,
    oil_change_km INTEGER DEFAULT 0,
    current_km INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    assigned_driver UUID REFERENCES employees(id) ON DELETE SET NULL,
    equipment JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE vehicles IS 'جدول المركبات والمعدات الثقيلة';
COMMENT ON COLUMN vehicles.insurance_expiry IS 'تاريخ انتهاء التأمين';
COMMENT ON COLUMN vehicles.registration_expiry IS 'تاريخ انتهاء الاستمارة';

-- ============================================
-- 7. Warehouses Table (المخازن)
-- ============================================
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    manager UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE warehouses IS 'جدول المخازن - كل مشروع له مخازنه';

-- ============================================
-- 8. Inventory Items Table (الأصناف)
-- ============================================
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    unit VARCHAR(50),
    unit_price DECIMAL(10, 2) DEFAULT 0,
    supplier VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE inventory_items IS 'جدول أصناف المخزون';
COMMENT ON COLUMN inventory_items.min_quantity IS 'عند الوصول لهذا الحد يظهر تنبيه';

-- ============================================
-- 9. Maintenance Schedules Table (الجدولة الدورية)
-- ============================================
CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    type VARCHAR(255),
    frequency VARCHAR(50) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    last_date DATE,
    next_date DATE,
    assigned_team JSONB DEFAULT '[]',
    assigned_vehicles JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'overdue')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE maintenance_schedules IS 'جدولة مهام الصيانة الدورية';

-- ============================================
-- 10. Financial Records Table (السجلات المالية)
-- ============================================
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    category VARCHAR(100),
    amount DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    date DATE,
    approved_by VARCHAR(255),
    receipt_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE financial_records IS 'السجلات المالية - إيرادات ومصاريف';

-- ============================================
-- 11. Reports Tables (التقارير)
-- ============================================

CREATE TABLE cleaning_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    date DATE,
    inspector UUID REFERENCES employees(id) ON DELETE SET NULL,
    areas JSONB DEFAULT '[]',
    total_score DECIMAL(4, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pass' CHECK (status IN ('pass', 'fail', 'needs_improvement')),
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE om_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    date DATE,
    inspector UUID REFERENCES employees(id) ON DELETE SET NULL,
    systems JSONB DEFAULT '[]',
    critical_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pass' CHECK (status IN ('pass', 'fail')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hvac_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    date DATE,
    inspector UUID REFERENCES employees(id) ON DELETE SET NULL,
    units JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'pass' CHECK (status IN ('pass', 'fail')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photo_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    date DATE,
    photographer UUID REFERENCES employees(id) ON DELETE SET NULL,
    sections JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 12. WhatsApp Messages Log (سجل رسائل واتساب)
-- ============================================
CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
    from_number VARCHAR(20),
    to_number VARCHAR(20),
    message TEXT,
    direction VARCHAR(10) CHECK (direction IN ('incoming', 'outgoing')),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE whatsapp_messages IS 'سجل جميع رسائل واتساب المرسلة والمستلمة';

-- ============================================
-- 13. App Settings (إعدادات التطبيق)
-- ============================================
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE app_settings IS 'إعدادات النظام العامة';

-- ============================================
-- Seed Data (بيانات تجريبية)
-- ============================================
INSERT INTO projects (id, name, description, contract_value, start_date, end_date, status, region, governorate, schools_count) VALUES
('11111111-1111-1111-1111-111111111111', 'مشروع صيانة مدارس القويعية', 'صيانة دورية لـ 12 مدرسة حكومية في محافظة القويعية', 2500000, '2026-01-01', '2026-12-31', 'active', 'الرياض', 'القويعية', 12),
('22222222-2222-2222-2222-222222222222', 'مشروع صيانة مدارس الدرعية', 'صيانة دورية لـ 8 مدارس في محافظة الدرعية', 1800000, '2026-03-01', '2026-12-31', 'active', 'الرياض', 'الدرعية', 8);

INSERT INTO schools (project_id, name, region, governorate, city, district, school_type, stage, size, students_count, buildings_count, floors_count, total_area, cl_owner, om_owner, hvac_owner, status) VALUES
('11111111-1111-1111-1111-111111111111', 'مدرسة الرياض الابتدائية', 'الرياض', 'القويعية', 'القويعية', 'حي النخيل', 'government', 'primary', 'medium', 450, 3, 2, 3500, 'أحمد محمد', 'خالد عبدالله', 'سعد العتيبي', 'active'),
('11111111-1111-1111-1111-111111111111', 'مدرسة النور المتوسطة', 'الرياض', 'القويعية', 'القويعية', 'حي الورود', 'government', 'intermediate', 'large', 800, 5, 3, 6200, 'محمد علي', 'فهد السالم', 'عبدالرحمن', 'active');

INSERT INTO employees (project_id, name, nationality, job_title, department, id_number, phone, residency_expiry, salary, status) VALUES
('11111111-1111-1111-1111-111111111111', 'أحمد محمد العتيبي', 'سعودي', 'مشرف صيانة', 'O&M', '1087654321', '0501234567', '2027-05-15', 8500, 'active'),
('11111111-1111-1111-1111-111111111111', 'خالد عبدالله السالم', 'مصري', 'فني كهرباء', 'كهرباء', '2456789012', '0559876543', '2026-09-10', 4500, 'active');

INSERT INTO app_settings (key, value) VALUES
('whatsapp_enabled', '"true"'),
('ai_analysis_enabled', '"true"'),
('auto_assign_enabled', '"false"'),
('notification_enabled', '"true"'),
('language', '"ar"'),
('currency', '"SAR"'),
('date_format', '"yyyy-MM-dd"');

-- ============================================
-- Indexes (فهارس للبحث السريع)
-- ============================================
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_governorate ON projects(governorate);
CREATE INDEX idx_schools_project ON schools(project_id);
CREATE INDEX idx_schools_governorate ON schools(governorate);
CREATE INDEX idx_schools_status ON schools(status);
CREATE INDEX idx_complaints_school ON complaints(school_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_source ON complaints(source);
CREATE INDEX idx_complaints_created ON complaints(created_at);
CREATE INDEX idx_employees_project ON employees(project_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_residency ON employees(residency_expiry);
CREATE INDEX idx_vehicles_project ON vehicles(project_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_insurance ON vehicles(insurance_expiry);
CREATE INDEX idx_inventory_warehouse ON inventory_items(warehouse_id);
CREATE INDEX idx_inventory_category ON inventory_items(category);
CREATE INDEX idx_financial_project ON financial_records(project_id);
CREATE INDEX idx_financial_date ON financial_records(date);
CREATE INDEX idx_financial_type ON financial_records(type);
CREATE INDEX idx_schedules_next_date ON maintenance_schedules(next_date);
CREATE INDEX idx_schedules_status ON maintenance_schedules(status);
CREATE INDEX idx_whatsapp_complaint ON whatsapp_messages(complaint_id);
CREATE INDEX idx_whatsapp_from ON whatsapp_messages(from_number);

-- ============================================
-- Update Triggers (تحديث تلقائي للتاريخ)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views (Views للتقارير السريعة)
-- ============================================
CREATE VIEW complaints_view AS
SELECT c.*, s.name as school_name, s.governorate, p.name as project_name
FROM complaints c
LEFT JOIN schools s ON c.school_id = s.id
LEFT JOIN projects p ON c.project_id = p.id;

CREATE VIEW employees_view AS
SELECT e.*, COALESCE(json_agg(json_build_object('number', ew.whatsapp_number, 'is_primary', ew.is_primary, 'label', ew.label)) FILTER (WHERE ew.id IS NOT NULL), '[]') as whatsapp_numbers
FROM employees e
LEFT JOIN employee_whatsapp ew ON e.id = ew.employee_id
GROUP BY e.id;

CREATE VIEW low_stock_view AS
SELECT i.*, w.name as warehouse_name
FROM inventory_items i
JOIN warehouses w ON i.warehouse_id = w.id
WHERE i.quantity <= i.min_quantity;

CREATE VIEW vehicles_expiring_view AS
SELECT v.*, e.name as driver_name
FROM vehicles v
LEFT JOIN employees e ON v.assigned_driver = e.id
WHERE v.insurance_expiry <= CURRENT_DATE + INTERVAL '60 days'
   OR v.registration_expiry <= CURRENT_DATE + INTERVAL '60 days';
