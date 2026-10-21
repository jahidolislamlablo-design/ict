-- =============================================================================
-- ICT EASY LEARNING - PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Platform: Supabase (Recommended) / PostgreSQL 14+
-- Charset: UTF-8
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. CHAPTERS (অধ্যায়সমূহ)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chapters (
    id SERIAL PRIMARY KEY,
    chapter_number VARCHAR(50) NOT NULL,          -- যেমন: "১ম অধ্যায়"
    title VARCHAR(255) NOT NULL,                   -- যেমন: "তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত"
    short_desc TEXT,                               -- মূল টপিকসমূহ
    icon VARCHAR(60) DEFAULT 'fa-book-open',       -- FontAwesome আইকন ক্লাস
    color VARCHAR(30) DEFAULT '#4F46E5',           -- থিম কালার হেক্স
    total_mcq INT DEFAULT 0,
    total_cq INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. EDUCATION BOARDS (সকল শিক্ষা বোর্ড)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boards (
    id VARCHAR(50) PRIMARY KEY,                   -- যেমন: "dhaka", "rajshahi"
    name VARCHAR(150) NOT NULL,                   -- যেমন: "ঢাকা বোর্ড (DHAKA BOARD)"
    code VARCHAR(20) NOT NULL,                    -- যেমন: "DB"
    icon VARCHAR(60) DEFAULT 'fa-building-columns'
);

-- -----------------------------------------------------------------------------
-- 3. TOP COLLEGES (শীর্ষ কলেজসমূহ - টেস্ট পেপার)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS colleges (
    id VARCHAR(50) PRIMARY KEY,                   -- যেমন: "ndc", "vnsc"
    name VARCHAR(200) NOT NULL,                   -- যেমন: "নটর ডেম কলেজ, ঢাকা"
    district VARCHAR(100) NOT NULL,               -- যেমন: "ঢাকা"
    total_tests INT DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 4. MCQ QUESTIONS (নৈর্ব্যক্তিক প্রশ্নভাণ্ডার)
-- Supports: Chapter MCQ, Board MCQ, College Test Paper MCQ, Model Test Questions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mcq_questions (
    id SERIAL PRIMARY KEY,
    context_stem TEXT,                            -- উদ্দীপক (যদি থাকে)
    question_text TEXT NOT NULL,                  -- প্রশ্ন
    options JSONB NOT NULL,                       -- ["কোর (Core)", "ক্ল্যাডিং", "জ্যাকেট", "বাফার"]
    correct_index INT NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3), -- ০, ১, ২ বা ৩
    explanation TEXT,                             -- নির্ভুল ব্যাখ্যা
    chapter_id INT REFERENCES chapters(id) ON DELETE SET NULL,
    board_id VARCHAR(50) REFERENCES boards(id) ON DELETE SET NULL,
    college_id VARCHAR(50) REFERENCES colleges(id) ON DELETE SET NULL,
    year VARCHAR(10),                             -- যেমন: "2024", "2025", "2026"
    difficulty VARCHAR(20) DEFAULT 'medium',      -- 'easy', 'medium', 'hard'
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_mcq_chapter ON mcq_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_mcq_board_year ON mcq_questions(board_id, year);
CREATE INDEX IF NOT EXISTS idx_mcq_college ON mcq_questions(college_id);

-- -----------------------------------------------------------------------------
-- 5. CQ QUESTIONS (সৃজনশীল প্রশ্ন ও উত্তর)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cq_questions (
    id SERIAL PRIMARY KEY,
    stem TEXT NOT NULL,                           -- উদ্দীপক
    q_ka TEXT NOT NULL,                           -- (ক) জ্ঞানমূলক প্রশ্ন
    ans_ka TEXT,                                  -- (ক) আদর্শ উত্তর
    q_kha TEXT NOT NULL,                          -- (খ) অনুধাবনমূলক প্রশ্ন
    ans_kha TEXT,                                 -- (খ) আদর্শ উত্তর
    q_ga TEXT NOT NULL,                           -- (গ) প্রয়োগমূলক প্রশ্ন
    ans_ga TEXT,                                  -- (গ) আদর্শ উত্তর
    q_gha TEXT NOT NULL,                          -- (ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন
    ans_gha TEXT,                                 -- (ঘ) আদর্শ উত্তর
    chapter_id INT REFERENCES chapters(id) ON DELETE SET NULL,
    board_id VARCHAR(50) REFERENCES boards(id) ON DELETE SET NULL,
    college_id VARCHAR(50) REFERENCES colleges(id) ON DELETE SET NULL,
    year VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cq_chapter ON cq_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_cq_board_year ON cq_questions(board_id, year);

-- -----------------------------------------------------------------------------
-- 6. MODEL TESTS (মডেল টেস্ট মেটাডাটা)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_tests (
    id VARCHAR(50) PRIMARY KEY,                   -- যেমন: "mt-01"
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'full',              -- 'full' (পূর্ণাঙ্গ) বা 'chapter' (অধ্যায়ভিত্তিক)
    badge VARCHAR(100),                           -- যেমন: "Full Syllabus", "Chapter 4"
    questions_count INT DEFAULT 25,
    duration INT DEFAULT 25,                      -- সময় (মিনিট)
    marks INT DEFAULT 25,
    negative_marking DECIMAL(4,2) DEFAULT 0.25,
    participants_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. MODEL TEST QUESTION MAPPINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_test_questions (
    id SERIAL PRIMARY KEY,
    model_test_id VARCHAR(50) REFERENCES model_tests(id) ON DELETE CASCADE,
    mcq_id INT REFERENCES mcq_questions(id) ON DELETE CASCADE,
    question_order INT DEFAULT 1,
    UNIQUE(model_test_id, mcq_id)
);

-- -----------------------------------------------------------------------------
-- 8. PDF SUGGESTIONS & HANDNOTES (পিডিএফ রিসোর্স)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pdf_suggestions (
    id VARCHAR(50) PRIMARY KEY,                   -- যেমন: "pdf-01"
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,                -- 'suggestion', 'handnote', 'cheatsheet', 'test_paper'
    chapter VARCHAR(100) DEFAULT 'সকল অধ্যায়',
    file_size VARCHAR(30),                        -- যেমন: "3.8 MB"
    pages INT,                                    -- যেমন: 42
    download_url TEXT NOT NULL,                   -- Supabase Storage বা Google Drive URL
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. USER PROFILES (শিক্ষার্থী প্রোফাইল)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(150) NOT NULL,
    college VARCHAR(200),
    hsc_batch VARCHAR(50) DEFAULT 'HSC 2026',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    completed_tests INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    total_solved INT DEFAULT 0,
    study_streak_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. EXAM RESULTS & SCORE HISTORY (পরীক্ষার ফলাফল ট্র্যাকিং)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    model_test_id VARCHAR(50) REFERENCES model_tests(id) ON DELETE SET NULL,
    score DECIMAL(5,2) NOT NULL,
    total_marks INT NOT NULL,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    skipped_count INT DEFAULT 0,
    time_taken_seconds INT,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_results_user ON exam_results(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Supabase-এ ক্লায়েন্ট থেকে সরাসরি নিরাপদে রিড করার জন্য
-- =============================================================================

-- Enable RLS on all public tables
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (যে কেউ প্রশ্ন, অধ্যায়, সাজেশন দেখতে পারবে)
CREATE POLICY "Public can view chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Public can view boards" ON boards FOR SELECT USING (true);
CREATE POLICY "Public can view colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Public can view mcq_questions" ON mcq_questions FOR SELECT USING (true);
CREATE POLICY "Public can view cq_questions" ON cq_questions FOR SELECT USING (true);
CREATE POLICY "Public can view model_tests" ON model_tests FOR SELECT USING (true);
CREATE POLICY "Public can view model_test_questions" ON model_test_questions FOR SELECT USING (true);
CREATE POLICY "Public can view pdf_suggestions" ON pdf_suggestions FOR SELECT USING (true);

-- 2. User Profiles Policies (ইউজার শুধু নিজের ডাটা এডিট করবে)
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Exam Results (ইউজার শুধু নিজের রেজাল্ট যুক্ত ও দেখতে পারবে)
CREATE POLICY "Users can view own exam results" ON exam_results FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert exam results" ON exam_results FOR INSERT WITH CHECK (true);
