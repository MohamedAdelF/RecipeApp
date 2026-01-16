# 🚀 Quick Start Guide - Recipe App

## Prerequisites
```bash
# Install Node.js 18+ and npm
node --version  # Should be 18+
npm --version

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI (for building)
npm install -g eas-cli
```

---

## 🔧 Initial Setup (30 minutes)

### Step 1: Create Project
```bash
# Create Expo app
npx create-expo-app RecipeApp --template blank-typescript
cd RecipeApp

# Initialize git
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Install All Dependencies
```bash
# Navigation
npx expo install expo-router react-native-safe-area-context react-native-screens react-native-gesture-handler

# UI Components
npm install @rneui/themed @rneui/base react-native-vector-icons

# Camera & Media
npx expo install expo-camera expo-image-picker expo-image-manipulator

# Audio (Voice Mode)
npx expo install expo-av expo-speech

# Backend
npm install @supabase/supabase-js @react-native-async-storage/async-storage

# RevenueCat (Subscriptions)
npm install react-native-purchases

# AI
npm install @google/generative-ai

# Utils
npm install axios date-fns zustand

# Dev Dependencies
npm install -D @types/react @types/react-native
```

### Step 3: Project Structure
```bash
# Create folder structure
mkdir -p app/{tabs,recipe,cooking}
mkdir -p components/{ui,recipe,cooking,shopping}
mkdir -p services
mkdir -p utils
mkdir -p hooks
mkdir -p stores
mkdir -p constants
mkdir -p assets/{images,fonts,icons}
```

### Step 4: Environment Variables
```bash
# Create .env file
touch .env

# Add to .env:
cat > .env << 'EOF'
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key

# Transcript API (self-hosted recommended)
EXPO_PUBLIC_TRANSCRIPT_API_URL=https://your-transcript-service/api/transcript

# RevenueCat
EXPO_PUBLIC_REVENUECAT_APPLE_KEY=your-apple-key
EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY=your-google-key

# App Config
EXPO_PUBLIC_APP_NAME=RecipeApp
EXPO_PUBLIC_APP_VERSION=1.0.0
EOF

# Add .env to .gitignore
echo ".env" >> .gitignore
```

---

## 🗄️ Supabase Setup (20 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Wait for setup (~2 minutes)
4. Copy URL and anon key

### Step 2: Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy content from `supabase_schema.sql`
3. Run the SQL
4. Verify tables created

### Step 3: Enable RLS
1. Go to Authentication → Policies
2. Verify RLS is enabled on all tables
3. Test with a test user

### Step 4: Setup Auth
1. Go to Authentication → Settings
2. Enable Email auth
3. Configure email templates (optional for MVP)

---

## 🤖 Gemini API Setup (5 minutes)

### Step 1: Get API Key
1. Go to https://aistudio.google.com/app/apikey
2. Create account / Sign in
3. Create new key
4. Copy and paste in `.env`

### Step 2: Test Connection
```typescript
// test-gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = gemini.getGenerativeModel({ model: 'gemini-1.5-pro' });

async function test() {
  const result = await model.generateContent('Say hello!');
  console.log(result.response.text());
}

test();
```

---

## 💳 RevenueCat Setup (30 minutes)

### Step 1: Create Account
1. Go to https://revenuecat.com
2. Sign up (free for development)
3. Create new project

### Step 2: Create Products
1. Go to Products
2. Create two products:
   - `pro_monthly` - $4.99/month
   - `pro_yearly` - $39.99/year (save 33%)
3. Create Entitlement: `premium`
4. Attach both products to entitlement

### Step 3: Configure App
```typescript
// In app initialization
import Purchases from 'react-native-purchases';

Purchases.configure({
  apiKey: Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY,
  })!,
});
```

---

## 📱 Run The App

### Development
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web
```

### Build for Testing
```bash
# Build development client
eas build --profile development --platform ios
eas build --profile development --platform android

# Or build locally
expo run:ios
expo run:android
```

---

## 🧪 Testing Setup

