-- ============================================
-- RECIPE APP - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  cooking_style TEXT, -- 'quick', 'healthy', 'budget', 'protein'
  dietary_restrictions TEXT[], -- ['vegetarian', 'gluten-free', etc]
  default_servings INTEGER DEFAULT 2,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMP,
  weekly_recipe_count INTEGER DEFAULT 0,
  weekly_scan_count INTEGER DEFAULT 0,
  week_reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- RECIPES TABLE
-- ============================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Source
  source_type TEXT NOT NULL, -- 'youtube', 'manual', 'fridge_scan'
  source_url TEXT,
  video_id TEXT,
  thumbnail_url TEXT,
  
  -- Recipe Details
  title TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  
  -- Time
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  total_time_minutes INTEGER,
  active_time_minutes INTEGER,
  
  -- Servings
  original_servings INTEGER DEFAULT 4,
  current_servings INTEGER DEFAULT 4,
  
  -- Content (JSON)
  ingredients JSONB NOT NULL, -- [{name, amount, unit, checked, category}]
  steps JSONB NOT NULL, -- [{step_number, instruction, duration_minutes, timer_id}]
  tools TEXT[], -- ['pan', 'knife', 'bowl']
  
  -- Nutrition (AI estimated)
  calories INTEGER,
  protein_g INTEGER,
  carbs_g INTEGER,
  fat_g INTEGER,
  
  -- User Data
  is_favorite BOOLEAN DEFAULT false,
  times_cooked INTEGER DEFAULT 0,
  last_cooked_at TIMESTAMP,
  user_notes TEXT,
  user_rating INTEGER, -- 1-5
  user_modifications JSONB, -- [{ingredient, original, modified}]
  
  -- AI Processing
  transcript TEXT,
  ai_processed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for recipes
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_source_type ON recipes(source_type);
CREATE INDEX idx_recipes_is_favorite ON recipes(is_favorite);

-- ============================================
-- SHOPPING LISTS TABLE
-- ============================================
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Shopping List',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SHOPPING ITEMS TABLE
-- ============================================
CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  amount DECIMAL,
  unit TEXT,
  category TEXT, -- 'produce', 'meat', 'dairy', 'pantry', 'frozen', 'other'
  is_checked BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shopping_items_list_id ON shopping_items(list_id);

-- ============================================
-- PANTRY (المكونات الموجودة)
-- ============================================
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  amount DECIMAL,
  unit TEXT,
  category TEXT,
  expiry_date DATE,
  added_from TEXT, -- 'manual', 'fridge_scan', 'leftover'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pantry_user_id ON pantry_items(user_id);

-- ============================================
-- COOKING SESSIONS (لتتبع الطبخ الحالي)
-- ============================================
CREATE TABLE cooking_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  
  current_step INTEGER DEFAULT 1,
  servings_adjustment DECIMAL DEFAULT 1.0,
  active_timers JSONB, -- [{timer_id, duration, started_at}]
  
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- RECIPE IMAGES (صور النتائج)
-- ============================================
CREATE TABLE recipe_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  image_url TEXT NOT NULL,
  caption TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USAGE TRACKING (للـ Free limits)
-- ============================================
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  action_type TEXT NOT NULL, -- 'recipe_extract', 'fridge_scan'
  week_number INTEGER,
  year INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_user_week ON usage_logs(user_id, week_number, year);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own data" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Recipes policies
CREATE POLICY "Users can view own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Shopping lists policies
CREATE POLICY "Users can manage own shopping lists" ON shopping_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own shopping items" ON shopping_items
  FOR ALL USING (
    list_id IN (
      SELECT id FROM shopping_lists WHERE user_id = auth.uid()
    )
  );

-- Pantry policies
CREATE POLICY "Users can manage own pantry" ON pantry_items
  FOR ALL USING (auth.uid() = user_id);

-- Cooking sessions policies
CREATE POLICY "Users can manage own cooking sessions" ON cooking_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Recipe images policies
CREATE POLICY "Users can manage own recipe images" ON recipe_images
  FOR ALL USING (auth.uid() = user_id);

-- Usage logs policies
CREATE POLICY "Users can view own usage" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage logs" ON usage_logs
  FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to reset weekly limits
CREATE OR REPLACE FUNCTION reset_weekly_limits()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    weekly_recipe_count = 0,
    weekly_scan_count = 0,
    week_reset_at = NOW()
  WHERE week_reset_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can perform action
CREATE OR REPLACE FUNCTION can_perform_action(
  p_user_id UUID,
  p_action_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_premium BOOLEAN;
  v_count INTEGER;
BEGIN
  -- Check if user is premium
  SELECT is_premium INTO v_is_premium
  FROM profiles
  WHERE id = p_user_id;
  
  -- Premium users can do anything
  IF v_is_premium THEN
    RETURN true;
  END IF;
  
  -- Check limits for free users
  IF p_action_type = 'recipe_extract' THEN
    SELECT weekly_recipe_count INTO v_count
    FROM profiles
    WHERE id = p_user_id;
    
    RETURN v_count < 5; -- 5 recipes per week
  ELSIF p_action_type = 'fridge_scan' THEN
    SELECT COUNT(*) INTO v_count
    FROM usage_logs
    WHERE user_id = p_user_id
      AND action_type = 'fridge_scan'
      AND created_at > NOW() - INTERVAL '1 day';
    
    RETURN v_count < 1; -- 1 scan per day
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pantry_items_updated_at BEFORE UPDATE ON pantry_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (للتطوير)
-- ============================================

-- يمكنك إضافة بيانات تجريبية هنا
