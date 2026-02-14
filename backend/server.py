from fastapi import FastAPI, APIRouter, HTTPException, Query, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Helper function for ObjectId
def str_to_objectid(id_str: str):
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")


# Define Models
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "customer"  # 'customer' or 'owner'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    role: str = "customer"

class SessionDataResponse(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    session_token: str

class Venue(BaseModel):
    name: str
    description: str
    location: str
    address: str
    owner_id: str
    categories: List[str]
    amenities: List[str]
    price_per_hour: float
    images: List[str] = []
    rating: float = 0.0
    total_reviews: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VenueCreate(BaseModel):
    name: str
    description: str
    location: str
    address: str
    owner_id: str
    categories: List[str]
    amenities: List[str]
    price_per_hour: float
    images: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Slot(BaseModel):
    venue_id: str
    booking_date: str
    start_time: str
    end_time: str
    status: str = "available"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SlotCreate(BaseModel):
    venue_id: str
    booking_date: str
    start_time: str
    end_time: str

class Booking(BaseModel):
    user_id: str
    venue_id: str
    venue_name: str
    booking_date: str
    start_time: str
    end_time: str
    phone_number: str
    total_price: float
    status: str = "pending"
    payment_status: str = "pending"
    payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    user_id: str
    venue_id: str
    booking_date: str
    start_time: str
    end_time: str
    phone_number: str

class Review(BaseModel):
    user_id: str
    venue_id: str
    rating: float
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    user_id: str
    venue_id: str
    rating: float
    comment: str


# Authentication Helper
async def get_current_user(request: Request) -> Optional[User]:
    # Check cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    # Find session
    session = await db.user_sessions.find_one(
        {"session_token": session_token}, 
        {"_id": 0}
    )
    
    if not session:
        return None
    
    # Check expiry (normalize timezone if needed)
    expires_at = session["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at <= datetime.now(timezone.utc):
        return None
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session["user_id"]}, 
        {"_id": 0}
    )
    
    if user_doc:
        return User(**user_doc)
    return None


# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = pwd_context.hash(user_data.password)
    
    # Create user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    await db.users.insert_one({
        "user_id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hashed_password,
        "picture": None,
        "role": user_data.role,
        "created_at": datetime.now(timezone.utc)
    })
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
    return SessionDataResponse(**user, session_token=session_token)


@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not pwd_context.verify(credentials.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    await db.user_sessions.insert_one({
        "user_id": user["user_id"],
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    user_data = {k: v for k, v in user.items() if k != "password"}
    return SessionDataResponse(**user_data, session_token=session_token)


@api_router.post("/auth/google/callback")
async def google_callback(session_id: str, response: Response):
    # Exchange session_id for session data
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session ID")
        
        user_data = auth_response.json()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
    
    if not existing_user:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "role": "customer",
            "created_at": datetime.now(timezone.utc)
        })
    else:
        user_id = existing_user["user_id"]
    
    # Create session
    session_token = user_data["session_token"]
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
    return SessionDataResponse(**user, session_token=session_token)


@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}


# Venue Routes
@api_router.post("/venues", status_code=201)
async def create_venue(venue: VenueCreate):
    venue_dict = venue.dict()
    venue_dict['created_at'] = datetime.now(timezone.utc)
    venue_dict['rating'] = 0.0
    venue_dict['total_reviews'] = 0
    result = await db.venues.insert_one(venue_dict)
    venue_dict['_id'] = str(result.inserted_id)
    return venue_dict

@api_router.get("/venues/search")
async def search_venues(
    category: Optional[str] = None,
    location: Optional[str] = None,
    search_date: Optional[str] = None
):
    query = {}
    if category:
        query['categories'] = category
    if location:
        query['location'] = {"$regex": location, "$options": "i"}
    
    venues = await db.venues.find(query).to_list(100)
    for venue in venues:
        venue['_id'] = str(venue['_id'])
    return venues

@api_router.get("/venues/{venue_id}")
async def get_venue(venue_id: str):
    venue = await db.venues.find_one({"_id": str_to_objectid(venue_id)})
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    venue['_id'] = str(venue['_id'])
    return venue