### Step 1: Create Test User
```bash
# In Supabase Dashboard
# Go to Authentication → Users
# Add new user:
# Email: test@recipe.app
# Password: Test123!
```

### Step 2: Add Test Data
```sql
-- In Supabase SQL Editor
INSERT INTO recipes (
  user_id,
  source_type,
  title,
  difficulty,
  total_time_minutes,
  original_servings,
  current_servings,
  ingredients,
  steps
) VALUES (
  'user-id-here',
  'manual',
  'Test Recipe',
  'beginner',
  30,
  4,
  4,
  '[{"name": "eggs", "amount": 2, "unit": "piece", "category": "dairy"}]',
  '[{"step_number": 1, "instruction": "Beat the eggs"}]'
);
```

---

## 📂 File Structure Overview

```
RecipeApp/
├── app/
│   ├── (tabs)/               # Main tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx         # Home (Add Recipe)
│   │   ├── scan.tsx          # Fridge Scan
│   │   ├── saved.tsx         # Saved Recipes
│   │   ├── shopping.tsx      # Shopping List
│   │   └── profile.tsx       # Settings
│   ├── recipe/
│   │   └── [id].tsx          # Recipe Detail
│   ├── cooking/
│   │   └── [id].tsx          # Cooking Mode
│   ├── auth/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── _layout.tsx           # Root layout
│
├── components/
│   ├── ui/                   # Reusable UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── recipe/
│   │   ├── RecipeCard.tsx
│   │   ├── IngredientList.tsx
│   │   └── StepCard.tsx
│   └── cooking/
│       ├── Timer.tsx
│       └── VoiceControl.tsx
│
├── services/
│   ├── ai.service.ts         # Gemini API
│   ├── youtube.service.ts    # Transcript
│   ├── supabase.service.ts   # Database
│   └── revenueCat.service.ts # Subscriptions
│
├── stores/
│   ├── authStore.ts          # Auth state
│   ├── recipeStore.ts        # Recipes
│   └── shoppingStore.ts      # Shopping list
│
├── utils/
│   ├── types.ts              # TypeScript types
│   ├── prompts.ts            # AI prompts
│   ├── constants.ts          # App constants
│   └── helpers.ts            # Helper functions
│
├── hooks/
│   ├── useRecipes.ts
│   ├── useAuth.ts
│   └── usePremium.ts
│
└── constants/
    ├── Colors.ts
    └── Layout.ts
```

---

## 🎨 First Component (Test)

Create `components/ui/Button.tsx`:

```typescript
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ title, onPress, loading, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## ✅ Verification Checklist

Before starting development:

- [ ] Node.js 18+ installed
- [ ] Expo CLI installed
- [ ] Project created
- [ ] All dependencies installed
- [ ] `.env` file configured
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Gemini API key obtained
- [ ] RevenueCat account created
- [ ] App runs on iOS/Android
- [ ] Test user created
- [ ] Git repository initialized

---

## 🐛 Common Issues

### Issue: Metro bundler won't start
```bash
# Clear cache
npx expo start -c
```

### Issue: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: iOS build fails
```bash
# Reinstall pods
cd ios
pod install
cd ..
```

### Issue: Android build fails
```bash
# Clean gradle
cd android
./gradlew clean
cd ..
```

### Issue: Supabase connection fails
- Check `.env` file is loaded
- Verify URL and key are correct
- Check RLS policies

---

## 📚 Resources

### Documentation
- [Expo Docs](https://docs.expo.dev)
- [React Native Elements](https://reactnativeelements.com)
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [RevenueCat Docs](https://docs.revenuecat.com)

### YouTube Channels
- [Expo](https://youtube.com/@expo)
- [Simon Grimm](https://youtube.com/@galaxies_dev)
- [Notjust.dev](https://youtube.com/@notjustdev)

---

## 🎯 Next Steps

1. ✅ Complete setup (this guide)
2. 📖 Read Week 1 roadmap
3. 🎨 Design app screens (Figma optional)
4. 💻 Start Day 1 tasks
5. 🚀 Build MVP!

---

**You're all set! Time to build! 💪**
