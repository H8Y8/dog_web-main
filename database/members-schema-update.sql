-- ===============================================
-- Members 表格更新：從人類成員改為狗隻成員
-- ===============================================

-- 備份現有資料（如果有的話）
CREATE TABLE members_backup AS SELECT * FROM members;

-- 刪除現有的 members 表格
DROP TABLE IF EXISTS members CASCADE;

-- 重新建立 members 表格（狗隻成員）
CREATE TABLE members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- 基本資訊
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL DEFAULT 'Scottish Terrier',
    birth_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    color VARCHAR(50) NOT NULL,
    
    -- 狗隻角色和狀態
    role VARCHAR(50) CHECK (role IN ('breeding_male', 'breeding_female', 'retired', 'training', 'champion', 'puppy_parent', 'companion')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'retired', 'deceased', 'on_loan', 'temporary')) DEFAULT 'active',
    
    -- 詳細資訊
    description TEXT,
    personality_traits TEXT,
    
    -- JSON 格式的複雜資料
    pedigree_info JSONB DEFAULT '{}',
    health_records JSONB DEFAULT '{}',
    achievements JSONB DEFAULT '[]',
    
    -- 照片和文件
    avatar_url TEXT,
    album_urls TEXT[] DEFAULT '{}',
    pedigree_urls TEXT[] DEFAULT '{}',
    health_check_urls TEXT[] DEFAULT '{}',
    
    -- 時間戳記
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立索引
CREATE INDEX members_breed_idx ON members(breed);
CREATE INDEX members_role_idx ON members(role);
CREATE INDEX members_status_idx ON members(status);
CREATE INDEX members_birth_date_idx ON members(birth_date);
CREATE INDEX members_gender_idx ON members(gender);

-- 添加 updated_at 觸發器
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 新增 RLS 政策（如果使用 Supabase）
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 允許已認證用戶讀取所有成員資料
CREATE POLICY "Allow authenticated users to read members"
ON members FOR SELECT
TO authenticated
USING (true);

-- 只允許管理員修改成員資料
CREATE POLICY "Allow admins to modify members"
ON members FOR ALL
TO authenticated
USING (auth.jwt()->>'role' = 'admin');

-- 插入範例資料
INSERT INTO members (name, breed, birth_date, gender, color, role, status, description, personality_traits, pedigree_info, health_records, achievements) VALUES
(
    'Champion Max',
    'Scottish Terrier',
    '2019-03-15',
    'male',
    'Black',
    'breeding_male',
    'active',
    '優秀的種公，具有完美的體型和氣質',
    '聰明、忠誠、活潑',
    '{"父親": "Grand Champion Rex", "母親": "Champion Bella", "血統登記號": "ST-2019-001"}',
    '{"最後檢查": "2024-12-01", "疫苗": "已完成", "健康狀況": "優良"}',
    '["2023年台灣犬展冠軍", "2024年亞洲犬展最佳種公"]'
),
(
    'Lady Rose',
    'Scottish Terrier', 
    '2020-08-22',
    'female',
    'Wheaten',
    'breeding_female',
    'active',
    '溫和的種母，生育能力優秀',
    '溫柔、母性強、穩定',
    '{"父親": "Champion Duke", "母親": "Lady Grace", "血統登記號": "ST-2020-005"}',
    '{"最後檢查": "2024-11-15", "疫苗": "已完成", "健康狀況": "優良", "繁殖記錄": "已生育3胎"}',
    '["2022年繁殖展優勝", "優秀母犬認證"]'
);

-- 註解說明
COMMENT ON TABLE members IS '犬舍狗隻成員資料表';
COMMENT ON COLUMN members.role IS '狗隻角色：breeding_male(種公), breeding_female(種母), retired(退休), training(訓練中), champion(冠軍犬), puppy_parent(幼犬父母), companion(陪伴犬)';
COMMENT ON COLUMN members.status IS '狗隻狀態：active(活躍), retired(退休), deceased(已故), on_loan(外借), temporary(暫時)';
COMMENT ON COLUMN members.pedigree_info IS 'JSON格式的血統資訊';
COMMENT ON COLUMN members.health_records IS 'JSON格式的健康記錄';
COMMENT ON COLUMN members.achievements IS 'JSON陣列格式的成就記錄'; 