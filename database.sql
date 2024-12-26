-- Create database
CREATE DATABASE IF NOT EXISTS subteacher_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE subteacher_db;

-- Users table (for both teachers and school admins)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL ,
    user_type INT NOT NULL COMMENT '1=super_admin, 2=teacher, 3=school_admin',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    city_id INT NOT NULL,
    profile_pic VARCHAR(255) NULL,
    price_per_day DECIMAL(10, 2) NULL,
    availability_status INT DEFAULT 1 COMMENT '1=immediate, 2=next_week, 3=unavailable',
    status_id INT DEFAULT 1 COMMENT '1=active, 2=suspended',
    bio TEXT NULL,
    teaching_style TEXT NULL,
    background_check_status INT DEFAULT 1 COMMENT '1=pending, 2=verified, 3=failed',
    background_check_date TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_user_type (user_type),
    INDEX idx_users_last_login_at (last_login_at),
    INDEX idx_users_status_id (status_id),
    INDEX idx_users_school_id (school_id),
    INDEX idx_users_price_per_day (price_per_day),
    INDEX idx_users_city_id (city_id),
    INDEX idx_users_is_active (is_active),
    INDEX idx_users_email_verified_at (email_verified_at),
    INDEX idx_users_phone_number (phone_number),
    INDEX idx_users_created_at (created_at),
    INDEX idx_users_updated_at (updated_at)
);

-- Schools table
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_name_en VARCHAR(255) NOT NULL,
    school_name_ar VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NULL,
    type_id INT NOT NULL COMMENT '1=private, 2=public',
    curriculum_id INT NOT NULL COMMENT '1=British Curriculum, 2=American Curriculum, 3=International Baccalaureate (IB), 4=Cambridge Curriculum 5=Other',
    city_id INT NOT NULL,
    school_logo VARCHAR(255) NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_verified (verified),
    INDEX idx_created_at (created_at),
    INDEX idx_city_id (city_id)
);

-- Cities lookup table
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subjects lookup table
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teacher subjects (many-to-many relationship)
CREATE TABLE teacher_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_subject_id (subject_id),
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- Certifications lookup table
CREATE TABLE certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teacher certifications (many-to-many relationship)
CREATE TABLE teacher_certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_user_id BIGINT UNSIGNED NOT NULL,
    certification_id INT NOT NULL,
    document_url VARCHAR(255) NULL,
    expiry_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_certification_id (certification_id),
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- Education history
CREATE TABLE education_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_user_id BIGINT UNSIGNED NOT NULL,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    major VARCHAR(255) NOT NULL,
    graduation_year YEAR NOT NULL,
    document_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- Teaching experience
CREATE TABLE teaching_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_user_id BIGINT UNSIGNED NOT NULL,
    position VARCHAR(255) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    document_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- Teacher availability schedule
CREATE TABLE teacher_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_user_id BIGINT UNSIGNED NOT NULL,
    day_of_week TINYINT NOT NULL, -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- Teacher preferences
CREATE TABLE teacher_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_user_id BIGINT UNSIGNED NOT NULL,
    preference_type ENUM('grade_level', 'job_duration', 'teaching_environment') NOT NULL,
    preference_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- jobs/Jobs
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    subject_id INT NOT NULL,
    teacher_user_id BIGINT UNSIGNED NULL, -- NULL if not assigned yet
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NULL,
    grade_level VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    status INT DEFAULT 1 COMMENT '1=open, 2=assigned, 3=completed, 4=cancelled',
    urgency_level INT DEFAULT 1 COMMENT '1=normal, 2=high, 3=urgent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_school_id (school_id),
    INDEX idx_subject_id (subject_id),
    INDEX idx_teacher_user_id (teacher_user_id)
);

-- job applications
CREATE TABLE teachers_bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_admin_user_id INT NOT NULL,
    teacher_user_id INT NOT NULL,
    school_id INT NOT NULL,
    status INT DEFAULT 1 COMMENT '1=pending, 2=accepted, 3=rejected',
    teacher_accepted_at TIMESTAMP NULL,
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_school_admin_user_id (school_admin_user_id),
    INDEX idx_teacher_user_id (teacher_user_id),
    INDEX idx_school_id (school_id),
    INDEX idx_status (status),
    INDEX idx_teacher_accepted_at (teacher_accepted_at)
);

