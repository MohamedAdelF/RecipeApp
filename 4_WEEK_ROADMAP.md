# 🗓️ خطة 4 أسابيع - Recipe App

## 📊 Overview
- **المدة الكلية**: 4 أسابيع (28 يوم)
- **الهدف**: MVP جاهز للمسابقة
- **المنهجية**: Agile Sprints (أسبوع واحد لكل sprint)

---

## 🎯 الأهداف لكل أسبوع

### Week 1: Foundation & Core Setup
**الأولوية**: بناء الأساسات

### Week 2: Recipe Extraction & AI Integration
**الأولوية**: الميزة الأساسية (YouTube → Recipe)

### Week 3: Fridge Scan & Shopping List
**الأولوية**: الميزة المميزة (Wow Factor)

### Week 4: Cooking Mode, Polish & Premium
**الأولوية**: التجربة النهائية والربحية

---

# 📅 WEEK 1: Foundation & Core Setup

## Day 1-2: Project Setup & Infrastructure

### ✅ Day 1 Morning
- [ ] Create Expo project
  ```bash
  npx create-expo-app RecipeApp --template blank-typescript
  cd RecipeApp
  ```
- [ ] Install all dependencies
  ```bash
  npm install @rneui/themed @rneui/base
  npm install expo-router react-native-safe-area-context
  npm install @supabase/supabase-js
  npm install @google/generative-ai
  npm install zustand axios date-fns
  ```
- [ ] Setup project structure
  - Create folders: `/app`, `/components`, `/services`, `/utils`
  - Add all TypeScript type files
- [ ] Configure `.env` file
  ```
  EXPO_PUBLIC_SUPABASE_URL=your_url
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
  EXPO_PUBLIC_GEMINI_API_KEY=your_key
  ```

### ✅ Day 1 Afternoon
- [ ] Setup Supabase project
  - Create new project on supabase.com
  - Run the schema.sql file
  - Enable Row Level Security
  - Test connection from app
- [ ] Create Supabase service file (`supabase.service.ts`)
  - Initialize client
  - Add auth methods (signUp, signIn, signOut)
  - Test authentication flow

### ✅ Day 2 Morning
- [ ] Design system & theme
  - Setup colors, typography, spacing
  - Create reusable UI components:
    - `Button.tsx`
    - `Card.tsx`
    - `Input.tsx`
    - `LoadingSpinner.tsx`
- [ ] Setup navigation (Expo Router)
  - Create tab layout
  - Add basic screens (Home, Saved, Profile)
  - Test navigation flow

### ✅ Day 2 Afternoon
- [ ] Auth screens
  - Login screen
  - Signup screen
  - Forgot password screen
- [ ] Auth state management (Zustand)
  - Create auth store
  - Persist auth state
  - Test login/logout flow

---

## Day 3-4: User Onboarding & Profile

### ✅ Day 3 Morning
- [ ] Onboarding flow UI
  - Welcome screen
  - Cooking style selection
  - Dietary restrictions selection
  - Servings preference
- [ ] Form validation & data collection

### ✅ Day 3 Afternoon
- [ ] Save user preferences to Supabase
- [ ] Skip onboarding option (for returning users)
- [ ] Profile screen
  - Display user info
  - Edit preferences
  - Account settings

### ✅ Day 4 Morning
- [ ] Create usage tracking system
  - Weekly limits check
  - Free vs Premium logic
  - Display usage stats in profile
- [ ] Database functions for limits
  - `can_perform_action()`
  - `reset_weekly_limits()`

### ✅ Day 4 Afternoon
- [ ] Basic error handling
  - Network errors
  - Auth errors
  - User-friendly messages
- [ ] Loading states for all async operations

---

## Day 5-7: Basic Recipe Management

### ✅ Day 5 Morning
- [ ] Recipe list screen
  - Fetch recipes from Supabase
  - Display recipe cards
  - Empty state design
- [ ] Recipe card component
  - Title, image, time, difficulty
  - Favorite button
  - Swipe actions (delete, favorite)

### ✅ Day 5 Afternoon
- [ ] Recipe detail screen
  - Full recipe view
  - Ingredients list
  - Steps list
  - Metadata (time, servings, etc)
