from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date, time
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Helper function for ObjectId
def str_to_objectid(id_str: str):
    try:
        return ObjectId(id_str)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")


# Define Models
class User(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str
    role: str  # 'customer' or 'owner'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Venue(BaseModel):
    name: str
    description: str
    location: str
    address: str
    owner_id: str
    categories: List[str]  # ['football', 'cricket', 'gaming']
    amenities: List[str]
    price_per_hour: float
    images: List[str] = []  # base64 encoded images
    rating: float = 0.0
    total_reviews: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

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
    date: str  # YYYY-MM-DD
    start_time: str  # HH:MM
    end_time: str  # HH:MM
    status: str = "available"  # 'available', 'booked', 'blocked'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SlotCreate(BaseModel):
    venue_id: str
    date: str
    start_time: str
    end_time: str

class Booking(BaseModel):
    user_id: str
    venue_id: str
    venue_name: str
    date: str
    start_time: str
    end_time: str
    total_price: float
    status: str = "pending"  # 'pending', 'confirmed', 'cancelled'
    payment_status: str = "pending"  # 'pending', 'completed', 'failed'
    payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    user_id: str
    venue_id: str
    date: str
    start_time: str
    end_time: str

class Review(BaseModel):
    user_id: str
    venue_id: str
    rating: float
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReviewCreate(BaseModel):
    user_id: str
    venue_id: str
    rating: float
    comment: str


# Venue Routes
@api_router.post("/venues", status_code=201)
async def create_venue(venue: VenueCreate):
    venue_dict = venue.dict()
    venue_dict['created_at'] = datetime.utcnow()
    venue_dict['rating'] = 0.0
    venue_dict['total_reviews'] = 0
    result = await db.venues.insert_one(venue_dict)
    venue_dict['_id'] = str(result.inserted_id)
    return venue_dict

@api_router.get("/venues/search")
async def search_venues(
    category: Optional[str] = None,
    location: Optional[str] = None,
    date: Optional[str] = None
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
    slot_dict['created_at'] = datetime.utcnow()
    result = await db.slots.insert_one(slot_dict)
    slot_dict['_id'] = str(result.inserted_id)
    return slot_dict

@api_router.get("/slots/available/{venue_id}")
async def get_available_slots(venue_id: str, date: str):
    slots = await db.slots.find({
        "venue_id": venue_id,
        "date": date,
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
    
    # Calculate total price (simplified - can be enhanced)
    start = datetime.strptime(booking.start_time, "%H:%M")
    end = datetime.strptime(booking.end_time, "%H:%M")
    hours = (end - start).seconds / 3600
    total_price = hours * venue['price_per_hour']
    
    booking_dict = booking.dict()
    booking_dict['venue_name'] = venue['name']
    booking_dict['total_price'] = total_price
    booking_dict['status'] = 'pending'
    booking_dict['payment_status'] = 'pending'
    booking_dict['created_at'] = datetime.utcnow()
    
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
    
    bookings = await db.bookings.find(query).sort("date", -1).to_list(100)
    for booking in bookings:
        booking['_id'] = str(booking['_id'])
    return bookings

@api_router.get("/bookings/venue/{venue_id}")
async def get_venue_bookings(venue_id: str):
    bookings = await db.bookings.find({"venue_id": venue_id}).sort("date", -1).to_list(100)
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
    review_dict['created_at'] = datetime.utcnow()
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


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Playslot API - Ready to serve!"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