-- Reviews
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id INT NULL,
    school_id BIGINT UNSIGNED NOT NULL,
    teacher_user_id BIGINT UNSIGNED NOT NULL,
    evaluator_user_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_school_id (school_id),
    INDEX idx_teacher_user_id (teacher_user_id),
    INDEX idx_evaluator_user_id (evaluator_user_id)
);

-- Notifications
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

CREATE TABLE teaching_styles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    style_name_en VARCHAR(50) NOT NULL,
    style_name_ar VARCHAR(50) NOT NULL
);

-- Audit Log Table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(50),
    table_name VARCHAR(100),
    record_id INT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_created_at (created_at)
);

INSERT INTO teaching_styles (style_name_en, style_name_ar) VALUES
('Lecture-based', 'قائم على المحاضرات'),
('Interactive', 'تفاعلي'),
('Hands-on', 'عملي'),
('Visual', 'بصري'),
('Auditory', 'سمعي'),
('Experimental', 'تجريبي'),
('Collaborative', 'تعاوني'),
('Problem-based', 'قائم على حل المشكلات'),
('Project-based', 'قائم على المشاريع'),
('Inquiry-based', 'قائم على الاستفسارات'),
('Flipped Classroom', 'الفصل المقلوب'),
('Socratic Method', 'الأسلوب السقراطي');

INSERT INTO subjects (name_en, name_ar) VALUES
('Mathematics', 'الرياضيات'),
('Science', 'العلوم'),
('English', 'اللغة الإنجليزية'),
('History', 'التاريخ'),
('Biology', 'الأحياء'),
('Chemistry', 'الكيمياء'),
('Physics', 'الفيزياء'),
('Arabic', 'اللغة العربية'),
('Social Studies', 'الدراسات الاجتماعية'),
('Computer Science', 'علوم الحاسب'),
('Physical Education', 'التربية الرياضية'),
('Art', 'الفنون'),
('Music', 'الموسيقى'),
('Geography', 'الجغرافيا'),
('Economics', 'الاقتصاد'),
('Psychology', 'علم النفس'),
('Sociology', 'علم الاجتماع'),
('Philosophy', 'الفلسفة'),
('Environmental Science', 'علوم البيئة'),
('Engineering', 'الهندسة'),
('Literature', 'الأدب'),
('Business Studies', 'دراسات الأعمال'),
('Political Science', 'العلوم السياسية'),
('Health Education', 'تربية الصحة'),
('Islamic Studies', 'الدراسات الإسلامية'),
('Hindu Studies', 'الدراسات الهندوسية');

INSERT INTO cities (name_en, name_ar) VALUES
('Riyadh', 'الرياض'),
('Jeddah', 'جدة'),
('Mecca', 'مكة المكرمة'),
('Medina', 'المدينة المنورة'),
('Dammam', 'الدمام'),
('Khobar', 'الخبر'),
('Dhahran', 'الظهران'),
('Tabuk', 'تبوك'),
('Abha', 'أبها'),
('Taif', 'الطائف'),
('Jizan', 'جازان'),
('Hail', 'حائل'),
('Najran', 'نجران'),
('Al Khafji', 'الخفجي'),
('Al Qatif', 'القطيف'),
('Buraidah', 'بريدة'),
('Khamis Mushait', 'خميس مشيط'),
('Al Kharj', 'الخرج'),
('Hafar Al-Batin', 'حفر الباطن'),
('Yanbu', 'ينبع'),
('Al Jubail', 'الجبيل'),
('Arar', 'عرعر'),
('Sakaka', 'سكاكا'),
('Ras Tanura', 'رأس تنورة');

-- Insert default certifications
INSERT INTO certifications (name_en, name_ar) VALUES
('K-12 Math', 'الرياضيات للمراحل K-12'),
('STEM Specialist', 'متخصص STEM'),
('English Literature', 'الأدب الإنجليزي'),
('Lab Safety Certified', 'معتمد في سلامة المختبرات'),
('Special Education', 'التربية الخاصة'),
('Early Childhood Education', 'تعليم الطفول المبكرة'),
('Digital Learning', 'التعلم الرقمي'),
('ESL/TEFL', 'تعليم اللغة الإنجليزية كلغة ثانية'),
('IB Certification', 'شهادة البكالوريا الدولية'),
('Advanced Placement', 'التنسيب المتقدم'); 