- [ ] Navigation to recipe detail

### ✅ Day 6 Morning
- [ ] Manual recipe creation
  - Add recipe form
  - Title, ingredients, steps
  - Save to Supabase
- [ ] Edit recipe functionality

### ✅ Day 6 Afternoon
- [ ] Saved recipes feature
  - Mark as favorite
  - Filter by favorites
  - Sort recipes (newest, most cooked, etc)
- [ ] Delete recipe

### ✅ Day 7: Testing & Bug Fixes
- [ ] Test all features from Week 1
- [ ] Fix bugs
- [ ] UI polish
- [ ] Code cleanup
- [ ] Commit to Git

---

# 📅 WEEK 2: Recipe Extraction & AI Integration

## Day 8-9: YouTube Integration

### ✅ Day 8 Morning
- [ ] YouTube service implementation
  - Video ID extraction
  - Transcript API integration
  - Error handling
- [ ] Test with various YouTube URLs

### ✅ Day 8 Afternoon
- [ ] Home screen: "Add Recipe from URL"
  - URL input field
  - Validate YouTube URL
  - Loading state while extracting
- [ ] Display video thumbnail & title

### ✅ Day 9 Morning
- [ ] Gemini AI integration
  - Setup Gemini SDK
  - Test basic API call
  - Implement retry logic
- [ ] Create all AI prompts (prompts.ts)

### ✅ Day 9 Afternoon
- [ ] Recipe extraction flow
  - Get transcript → Send to Gemini → Parse JSON
  - Handle errors gracefully
  - Display extracted recipe for review

---

## Day 10-11: Recipe Extraction UI

### ✅ Day 10 Morning
- [ ] Recipe preview screen
  - Show extracted recipe
  - Allow user to edit before saving
  - Ingredient checkboxes
  - Steps with timers

### ✅ Day 10 Afternoon
- [ ] Save extracted recipe to Supabase
  - Store all recipe data
  - Link to user
  - Update usage count
- [ ] Success animation/feedback

### ✅ Day 11 Morning
- [ ] Usage limits implementation
  - Check before extraction
  - Show "X recipes remaining this week"
  - Block if limit reached (Free users)
- [ ] Paywall trigger (basic)

### ✅ Day 11 Afternoon
- [ ] Alternative: Manual transcript input
  - "Paste transcript" option
  - Textarea input
  - Validate minimum length
- [ ] Test extraction with real cooking videos

---

## Day 12-14: AI Features Enhancement

### ✅ Day 12 Morning
- [ ] Serving size adjuster
  - UI slider (2-8 servings)
  - Call AI to scale recipe
  - Update ingredient amounts
- [ ] Display scaling notes

### ✅ Day 12 Afternoon
- [ ] Ingredient substitution (Premium)
  - "Don't have X?" button
  - AI suggests alternatives
  - Show substitution modal
- [ ] Apply substitution to recipe

### ✅ Day 13 Morning
- [ ] Nutrition estimation
  - Call AI if not in transcript
  - Display calories, macros
  - Per-serving breakdown
- [ ] Nutrition info card in recipe detail

### ✅ Day 13 Afternoon
- [ ] Recipe difficulty indicator
  - Visual badge (beginner/intermediate/advanced)
  - Time estimation
  - Active vs Total time
- [ ] Filter recipes by difficulty

### ✅ Day 14: Testing & Optimization
- [ ] Test all Week 2 features
- [ ] Performance optimization
  - Cache AI responses
  - Optimize image loading
- [ ] Error handling improvements
- [ ] Code review & cleanup

---

# 📅 WEEK 3: Fridge Scan & Shopping List

## Day 15-16: Camera & Vision

### ✅ Day 15 Morning
- [ ] Camera permissions setup
  - Request camera access
  - Handle denied permissions
- [ ] Image picker integration
  - expo-image-picker
  - Camera and gallery options
- [ ] Test on real device

### ✅ Day 15 Afternoon
- [ ] Fridge scan screen UI
  - Camera preview
  - Capture button
  - Gallery button
  - Guidelines overlay ("Point at your fridge")

