-- ===============================================
-- Scottish Terrier Dog Web 資料庫架構
-- ===============================================

-- 啟用 UUID 擴充功能
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- 1. Posts 表格 (日記文章)
-- ===============================================
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 建立 posts 表格的索引
CREATE INDEX posts_author_id_idx ON posts(author_id);
CREATE INDEX posts_published_idx ON posts(published);
CREATE INDEX posts_created_at_idx ON posts(created_at);

-- ===============================================
-- 2. Members 表格 (成員/會員)
-- ===============================================
CREATE TABLE members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立 members 表格的索引
CREATE INDEX members_role_idx ON members(role);
CREATE INDEX members_email_idx ON members(email);

-- ===============================================
-- 3. Puppies 表格 (幼犬資訊)
-- ===============================================
CREATE TABLE puppies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    color VARCHAR(50) NOT NULL,
    description TEXT,
    personality_traits TEXT,
    images TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'not_for_sale')),
    price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'TWD',
    microchip_id VARCHAR(50),
    birth_weight INTEGER,
    current_weight INTEGER,
    expected_adult_weight INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- 約束條件
    CONSTRAINT check_birth_weight CHECK (birth_weight > 0 AND birth_weight < 10000),
    CONSTRAINT check_current_weight CHECK (current_weight > 0 AND current_weight < 100000),
    CONSTRAINT check_expected_adult_weight CHECK (expected_adult_weight > 0 AND expected_adult_weight < 100000)
);

-- 建立 puppies 表格的索引
CREATE INDEX puppies_breed_idx ON puppies(breed);
CREATE INDEX puppies_status_idx ON puppies(status);
CREATE INDEX puppies_birth_date_idx ON puppies(birth_date);
CREATE INDEX puppies_microchip_id_idx ON puppies(microchip_id) WHERE microchip_id IS NOT NULL;

-- ===============================================
-- 4. Environments 表格 (環境資訊)
-- ===============================================
CREATE TABLE environments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('accommodation', 'classroom', 'playground', 'transport', 'other')) NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立 environments 表格的索引
CREATE INDEX environments_type_idx ON environments(type);

-- ===============================================
-- 觸發器函數：自動更新 updated_at 欄位
-- ===============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為所有表格添加 updated_at 觸發器
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_puppies_updated_at BEFORE UPDATE ON puppies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environments_updated_at BEFORE UPDATE ON environments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 