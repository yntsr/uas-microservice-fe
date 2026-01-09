# 🏗️ Arsitektur Aplikasi - Client

Dokumentasi detail tentang arsitektur dan desain aplikasi client.

## 📐 Overview Arsitektur

Aplikasi client menggunakan **Single Page Application (SPA)** architecture dengan React sebagai framework utama. Aplikasi ini berkomunikasi langsung dengan dua microservice terpisah tanpa menggunakan API Gateway.

## 🎯 Design Principles

1. **Separation of Concerns**: Setiap komponen memiliki tanggung jawab yang jelas
2. **Component-Based**: UI dibangun dari komponen-komponen reusable
3. **State Management**: Menggunakan React Context untuk global state
4. **API Abstraction**: API calls di-abstract dalam layer terpisah
5. **Responsive First**: Mobile-first design approach

## 🔄 Data Flow

### Authentication Flow

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Submit Login Form
       ▼
┌─────────────────┐
│   Login.jsx     │
└──────┬──────────┘
       │
       │ 2. Call authAPI.login()
       ▼
┌─────────────────┐
│  api/index.js    │
│  (authApi)       │
└──────┬──────────┘
       │
       │ 3. POST /api/auth/login
       ▼
┌─────────────────┐
│  Auth Service    │
│  (Port 3003)     │
└──────┬──────────┘
       │
       │ 4. Return JWT Token
       ▼
┌─────────────────┐
│  AuthContext     │
│  - Store token   │
│  - Store user    │
│  - Update state  │
└──────┬──────────┘
       │
       │ 5. Redirect to Dashboard
       ▼
┌─────────────────┐
│  Dashboard.jsx   │
└─────────────────┘
```

### Product Management Flow

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Load Products
       ▼
┌─────────────────┐
│  Products.jsx   │
└──────┬──────────┘
       │
       │ 2. Call productsAPI.getAll()
       ▼
┌─────────────────┐
│  api/index.js    │
│  (productApi)    │
└──────┬──────────┘
       │
       │ 3. GET /api/products
       │    (with JWT token)
       ▼
┌─────────────────┐
│ Product Service  │
│  (Port 3001)     │
└──────┬──────────┘
       │
       │ 4. Return Products Data
       ▼
┌─────────────────┐
│  Products.jsx    │
│  - Render Table  │
│  - Render Cards  │
└─────────────────┘
```

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Login (Public Route)
│       └── ProtectedRoute
│           └── Dashboard
│               └── Products
│                   ├── ProductTable (Desktop)
│                   ├── ProductCards (Mobile)
│                   └── ProductModal
└── Toast (Global)
```

### Component Responsibilities

#### 1. App.jsx
- **Role**: Root component, routing setup
- **Responsibilities**:
  - Setup React Router
  - Wrap app dengan AuthProvider
  - Define routes

#### 2. AuthContext.jsx
- **Role**: Global state management untuk authentication
- **State**:
  - `user`: User object
  - `loading`: Loading state
- **Methods**:
  - `login()`: Handle login logic
  - `logout()`: Handle logout logic
- **Side Effects**:
  - Load user from localStorage on mount
  - Persist user to localStorage on login

#### 3. ProtectedRoute.jsx
- **Role**: Route guard
- **Logic**:
  - Check `isAuthenticated` dari AuthContext
  - Redirect ke `/login` jika tidak authenticated
  - Render children jika authenticated

#### 4. Dashboard.jsx
- **Role**: Main page setelah login
- **Responsibilities**:
  - Display user info
  - Load and display products
  - Handle logout
- **State**:
  - `products`: Array of products
  - `health`: Service health status

#### 5. Products.jsx
- **Role**: Product management component
- **Responsibilities**:
  - Display products (table/cards)
  - Handle CRUD operations
  - Show modal for create/edit
  - Handle delete confirmation
- **State**:
  - `showModal`: Modal visibility
  - `editingProduct`: Product being edited
  - `formData`: Form input data
  - `toast`: Toast notification

#### 6. Login.jsx
- **Role**: Authentication page
- **Responsibilities**:
  - Display login form
  - Handle form submission
  - Show error messages
  - Handle loading state
- **State**:
  - `username`: Input username
  - `password`: Input password
  - `error`: Error message
  - `loading`: Loading state

## 🔌 API Layer Architecture

### API Client Structure

```javascript
// Separate instances for each service
authApi (axios instance) → Auth Service
productApi (axios instance) → Product Service

// Request Interceptors
- Add JWT token to headers
- Format: Authorization: Bearer <token>

