# FlawSkin - Admin Development Guide

This guide is designed for the admin development team building the Admin Portal (admin dashboard) for the **LasarFlawSkin** project.

The application uses a **Hybrid Authentication Strategy** integrating both **Node.js/MongoDB** and **Firebase**.

## Architecture Overview

1. **Authentication:** 
   - Handled primarily by Node.js/MongoDB in the existing backend (`/api/auth`).
   - Logging in natively provides a Node.js JWT for standard API authentication and automatically generates a **Custom Firebase Token**.
   - The frontend automatically signs into Firebase (`signInWithCustomToken()`) using the generated token.
   - **Important for Admins:** Your admin portal should use this exact same flow. Authenticate via your existing `/api/admin/login` (if it exists) to retrieve both a JWT and a Firebase token, unlocking both the backend APIs and Firestore access.

2. **Core Database:**
   - **MongoDB** is used strictly for storing critical user credentials (emails, password hashes, `resetPasswordTokens`, and `roles` like "user" vs "admin").
   - **Firebase Firestore** is the primary dynamic database for all application features (Profiles, Bookings, Carts, Forms, Services).

---

## Firebase Firestore Database Structure

The Admin team will need to read, update, and manage the following Firestore collections:

### 1. `Auth` Collection (User Profiles)
When a user registers via the Node.js API, their profile details are simultaneously synced to the `Auth` collection in Firestore using their MongoDB User `_id` as the document ID.
- **Document ID:** `{userId}` (e.g. `64a7ef9f...`)
- **Fields:**
  - `fullName` (string)
  - `email` (string)
  - `phone` (string)
  - `gender` (string)
  - `age` (string)
  - `image` (string url)
  - `note` (string) - Personal note left for consultants
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### 2. `users` Collection (Sub-collections)
We maintain user-specific interactive data (carts & addresses) in sub-collections underneath a generic `users` collection to keep it strictly isolated by the user's ID.
- **Document ID:** `{userId}` (Same as the `Auth` document ID)
- **Sub-collections:**
  1. `cart`: `users/{userId}/cart`
     - Stores items a user is currently about to purchase.
  2. `addresses`: `users/{userId}/addresses`
     - Stores saved home locations / clinic addresses selected by the user.

### 3. `bookings` Collection
Centralized collection of all treatment bookings made through the app.
- **Document ID:** Auto-generated ID
- **Fields:**
  - `userId` (string) - Links to `Auth` profile
  - `items` (array) - Array of treatments requested
  - `location` (object) - Address where the treatment is happening
  - `totalAmount` (number)
  - `status` (string) - e.g., "pending", "confirmed", "completed", "cancelled"
  - `date`, `time` (strings)
  - `createdAt` (timestamp)

### 4. `feedback` Collection
Stores reviews/feedback submitted by customers about treatments or clinic experiences.
- **Document ID:** Auto-generated ID
- **Fields:**
  - `userId` (string)
  - `rating` (number)
  - `comment` (string)
  - `createdAt` (timestamp)

### 5. `contactRequests` Collection
Submissions from the "Get In Touch" (Contact) form on the app.
- **Document ID:** Auto-generated ID
- **Fields:**
  - `full_name` (string)
  - `email` (string)
  - `message` (string)
  - `createdAt` (timestamp)

### 6. `callbackRequests` Collection
Submissions when a user specifically clicks "Request a Callback" from their profile dashboard.
- **Document ID:** Auto-generated ID
- **Fields:**
  - `userId` (string)
  - `userName` (string)
  - `phone` (string)
  - `reason` (string) - e.g., "Booking Issue", "Payment Issue"
  - `timeWindow` (string) - Preferred call time
  - `status` (string) - Typically "pending" (can be updated by the admin to "contacted")
  - `createdAt` (timestamp)

### 7. `available_slots` Collection
System configuration representing days and time slots the clinic is open for booking.
- **Document ID:** Specific Date strings in `YYYY-MM-DD` format (e.g. `2026-03-24`)
- **Fields:**
  - `date` (string)
  - `slots` (array of objects)
    - `time` (string)
    - `isAvailable` (boolean)

---

## Admin Portal Integration Requirements

**1. Analytics & Dashboards**
The admin dashboard should immediately monitor the `bookings`, `contactRequests`, and `callbackRequests` collections.

**2. State Management (Status Lifecycle)**
Admins should be able to alter the `status` field on `bookings` (e.g., from 'pending' to 'confirmed') and update the `status` on `callbackRequests` (from 'pending' to 'resolved').
 
**3. Availability Configuration**
Admins need an interface to manage the `available_slots` collection, setting days/times as `isAvailable: false` when the clinic is fully booked or closed, preventing frontend users from booking overlapping treatments.

**4. Data Fetching Priority**
When displaying profile details for a booking, the admin frontend should cross-reference the `userId` in the booking with the `Auth` collection to pull their full name, phone number, and gender in real-time.

## Important Note regarding Node/Firebase setup
To run Firebase operations natively in your backend services, ensure the `firebaseServiceKey.json` belongs to the correct `lasarflawskin` project, which holds all this data. The frontend connects using standard API keys defined in `VITE_FIREBASE_API_KEY`, etc.