### ✅ Day 16 Morning
- [ ] Image preprocessing
  - Resize for AI (max 1024px)
  - Convert to base64
  - Compress quality
- [ ] Vision AI integration
  - Send image to Gemini
  - Parse ingredient list
  - Display results

### ✅ Day 16 Afternoon
- [ ] Fridge scan results screen
  - List detected ingredients
  - Edit/remove items
  - Add to pantry button
  - Suggest recipes button

---

## Day 17-18: Recipe Suggestions

### ✅ Day 17 Morning
- [ ] Pantry management
  - Save detected ingredients
  - Manual add/edit/delete
  - Expiry date tracking
- [ ] Pantry screen UI

### ✅ Day 17 Afternoon
- [ ] AI recipe suggestions
  - Send pantry items to Gemini
  - Get recipe suggestions
  - Display match scores
- [ ] Recipe suggestion cards
  - Title, description, match %
  - What you have / What you need
  - Preview steps

### ✅ Day 18 Morning
- [ ] Select suggested recipe
  - Show full recipe detail
  - Option to save
  - Option to start cooking
- [ ] Convert suggestion to full recipe
  - Extract complete steps if needed

### ✅ Day 18 Afternoon
- [ ] Usage limits for fridge scan
  - 1 scan/day for Free users
  - Unlimited for Premium
  - Show remaining scans
- [ ] Test fridge scan with real fridges

---

## Day 19-21: Shopping List

### ✅ Day 19 Morning
- [ ] Shopping list data model
  - Create list table
  - Add items table
  - Group by category
- [ ] Shopping list screen UI
  - Tab navigation
  - Active list
  - Completed items

### ✅ Day 19 Afternoon
- [ ] Add missing ingredients to list
  - "Add to shopping list" button on recipe
  - Checkbox for each ingredient
  - Bulk add
- [ ] Save to Supabase

### ✅ Day 20 Morning
- [ ] Shopping list features
  - Check/uncheck items
  - Delete items
  - Edit quantity
  - Add custom items
- [ ] Group by category
  - Produce, Meat, Dairy, etc.
  - Collapsible sections

### ✅ Day 20 Afternoon
- [ ] Shopping list actions
  - Share list (text)
  - Clear all checked items
  - Duplicate list
- [ ] Persist checked state

### ✅ Day 21: Integration & Testing
- [ ] Complete flow test:
  - Extract recipe → Check ingredients → Add to shopping list
- [ ] Fridge scan → Suggestions → Save recipe → Shopping list
- [ ] Bug fixes
- [ ] UI polish

---

# 📅 WEEK 4: Cooking Mode, Premium & Final Polish

## Day 22-23: Cooking Mode

### ✅ Day 22 Morning
- [ ] Cooking session model
  - Start cooking session
  - Track current step
  - Save progress
- [ ] Cooking mode UI
  - Full-screen step view
  - Large text for readability
  - Next/Previous buttons

### ✅ Day 22 Afternoon
- [ ] Timer integration
  - Detect timers in steps
  - One-tap start timer
  - Multiple concurrent timers
  - Notifications when timer ends
- [ ] Timer management UI

### ✅ Day 23 Morning
- [ ] Voice control (Premium)
  - expo-speech for TTS
  - expo-av for voice input
  - "Next step", "Repeat", "Set timer"
- [ ] Voice commands parsing (AI)

### ✅ Day 23 Afternoon
- [ ] Cooking mode features
  - Keep screen awake
  - Step completion checkmarks
  - Progress bar
  - "Done cooking" button
- [ ] Post-cooking
  - Rate recipe
  - Add notes
  - Share photo

---

## Day 24-25: Premium & RevenueCat

### ✅ Day 24 Morning
- [ ] RevenueCat setup
  - Create account
  - Add app
  - Create products (Pro Monthly, Pro Yearly)
  - Setup entitlements
- [ ] Install react-native-purchases
  - Configure for iOS/Android
  - Test connection

### ✅ Day 24 Afternoon
- [ ] Paywall modal design
  - Feature comparison table
  - Pricing display
  - CTA buttons
