# Playslot Project - Analysis & Running Status

## 📊 Project Overview

**Playslot** is a full-stack venue booking application that allows users to discover and book sports venues, gaming cafes, and other recreational spaces.

### Technology Stack

**Backend:**
- FastAPI (Python web framework)
- MongoDB (Database)
- Motor (Async MongoDB driver)
- Uvicorn (ASGI server)
- Passlib + Bcrypt (Password hashing)
- Pydantic (Data validation)

**Frontend:**
- React Native (Expo)
- Expo Router (File-based routing)
- TypeScript
- React Native Reanimated (Animations)
- Axios (HTTP client)
- AsyncStorage (Local storage)
- Bottom Sheet, Calendars, Gesture Handler

## ✅ Project Status: RUNNING

### Backend Server
- **Status:** ✅ Running
- **URL:** http://localhost:8001
- **API Endpoint:** http://localhost:8001/api/
- **Database:** MongoDB (localhost:27017)
- **Database Name:** playslot_db
- **Seeded Data:** 6 venues across Bangalore, Mumbai, and Delhi

### Frontend Server
- **Status:** ✅ Running
- **Platform:** Web (Expo)
- **Build:** Complete (1620 modules bundled)
- **Access:** Check your terminal for the local URL (typically http://localhost:8081)

## 🏗️ Project Architecture

### Backend Structure
```
backend/
├── server.py          # Main FastAPI application
├── seed_data.py       # Database seeding script
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

### Frontend Structure
```
frontend/
├── app/
│   ├── (auth)/       # Authentication screens (login, register)
│   ├── (tabs)/       # Main app tabs (home, bookings, profile)
│   ├── venue/        # Venue detail screens
│   ├── booking/      # Booking confirmation
│   ├── _layout.tsx   # Root layout with providers
│   └── index.tsx     # Entry point with auth routing
├── context/
│   ├── AuthContext.tsx   # Authentication state management
│   └── ThemeContext.tsx  # Theme (light/dark mode) management
├── constants/
│   └── theme.ts      # Color scheme and design tokens
└── package.json
```

## 🎨 Design System

### Color Scheme
The app features a modern grayscale palette with teal accent:

**Light Mode:**
- Background: #f8f9fa (Bright Snow)
- Cards: #FFFFFF (White)
- Primary: #4EC0D6 (Teal - from logo)
- Text: #212529 (Carbon Black)

**Dark Mode:**
- Background: #212529 (Carbon Black)
- Cards: #495057 (Iron Grey)
- Primary: #4EC0D6 (Teal - preserved)
- Text: #f8f9fa (Bright Snow)

### Features
- ✅ Light/Dark theme toggle
- ✅ Smooth animations with Reanimated
- ✅ Bottom sheet modals
- ✅ Calendar date picker
- ✅ Responsive design

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Venues
- `GET /api/venues/search` - Search venues (with filters)
- `GET /api/venues/{venue_id}` - Get venue details
- `POST /api/venues` - Create venue (owner)
- `PUT /api/venues/{venue_id}` - Update venue
- `GET /api/venues/owner/{owner_id}` - Get owner's venues

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{user_id}` - Get user bookings
- `GET /api/bookings/venue/{venue_id}` - Get venue bookings
- `PUT /api/bookings/{booking_id}/status` - Update booking status
- `PUT /api/bookings/{booking_id}/payment` - Update payment status

### Slots
- `POST /api/slots` - Create time slot
- `GET /api/slots/available/{venue_id}` - Get available slots
- `PUT /api/slots/{slot_id}/status` - Update slot status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/venue/{venue_id}` - Get venue reviews

## 🗄️ Database Schema

### Collections
1. **users** - User accounts (customer/owner roles)
2. **user_sessions** - Active user sessions
3. **venues** - Venue listings with details
4. **bookings** - Booking records
5. **slots** - Available time slots
6. **reviews** - User reviews for venues

### Sample Venues (Seeded)
1. Champions Football Arena (Bangalore) - ₹1500/hour
2. Cricket Valley (Bangalore) - ₹800/hour
3. GameZone Pro (Bangalore) - ₹300/hour
4. Sports Hub Multi-Arena (Mumbai) - ₹2000/hour
5. Elite Gaming Lounge (Mumbai) - ₹400/hour
6. Victory Football Turf (Delhi) - ₹1800/hour

## 🔧 Configuration Files

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=playslot_db
```

### Frontend (.env)
```
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

## 🚀 How to Run (Already Running!)

Both servers are currently running in the background:

### Backend
```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
npx expo start --web
```

## 🧪 Testing

A comprehensive test suite is available in `backend_test.py` that tests:
- All venue endpoints
- Booking creation and management
- Slot availability
- Review system
- Error handling

Run tests:
```bash
python backend_test.py
```

## 📝 Recent Updates

Based on the documentation files:

1. **Branding Update** - Logo integration and teal color scheme
2. **Color Scheme Update** - Grayscale palette with teal accent
3. **Theme System** - Light/Dark mode implementation
4. **Authentication** - Google OAuth integration ready

## ⚠️ Notes

1. **Dependencies:** All backend dependencies installed successfully
2. **Frontend:** Installed with `--legacy-peer-deps` due to React version conflicts
3. **MongoDB:** Running locally without authentication (development mode)
4. **Security Warnings:** MongoDB access control should be enabled for production

## 🎯 Next Steps (Optional)

1. Open the frontend URL in your browser
2. Test the authentication flow
3. Browse venues and create bookings
4. Toggle between light/dark themes
5. Test the booking flow end-to-end

## 📱 App Features

### For Customers
- Browse venues by category (Football, Cricket, Gaming, Other)
- Search by location and date
- View venue details, amenities, and reviews
- Book time slots
- Manage bookings
- Leave reviews

### For Venue Owners
- List venues with details
- Manage availability slots
- View and manage bookings
- Track revenue

## 🔐 Authentication

Currently supports:
- Email/Password registration and login
- Google OAuth (configured)
- Session-based authentication with cookies
- Role-based access (customer/owner)

---

**Status:** ✅ All systems operational
**Last Updated:** February 22, 2026