@api_router.put("/venues/{venue_id}")
async def update_venue(venue_id: str, venue: VenueCreate):
    result = await db.venues.update_one(
        {"_id": str_to_objectid(venue_id)},
        {"$set": venue.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Venue not found")
    return {"message": "Venue updated successfully"}

@api_router.get("/venues/owner/{owner_id}")
async def get_owner_venues(owner_id: str):
    venues = await db.venues.find({"owner_id": owner_id}).to_list(100)
    for venue in venues:
        venue['_id'] = str(venue['_id'])
    return venues


# Slot Routes
@api_router.post("/slots", status_code=201)
async def create_slot(slot: SlotCreate):
    slot_dict = slot.dict()
    slot_dict['status'] = 'available'
    slot_dict['created_at'] = datetime.now(timezone.utc)
    result = await db.slots.insert_one(slot_dict)
    slot_dict['_id'] = str(result.inserted_id)
    return slot_dict

@api_router.get("/slots/available/{venue_id}")
async def get_available_slots(venue_id: str, search_date: str):
    slots = await db.slots.find({
        "venue_id": venue_id,
        "booking_date": search_date,
        "status": "available"
    }).to_list(100)
    for slot in slots:
        slot['_id'] = str(slot['_id'])
    return slots

@api_router.put("/slots/{slot_id}/status")
async def update_slot_status(slot_id: str, status: str):
    result = await db.slots.update_one(
        {"_id": str_to_objectid(slot_id)},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Slot not found")
    return {"message": "Slot status updated"}


# Booking Routes
@api_router.post("/bookings", status_code=201)
async def create_booking(booking: BookingCreate):
    # Get venue details
    venue = await db.venues.find_one({"_id": str_to_objectid(booking.venue_id)})
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    # Calculate total price
    start = datetime.strptime(booking.start_time, "%H:%M")
    end = datetime.strptime(booking.end_time, "%H:%M")
    hours = (end - start).seconds / 3600
    total_price = hours * venue['price_per_hour']
    
    booking_dict = booking.dict()
    booking_dict['venue_name'] = venue['name']
    booking_dict['total_price'] = total_price
    booking_dict['status'] = 'pending'
    booking_dict['payment_status'] = 'pending'
    booking_dict['created_at'] = datetime.now(timezone.utc)
    
    result = await db.bookings.insert_one(booking_dict)
    booking_dict['_id'] = str(result.inserted_id)
    return booking_dict

@api_router.get("/bookings/user/{user_id}")
async def get_user_bookings(user_id: str, status: str = "upcoming"):
    query = {"user_id": user_id}
    
    if status == "upcoming":
        query['status'] = {"$in": ["pending", "confirmed"]}
    else:
        query['status'] = {"$in": ["cancelled", "completed"]}
    
    bookings = await db.bookings.find(query).sort("booking_date", -1).to_list(100)
    for booking in bookings:
        booking['_id'] = str(booking['_id'])
    return bookings

@api_router.get("/bookings/venue/{venue_id}")
async def get_venue_bookings(venue_id: str):
    bookings = await db.bookings.find({"venue_id": venue_id}).sort("booking_date", -1).to_list(100)
    for booking in bookings:
        booking['_id'] = str(booking['_id'])
    return bookings

@api_router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str):
    result = await db.bookings.update_one(
        {"_id": str_to_objectid(booking_id)},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking status updated"}

@api_router.put("/bookings/{booking_id}/payment")
async def update_payment_status(booking_id: str, payment_status: str, payment_id: str):
    result = await db.bookings.update_one(
        {"_id": str_to_objectid(booking_id)},
        {"$set": {
            "payment_status": payment_status,
            "payment_id": payment_id,
            "status": "confirmed" if payment_status == "completed" else "pending"
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Payment status updated"}


# Review Routes
@api_router.post("/reviews", status_code=201)
async def create_review(review: ReviewCreate):
    review_dict = review.dict()
    review_dict['created_at'] = datetime.now(timezone.utc)
    result = await db.reviews.insert_one(review_dict)
    
    # Update venue rating
    reviews = await db.reviews.find({"venue_id": review.venue_id}).to_list(1000)
    avg_rating = sum([r['rating'] for r in reviews]) / len(reviews)
    await db.venues.update_one(
        {"_id": str_to_objectid(review.venue_id)},
        {"$set": {"rating": avg_rating, "total_reviews": len(reviews)}}
    )
    
    review_dict['_id'] = str(result.inserted_id)
    return review_dict

@api_router.get("/reviews/venue/{venue_id}")
async def get_venue_reviews(venue_id: str):
    reviews = await db.reviews.find({"venue_id": venue_id}).sort("created_at", -1).to_list(100)
    for review in reviews:
        review['_id'] = str(review['_id'])
    return reviews


@api_router.get("/")
async def root():
    return {"message": "Playslot API - Ready to serve!"}


# Register the router
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
