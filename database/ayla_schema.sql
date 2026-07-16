-- ============================================
-- Ayla Maintenance Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Projects Table
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

-- ============================================
-- 2. Schools Table
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

-- ============================================
-- 3. Employees Table
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

-- ============================================
-- 4. Employee WhatsApp Numbers
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

-- ============================================
-- 5. Complaints Table
-- ============================================
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    category VARCHAR(50),
    sub_category VARCHAR(255),
    description TEXT,
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

-- ============================================
-- 6. Vehicles Table
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

-- ============================================
-- 7. Warehouses Table
-- ============================================
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    manager UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. Inventory Items Table
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

-- ============================================
-- 9. Maintenance Schedules Table
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

-- ============================================
-- 10. Financial Records Table
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

-- ============================================
-- 11. Reports Tables
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
-- 12. WhatsApp Messages Log
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

-- ============================================
-- 13. App Settings
-- ============================================
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Seed Data
-- ============================================
INSERT INTO projects (id, name, description, contract_value, start_date, end_date, status, region, governorate, schools_count) VALUES
('11111111-1111-1111-1111-111111111111', 'مشروع صيانة مدارس القويعية', 'صيانة دورية لـ 12 مدرسة حكومية', 2500000, '2026-01-01', '2026-12-31', 'active', 'الرياض', 'القويعية', 12),
('22222222-2222-2222-2222-222222222222', 'مشروع صيانة مدارس الدرعية', 'صيانة دورية لـ 8 مدارس', 1800000, '2026-03-01', '2026-12-31', 'active', 'الرياض', 'الدرعية', 8);

INSERT INTO app_settings (key, value) VALUES
('whatsapp_enabled', 'true'),
('ai_analysis_enabled', 'true'),
('auto_assign_enabled', 'false'),
('notification_enabled', 'true'),
('language', '"ar"'),
('currency', '"SAR"');

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_schools_project ON schools(project_id);
CREATE INDEX idx_complaints_school ON complaints(school_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_employees_project ON employees(project_id);
CREATE INDEX idx_financial_project ON financial_records(project_id);
CREATE INDEX idx_schedules_next_date ON maintenance_schedules(next_date);

-- ============================================
-- Update Trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
