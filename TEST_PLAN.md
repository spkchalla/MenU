# MenU Project - Test Plan & Execution

## Test Execution Date: 2026-01-01

---

## ✅ Pre-Test Setup Verification

### Backend
- [x] All dependencies installed (including jsonwebtoken)
- [x] Environment variables configured
  - [x] MONGO_URI
  - [x] GOOGLE_API_KEY
  - [x] JWT_SECRET
  - [x] PORT
- [x] Server running on port 5000
- [x] MongoDB connection successful

### Frontend
- [x] All dependencies installed
- [x] Environment variables configured
  - [x] VITE_API_BASE_URL
- [x] Development server running on port 5173

---

## 🧪 Test Cases

### 1. Backend API Tests

#### 1.1 Health Check
**Endpoint:** `GET /api/menu/todayMenu`
**Expected:** 200 OK with today's menu data
**Status:** ✅ PASSED
**Response:**
```json
{
  "message": "Successfully fetched today's menu",
  "menu": {
    "date": "2026-01-01",
    "day": "Thursday",
    "breakfast": {...},
    "lunch": {...},
    "snacks": {...},
    "dinner": {...}
  }
}
```

#### 1.2 Current Meal Endpoint
**Endpoint:** `GET /api/menu/currentMeal`
**Expected:** 200 OK with current meal based on time
**Status:** ⏳ PENDING

#### 1.3 Other Meals Endpoint
**Endpoint:** `GET /api/menu/otherMeals`
**Expected:** 200 OK with other meals for today
**Status:** ⏳ PENDING

#### 1.4 Specific Day Menu
**Endpoint:** `GET /api/menu/dayOfPresentWeek/:day`
**Expected:** 200 OK with specific day's menu
**Status:** ⏳ PENDING

#### 1.5 Specific Date Menu
**Endpoint:** `GET /api/menu/specificDay/:date`
**Expected:** 200 OK with specific date's menu
**Status:** ⏳ PENDING

#### 1.6 User Registration
**Endpoint:** `POST /api/user/registerUser`
**Expected:** 201 Created with success message
**Status:** ⏳ PENDING

#### 1.7 User Login
**Endpoint:** `POST /api/user/login`
**Expected:** 200 OK with JWT token
**Status:** ⏳ PENDING

#### 1.8 Admin Protected Routes
**Endpoint:** `GET /api/menu/allMenus` (requires admin auth)
**Expected:** 401/403 without token, 200 with valid admin token
**Status:** ⏳ PENDING

---

### 2. Frontend Tests

#### 2.1 Application Load
**Test:** Open http://localhost:5173/
**Expected:** App loads without console errors
**Status:** ⏳ PENDING

#### 2.2 Menu Page Display
**Test:** Menu page shows current meal and other meals
**Expected:** Data fetched from API and displayed correctly
**Status:** ⏳ PENDING

#### 2.3 Day Selection
**Test:** Click on different day buttons
**Expected:** Menu updates to show selected day's menu
**Status:** ⏳ PENDING

#### 2.4 Date Picker
**Test:** Select a date from calendar
**Expected:** Menu updates to show selected date's menu
**Status:** ⏳ PENDING

#### 2.5 Login Flow
**Test:** Navigate to /login and submit credentials
**Expected:** JWT token stored in localStorage, redirect to home
**Status:** ⏳ PENDING

#### 2.6 Registration Flow
**Test:** Navigate to /register and create account
**Expected:** User created, redirect to login
**Status:** ⏳ PENDING

#### 2.7 Admin Dashboard Access
**Test:** Login as admin and access /admin/dashboard
**Expected:** Dashboard loads with admin controls
**Status:** ⏳ PENDING

#### 2.8 Theme Toggle
**Test:** Click theme toggle button
**Expected:** Theme switches between light and dark
**Status:** ⏳ PENDING

---

### 3. Integration Tests

#### 3.1 End-to-End User Flow
**Steps:**
1. Register new user
2. Login with credentials
3. View today's menu
4. Select different days
5. Use date picker
6. Logout

**Expected:** All steps complete without errors
**Status:** ⏳ PENDING

#### 3.2 End-to-End Admin Flow
**Steps:**
1. Login as admin
2. Access admin dashboard
3. Create new weekly menu
4. Update existing menu
5. Delete menu
6. Approve admin requests

**Expected:** All admin operations complete successfully
**Status:** ⏳ PENDING

---

## 🐛 Known Issues

### Fixed Issues
1. ✅ Missing jsonwebtoken dependency - FIXED
2. ✅ Empty deleteWeeklyMenu.js file - FIXED
3. ✅ Frontend .env not configured - FIXED

### Remaining Issues
1. ⚠️ Empty Menu.jsx in components folder (unused duplicate)
   - **Impact:** None (not imported anywhere)
   - **Recommendation:** Delete file
   
2. ⚠️ Empty api folder in frontend/src
   - **Impact:** None (axiosInstance is in utils folder)
   - **Recommendation:** Delete folder or move axiosInstance here

---

## 📊 Test Results Summary

**Total Tests Planned:** 18
**Tests Passed:** 1
**Tests Failed:** 0
**Tests Pending:** 17

**Backend Status:** ✅ Running (Port 5000)
**Frontend Status:** ✅ Running (Port 5173)
**Database Status:** ✅ Connected

---

## 🔍 Manual Testing Instructions

### Testing Backend Endpoints

```bash
# Test current meal
curl http://localhost:5000/api/menu/currentMeal

# Test other meals
curl http://localhost:5000/api/menu/otherMeals

# Test specific day (e.g., Monday)
curl http://localhost:5000/api/menu/dayOfPresentWeek/Monday

# Test specific date
curl http://localhost:5000/api/menu/specificDay/2026-01-01

# Test user registration
curl -X POST http://localhost:5000/api/user/registerUser \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test user login
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Testing Frontend

1. Open browser to http://localhost:5173/
2. Check browser console for errors
3. Test navigation between pages
4. Test login/registration forms
5. Test menu display and interactions
6. Test theme toggle
7. Test admin features (if admin account exists)

---

## 🚀 Next Steps

1. Run all pending backend API tests
2. Run all pending frontend tests
3. Perform integration testing
4. Fix any issues discovered
5. Document any additional bugs found
6. Consider adding automated test suite (Jest/Vitest)

---

## 📝 Notes

- Server is using nodemon for auto-restart on changes
- Frontend is using Vite HMR for instant updates
- All critical dependencies are now installed
- Environment variables are properly configured
- Database connection is stable
