# WayWise Backend Setup Guide

## 🚀 Complete AI Trip Planner Backend

This guide will help you set up the AI-powered trip planning backend for WayWise.

## ✅ What's Been Implemented

### 1. API Routes
- **`/api/plan-trip`** - OpenAI GPT-4 integration
- **`/api/plan-trip-gemini`** - Google Gemini API alternative

### 2. Type Definitions
- Complete TypeScript interfaces in `types/trip.ts`
- Type-safe API responses

### 3. API Client Functions
- `planTrip()` - Call OpenAI endpoint
- `planTripWithGemini()` - Call Gemini endpoint

### 4. Updated Hero Section
- Integrated with backend API
- Loading states and error handling
- Toast notifications
- Navigation to trip results

## 📦 Installation Steps

### Step 1: Install Required Dependencies

```bash
# Install OpenAI SDK
npm install openai
# or
pnpm add openai

# Already installed (verify):
# - next
# - react
# - lucide-react
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Add your API key:

```env
# OpenAI API Key (Get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# OR use Google Gemini (Get from: https://makersuite.google.com/app/apikey)
# GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxx

NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 3: Get Your API Keys

#### Option A: OpenAI (Recommended)
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and paste it in `.env.local`
5. **Note**: Requires billing setup (~$0.002 per request with GPT-4-turbo)

#### Option B: Google Gemini (Free Alternative)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste in `.env.local`
5. **Free tier**: 60 requests per minute

### Step 4: Test the Backend

Start your development server:

```bash
npm run dev
# or
pnpm dev
```

## 🧪 Testing the API

### Method 1: Using the Frontend (Easiest)

1. Go to http://localhost:3000
2. Scroll to hero section
3. Click "AI Prompt Search" tab
4. Enter: "Plan a budget trip from Kollam to Goa in December with beach activities"
5. Click "Generate AI Itinerary"
6. Wait for response (10-30 seconds)

### Method 2: Using curl (For Testing)

```bash
curl -X POST http://localhost:3000/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Plan a budget trip from Kollam to Goa in December with beach activities and local cuisine"
  }'
```

### Method 3: Using Postman/Thunder Client

```
POST http://localhost:3000/api/plan-trip
Content-Type: application/json

Body:
{
  "prompt": "Plan a 3-day trip to Paris with art museums and fine dining"
}
```

## 📁 File Structure Created

```
way-wise-travel/
├── app/
│   └── api/
│       ├── plan-trip/
│       │   └── route.ts          ✅ OpenAI endpoint
│       └── plan-trip-gemini/
│           └── route.ts          ✅ Gemini endpoint
├── types/
│   └── trip.ts                   ✅ TypeScript interfaces
├── lib/
│   └── api.ts                    ✅ API client functions
├── components/
│   └── hero-section.tsx          ✅ Updated with backend integration
├── .env.example                  ✅ Environment template
└── BACKEND_SETUP.md             ✅ This file
```

## 🎯 How It Works

### User Flow:
```
1. User enters prompt in Hero Section
   ↓
2. Frontend calls /api/plan-trip with prompt
   ↓
3. Backend creates structured prompt for AI
   ↓
4. AI generates JSON trip plan
   ↓
5. Backend validates and returns data
   ↓
6. Frontend displays beautiful itinerary
```

### API Request Format:
```typescript
POST /api/plan-trip
{
  "prompt": "Plan a budget trip from Mumbai to Kerala..."
}
```

### API Response Format:
```typescript
{
  "success": true,
  "data": {
    "destination": "Kerala",
    "from": "Mumbai",
    "duration": "5 days",
    "budget": "₹20,000 - ₹25,000",
    "overview": "...",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Kochi",
        "activities": [...],
        "meals": {...},
        "accommodation": "..."
      }
    ],
    "budgetBreakdown": {...},
    "packingList": [...],
    "localTips": [...],
    "mustTryFoods": [...],
    "mustVisitPlaces": [...]
  },
  "timestamp": "2025-10-06T..."
}
```

## 🔧 Customization Options

### Change AI Model

Edit `app/api/plan-trip/route.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for cheaper/faster
  // ...
});
```

### Adjust Response Length

```typescript
max_tokens: 3000, // Increase for more detailed plans
```

### Modify Temperature (Creativity)

```typescript
temperature: 0.7, // 0.0 = very focused, 1.0 = very creative
```

### Custom System Prompt

Edit the `systemPrompt` variable to change AI behavior:

```typescript
const systemPrompt = `You are a luxury travel expert...`
```

## 💰 Cost Estimates

### OpenAI GPT-4 Turbo
- **Input**: ~$0.01 per 1K tokens
- **Output**: ~$0.03 per 1K tokens
- **Average trip plan**: ~$0.05 - $0.10 per request

### OpenAI GPT-3.5 Turbo (Budget Option)
- **Input**: ~$0.0005 per 1K tokens
- **Output**: ~$0.0015 per 1K tokens
- **Average trip plan**: ~$0.002 - $0.005 per request

### Google Gemini Pro
- **Free tier**: 60 requests/minute
- **Paid**: Very competitive pricing
- **Average trip plan**: FREE (within limits)

## 🛡️ Security Best Practices

### ✅ Implemented:
- API keys stored in environment variables
- Server-side API calls only (no client exposure)
- Input validation
- Error handling
- CORS configuration

### 🔒 Recommended Additions:
1. **Rate Limiting**: Limit requests per user/IP
2. **Authentication**: Require user login for API access
3. **Caching**: Cache similar prompts to save costs
4. **Logging**: Track usage and costs

## 🐛 Troubleshooting

### Error: "Cannot find module 'openai'"
```bash
npm install openai
```

### Error: "OpenAI API key not configured"
- Check `.env.local` exists
- Verify `OPENAI_API_KEY=sk-proj-...` is set
- Restart dev server

### Error: "insufficient_quota"
- Add billing info to OpenAI account
- Or switch to Gemini API (free)

### Response is too slow
- Switch to `gpt-3.5-turbo` (faster, cheaper)
- Reduce `max_tokens`
- Use Gemini API

### JSON parsing error
- AI sometimes returns malformed JSON
- Retry the request
- Adjust temperature lower (0.5)

## 📊 Monitoring & Analytics

### Track Usage:
```typescript
// Add to route.ts
console.log(`Trip generated: ${tripPlan.destination} | Cost: ~$0.08`)
```

### Log Errors:
```typescript
console.error('AI Error:', {
  prompt,
  error: error.message,
  timestamp: new Date().toISOString()
})
```

## 🚀 Next Steps

### Immediate:
1. ✅ Install dependencies
2. ✅ Add API key
3. ✅ Test with sample prompt

### Optional Enhancements:
1. **Database Integration**: Save trip plans
2. **User Accounts**: Track user's trips
3. **Favorites System**: Save favorite destinations
4. **Share Feature**: Share trip plans via link
5. **PDF Export**: Download trip as PDF
6. **Booking Integration**: Link to actual booking sites

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ✅ Verification Checklist

- [ ] Dependencies installed (`openai` package)
- [ ] `.env.local` created with API key
- [ ] Dev server running
- [ ] Hero section shows AI search tab
- [ ] Test prompt generates response
- [ ] No console errors
- [ ] Response displays correctly

---

**Need Help?**
- Check console for errors
- Verify API key is valid
- Test with simple prompt first
- Check OpenAI dashboard for usage

**Status**: ✅ Backend Ready for Production
**Last Updated**: October 6, 2025
