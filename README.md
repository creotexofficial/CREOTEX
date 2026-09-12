# CreotexShop — Robotics & Maker Superstore 🤖⚡

> A premium, full-stack e-commerce platform for robotics competition parts, 3D printing filaments, motors, drivers, and chassis kits — built with **React 19 + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** (local or Atlas cloud instance)

### 1. Install All Dependencies
```bash
# From root (installs both frontend & backend)
npm run install:all
```

### 2. Configure Environment
```bash
# Copy the example env file
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, JWT secret, etc.
```

### 3. Seed Demo Data (Optional)
```bash
npm run seed:backend
```

### 4. Run Development Servers
```bash
# Frontend only (default)
npm run dev

# Backend only
npm run dev:backend

# Or run both in separate terminals
npm run dev:frontend
npm run dev:backend
```

### 5. Build for Production
```bash
npm run build:frontend
```

---

## 📁 Project Structure

```
CreotexShop/
├── package.json                  # Monorepo root scripts
├── README.md
│
├── frontend/                     # React 19 + Vite SPA
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx               # Root component & routing
│       ├── main.jsx              # React DOM entry point
│       │
│       ├── components/
│       │   ├── admin/            # Super Admin Panel (16 modules)
│       │   │   ├── AdminLayout.jsx
│       │   │   ├── AdminLogin.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminProducts.jsx
│       │   │   ├── AdminProductModal.jsx
│       │   │   ├── AdminCategories.jsx
│       │   │   ├── AdminOrders.jsx
│       │   │   ├── AdminOrderDetailModal.jsx
│       │   │   ├── AdminCustomers.jsx
│       │   │   ├── AdminUsers.jsx
│       │   │   ├── AdminCoupons.jsx
│       │   │   ├── AdminDatasheets.jsx
│       │   │   ├── AdminSettings.jsx
│       │   │   ├── AdminHeroBanners.jsx
│       │   │   ├── AdminRobotBuilder.jsx
│       │   │   └── AdminFilamentHub.jsx     ⭐ NEW
│       │   │
│       │   ├── home/             # Storefront pages
│       │   │   ├── HeroSlider.jsx
│       │   │   ├── FlashDeals.jsx
│       │   │   ├── FilamentSection.jsx      ⭐ UPDATED
│       │   │   ├── FilamentHubPage.jsx      ⭐ UPDATED
│       │   │   ├── FilamentSpoolViewer.jsx
│       │   │   ├── CatalogSection.jsx
│       │   │   ├── RobotBuilder.jsx
│       │   │   ├── DatasheetsHub.jsx
│       │   │   ├── ProductCard.jsx
│       │   │   └── ValueStrip.jsx
│       │   │
│       │   ├── layout/           # Shared layout
│       │   │   ├── Header.jsx
│       │   │   ├── MegaNav.jsx
│       │   │   ├── NeuralBackground.jsx
│       │   │   └── Footer.jsx
│       │   │
│       │   └── modals/           # Global modals & overlays
│       │       ├── AuthModal.jsx
│       │       ├── CartDrawer.jsx
│       │       ├── CheckoutModal.jsx
│       │       ├── QuickViewModal.jsx
│       │       ├── CompareModal.jsx
│       │       └── ToastContainer.jsx
│       │
│       ├── context/
│       │   └── CartContext.jsx              ⭐ UPDATED (filament CRUD)
│       │
│       ├── data/
│       │   ├── productsData.js              # Full product catalog
│       │   ├── productImages.jsx            # Inline SVG product images
│       │   ├── adminDemoData.js             # Admin demo seed data
│       │   └── robotBuilderData.js          # Robot builder presets
│       │
│       ├── services/
│       │   └── api.js                       # Backend API client
│       │
│       └── styles/
│           ├── style.css                    # Main stylesheet
│           ├── components.css               # Component-specific styles
│           ├── responsive.css               ⭐ UPDATED (full responsive)
│           └── admin.css                    # Admin panel styles
│
└── backend/                      # Node.js + Express REST API
    ├── package.json
    ├── server.js                 # Express entry point
    ├── seeder.js                 # Database seeder
    ├── .env / .env.example
    ├── config/                   # DB connection config
    ├── controllers/              # Route handlers
    ├── models/                   # Mongoose schemas
    ├── routes/                   # Express routes
    ├── middleware/               # Auth, error handling
    ├── utils/                    # Helpers & utilities
    └── data/                     # Seed data JSON
```