// Response Interceptors
- Handle 401 errors
- Auto logout and redirect
```

### API Methods

#### Auth API
```javascript
authAPI.login(credentials)
authAPI.logout()
authAPI.verify()
authAPI.profile()
```

#### Product API
```javascript
productsAPI.getAll()
productsAPI.getById(id)
productsAPI.create(data)
productsAPI.update(id, data)
productsAPI.delete(id)
```

## 🎨 Styling Architecture

### CSS Organization

```
Global Styles
├── index.css (Reset, base styles)
└── App.css (App-level styles)

Component Styles
├── pages/
│   ├── Dashboard.css
│   └── Login.css
└── components/
    └── (Inline styles atau CSS modules)
```

### Responsive Strategy

1. **Mobile-First**: Base styles untuk mobile
2. **Progressive Enhancement**: Add styles untuk larger screens
3. **Breakpoints**:
   - Mobile: ≤ 480px
   - Tablet: ≤ 768px
   - Desktop: > 768px

### CSS Features

- **Flexbox**: Untuk layout
- **Grid**: Untuk card layouts
- **Media Queries**: Untuk responsive design
- **CSS Variables**: Untuk theming (future)
- **Transitions**: Untuk smooth animations

## 🔐 Security Architecture

### Authentication Flow

1. **Login**:
   - User submits credentials
   - Auth Service validates
   - JWT token returned
   - Token stored in localStorage
   - User data stored in localStorage

2. **Request Authentication**:
   - Token diambil dari localStorage
   - Token ditambahkan ke request header
   - Service validates token

3. **Token Expiration**:
   - Service returns 401 jika token expired
   - Interceptor catches 401
   - Auto logout dan redirect

### Data Storage

- **localStorage**: Token dan user data
- **Session**: Tidak digunakan (stateless)
- **Cookies**: Tidak digunakan

### Security Best Practices

- ✅ Token tidak di-expose di URL
- ✅ HTTPS required di production
- ✅ Input validation
- ✅ XSS protection (React default)
- ✅ No sensitive data di client code

## 📊 State Management

### Local State (useState)

Digunakan untuk:
- Form inputs
- UI state (modal, toast)
- Component-specific data

### Global State (Context)

**AuthContext**:
- User authentication state
- User data
- Auth methods

### State Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call
    ↓
Update Local/Global State
    ↓
Re-render Component
```

## 🚀 Performance Optimizations

### Current Optimizations

1. **Code Splitting**: 
   - Route-based (React Router)
   - Lazy loading (future)

2. **Asset Optimization**:
   - Vite build optimization
   - Tree shaking
   - Minification

3. **Rendering**:
   - Conditional rendering
   - Key props untuk lists

### Future Optimizations

- React.memo untuk expensive components
- useMemo untuk expensive calculations
- useCallback untuk function references
- Virtual scrolling untuk large lists
- Image lazy loading

## 🧪 Testing Strategy (Future)

### Unit Tests
- Component rendering
- User interactions
- API calls mocking

### Integration Tests
- Authentication flow
- Product CRUD operations
- Navigation flow

### E2E Tests
- Complete user journeys
- Cross-browser testing

## 📦 Build & Deployment

### Development
- Vite dev server
- Hot Module Replacement (HMR)
- Fast refresh

### Production Build
- Vite build
- Optimized bundle
- Static assets
- Environment variables injection

### Deployment Targets
- Vercel (recommended)
- Netlify
- Any static hosting

## 🔄 Update & Maintenance

### Dependency Updates
- Regular npm audit
- Update dependencies carefully
- Test after updates

### Code Maintenance
- ESLint for code quality
- Consistent code style
- Component documentation
- Regular refactoring

## 📈 Scalability Considerations

### Current Architecture
- ✅ Stateless client
- ✅ Service separation
- ✅ Component reusability

### Future Enhancements
- State management library (Redux/Zustand) jika diperlukan
- Service worker untuk offline support
- Caching strategy
- API response caching
- Error boundary components

## 🎯 Design Patterns

### Patterns Used

1. **Provider Pattern**: AuthContext
2. **HOC Pattern**: ProtectedRoute
3. **Container/Presentational**: Components structure
4. **Singleton Pattern**: API instances
5. **Observer Pattern**: React state updates

### Patterns to Consider

- **Render Props**: Untuk reusable logic
- **Custom Hooks**: Untuk shared logic
- **Compound Components**: Untuk complex UI

---

**Last Updated**: 2024
