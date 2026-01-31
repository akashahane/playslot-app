import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_venues():
    # Clear existing data
    await db.venues.delete_many({})
    
    # Sample venues
    venues = [
        {
            "name": "Champions Football Arena",
            "description": "Premium 5-a-side and 7-a-side football turf with floodlights. Perfect for evening matches with friends or tournaments.",
            "location": "Bangalore",
            "address": "123 MG Road, Bangalore, Karnataka 560001",
            "owner_id": "owner1",
            "categories": ["football"],
            "amenities": ["Floodlights", "Parking", "Washroom", "Changing Room", "Water"],
            "price_per_hour": 1500,
            "images": [],
            "rating": 4.5,
            "total_reviews": 120
        },
        {
            "name": "Cricket Valley",
            "description": "Professional cricket practice nets with bowling machine. Great for practice sessions and coaching.",
            "location": "Bangalore",
            "address": "456 Indiranagar, Bangalore, Karnataka 560038",
            "owner_id": "owner1",
            "categories": ["cricket"],
            "amenities": ["Bowling Machine", "Nets", "Parking", "Washroom", "Seating Area"],
            "price_per_hour": 800,
            "images": [],
            "rating": 4.3,
            "total_reviews": 85
        },
        {
            "name": "GameZone Pro",
            "description": "Premium gaming cafe with PS5 consoles and high-end gaming PCs. Comfortable gaming chairs and AC environment.",
            "location": "Bangalore",
            "address": "789 Koramangala, Bangalore, Karnataka 560034",
            "owner_id": "owner2",
            "categories": ["gaming"],
            "amenities": ["PS5", "Gaming PC", "AC", "High-Speed Internet", "Snacks & Drinks"],
            "price_per_hour": 300,
            "images": [],
            "rating": 4.7,
            "total_reviews": 200
        },
        {
            "name": "Sports Hub Multi-Arena",
            "description": "Multi-sport venue with football, cricket, and badminton facilities. Perfect for all sports enthusiasts.",
            "location": "Mumbai",
            "address": "321 Bandra West, Mumbai, Maharashtra 400050",
            "owner_id": "owner2",
            "categories": ["football", "cricket", "other"],
            "amenities": ["Multi-Sport", "Floodlights", "Parking", "Washroom", "Cafeteria"],
            "price_per_hour": 2000,
            "images": [],
            "rating": 4.6,
            "total_reviews": 150
        },
        {
            "name": "Elite Gaming Lounge",
            "description": "Luxury gaming experience with latest games, comfortable seating, and tournament hosting capabilities.",
            "location": "Mumbai",
            "address": "654 Andheri, Mumbai, Maharashtra 400053",
            "owner_id": "owner3",
            "categories": ["gaming"],
            "amenities": ["PS5", "Gaming PC", "AC", "Tournament Setup", "Food & Beverages"],
            "price_per_hour": 400,
            "images": [],
            "rating": 4.8,
            "total_reviews": 175
        },
        {
            "name": "Victory Football Turf",
            "description": "Well-maintained artificial turf for football enthusiasts. Available for 5v5 and 7v7 formats.",
            "location": "Delhi",
            "address": "987 Connaught Place, Delhi 110001",
            "owner_id": "owner3",
            "categories": ["football"],
            "amenities": ["Artificial Turf", "Floodlights", "Parking", "Washroom", "First Aid"],
            "price_per_hour": 1800,
            "images": [],
            "rating": 4.4,
            "total_reviews": 95
        }
    ]
    
    result = await db.venues.insert_many(venues)
    print(f"Inserted {len(result.inserted_ids)} venues")
    
    for venue_id in result.inserted_ids:
        print(f"Venue ID: {venue_id}")

async def main():
    print("Starting data seeding...")
    await seed_venues()
    print("Data seeding completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
