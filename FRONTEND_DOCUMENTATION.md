# Frontend Architecture & Documentation

## Overview

The Welfare Scheme Portal frontend is a modern React + Vite application with premium UI/UX, role-based routing, real-time notifications, and comprehensive state management.

---

## Technology Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with custom interceptors
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Form Validation**: Custom hooks

---

## Project Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
│
├── public/
│   └── assets/
│
└── src/
    ├── main.jsx                    # App entry point
    ├── App.jsx                     # Main app component
    ├── App.css
    │
    ├── api/
    │   └── axios.js               # HTTP client setup
    │
    ├── assets/
    │   ├── images/
    │   └── icons/
    │
    ├── components/
    │   ├── common/
    │   │   ├── Footer.jsx
    │   │   └── PageHeader.jsx
    │   │
    │   ├── dashboard/
    │   │   ├── QuickActionCard.jsx
    │   │   ├── SectionCard.jsx
    │   │   └── StatCard.jsx
    │   │
    │   └── ui/
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       ├── Input.jsx
    │       └── Loader.jsx
    │
    ├── constants/
    │   ├── colors.js
    │   └── routes.js
    │
    ├── features/
    │   ├── admin/
    │   │   ├── api/
    │   │   │   └── admin-analytics.api.js
    │   │   │
    │   │   └── pages/
    │   │       ├── AdminDashboardPage.jsx
    │   │       ├── AdminReportsPage.jsx
    │   │       ├── AdminStaffPage.jsx
    │   │       └── AnalyticsDashboardPage.jsx
    │   │
    │   ├── auth/
    │   │   ├── api/
    │   │   ├── components/
    │   │   └── pages/
    │   │
    │   ├── citizen/
    │   │   ├── api/
    │   │   ├── pages/
    │   │   │   ├── CitizenDashboardPage.jsx
    │   │   │   ├── ProfilePage.jsx
    │   │   │   └── SettingsPage.jsx
    │   │   └── components/
    │   │
    │   ├── dashboard/
    │   │   ├── api/
    │   │   │   └── dashboard.api.js
    │   │   └── pages/
    │   │
    │   ├── landing/
    │   │   └── pages/
    │   │       └── LandingPage.jsx
    │   │
    │   ├── notifications/
    │   │   ├── api/
    │   │   │   └── notifications.api.js
    │   │   └── pages/
    │   │       └── NotificationsPage.jsx
    │   │
    │   ├── officer/
    │   │   ├── api/
    │   │   └── pages/
    │   │       ├── OfficerDashboardPage.jsx
    │   │       ├── OfficerQueuePage.jsx
    │   │       └── OfficerReviewPage.jsx
    │   │
    │   ├── payments/
    │   │   ├── api/
    │   │   │   └── payments.api.js
    │   │   └── pages/
    │   │       └── PaymentManagementPage.jsx
    │   │
    │   ├── schemes/
    │   │   ├── api/
    │   │   │   ├── schemes.api.js
    │   │   │   ├── applications.api.js
    │   │   │   └── eligibility.api.js
    │   │   ├── components/
    │   │   ├── constants/
    │   │   └── pages/
    │   │       ├── BrowseSchemesPage.jsx
    │   │       ├── SchemeDetailsPage.jsx
    │   │       ├── ApplySchemePage.jsx
    │   │       ├── ApplicationTrackingPage.jsx
    │   │       └── MyApplicationsPage.jsx
    │   │
    │   └── verification/
    │       ├── api/
    │       │   └── verification.api.js
    │       └── pages/
    │           └── VerificationQueuePage.jsx
    │
    ├── hooks/
    │   └── useNotifications.js
    │
    ├── layouts/
    │   ├── AuthLayout.jsx
    │   ├── DashboardLayout/
    │   │   ├── DashboardLayout.jsx
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── MobileSidebar.jsx
    │   └── index.js
    │
    ├── routes/
    │   ├── AppRoutes.jsx           # All route definitions
    │   ├── ProtectedRoute.jsx      # Auth protection
    │   └── RoleRoute.jsx           # Role-based protection
    │
    ├── utils/
    │   └── storage.js              # LocalStorage management
    │
    └── index.css                   # Global styles
