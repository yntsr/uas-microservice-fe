# 🛒 Dashboard Microservice - Client Application

Aplikasi web frontend untuk sistem manajemen produk berbasis microservice architecture. Dibangun dengan React dan Vite untuk performa optimal.

## 📋 Daftar Isi

- [Deskripsi](#deskripsi)
- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder](#struktur-folder)
- [Setup dan Instalasi](#setup-dan-instalasi)
- [Konfigurasi](#konfigurasi)
- [Fitur-Fitur](#fitur-fitur)
- [API Integration](#api-integration)
- [Komponen Utama](#komponen-utama)
- [Responsive Design](#responsive-design)
- [Deployment](#deployment)

## 📖 Deskripsi

Dashboard Microservice Client adalah aplikasi web frontend untuk mengelola produk dengan sistem autentikasi terintegrasi. Aplikasi ini menggunakan arsitektur microservice dimana frontend berkomunikasi langsung dengan dua service terpisah tanpa menggunakan API Gateway:

- **Auth Service**: Menangani autentikasi dan otorisasi pengguna (repository terpisah)
- **Product Service**: Menangani CRUD operasi untuk produk (repository terpisah)

> **Note**: Ini adalah repository terpisah untuk client application. Auth Service dan Product Service berada di repository yang berbeda.

## 🏗️ Arsitektur Aplikasi

### Arsitektur Microservice

```
┌─────────────────────────────────────────────────────────┐
│                    Client Application                     │
│                    (React + Vite)                        │
└──────────────┬──────────────────────┬─────────────────────┘
               │                      │
               │                      │
    ┌──────────▼──────────┐  ┌────────▼──────────┐
    │   Auth Service      │  │  Product Service  │
    │   (Port 3003)       │  │  (Port 3001)      │
    │                     │  │                   │
    │  - Login            │  │  - CRUD Products  │
    │  - Logout           │  │  - Stock Management│
    │  - Token Verify     │  │                   │
    │  - User Profile     │  │                   │
    └──────────┬──────────┘  └────────┬──────────┘
               │                      │
               │                      │
    ┌──────────▼──────────┐  ┌────────▼──────────┐
    │   Auth Database      │  │  Product Database │
    │   (MySQL + Prisma)   │  │  (MySQL + Prisma) │
    └──────────────────────┘  └───────────────────┘
```

### Flow Autentikasi

```
1. User Login
   ↓
2. Auth Service validates credentials
   ↓
3. JWT Token generated
   ↓
4. Token stored in localStorage
   ↓
5. Token attached to all API requests
   ↓
6. Protected routes check authentication
```

### Flow Manajemen Produk

```
1. User authenticated
   ↓
2. Request products from Product Service
   ↓
3. Display products in table/card layout
   ↓
4. User can Create/Read/Update/Delete
   ↓
5. Changes synced with Product Service
```

## 🛠️ Teknologi yang Digunakan

### Core Technologies
- **React 19.2.0** - UI library untuk membangun interface
- **Vite 7.2.4** - Build tool dan development server
- **React Router DOM 6.20.0** - Routing untuk SPA
- **Axios 1.5.0** - HTTP client untuk API calls

### Development Tools
- **ESLint** - Code linting
- **Vite Plugin React** - React support untuk Vite

## 📁 Struktur Folder

```
.
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── api/               # API configuration
│   │   └── index.js       # Axios instances & API methods
│   ├── assets/            # Images & static files
│   │   └── react.svg
│   ├── components/        # Reusable components
│   │   ├── Products.jsx    # Product management component
│   │   ├── ProtectedRoute.jsx  # Route protection
│   │   └── Toast.jsx      # Toast notification
│   ├── context/           # React Context
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Dashboard.css  # Dashboard styles
│   │   ├── Login.jsx      # Login page
│   │   └── Login.css      # Login styles
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global app styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (gitignored)
├── .gitignore             # Git ignore rules
├── env-example            # Environment variables template
├── package.json           # Dependencies & scripts
├── package-lock.json      # Lock file
├── vite.config.js        # Vite configuration
├── vercel.json           # Vercel deployment config
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── README.md             # This file
└── ARCHITECTURE.md       # Architecture documentation
```

## 🚀 Setup dan Instalasi

### Prerequisites
- Node.js >= 18.x
- npm atau yarn
- **Auth Service** harus berjalan dan accessible (default: `http://localhost:3003`)
- **Product Service** harus berjalan dan accessible (default: `http://localhost:3001`)

> **Note**: Pastikan kedua service sudah berjalan sebelum menjalankan client application.

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env-example .env
   ```
   
   Edit file `.env` dan sesuaikan URL service sesuai dengan deployment:
   ```env
   # Development
   VITE_AUTH_SERVICE_URL=http://localhost:3003
   VITE_PRODUCT_SERVICE_URL=http://localhost:3001
   
   # Production (contoh)
   # VITE_AUTH_SERVICE_URL=https://auth-service.example.com
   # VITE_PRODUCT_SERVICE_URL=https://product-service.example.com
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:5173` (default Vite port)

5. **Build untuk production**
   ```bash
   npm run build
   ```
   
   Output akan berada di folder `dist/`

6. **Preview production build**
   ```bash
   npm run preview
   ```

## ⚙️ Konfigurasi

### Environment Variables

File `.env` harus berisi:

```env
# Auth Service URL
VITE_AUTH_SERVICE_URL=http://localhost:3003

# Product Service URL
VITE_PRODUCT_SERVICE_URL=http://localhost:3001
```

## 🔌 API Integration

### Auth Service Endpoints

Base URL: `VITE_AUTH_SERVICE_URL`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/verify` | Verify token | ✅ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| GET | `/health` | Health check | ❌ |

### Product Service Endpoints

Base URL: `VITE_PRODUCT_SERVICE_URL`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | ✅ |
| GET | `/api/products/:id` | Get product by ID | ✅ |
| POST | `/api/products` | Create product | ✅ |
| PUT | `/api/products/:id` | Update product | ✅ |
| DELETE | `/api/products/:id` | Delete product | ✅ |
| PATCH | `/api/products/:id/stock` | Update stock | ✅ |
| GET | `/health` | Health check | ❌ |

### API Client Configuration

File `src/api/index.js` menyediakan:

1. **Separate Axios Instances**
   - `authApi` - untuk Auth Service
   - `productApi` - untuk Product Service

2. **Request Interceptors**
   - Otomatis menambahkan JWT token ke header
   - Format: `Authorization: Bearer <token>`

3. **Response Interceptors**
   - Handle 401 Unauthorized
   - Auto redirect ke login page
   - Clear localStorage

## 🧩 Komponen Utama

### 1. App.jsx
Komponen utama aplikasi yang mengatur routing:
- `/login` - Login page
- `/` - Dashboard (protected)

### 2. AuthContext.jsx
Context untuk manajemen state autentikasi:
- `user` - User data
- `loading` - Loading state
- `login()` - Login function
- `logout()` - Logout function
- `isAuthenticated` - Auth status

### 3. ProtectedRoute.jsx
HOC untuk melindungi route yang memerlukan autentikasi:
- Check authentication status
- Redirect ke login jika tidak authenticated

### 4. Dashboard.jsx
Halaman utama setelah login:
- Menampilkan user info
- Menampilkan produk
- Logout functionality

### 5. Login.jsx
Halaman login:
- Form login
- Error handling
- Loading state

### 6. Products.jsx
Komponen untuk manajemen produk:
- Tampilkan produk (table/card)
- Modal untuk create/edit
- Delete confirmation
- Toast notifications

### 7. Toast.jsx
Komponen untuk menampilkan notifikasi:
- Success messages
- Error messages
- Auto dismiss setelah 3 detik

## 📱 Responsive Design

### Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | > 768px | Table layout, full features |
| Tablet | ≤ 768px | Card layout, optimized spacing |
| Mobile | ≤ 480px | Single column, compact design |

### Mobile Features
- Card-based product display
- Full-width buttons
- Bottom sheet modal
- Touch-friendly interactions
- Optimized font sizes

### Desktop Features
- Table layout untuk produk
- Multi-column forms
- Hover effects
- Larger spacing

**Important Notes:**
- Environment variables harus dimulai dengan `VITE_` untuk bisa diakses di client-side
- Setelah mengubah environment variables, perlu rebuild dan redeploy
- Jangan hardcode service URLs di code, selalu gunakan environment variables

## 🔒 Security

### Implemented Security Features
- ✅ JWT token storage di localStorage
- ✅ Auto token injection ke requests
- ✅ Protected routes
- ✅ Auto logout pada 401 error
- ✅ XSS protection (React default)
- ✅ CORS handled by services

### Best Practices
- Jangan commit file `.env`
- Gunakan HTTPS di production
- Set CORS policy di services
- Validate input di frontend dan backend
- Sanitize user input

## 🐛 Troubleshooting

### Issue: Cannot connect to services
**Solution**: 
- Pastikan kedua service (Auth Service & Product Service) sudah berjalan
- Verifikasi URL di file `.env` sesuai dengan service endpoints
- Check network connectivity dan firewall settings
- Untuk development, pastikan service berjalan di:
  - Auth Service: `http://localhost:3003`
  - Product Service: `http://localhost:3001`

### Issue: 401 Unauthorized
**Solution**: 
- Check token di browser localStorage (DevTools → Application → Local Storage)
- Verify token masih valid dengan memanggil `/api/auth/verify`
- Login ulang jika token expired
- Pastikan token format: `Bearer <token>`

### Issue: CORS error
**Solution**: 
- Pastikan services mengizinkan origin frontend di CORS configuration
- Untuk development, pastikan service mengizinkan `http://localhost:5173`
- Check browser console untuk detail error CORS

### Issue: Build fails
**Solution**: 
- Clear node_modules dan reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Check Node.js version (harus >= 18.x): `node --version`
- Check error messages di terminal untuk detail
- Pastikan semua dependencies terinstall dengan benar

### Issue: Environment variables not working
**Solution**:
- Pastikan variable dimulai dengan `VITE_` prefix
- Restart development server setelah mengubah `.env`
- Untuk production build, pastikan environment variables di-set di deployment platform
- Check bahwa file `.env` ada di root folder project

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
