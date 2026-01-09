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

Dashboard Microservice adalah aplikasi web untuk mengelola produk dengan sistem autentikasi terintegrasi. Aplikasi ini menggunakan arsitektur microservice dimana frontend berkomunikasi langsung dengan dua service terpisah:

- **Auth Service**: Menangani autentikasi dan otorisasi pengguna
- **Product Service**: Menangani CRUD operasi untuk produk

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
client/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── api/               # API configuration
│   │   └── index.js       # Axios instances & API methods
│   ├── assets/            # Images & static files
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
├── env-example            # Environment variables template
├── package.json           # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🚀 Setup dan Instalasi

### Prerequisites
- Node.js >= 18.x
- npm atau yarn
- Auth Service berjalan di port 3003
- Product Service berjalan di port 3001

### Langkah Instalasi

1. **Clone repository dan masuk ke folder client**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env-example .env
   ```
   
   Edit file `.env` dan sesuaikan URL service:
   ```env
   VITE_AUTH_SERVICE_URL=http://localhost:3003
   VITE_PRODUCT_SERVICE_URL=http://localhost:3001
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Build untuk production**
   ```bash
   npm run build
   ```

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

### Vite Configuration

File `vite.config.js` mengkonfigurasi:
- React plugin
- Build output directory
- Development server port

### Vercel Configuration

File `vercel.json` mengkonfigurasi:
- Routing untuk SPA (Single Page Application)
- Semua route diarahkan ke `index.html`

## ✨ Fitur-Fitur

### 1. Autentikasi
- ✅ Login dengan username dan password
- ✅ JWT token-based authentication
- ✅ Auto logout saat token expired
- ✅ Protected routes
- ✅ User profile display

### 2. Manajemen Produk
- ✅ Tampilkan daftar produk (table/card view)
- ✅ Tambah produk baru
- ✅ Edit produk
- ✅ Hapus produk
- ✅ Format currency Indonesia
- ✅ Stock management

### 3. User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

### 4. Responsive Design
- ✅ Mobile-first approach
- ✅ Card layout untuk mobile
- ✅ Table layout untuk desktop
- ✅ Adaptive navigation
- ✅ Touch-friendly buttons

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

## 🚢 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   Di Vercel dashboard, set:
   - `VITE_AUTH_SERVICE_URL`
   - `VITE_PRODUCT_SERVICE_URL`

### Build untuk Production

```bash
npm run build
```

Output akan berada di folder `dist/` yang dapat di-deploy ke static hosting apapun.

### Environment Variables untuk Production

Pastikan untuk set environment variables di platform deployment:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- dll

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
**Solution**: Pastikan kedua service berjalan dan URL di `.env` benar

### Issue: 401 Unauthorized
**Solution**: 
- Check token di localStorage
- Verify token masih valid
- Login ulang jika perlu

### Issue: CORS error
**Solution**: Pastikan services mengizinkan origin frontend

### Issue: Build fails
**Solution**: 
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version
- Check error messages

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License

## 👥 Authors

- Development Team

## 📞 Support

Untuk pertanyaan atau issues, silakan buat issue di repository.

---

**Last Updated**: 2024
