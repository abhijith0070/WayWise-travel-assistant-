# Quick Start Guide - Route Search Feature

## 🎯 Two Ways to Plan Your Travel

### Option 1: AI Trip Planner (Complete Itinerary)
**When to use:** You want a full trip plan with daily activities, meals, budget breakdown

**How to access:**
1. Click "Plan My Trip" in navbar, OR
2. Go to Services → Route Planning → "AI Trip Planner" button

**What you get:**
- Complete day-by-day itinerary
- Activity recommendations
- Meal suggestions
- Budget breakdown
- Packing list
- Local tips

**Loading message:** "Generating Your Trip Plan" ✨

---

### Option 2: Manual Route Search (Quick Transport Lookup)
**When to use:** You just need to find transport options between two cities

**How to access:**
1. Go to Services → Route Planning → "Search Routes" button, OR
2. Navigate directly to `/search-routes`

**What you get:**
- List of available buses, trains, flights, car rentals
- Prices, duration, departure times
- Operator names
- Amenities (WiFi, AC, meals, etc.)

**Loading message:** "Searching Available Routes..." 🔍

---

## 📍 Quick Access

### From Homepage:
```
Services (navbar) → Route Planning → Choose:
  ├─ AI Trip Planner      (Full AI itinerary)
  └─ Search Routes        (Quick transport search)
```

### From Anywhere:
- **Navbar:** "Plan My Trip" → AI Trip Planner
- **Direct URL:** `/search-routes` → Manual Route Search

---

## 🎨 Visual Difference

### AI Trip Planner Page (`/plan-trip`)
```
┌─────────────────────────────────────┐
│   AI Trip Planner                   │
│   --------------------------------   │
│                                     │
│   [Textarea: Describe your trip]    │
│                                     │
│   [Generate Trip Plan] 🌟           │
│                                     │
│   Loading: "Generating Your Trip    │
│             Plan" + AI icon         │
└─────────────────────────────────────┘
```

### Manual Route Search Page (`/search-routes`)
```
┌─────────────────────────────────────┐
│   Search Transport Routes           │
│   --------------------------------   │
│                                     │
│   From: [____]  To: [____]          │
│   Mode: [Dropdown: All/Bus/Train]   │
│                                     │
│   [Search Routes] 🔍                │
│                                     │
│   Loading: "Searching Available     │
│             Routes..."              │
│                                     │
│   Results: [Route Cards]            │
└─────────────────────────────────────┘
```

---

## 🚀 Try It Now!

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test AI Trip Planner:**
   - Navigate to: http://localhost:3000/plan-trip
   - Enter: "Plan a weekend trip from Mumbai to Goa"
   - Click "Generate Trip Plan"
   - See: "Generating Your Trip Plan" loading message

3. **Test Manual Route Search:**
   - Navigate to: http://localhost:3000/search-routes
   - From: "Kochi", To: "Trivandrum", Mode: "Bus"
   - Click "Search Routes"
   - See: "Searching Available Routes..." loading message

---

## 💡 Pro Tips

1. **Choose wisely:**
   - Need complete trip plan? → Use AI Trip Planner
   - Just need transport? → Use Route Search

2. **Combine features:**
   - Search routes first to check availability
   - Then use AI planner for complete itinerary

3. **Database routes:**
   - Current database has 20+ routes
   - Covers: Kerala (Kochi, Trivandrum, Kollam)
   - Also: Mumbai-Pune, Bangalore routes

4. **No confusion:**
   - Each page has distinct loading messages
   - You always know which feature you're using
