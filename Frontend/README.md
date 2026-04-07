# LaserRedux - Premium Skincare Booking System

Welcome to the **LaserRedux** frontend repository. This application is a high-performance, real-time booking and e-commerce platform built for the LasarFlawSkin Clinic, providing a premium experience for various skin treatments and laser services.

---

## 🛠️ Recent Technical Accomplishments (Audit & Optimization)

A comprehensive technical audit and stabilization phase was completed in **March 2026** to resolve critical technical bugs and improve the overall application resilience.

### 1. Navigation & Routing Stability
- **Route Standardization**: Unified all application routes in `App.jsx` to consistent lowercase paths (e.g., `/cart`, `/select-slots`). This eliminates broken links caused by case-sensitivity issues across different operating systems and browsers.
- **ProtectedRoute Hardening**: Robust redirection logic ensures users are redirected back to their intended page (like the checkout or booking dashboard) after a successful login.
- **Navigation Guard**: Eliminated broken links in the Navbar profile dropdown, ensuring smooth access to **Profile Settings** and **Dashboards**.

### 2. Real-Time Synchronization & Auth
- **Multi-Tab Session Sync**: Implemented a `storage` listener in the `Navbar` to ensure login/logout states sync instantly across all open browser windows, preventing "zombie sessions" where a user appears logged in on one tab after logging out in another.
- **Real-Time Slots**: The booking system now correctly identifies and disables past time slots for the current day, preventing invalid bookings.
- **Cart-to-Account Merging**: Guest carts are automatically merged with user accounts upon sign-in, maintaining data continuity.

### 3. Data Integrity & Firebase Integration
- **Client-Side Data Hydration**: Resolved "disappearing bookings" bugs by switching to client-side sorting for Firestore queries. This eliminates the need for manual "Composite Index" configuration while maintaining reliable data presentation.
- **Bulletproof Parsing**: Hardened the service and price parsing logic (especially in `WomenService.jsx`) to handle both numeric and string values from the database, preventing runtime crashes.
- **Atomic Booking Workflows**: Rescheduling a booking now correctly releases the old slot while reserving the new one simultaneously in Firestore.

### 4. Security & Error Handling
- **Password Recovery Guard**: Enhanced the `ForgotPassword` and `ResetPassword` flows with strict validation. Attempts to reset passwords without valid tokens are now blocked with user-friendly error messages.
- **Global Toast System**: Integrated `sonner` notifications globally for consistent, professional feedback during all critical transactions (Add to Cart, Booking, Payment, Profile Updates).

---

## 🚀 Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management**: [Context API](https://react.dev/learn/passing-data-deeply-with-context) (Cart & Auth)
- **Database/Auth**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Cloud Functions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Lucide-React
- **API**: Axios for backend integration

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, Footer, Modals)
├── context/        # React Context providers (Cart, Auth states)
├── firebase/       # Service wrappers for Firestore collection operations
├── pages/          # Full page components (Home, Booking, Checkout, etc.)
├── styles/         # Global and component-specific CSS
└── utils/          # Helper functions and session management logic (Auth, Profile)
```

---

## 🚦 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Ensure you have the latest `.env` file with proper Firebase and Backend API keys.
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Deployment Note
When adding new routes, always use **lowercase** paths to maintain compatibility with the established navigation architecture. Any new Firebase queries that require complex sorting should prioritize client-side sorting unless at extreme scale to avoid indexing overhead.

---

© 2026 LasarFlawSkin - All Rights Reserved.
