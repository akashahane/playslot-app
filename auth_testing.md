# Auth Testing Playbook for Playslot

## IMPORTANT - Read this file when testing authentication

### Step 1: Create Test User & Session
```bash
mongosh --eval "
use('playslot_db');
var visitorId = 'user_' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: visitorId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  role: 'customer',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: visitorId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + visitorId);
"
```

### Step 2: Test Backend API
```bash
# Test auth endpoint
curl -X GET "http://localhost:8001/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Test venues endpoint
curl -X GET "http://localhost:8001/api/venues/search" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Step 3: Test Login Flow
1. Click "Login with Google" button
2. Should redirect to Emergent Auth
3. After Google auth, should redirect back to app
4. Session should be created and user logged in
5. Should see home screen with venues

### MongoDB ID Handling
- Use custom `user_id` field (not MongoDB's `_id`)
- Always exclude `_id` from queries: `{"_id": 0}`
- Reference users via `user_id` in all collections

### Success Indicators
- /api/auth/me returns user data
- Home screen loads with venues
- Booking flow works
- Profile shows user info

### Failure Indicators
- "User not found" errors
- 401 Unauthorized
- Redirect loops
- Session not persisting