---

## 🌟 Key Features

### 🛒 Storefront

| Feature | Description |
|---------|-------------|
| **Hero Slider** | Full-width animated banner carousel with CTA buttons |
| **Flash Deals** | Time-limited deal cards with countdown timers and discount badges |
| **Product Catalog** | Category-filtered grid with quick-view, compare, and add-to-cart |
| **Filament Zone** | Dedicated 3D printing filament section with spool viewer & color variants |
| **Robot Builder** | Interactive 2D chassis blueprint with component customization & bundle pricing |
| **Datasheets Hub** | Technical specification library with PDF downloads |
| **Live Search** | Instant autocomplete popup matching names, SKUs, and tags |
| **Spec Compare** | Side-by-side comparison table for up to 4 components |
| **Dark/Light Theme** | Toggle with localStorage persistence |

### 🛍️ Shopping Experience

| Feature | Description |
|---------|-------------|
| **Slide-Out Cart** | Free Express Shipping progress bar (₹999 threshold), coupon engine (`ROBO10`, `MAKER50`), quantity controls |
| **3-Step Checkout** | Address → Payment (UPI, Cards, NetBanking, COD) → Order Confirmation & Receipt |
| **Auth System** | Login/Register modal with form validation |

### 🔐 Super Admin Panel

| Module | Description |
|--------|-------------|
| **Dashboard** | Sales analytics, order stats, revenue charts |
| **Products** | Full CRUD with rich product modal editor |
| **Categories** | Category management with image uploads |
| **Orders** | Order list with detail modal & status management |
| **Customers** | Customer directory with order history |
| **Users** | Admin user management & role assignment |
| **Coupons** | Discount code creation & management |
| **Datasheets** | Technical document uploads |
| **Hero Banners** | Storefront banner management with drag-reorder |
| **Robot Builder** | Admin config for builder presets & components |
| **Filament Hub** | ⭐ **NEW** — Full filament subcategory management (see below) |
| **Settings** | Store configuration & preferences |

---

## ⭐ Recent Changes & Improvements

### 🧵 Filament Hub — Super Admin (NEW)

A complete filament subcategory management system accessible from the admin sidebar.

#### Capabilities
- **Create Subcategory** — Modal with name, description, and preset spool image selection
- **Studio Editor** — Advanced editing interface for each subcategory:
  - Edit name, description, price, weight, diameter, and material specs
  - **Color Variant Manager** — Add/remove color variants with:
    - Color picker for spool tinting
    - Custom photo upload per color variant
    - Color name and hex code assignment
  - Live preview of the spool with selected color tint
- **Publish/Draft Toggle** — Control storefront visibility per subcategory
  - Published subcategories appear on the storefront
  - Draft subcategories are hidden from customers but visible in admin
- **Delete Subcategory** — Remove with confirmation dialog

#### How It Works (State Management)
- All filament subcategory data is managed via `CartContext.jsx`
- State is persisted to `localStorage` for offline/demo use
- The `updateFilamentSubcategory()` function performs dual updates:
  1. Updates the subcategory metadata list
  2. Syncs changes to the main product catalog
- Storefront components (`FilamentSection.jsx`, `FilamentHubPage.jsx`) automatically filter out unpublished subcategories

### 🎨 Filament Storefront UI — "Flash-Scale" Design

The filament section on the homepage was completely redesigned with a premium card layout:

- **Large spool images** with hover zoom effect
- **Clean titles** — no clutter, no long descriptions on cards
- **Professional badge system** — material type indicators
- **Color dot indicators** — showing available colors at a glance
- **2-column mobile grid** — responsive layout for small screens

