
-- ============================================
-- Users Table (للمصادقة)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'supervisor', 'user')),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء مستخدم admin افتراضي
INSERT INTO users (email, password, name, role) VALUES
('admin@ayla.com', 'admin123', 'مدير النظام', 'admin');
