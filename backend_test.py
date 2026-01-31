#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Playslot Application
Tests all venue, booking, slot, and review endpoints
"""

import requests
import json
from datetime import datetime, date, timedelta
import sys
import time

# Configuration
BASE_URL = "https://sportspot-12.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class PlayslotAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = {
            "venues": {"passed": 0, "failed": 0, "errors": []},
            "bookings": {"passed": 0, "failed": 0, "errors": []},
            "slots": {"passed": 0, "failed": 0, "errors": []},
            "reviews": {"passed": 0, "failed": 0, "errors": []}
        }
        self.venue_id = None
        self.booking_id = None
        self.slot_id = None
        
    def log_result(self, category, test_name, success, message="", response=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if response and not success:
            print(f"   Response: {response.status_code} - {response.text[:200]}")
        
        if success:
            self.test_results[category]["passed"] += 1
        else:
            self.test_results[category]["failed"] += 1
            self.test_results[category]["errors"].append(f"{test_name}: {message}")
        print()

    def test_venue_endpoints(self):
        """Test all venue-related endpoints"""
        print("🏟️  TESTING VENUE ENDPOINTS")
        print("=" * 50)
        
        # Test 1: Search venues (should return seeded data)
        try:
            response = requests.get(f"{self.base_url}/venues/search")
            if response.status_code == 200:
                venues = response.json()
                if len(venues) > 0:
                    self.venue_id = venues[0]["_id"]  # Store for later tests
                    self.log_result("venues", "GET /venues/search", True, 
                                  f"Found {len(venues)} venues")
                else:
                    self.log_result("venues", "GET /venues/search", False, 
                                  "No venues found in database")
            else:
                self.log_result("venues", "GET /venues/search", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("venues", "GET /venues/search", False, f"Exception: {str(e)}")

        # Test 2: Search with filters
        try:
            response = requests.get(f"{self.base_url}/venues/search?category=football")
            if response.status_code == 200:
                venues = response.json()
                self.log_result("venues", "GET /venues/search?category=football", True, 
                              f"Found {len(venues)} football venues")
            else:
                self.log_result("venues", "GET /venues/search?category=football", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("venues", "GET /venues/search?category=football", False, f"Exception: {str(e)}")

        # Test 3: Get specific venue (if we have venue_id)
        if self.venue_id:
            try:
                response = requests.get(f"{self.base_url}/venues/{self.venue_id}")
                if response.status_code == 200:
                    venue = response.json()
                    self.log_result("venues", f"GET /venues/{self.venue_id}", True, 
                                  f"Retrieved venue: {venue.get('name', 'Unknown')}")
                else:
                    self.log_result("venues", f"GET /venues/{self.venue_id}", False, 
                                  f"Status: {response.status_code}", response)
            except Exception as e:
                self.log_result("venues", f"GET /venues/{self.venue_id}", False, f"Exception: {str(e)}")

        # Test 4: Create new venue
        try:
            new_venue = {
                "name": "Test Sports Arena",
                "description": "A test venue for automated testing",
                "location": "Mumbai",
                "address": "Test Address, Mumbai, Maharashtra",
                "owner_id": "test_owner_123",
                "categories": ["football", "cricket"],
                "amenities": ["parking", "restroom", "cafeteria"],
                "price_per_hour": 500.0,
                "images": [],
                "latitude": 19.0760,
                "longitude": 72.8777
            }
            
            response = requests.post(f"{self.base_url}/venues", 
                                   json=new_venue, headers=self.headers)
            if response.status_code == 201:
                created_venue = response.json()
                self.log_result("venues", "POST /venues", True, 
                              f"Created venue with ID: {created_venue.get('_id')}")
            else:
                self.log_result("venues", "POST /venues", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("venues", "POST /venues", False, f"Exception: {str(e)}")

        # Test 5: Get venues by owner
        try:
            response = requests.get(f"{self.base_url}/venues/owner/test_owner_123")
            if response.status_code == 200:
                owner_venues = response.json()
                self.log_result("venues", "GET /venues/owner/{owner_id}", True, 
                              f"Found {len(owner_venues)} venues for owner")
            else:
                self.log_result("venues", "GET /venues/owner/{owner_id}", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("venues", "GET /venues/owner/{owner_id}", False, f"Exception: {str(e)}")

    def test_booking_endpoints(self):
        """Test all booking-related endpoints"""
        print("📅 TESTING BOOKING ENDPOINTS")
        print("=" * 50)
        
        if not self.venue_id:
            print("❌ Skipping booking tests - no venue_id available")
            return

        # Test 1: Create booking
        try:
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            new_booking = {
                "user_id": "test_user_456",
                "venue_id": self.venue_id,
                "date": tomorrow,
                "start_time": "10:00",
                "end_time": "12:00"
            }
            
            response = requests.post(f"{self.base_url}/bookings", 
                                   json=new_booking, headers=self.headers)
            if response.status_code == 201:
                booking = response.json()
                self.booking_id = booking.get("_id")
                total_price = booking.get("total_price", 0)
                self.log_result("bookings", "POST /bookings", True, 
                              f"Created booking with ID: {self.booking_id}, Price: ₹{total_price}")
            else:
                self.log_result("bookings", "POST /bookings", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("bookings", "POST /bookings", False, f"Exception: {str(e)}")

        # Test 2: Get user bookings (upcoming)
        try:
            response = requests.get(f"{self.base_url}/bookings/user/test_user_456?status=upcoming")
            if response.status_code == 200:
                bookings = response.json()
                self.log_result("bookings", "GET /bookings/user/{user_id}?status=upcoming", True, 
                              f"Found {len(bookings)} upcoming bookings")
            else:
                self.log_result("bookings", "GET /bookings/user/{user_id}?status=upcoming", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("bookings", "GET /bookings/user/{user_id}?status=upcoming", False, f"Exception: {str(e)}")

        # Test 3: Get venue bookings
        try:
            response = requests.get(f"{self.base_url}/bookings/venue/{self.venue_id}")
            if response.status_code == 200:
                venue_bookings = response.json()
                self.log_result("bookings", "GET /bookings/venue/{venue_id}", True, 
                              f"Found {len(venue_bookings)} bookings for venue")
            else:
                self.log_result("bookings", "GET /bookings/venue/{venue_id}", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("bookings", "GET /bookings/venue/{venue_id}", False, f"Exception: {str(e)}")

        # Test 4: Update booking status (if we have booking_id)
        if self.booking_id:
            try:
                response = requests.put(f"{self.base_url}/bookings/{self.booking_id}/status?status=confirmed")
                if response.status_code == 200:
                    self.log_result("bookings", "PUT /bookings/{booking_id}/status", True, 
                                  "Successfully updated booking status to confirmed")
                else:
                    self.log_result("bookings", "PUT /bookings/{booking_id}/status", False, 
                                  f"Status: {response.status_code}", response)
            except Exception as e:
                self.log_result("bookings", "PUT /bookings/{booking_id}/status", False, f"Exception: {str(e)}")

        # Test 5: Update payment status (if we have booking_id)
        if self.booking_id:
            try:
                response = requests.put(f"{self.base_url}/bookings/{self.booking_id}/payment?payment_status=completed&payment_id=pay_test_123")
                if response.status_code == 200:
                    self.log_result("bookings", "PUT /bookings/{booking_id}/payment", True, 
                                  "Successfully updated payment status to completed")
                else:
                    self.log_result("bookings", "PUT /bookings/{booking_id}/payment", False, 
                                  f"Status: {response.status_code}", response)
            except Exception as e:
                self.log_result("bookings", "PUT /bookings/{booking_id}/payment", False, f"Exception: {str(e)}")

    def test_slot_endpoints(self):
        """Test all slot-related endpoints"""
        print("🕐 TESTING SLOT ENDPOINTS")
        print("=" * 50)
        
        if not self.venue_id:
            print("❌ Skipping slot tests - no venue_id available")
            return

        # Test 1: Create slot
        try:
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            new_slot = {
                "venue_id": self.venue_id,
                "date": tomorrow,
                "start_time": "14:00",
                "end_time": "15:00"
            }
            
            response = requests.post(f"{self.base_url}/slots", 
                                   json=new_slot, headers=self.headers)
            if response.status_code == 201:
                slot = response.json()
                self.slot_id = slot.get("_id")
                self.log_result("slots", "POST /slots", True, 
                              f"Created slot with ID: {self.slot_id}")
            else:
                self.log_result("slots", "POST /slots", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("slots", "POST /slots", False, f"Exception: {str(e)}")

        # Test 2: Get available slots
        try:
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            response = requests.get(f"{self.base_url}/slots/available/{self.venue_id}?date={tomorrow}")
            if response.status_code == 200:
                slots = response.json()
                self.log_result("slots", "GET /slots/available/{venue_id}?date=YYYY-MM-DD", True, 
                              f"Found {len(slots)} available slots")
            else:
                self.log_result("slots", "GET /slots/available/{venue_id}?date=YYYY-MM-DD", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("slots", "GET /slots/available/{venue_id}?date=YYYY-MM-DD", False, f"Exception: {str(e)}")

        # Test 3: Update slot status (if we have slot_id)
        if self.slot_id:
            try:
                response = requests.put(f"{self.base_url}/slots/{self.slot_id}/status?status=booked")
                if response.status_code == 200:
                    self.log_result("slots", "PUT /slots/{slot_id}/status", True, 
                                  "Successfully updated slot status to booked")
                else:
                    self.log_result("slots", "PUT /slots/{slot_id}/status", False, 
                                  f"Status: {response.status_code}", response)
            except Exception as e:
                self.log_result("slots", "PUT /slots/{slot_id}/status", False, f"Exception: {str(e)}")

    def test_review_endpoints(self):
        """Test all review-related endpoints"""
        print("⭐ TESTING REVIEW ENDPOINTS")
        print("=" * 50)
        
        if not self.venue_id:
            print("❌ Skipping review tests - no venue_id available")
            return

        # Test 1: Create review
        try:
            new_review = {
                "user_id": "test_user_456",
                "venue_id": self.venue_id,
                "rating": 4.5,
                "comment": "Great venue! Clean facilities and good location."
            }
            
            response = requests.post(f"{self.base_url}/reviews", 
                                   json=new_review, headers=self.headers)
            if response.status_code == 201:
                review = response.json()
                self.log_result("reviews", "POST /reviews", True, 
                              f"Created review with ID: {review.get('_id')}")
            else:
                self.log_result("reviews", "POST /reviews", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("reviews", "POST /reviews", False, f"Exception: {str(e)}")

        # Test 2: Get venue reviews
        try:
            response = requests.get(f"{self.base_url}/reviews/venue/{self.venue_id}")
            if response.status_code == 200:
                reviews = response.json()
                self.log_result("reviews", "GET /reviews/venue/{venue_id}", True, 
                              f"Found {len(reviews)} reviews for venue")
            else:
                self.log_result("reviews", "GET /reviews/venue/{venue_id}", False, 
                              f"Status: {response.status_code}", response)
        except Exception as e:
            self.log_result("reviews", "GET /reviews/venue/{venue_id}", False, f"Exception: {str(e)}")

    def test_error_handling(self):
        """Test error handling with invalid data"""
        print("🚫 TESTING ERROR HANDLING")
        print("=" * 50)
        
        # Test invalid venue ID
        try:
            response = requests.get(f"{self.base_url}/venues/invalid_id_123")
            if response.status_code == 400:
                self.log_result("venues", "GET /venues/invalid_id (Error Handling)", True, 
                              "Correctly returned 400 for invalid ID format")
            else:
                self.log_result("venues", "GET /venues/invalid_id (Error Handling)", False, 
                              f"Expected 400, got {response.status_code}", response)
        except Exception as e:
            self.log_result("venues", "GET /venues/invalid_id (Error Handling)", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 STARTING PLAYSLOT API TESTS")
        print("=" * 60)
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API connectivity first
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                print("✅ API is accessible")
                print()
            else:
                print(f"❌ API connectivity issue: {response.status_code}")
                return
        except Exception as e:
            print(f"❌ Cannot connect to API: {str(e)}")
            return
        
        # Run test suites
        self.test_venue_endpoints()
        self.test_booking_endpoints()
        self.test_slot_endpoints()
        self.test_review_endpoints()
        self.test_error_handling()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.test_results.items():
            passed = results["passed"]
            failed = results["failed"]
            total_passed += passed
            total_failed += failed
            
            status = "✅" if failed == 0 else "❌"
            print(f"{status} {category.upper()}: {passed} passed, {failed} failed")
            
            if results["errors"]:
                for error in results["errors"]:
                    print(f"   - {error}")
        
        print("=" * 60)
        overall_status = "✅ ALL TESTS PASSED" if total_failed == 0 else f"❌ {total_failed} TESTS FAILED"
        print(f"{overall_status} ({total_passed} passed, {total_failed} failed)")
        print("=" * 60)

if __name__ == "__main__":
    tester = PlayslotAPITester()
    tester.run_all_tests()