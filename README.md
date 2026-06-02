# Welfare Scheme Portal - Frontend

**Modern React + Vite Application for Welfare Scheme Management**

---

## 📋 Quick Navigation

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building](#building)
- [API Integration](#api-integration)
- [Contributing](#contributing)

---

## Overview

The **Welfare Scheme Portal Frontend** is a modern, responsive React application built with Vite that provides an intuitive interface for citizens, officers, and administrators to manage welfare scheme applications.

### Key Highlights
- 🎨 Premium dark theme UI with Tailwind CSS
- 📊 Interactive charts and analytics dashboards
- 🔐 Role-based access control
- ⚡ Lightning-fast performance with Vite
- 📱 Fully responsive design
- 🔔 Real-time notifications
- 🎭 Smooth animations with Framer Motion

---

## Features

### Citizen Dashboard
- 📋 Browse available welfare schemes
- 📝 Apply for schemes with document upload
- 📊 Track application status in real-time
- 🔔 Receive notifications on application updates
- 👤 Manage personal profile and preferences
- 💳 View payment status and history

### Officer Dashboard
- ✅ Review pending applications
- 📄 Document verification
- 🏘️ Field verification
- ➕ Add remarks and comments
- 📈 View analytics and reports
- 🔔 Receive alerts on new submissions

### Admin Dashboard
- 🏢 Complete system management
- 💰 Payment management and analytics
- 📊 Comprehensive system analytics
- 👥 User and staff management
- 📋 Scheme management
- 📋 Audit log viewing

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18+ |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **State** | React Hooks + localStorage |

---

## Getting Started

### Prerequisites
- Node.js v16+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd Welfare-schemes-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. **Start development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Project Structure

```
src/
├── api/
│   └── axios.js                 # HTTP client with interceptors
│
├── components/
│   ├── common/                  # Shared components
│   │   ├── Footer.jsx
│   │   └── PageHeader.jsx
│   │
│   ├── dashboard/              # Dashboard components
│   │   ├── StatCard.jsx
│   │   ├── QuickActionCard.jsx
│   │   └── SectionCard.jsx
│   │
│   └── ui/                     # Reusable UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── Loader.jsx
│
├── features/                   # Feature modules
│   ├── admin/
│   ├── citizen/
│   ├── officer/
│   ├── auth/
│   ├── payments/               # NEW: Payment management
│   ├── schemes/
│   └── ...
│
├── hooks/
│   └── useNotifications.js     # Notification polling hook
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
│   ├── AppRoutes.jsx           # Route definitions
│   ├── ProtectedRoute.jsx      # Auth protection wrapper
│   └── RoleRoute.jsx           # Role-based protection wrapper
│
├── utils/
│   └── storage.js              # localStorage utilities
│
├── App.jsx
├── main.jsx
└── index.css                   # Global styles
```

---

## Development

### Running Development Server
```bash
npm run dev
```
- Hot Module Replacement (HMR) enabled
- Auto-reload on file changes
- Fast refresh for React components

### Linting
```bash
npm run lint
```

### Type Checking (if using TypeScript)
```bash
npm run type-check
```

### Testing
```bash
npm run test
```

---

## Building

### Production Build
```bash
npm run build
```
Output: `dist/` folder with optimized assets

### Preview Build Locally
```bash
npm run preview
```
Serves the production build locally for testing

---

## API Integration

### Base Configuration
```javascript
// src/api/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

// Auto-inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Available API Clients

#### Authentication
```javascript
import { loginApi, registerApi, refreshTokenApi } from '@/features/auth/api';
```

#### Schemes
```javascript
import { getSchemesApi, getSchemeDetailsApi } from '@/features/schemes/api';
```

#### Applications
```javascript
import { 
  createApplicationApi, 
  getMyApplicationsApi 
} from '@/features/schemes/api';
```

#### Payments (NEW)
```javascript
import { 
  getPaymentsApi, 
  getPaymentsAnalyticsApi 
} from '@/features/payments/api';
```

#### Dashboard Analytics (NEW)
```javascript
import { 
  getDashboardAnalyticsApi 
} from '@/features/admin/api';
```

#### Notifications
```javascript
import { 
  getNotificationsApi, 
  markNotificationReadApi 
} from '@/features/notifications/api';
```

### Example: Using API in Component
```javascript
import { useState, useEffect } from 'react';
import { getSchemesApi } from '@/features/schemes/api';
import toast from 'react-hot-toast';

function SchemeList() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true);
        const response = await getSchemesApi();
        setSchemes(response.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load schemes');
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, []);

  return (
    <div>
      {/* Render schemes */}
    </div>
  );
}

export default SchemeList;
```

---

## Authentication Flow

1. **User enters credentials** → Login form
2. **API Call** → `POST /auth/login`
3. **Backend Response** → Access token + Refresh token
4. **Store Tokens** → localStorage
5. **Redirect** → Dashboard
6. **Auto-Inject** → JWT in all requests via interceptor
7. **Token Expiry** → Auto-refresh or re-login prompt

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:5000/api/v1` |

---

## Component Patterns

### Functional Component with Hooks
```javascript
function MyComponent() {
  const [state, setState] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    // Side effects here
  }, [dependencies]);

  return <div>{/* JSX */}</div>;
}

export default MyComponent;
```

### Data Fetching Pattern
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiFunction();
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Form Handling Pattern
```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Validate, then submit
};
```

---

## UI Components

### Premium Dark Theme
- Base colors: Slate-900, Slate-800
- Accent colors: Blue, Green, Purple
- Gradients for enhanced visual hierarchy
- Smooth animations and transitions

### Reusable Components

**StatCard**: Display key metrics
```javascript
<StatCard icon={Icon} value="1,234" label="Total Applications" />
```

**Card**: Container for content
```javascript
<Card className="p-6">
  {/* Content */}
</Card>
```

**Button**: Action button
```javascript
<Button 
  onClick={handleClick} 
  variant="primary"
  disabled={loading}
>
  Submit
</Button>
```

**Input**: Form input field
```javascript
<Input 
  type="text" 
  placeholder="Enter value" 
  value={value}
  onChange={handleChange}
  error={errorMessage}
/>
```

---

## State Management

### Local Component State
```javascript
const [count, setCount] = useState(0);
```

### Persistent Storage
```javascript
localStorage.setItem("key", JSON.stringify(value));
const value = JSON.parse(localStorage.getItem("key"));
```

### URL State
```javascript
const { id } = useParams();
const navigate = useNavigate();
```

---

## Performance Tips

✅ Use `memo()` for expensive components  
✅ Implement code splitting with lazy loading  
✅ Optimize images (use WebP format)  
✅ Debounce search/filter inputs  
✅ Cache API responses when possible  
✅ Use `useCallback()` for stable function references  

---

## New Features (Latest Update)

### 1. Payment Management Page
- Location: `/admin/payments`
- Features:
  - Payment analytics cards
  - Filterable payment list
  - Export to CSV
  - Pagination support

### 2. Analytics Dashboard Page  
- Location: `/admin/analytics`
- Features:
  - 7 summary stat cards
  - 6 interactive charts
  - System analytics
  - Real-time data

---

## Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### API Connection Issues
- Check backend is running on `http://localhost:5000`
- Verify `VITE_API_BASE_URL` in .env
- Check browser console for CORS errors

### Module Not Found
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Style Issues
- Ensure Tailwind CSS is properly configured in `tailwind.config.js`
- Check global styles in `src/index.css`

---

## Best Practices

1. **Component Organization**
   - One component per file
   - Use descriptive names
   - Keep components small and focused

2. **API Calls**
   - Centralize in feature-specific API clients
   - Use try-catch for error handling
   - Show loading and error states

3. **State Management**
   - Use local state for component-specific data
   - Use localStorage for persistent data
   - Avoid prop drilling (use context if needed)

4. **Styling**
   - Use Tailwind utility classes
   - Keep custom CSS minimal
   - Maintain consistent color scheme

5. **Performance**
   - Lazy load heavy components
   - Memoize expensive calculations
   - Optimize re-renders

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Deploy to AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name/
```

---

## Deployment Checklist

- [ ] Environment variables configured for production
- [ ] API base URL set correctly
- [ ] Build succeeds without warnings
- [ ] All routes tested
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] Error pages configured
- [ ] Analytics setup
- [ ] Security headers configured
- [ ] HTTPS enabled

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Commit with descriptive message: `git commit -m 'feat: add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## Support & Documentation

- **Complete Documentation**: [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)
- **API Reference**: [Backend API Docs](../welfare-scheme-portal/docs/15_API_Endpoints_Reference.md)
- **Issues**: Check GitHub issues
- **Contact**: support@example.com

---

## License

Proprietary - Government of Andhra Pradesh

---

## Version History

| Version | Date | Updates |
|---------|------|---------|
| 1.0.0 | June 2026 | Initial release with all core features |
| 1.1.0 | - | Payment Management (NEW) |
| 1.2.0 | - | Analytics Dashboard (NEW) |

---

**Last Updated**: June 3, 2026  
**Maintainer**: Development Team  
**Status**: Production Ready