- [ ] Trigger paywall at:
  - Limit reached
  - Premium feature tap
  - Profile "Upgrade" button

### ✅ Day 25 Morning
- [ ] Purchase flow
  - Select plan
  - Complete purchase
  - Update Supabase
  - Unlock features
- [ ] Restore purchases

### ✅ Day 25 Afternoon
- [ ] Premium features gating
  - Check entitlement before action
  - Show upgrade prompt
  - Graceful degradation
- [ ] Subscription management
  - View current plan
  - Cancel subscription info
  - Billing history (link to store)

---

## Day 26-27: Polish & Demo

### ✅ Day 26 Morning
- [ ] App icon design
- [ ] Splash screen
- [ ] App name & branding
- [ ] Color scheme finalization
- [ ] Typography consistency

### ✅ Day 26 Afternoon
- [ ] Animations & micro-interactions
  - Page transitions
  - Button feedback
  - List animations
  - Success celebrations
- [ ] Dark mode (if time allows)

### ✅ Day 27 Morning
- [ ] Demo preparation
  - Script the demo flow
  - Prepare demo videos
  - Add sample recipes
  - Create test user account
- [ ] Screen recording setup

### ✅ Day 27 Afternoon
- [ ] Record demo video (2-3 min)
  - Show URL → Recipe
  - Show Fridge Scan → Suggestions
  - Show Cooking Mode
  - Show Premium features
- [ ] Video editing & polish

---

## Day 28: Final Testing & Submission

### ✅ Day 28 Morning
- [ ] Full app testing
  - Test all user flows
  - Test on iOS & Android
  - Test edge cases
  - Fix critical bugs
- [ ] Performance check
  - App size
  - Load times
  - Memory usage

### ✅ Day 28 Afternoon
- [ ] Submission preparation
  - App store screenshots
  - App description
  - Privacy policy
  - Terms of service
- [ ] Final build
  - Remove console.logs
  - Production build
  - Test build on device
- [ ] Submit to app stores
- [ ] Submit competition entry
  - Demo video
  - Documentation
  - Source code (if required)

---

## 🎯 Success Metrics

### MVP Must-Haves (for competition)
- ✅ YouTube URL → Recipe extraction
- ✅ Fridge scan → Recipe suggestions
- ✅ Shopping list generation
- ✅ Cooking mode with timers
- ✅ Free/Premium tiers
- ✅ RevenueCat integration
- ✅ Clean, professional UI

### Nice-to-Haves (if time allows)
- 🔄 Voice control
- 🔄 Dark mode
- 🔄 Recipe sharing
- 🔄 Meal planner
- 🔄 Advanced filtering

### Demo Requirements
- ✅ 2-3 minute video
- ✅ Shows core features
- ✅ Clear value proposition
- ✅ Shows monetization
- ✅ Professional presentation

---

## 🚨 Risk Mitigation

### High Risk Areas
1. **AI Response Time**: Pre-cache responses, show progress
2. **Camera Issues**: Test on multiple devices early
3. **RevenueCat Integration**: Start testing by Week 3
4. **Transcript Availability**: Have manual input fallback

### Daily Checkpoints
- End of each day: commit code, test on device
- If behind schedule: cut nice-to-have features
- If ahead: add polish and animations

### Backup Plans
- No transcript? → Manual paste option
- Camera issues? → Gallery upload only for MVP
- AI slow? → Show "This may take a minute" message

---

## 📱 Testing Devices
- **iOS**: iPhone 12 or newer (iOS 15+)
- **Android**: Pixel 4 or newer (Android 11+)
- **Test on both platforms weekly**

---

## 🎬 Demo Script (Final)

### Opening (15 sec)
"Ever saved a recipe and never cooked it? We solve that."

### Core Features (90 sec)
1. Paste YouTube URL → Instant recipe (30s)
2. Scan fridge → Get suggestions (30s)
3. Cook with voice control (30s)

### Business (15 sec)
"Free to start, Premium unlocks unlimited."

### Closing (10 sec)
"From saved video to dinner on the table."

---

**Good Luck! 🚀 Let's build this! 💪**
