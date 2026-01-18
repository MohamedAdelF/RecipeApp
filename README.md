# Recipe App

Transform saved cooking videos into actual meals with AI-powered recipe extraction.

## Features

- **Video to Recipe** - Paste YouTube/TikTok/Instagram URL, AI extracts ingredients & steps
- **Fridge Scan** - Take a photo, get recipe ideas based on what you have
- **Smart Shopping Lists** - Auto-generate from recipes, grouped by section
- **Cooking Mode** - Step-by-step guidance with timers

## Tech Stack

- **Frontend**: React Native (Expo SDK 52), TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini 1.5 Pro
- **Payments**: RevenueCat

## Setup

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env

# Start dev server
npm start
```

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key
EXPO_PUBLIC_TRANSCRIPT_API_URL=your-transcript-api
```

## Project Structure

```
app/           # Expo Router screens
components/    # React components
services/      # API services (AI, Supabase, YouTube)
stores/        # Zustand state management
utils/         # Types & utilities
```

## License

MIT