### 📱 Full Responsive Overhaul

All pages and the admin panel are now fully responsive across all viewports:

| Viewport | Breakpoint | Optimizations |
|----------|------------|---------------|
| Desktop | > 1024px | Full-width layouts, multi-column grids |
| Tablet | 768px–1024px | Adjusted grids, collapsible sidebars |
| Mobile | < 768px | Single/2-column stacked layouts, touch-friendly targets |
| Small Mobile | < 480px | Compact cards, reduced padding, optimized typography |

**Key responsive fixes:**
- Admin panel sidebar collapses to hamburger menu on mobile
- Product grids switch to 2-column on mobile, 1-column on small screens
- Cart drawer is full-width on mobile
- Filament hub page uses stacked layout on narrow screens
- All modals are viewport-aware with proper max-height and scrolling
- Header navigation collapses to mobile menu

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 6.x | Build tool & dev server |
| Vanilla CSS | — | Styling (no CSS framework) |
| localStorage | — | Client-side state persistence |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.x | REST API framework |
| MongoDB + Mongoose | 8.x | Database & ODM |
| JWT | — | Authentication tokens |
| bcryptjs | — | Password hashing |
| Helmet | — | Security headers |
| Morgan | — | HTTP request logging |
| Compression | — | Response compression |
| CORS | — | Cross-origin support |

---

## 🏷️ Product Categories

1. **🔩 Nut Bolt & Screws** — M3/M4/M5 stainless steel kits, brass standoffs, knurled spacers, anodized aluminum washers
2. **🧵 3D Printing & Filaments** — Hyper-Speed PLA (600mm/s), Carbon Fiber PETG-CF, Flex TPU 95A, hardened nozzle sets
3. **⚙️ Gearbox & Motors** — PG-36 planetary DC motors, NEMA 17 steppers, N20 gearmotors, MG996R servos, A2212 BLDC
4. **🔌 Motor Drivers & ESCs** — Cytron MDD10A, TB6612FNG, TMC2209 stepper drivers, 40A bidirectional ESCs
5. **🔄 Bearings & Linear Motion** — 608ZZ ball bearings, LM8UU linear bushings, T8 lead screws, KFL08 pillow blocks
6. **🏁 Line Follower Robot Kits** — Phantom PRO complete kit, QTR-8RC sensor arrays, mini starter kits
7. **🏎️ Robo Race Chassis & Wheels** — Carbon fiber plates, silicone race wheels, knobby all-terrain wheels, hex hub couplers
8. **⚽ Soccer Robot** — Omni-directional chassis, mecanum wheels, nylon omni wheels, solenoid ball kickers
9. **🔋 Batteries, Sensors & Power** — 3S LiPo batteries, MPU-6050 IMU, HC-SR04 ultrasonic sensors

---

## 🔑 Important Notes for Developers

### State Management
- The app uses **React Context API** (`CartContext.jsx`) for global state
- Cart, user auth, theme, filament data, and admin state are all managed through context
- `localStorage` is used for persistence across page reloads
- No external state management library (Redux, Zustand, etc.) is used

### Admin Access
- Navigate to the admin login page from the header user menu
- Super Admin credentials are managed via the backend auth system
- The admin panel has a collapsible sidebar with all management modules

### Filament Data Flow
```
AdminFilamentHub.jsx  →  CartContext.jsx  →  localStorage
                                           ↓
                         FilamentSection.jsx (homepage)
                         FilamentHubPage.jsx (dedicated page)
                         (Both filter: published === true)
```

### CSS Architecture
- `style.css` — Main global styles, layout, and design tokens
- `components.css` — Component-specific styles (cards, badges, buttons)
- `responsive.css` — All media queries and responsive overrides
- `admin.css` — Admin panel-specific styles

### SVG Product Images
- All product images are **inline SVGs** generated in `productImages.jsx`
- This eliminates external image dependencies and ensures instant loading
- SVGs are color-themed and resolution-independent

---

## 📄 License

ISC © Creotex Engineering