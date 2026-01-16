# 🍳 Recipe App - From Video to Table

> Transform saved cooking videos into actual meals with AI-powered recipe extraction, smart shopping lists, and hands-free cooking mode.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB)

---

## 📱 App Overview

**The Problem**: People save cooking videos but never actually cook them.

**The Solution**: Recipe App makes it effortless to go from "I saved this" to "it's on the table."

### Core Features

1. **🎥 Smart Recipe Extraction**
   - Paste any YouTube cooking video URL
   - AI extracts ingredients, steps, timing automatically
   - Editable before saving

2. **📸 Fridge Scan**
   - Take a photo of your fridge/pantry
   - AI identifies ingredients
   - Suggests recipes you can make right now

3. **🛒 Smart Shopping Lists**
   - Auto-generate from recipes
   - Check off what you have
   - Grouped by store section

4. **👨‍🍳 Cooking Mode**
   - Step-by-step guidance
   - Integrated timers
   - Voice control (hands-free)
   - Progress tracking

5. **💎 Premium Features**
   - Unlimited recipe extractions
   - Unlimited fridge scans
   - Smart ingredient substitutions
   - Nutrition information
   - Voice-controlled cooking
   - Meal planning

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React Native (Expo SDK 52)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Library**: React Native Elements
- **State Management**: Zustand
- **Camera**: Expo Camera & Image Picker

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 1.5 Pro
- **Subscriptions**: RevenueCat
- **Video Processing**: YouTube Transcript API

### Key Features Implementation
- **Recipe Extraction**: Gemini AI + Custom Prompts
- **Image Recognition**: Gemini Vision API
- **Voice Control**: Expo Speech + Expo AV
- **Timers**: React Native Background Timer

---

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
expo-cli (latest)
```

### Quick Setup
```bash
# Clone repository
git clone https://github.com/yourusername/recipe-app.git
cd recipe-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm start
```

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

---

## 📂 Project Structure

```
RecipeApp/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── recipe/            # Recipe screens
│   ├── cooking/           # Cooking mode
│   └── auth/              # Authentication
├── components/            # React components
│   ├── ui/               # Reusable UI
│   ├── recipe/           # Recipe-specific
│   └── cooking/          # Cooking mode
├── services/             # API services
│   ├── ai.service.ts     # Gemini AI
│   ├── youtube.service.ts # YouTube API
│   ├── supabase.service.ts # Database
│   └── revenueCat.service.ts # Payments
├── stores/               # Zustand stores
├── utils/                # Utilities
│   ├── types.ts          # TypeScript types
│   ├── prompts.ts        # AI prompts
│   └── constants.ts      # Constants
└── hooks/                # Custom hooks
```

---

## 🎯 Development Roadmap

### ✅ Week 1: Foundation (Completed)
- [x] Project setup
- [x] Authentication
- [x] User onboarding
- [x] Basic recipe management

### ✅ Week 2: Core Features (Completed)
- [x] YouTube integration
- [x] AI recipe extraction
- [x] Serving size adjustment
- [x] Ingredient substitutions

### 🔄 Week 3: Advanced Features (In Progress)
- [x] Fridge scanning
- [x] Recipe suggestions
- [x] Shopping list
- [ ] Pantry management

### 📅 Week 4: Polish & Launch
- [ ] Cooking mode
- [ ] Voice control
- [ ] RevenueCat integration
- [ ] App store submission

See [4_WEEK_ROADMAP.md](./4_WEEK_ROADMAP.md) for detailed timeline.

---

## 🔑 Environment Variables

Create `.env` file:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Google Gemini
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key

# Transcript API
EXPO_PUBLIC_TRANSCRIPT_API_URL=https://your-transcript-service/api/transcript

# RevenueCat
EXPO_PUBLIC_REVENUECAT_APPLE_KEY=appl_xxx...
EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY=goog_xxx...

# App Config
EXPO_PUBLIC_APP_NAME=RecipeApp
EXPO_PUBLIC_APP_VERSION=1.0.0
```

---

## 🎨 Key Components

### Recipe Extraction Flow
```typescript
// 1. Get YouTube transcript
const transcript = await youtubeService.getTranscript(url);

// 2. Extract recipe with AI
const recipe = await aiService.extractRecipeFromTranscript(transcript);

// 3. Save to database
await supabaseService.saveRecipe(recipe);
```

### Fridge Scan Flow
```typescript
// 1. Capture image
const image = await ImagePicker.launchCameraAsync();

// 2. Analyze with AI
const ingredients = await aiService.analyzeFridgeImage(image);

// 3. Suggest recipes
const suggestions = await aiService.suggestRecipesFromIngredients(ingredients);
```

### Cooking Mode
```typescript
// 1. Start session
const session = await cookingService.startSession(recipeId);

// 2. Track progress
await cookingService.updateStep(sessionId, stepNumber);

// 3. Manage timers
await cookingService.setTimer(duration, label);
```

---

## 💰 Monetization Strategy

### Free Tier
- 5 recipe extractions/week
- 1 fridge scan/day
- Save up to 10 recipes
- Basic features

### Pro Tier ($4.99/month)
- ✅ Unlimited recipe extractions
- ✅ Unlimited fridge scans
- ✅ Unlimited saved recipes
- ✅ Smart substitutions
- ✅ Nutrition info
- ✅ Voice control
- ✅ Priority support

### Pro+ Tier ($39.99/year - 33% savings)
- ✅ Everything in Pro
- ✅ Weekly meal planner
- ✅ Family sharing (5 accounts)
- ✅ Early access to features

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

### Manual Testing Checklist
- [ ] Authentication flow
- [ ] Recipe extraction
- [ ] Fridge scanning
- [ ] Shopping list
- [ ] Cooking mode
- [ ] Payment flow
- [ ] Offline mode

---

## 🚀 Deployment

### Build for iOS
```bash
eas build --platform ios --profile production
```

### Build for Android
```bash
eas build --platform android --profile production
```

### Submit to Stores
```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

---

## 📊 Analytics & Monitoring

- **Analytics**: Expo Analytics + Mixpanel
- **Crash Reporting**: Sentry
- **Performance**: Expo Performance Monitoring
- **A/B Testing**: RevenueCat Experiments

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 👥 Team

- **Developer**: [Your Name]
- **Designer**: [Designer Name]
- **Advisor**: [Advisor Name]

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - Amazing React Native framework
- [Google AI Studio](https://aistudio.google.com) - Gemini API
- [Supabase](https://supabase.com) - Backend as a Service
- [RevenueCat](https://revenuecat.com) - Subscription management
- [React Native Elements](https://reactnativeelements.com) - UI components

---

## 📞 Support

- **Email**: support@recipeapp.com
- **Discord**: [Join our community](https://discord.gg/xxx)
- **Twitter**: [@RecipeApp](https://twitter.com/recipeapp)

---

## 🔮 Future Enhancements

- [ ] Social features (share recipes)
- [ ] Community recipe database
- [ ] Integration with grocery delivery
- [ ] Smart kitchen appliance integration
- [ ] Nutrition tracking
- [ ] Dietary goal tracking
- [ ] Recipe video generation
- [ ] AR cooking assistance

---

## 📈 Stats

- **Lines of Code**: ~15,000
- **Components**: 50+
- **API Endpoints**: 20+
- **Supported Languages**: English, Arabic
- **Platforms**: iOS, Android

---

Made with ❤️ and lots of ☕

**Star ⭐ this repo if you find it helpful!**
