# 🚀 Playslot - Quick Start Guide

## Current Status: ✅ RUNNING

Both backend and frontend servers are currently running!

## 🌐 Access URLs

### Backend API
- **Base URL:** http://localhost:8001
- **API Root:** http://localhost:8001/api/
- **Health Check:** http://localhost:8001/api/ (returns "Playslot API - Ready to serve!")

### Frontend Web App
- Check your terminal output for the Expo web URL
- Typically: **http://localhost:8081** or similar
- Look for the message in the frontend terminal

## 🎮 Quick Test

### 1. Test Backend API
Open your browser or use curl:
```bash
curl http://localhost:8001/api/venues/search
```

You should see 6 seeded venues.

### 2. Test Frontend
1. Open the Expo web URL in your browser
2. You'll see a loading screen, then be redirected to login
3. Try registering a new account or logging in

## 📊 Database

### View Data in MongoDB
```bash
mongosh
use playslot_db
db.venues.find().pretty()
db.users.find().pretty()
```

### Reseed Database (if needed)
```bash
cd backend
python seed_data.py
```

## 🛑 Stop Servers

If you need to stop the servers, they're running in background processes:
- Backend: Terminal ID 2
- Frontend: Terminal ID 3

## 🔄 Restart Servers

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

## 🧪 Run Tests

```bash
python backend_test.py
```

## 📱 Test on Mobile

### iOS Simulator
```bash
cd frontend
npx expo start --ios
```

### Android Emulator
```bash
cd frontend
npx expo start --android
```

## 🎨 Features to Test

1. **Authentication**
   - Register new user
   - Login with credentials
   - View profile

2. **Venue Discovery**
   - Browse all venues
   - Filter by category (Football, Cricket, Gaming)
   - Search by location
   - Filter by date

3. **Booking Flow**
   - Select a venue
   - Choose date and time slot
   - Complete booking
   - View in "My Bookings"

4. **Theme Toggle**
   - Go to Profile tab
   - Toggle between Light/Dark mode
   - See theme persist across app

5. **Reviews**
   - View venue reviews
   - Leave a review after booking

## 🐛 Troubleshooting

### Backend Issues
- Check MongoDB is running: `mongosh --version`
- Check backend logs in Terminal ID 2
- Verify .env file exists in backend/

### Frontend Issues
- Clear Metro cache: `cd frontend && npx expo start -c`
- Check .env file exists in frontend/
- Verify backend URL in .env matches running backend

### Database Issues
- Start MongoDB: `mongod` (if not running)
- Reseed data: `cd backend && python seed_data.py`

## 📚 API Documentation

### Example Requests

**Get All Venues:**
```bash
curl http://localhost:8001/api/venues/search
```

**Search Football Venues:**
```bash
curl "http://localhost:8001/api/venues/search?category=football"
```

**Search by Location:**
```bash
curl "http://localhost:8001/api/venues/search?location=Bangalore"
```

**Register User:**
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "customer"
  }'
```

## 🎯 Default Test Data

### Venues
- 6 venues across 3 cities (Bangalore, Mumbai, Delhi)
- Categories: Football, Cricket, Gaming
- Price range: ₹300 - ₹2000 per hour

### Users
- No default users (create via registration)
- Roles: customer, owner

## 💡 Tips

1. **Use the web version** for fastest development
2. **Check browser console** for frontend logs
3. **Monitor backend terminal** for API requests
4. **Use MongoDB Compass** for visual database management
5. **Test dark mode** - it looks great!

## 🔗 Useful Links

- Backend Code: `backend/server.py`
- Frontend Entry: `frontend/app/index.tsx`
- Theme Config: `frontend/constants/theme.ts`
- Auth Context: `frontend/context/AuthContext.tsx`

---

**Everything is ready to go! Start exploring the app.** 🎉