```

---

## Architecture Layers

### 1. API Layer (`src/api/` & `src/features/*/api/`)

**Purpose**: Handle all HTTP communication

**Structure**:
```javascript
// axios.js - Base client setup
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Feature-specific API clients**:
```javascript
// features/payments/api/payments.api.js
export const getPaymentsApi = async () => {
  return await api.get("/payments");
};

export const releasePaymentApi = async (applicationId) => {
  return await api.post(`/payments/release/${applicationId}`);
};

export const getPaymentsAnalyticsApi = async () => {
  return await api.get("/payments/analytics");
};
```

---

### 2. Pages/Components Layer

**Purpose**: Render UI and manage component state

**Citizen Dashboard Example**:
```javascript
function CitizenDashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const response = await getCitizenDashboardApi();
      setStats(response.data.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard">
      {/* Premium UI with animations and charts */}
    </div>
  );
}
```

---

### 3. Hooks Layer (`src/hooks/`)

**Purpose**: Reusable logic for components

**Notifications Hook Example**:
```javascript
export default function useNotifications(pollInterval = 30000) {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    fetchNotifications(); // Initial load
    const timer = setInterval(fetchNotifications, pollInterval);
    return () => clearInterval(timer);
  }, []);
  
  const markAsRead = async (id) => {
    await markNotificationReadApi(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };
  
  return {
    notifications,
    markAsRead,
    unreadCount: notifications.filter((n) => !n.read).length
  };
}
```

---

### 4. Routing Layer (`src/routes/`)

**Purpose**: Define application routes and protection

**Protected Route**:
```javascript
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Usage
<Route
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  {/* Protected routes */}
</Route>
```

**Role-Based Route**:
```javascript
function RoleRoute({ allowedRoles, children }) {
  const user = getUser();
  
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Usage
<Route
  element={
    <RoleRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </RoleRoute>
  }
/>
```

---

## Key Features

### 1. Authentication Flow

```
1. User enters credentials
   ↓
2. Login API call
   ↓
3. Server returns access + refresh tokens
   ↓
4. Store tokens in localStorage
   ↓
5. Redirect to dashboard
   ↓
6. All requests include JWT in header
```

### 2. Role-Based Access Control

**Citizen**:
- Browse schemes
- Apply for schemes
- Track applications
- View profile

**Officer**:
- Review applications
- Verify documents
- Approve/Reject
- View analytics

**Admin**:
- Full system access
- Manage schemes
- Manage users
- Payment management
- System analytics

### 3. Real-time Notifications

```javascript
// useNotifications hook
const useNotifications = (pollInterval = 30000) => {
  useEffect(() => {
    // Poll backend every 30 seconds
    const timer = setInterval(async () => {
      const response = await getNotificationsApi();
      setNotifications(response.data.data);
    }, pollInterval);
    
    return () => clearInterval(timer);
  }, []);
};

// Header component uses the hook
const { notifications, unreadCount } = useNotifications();
// Displays notification badge and dropdown
```

---

## API Endpoints Used

### Dashboard APIs
```javascript
// Citizen
GET /dashboard/citizen
GET /dashboard/application-status-chart

// Officer
GET /dashboard/officer
GET /dashboard/application-status-chart

// Admin
GET /dashboard/admin
GET /dashboard/analytics
GET /dashboard/monthly-applications-chart
GET /dashboard/scheme-wise-applications
```

### Application APIs
```javascript
POST /applications                    // Create
GET /applications                     // My applications
GET /applications/{id}                // Details
GET /admin/applications              // All (Admin)
GET /admin/applications/statistics   // Stats (Admin)
```

### Verification APIs
```javascript
GET /verifications/pending           // Pending list (Officer)
GET /verifications/field-verified    // Approved for payment (Admin)
PATCH /verifications/{id}/approve    // Approve
PATCH /verifications/{id}/reject     // Reject
```

### Payment APIs
```javascript
GET /payments                         // All payments (Admin)
GET /payments/{id}                    // Details
POST /payments/release/{appId}        // Release payment
GET /payments/analytics              // Analytics
```

### Notification APIs
```javascript
GET /notifications/my-notifications  // Get all
GET /notifications/unread-count      // Count
PATCH /notifications/{id}/read       // Mark read
PATCH /notifications/mark-all-read  // Mark all
DELETE /notifications/{id}           // Delete one
DELETE /notifications                // Delete all
```

---

## Premium UI Components

### 1. Dark Theme with Gradients
```javascript
<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  {/* Dark theme with blue accents */}
</div>
```

### 2. Animated Cards
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

### 3. Rich Charts
```javascript
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
    <XAxis dataKey="name" stroke="#94a3b8" />
    <YAxis stroke="#94a3b8" />
    <Tooltip />
    <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### 4. Toast Notifications
```javascript
toast.success("Operation successful");
toast.error("An error occurred");
toast.loading("Processing...");
```

---

## State Management Pattern

**Local Component State** for UI state:
```javascript
const [loading, setLoading] = useState(false);
const [activeTab, setActiveTab] = useState("overview");
```

**LocalStorage** for persistent data:
```javascript
localStorage.setItem("accessToken", token);
localStorage.setItem("user", JSON.stringify(user));
```

**URL State** for navigation:
```javascript
useParams();  // Get route params
useNavigate(); // Navigate between pages
```

---

## Performance Optimizations

### 1. Component Memoization
```javascript
const StatCard = memo(({ icon: Icon, value, label }) => (
  // Component that doesn't re-render unless props change
));
```

### 2. Lazy Loading
```javascript
const AdminDashboard = lazy(() => import("./AdminDashboard"));

<Suspense fallback={<Loader />}>
  <AdminDashboard />
</Suspense>
```

### 3. Code Splitting
Routes are automatically split by Vite for faster initial load.

---

## Error Handling Strategy

### API Error Handling
```javascript
try {
  const response = await getDataApi();
  setData(response.data.data);
} catch (err) {
  console.error("Error:", err);
  toast.error(err.response?.data?.message || "An error occurred");
  // Retry logic or fallback UI
}
```

### Validation
```javascript
const errors = {};
if (!name.trim()) errors.name = "Name is required";
if (!email.includes("@")) errors.email = "Invalid email";

if (Object.keys(errors).length > 0) {
  setFormErrors(errors);
  return;
}
```

---

## New Features Implemented

### 1. Payment Management Page
- **Location**: `src/features/payments/pages/PaymentManagementPage.jsx`
- **Features**:
  - Payment analytics (total, successful, average)
  - Filterable payment list
  - Status badges
  - Export to CSV
  - Pagination

### 2. Analytics Dashboard Page
- **Location**: `src/features/admin/pages/AnalyticsDashboardPage.jsx`
- **Features**:
  - 7 Summary stat cards
  - 3 Key metrics (approval, rejection, disbursement rates)
  - Applications by status (pie chart)
  - Users by role (bar chart)
  - Applications trend (area chart)
  - Payments trend (line chart)
  - Schemes by category (horizontal bar)

### 3. Updated Routes
- `/admin/payments` → Payment Management
- `/admin/analytics` → Analytics Dashboard

### 4. Updated Sidebar
- Added "Analytics" menu item for admin
- Added "Payments" menu item for admin

---

## Best Practices

### Component Organization
```javascript
// 1. Imports
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Component
function MyComponent() {
  // 3. State
  const [data, setData] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    loadData();
  }, []);
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{/* JSX */}</div>;
}

// 7. Export
export default MyComponent;
```

### API Call Pattern
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await apiFunction();
      setData(response.data.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, [dependencies]);
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API base URL set for production
- [ ] Toast notifications working
- [ ] Charts rendering correctly
- [ ] Responsive design tested
- [ ] Dark mode working
- [ ] Animations smooth
- [ ] All API endpoints tested
- [ ] Error boundaries in place
- [ ] Loading states implemented

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Common Issues & Solutions

### CORS Errors
```javascript
// Frontend: Ensure API baseURL matches backend
// Backend: Configure CORS middleware properly
```

### Token Expiration
```javascript
// Frontend: Implement token refresh logic in axios interceptor
// Backend: Return 401 on expired token
```

### Slow Requests
```javascript
// Use pagination for large datasets
// Implement request debouncing
// Cache static data
```

---

## Future Enhancements

- [ ] Real-time websocket notifications
- [ ] Offline mode with sync
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support
- [ ] Advanced filters and search
- [ ] Export reports to PDF
- [ ] Mobile app version
- [ ] Dashboard customization

---

## Support Resources

- API Documentation: `http://localhost:5000/docs`
- Postman Collection: `/postman/welfare-api.json`
- Backend Guide: `backend/docs/`
- Common Issues: `TROUBLESHOOTING.md`
