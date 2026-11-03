import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PRODUCTS_DATA, COUPON_CODES, FILAMENT_SUBCATEGORIES, DEFAULT_FILAMENT_COLORS } from '../data/productsData';
import {
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  INITIAL_USERS
} from '../data/adminDemoData';
import { api } from '../services/api';

export const DEFAULT_NAVBAR_CATEGORIES = [
  { id: 'filaments', name: '3D Filament Spool', icon: '🧵', badge: '1KG SPOOLS', badgeType: 'hot', targetType: 'link', targetUrl: '#filament-hub-section', active: true, order: 1 },
  { id: '3d-products', name: '3D Print Product', icon: '📦', badge: 'FINISHED PRINTS', badgeType: 'pro', targetType: 'link', targetUrl: '#section-3d-print-products', active: true, order: 2 },
  { id: 'custom-3d-print', name: 'Custom 3D Print', icon: '🖨️', badge: 'INSTANT QUOTE', badgeType: 'new', targetType: 'link', targetUrl: '#custom-3d-print', active: true, order: 3 }
];

export const DEFAULT_NAVBAR_SETTINGS = {
  enabled: true,
  showToolsLink: true,
  toolsLinkLabel: 'Custom 3D Print Quote',
  toolsLinkUrl: '#custom-3d-print',
  toolsLinkIcon: '🖨️'
};

export const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide-1',
    badge: 'Precision 3D Filament Spools',
    badgeColor: '#EA580C',
    title: 'High-Flow 1.75mm Filaments &',
    titleHighlight: '1KG Engineering Spools',
    description: 'Hyper PLA, Carbon Fiber PETG-CF, High-Heat ABS & Shockproof TPU 95A. Vacuum-sealed spools with ±0.02mm diameter tolerance.',
    primaryBtnText: 'Explore Filament Spools →',
    primaryBtnAction: 'link',
    primaryBtnTarget: '#filament-hub-section',
    secondaryBtnText: '🖨️ Custom 3D Print',
    secondaryBtnAction: 'link',
    secondaryBtnTarget: '#custom-3d-print',
    imageType: 'filament',
    active: true,
    order: 1
  },
  {
    id: 'slide-2',
    badge: 'Ready-to-Ship Finished Prints',
    badgeColor: '#10B981',
    title: 'Precision Manufactured',
    titleHighlight: '3D Printed Products',
    description: 'Articulated dragons, ergonomic desk docks, Voronoi architectural decor, modular cable spines, and working planetary gearboxes.',
    primaryBtnText: 'Shop 3D Print Products →',
    primaryBtnAction: 'link',
    primaryBtnTarget: '#section-3d-print-products',
    secondaryBtnText: 'Upload Custom CAD',
    secondaryBtnAction: 'link',
    secondaryBtnTarget: '#custom-3d-print',
    imageType: 'filament',
    active: true,
    order: 2
  },
  {
    id: 'slide-3',
    badge: 'Bambu Lab & Voron Print Farm',
    badgeColor: '#6366F1',
    title: 'Instant Automated Online',
    titleHighlight: 'Custom 3D Printing',
    description: 'Upload your .STL or .STEP files for real-time slicing and pricing from ₹3.5/gram. Multi-color, engineering polymers, and 24-hr rush dispatch.',
    primaryBtnText: 'Start Custom Print Job →',
    primaryBtnAction: 'link',
    primaryBtnTarget: '#custom-3d-print',
    secondaryBtnText: 'View Spools Catalog',
    secondaryBtnAction: 'link',
    secondaryBtnTarget: '#filament-hub-section',
    imageType: 'custom',
    active: true,
    order: 3
  }
];

export const DEFAULT_HERO_SIDE_BANNERS = [
  {
    id: 'side-1',
    badge: '🧵 Spool Highlights',
    badgeColor: '#EA580C',
    title: 'Hyper PLA & PETG-CF Spools',
    description: 'Up to 600mm/s high-flow printing. 30+ vibrant color shades in stock.',
    btnText: 'Shop Spools →',
    btnAction: 'link',
    btnTarget: '#filament-hub-section',
    accentClass: 'card-accent-1',
    active: true,
    order: 1
  },
  {
    id: 'side-2',
    badge: '🖨️ On-Demand Studio',
    badgeColor: '#6366F1',
    title: 'Custom 3D Print Quote',
    description: 'Upload CAD files & get instant pricing from ₹3.5/gram with 24H dispatch.',
    btnText: 'Upload Model →',
    btnAction: 'link',
    btnTarget: '#custom-3d-print',
    accentClass: 'card-accent-2',
    active: true,
    order: 2
  }
];

export const DEFAULT_HERO_SETTINGS = {
  enabled: true,
  autoplay: true,
  autoplayInterval: 5000,
  showSideBanners: true
};

export const DEFAULT_FILAMENT_SECTION_SETTINGS = {
  enabled: true,
  title: '3D Printer Filament Spool Zone',
  subtitle: 'Precision 1.75mm engineering filaments for rapid prototyping, combat robots & heat-resistant parts',
  icon: '🧵',
  badgeText: '',
  buttonText: 'Explore All 3D Filaments',
  buttonLink: '#filaments-hub',
  showSubcategoriesGrid: true,
  showShelf: true,
  shelfTitle: '⭐ Popular In-Stock 1KG Spools',
  shelfSubtitle: 'Bambu Lab RFID & Standard 1KG spools vacuum-sealed with desiccant',
  shelfButtonText: 'View All Filaments',
  maxShelfProducts: 4,
  customShelfProductIds: [],
  hiddenSubcategoryKeys: []
};

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const VALID_ADMIN_TABS = [
  'dashboard',
  'products',
  'filaments',
  'hero-banners',
  'categories',
  'orders',
  'coupons',
  'customers',
  'users',
  'settings'
];

export const getInitialAdminTab = () => {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || params.get('adminTab') || params.get('section');
      if (tabParam && VALID_ADMIN_TABS.includes(tabParam.toLowerCase())) {
        return tabParam.toLowerCase();
      }
    } catch {}

    try {
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (rawHash) {
        if (VALID_ADMIN_TABS.includes(rawHash)) {
          return rawHash;
        }
        if (rawHash.includes('tab=')) {
          const hashParams = new URLSearchParams(rawHash.includes('?') ? rawHash.split('?')[1] : rawHash);
          const hashTab = hashParams.get('tab');
          if (hashTab && VALID_ADMIN_TABS.includes(hashTab.toLowerCase())) {
            return hashTab.toLowerCase();
          }
        }
        const hashParts = rawHash.split('/');
        const lastPart = hashParts[hashParts.length - 1];
        if (VALID_ADMIN_TABS.includes(lastPart)) {
          return lastPart;
        }
      }
    } catch {}

    try {
      const pathParts = window.location.pathname.toLowerCase().split('/').filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1];
      if (VALID_ADMIN_TABS.includes(lastPart)) {
        return lastPart;
      }
    } catch {}

    try {
      const saved = localStorage.getItem('creotex_admin_active_tab');
      if (saved && VALID_ADMIN_TABS.includes(saved.toLowerCase())) {
        return saved.toLowerCase();
      }
    } catch {}
  }

  return 'dashboard';
};

export const CartProvider = ({ children }) => {
  // Storage Keys
  const cartKey = "creotex_cart_items";
  const wishlistKey = "creotex_wishlist_items";
  const couponKey = "creotex_applied_coupon";
  const themeKey = "creotex_theme_v3";
  const productsKey = "creotex_admin_products_v4";
  const ordersKey = "creotex_admin_orders";
  const couponsKey = "creotex_admin_coupons";
  const customersKey = "creotex_admin_customers";
  const settingsKey = "creotex_admin_settings";
  const viewKey = "creotex_current_view";
  const adminTabKey = "creotex_admin_active_tab";
  const usersKey = "creotex_users";
  const authKey = "creotex_auth_user";
  const navbarCategoriesKey = "creotex_navbar_categories_v4";
  const navbarSettingsKey = "creotex_navbar_settings_v4";
  const heroSlidesKey = "creotex_hero_slides_v4";
  const heroSideBannersKey = "creotex_hero_side_banners_v4";
  const heroSettingsKey = "creotex_hero_settings";
  const filamentSubcategoriesKey = "creotex_filament_subcategories";
  const filamentSectionSettingsKey = "creotex_filament_section_settings";

  // Load helper
  const load = (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  // State
  const [items, setItems] = useState(() => load(cartKey, []));
  const [wishlist, setWishlist] = useState(() => load(wishlistKey, []));
  const [appliedCoupon, setAppliedCoupon] = useState(() => load(couponKey, null));
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(themeKey);
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return "light";
  });

  // Auth & User State
  const [users, setUsers] = useState(() => load(usersKey, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => load(authKey, null));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  // Helper to determine active view based on browser URL / hash
  const getViewFromLocation = () => {
    if (typeof window !== 'undefined') {
      try {
        const p = window.location.pathname.toLowerCase();
        const h = window.location.hash.toLowerCase();
        const s = window.location.search.toLowerCase();
        if (p.includes('super') || h.includes('super') || s.includes('super') || p.includes('admin') || h.includes('admin')) {
          return "admin";
        }
        if (p.includes('custom-3d') || h.includes('custom-3d') || s.includes('custom-3d')) {
          return "custom-3d-print";
        }
        if (p.includes('filaments') || h.includes('filaments') || s.includes('filaments')) {
          return "filaments";
        }
        const cleanPath = p.replace(/^\/+|\/+$/g, '');
        if (cleanPath && !['super', 'admin', 'filaments', 'custom-3d-print', 'index.html'].includes(cleanPath)) {
          return "storefront";
        }
      } catch {}
    }
    return localStorage.getItem(viewKey) || "storefront";
  };

  // Navigation & Admin View State
  const [currentView, setCurrentView] = useState(() => getViewFromLocation());
  const [adminActiveTab, setAdminActiveTabState] = useState(() => getInitialAdminTab());

  // Dynamic Store Data with LocalStorage Sync
  const [products, setProducts] = useState(() => load(productsKey, PRODUCTS_DATA));
  const [filamentSubcategories, setFilamentSubcategories] = useState(
    () => load(filamentSubcategoriesKey, FILAMENT_SUBCATEGORIES)
  );
  const [activeFilamentSubcategory, setActiveFilamentSubcategory] = useState("all");
  const [orders, setOrders] = useState(() => load(ordersKey, INITIAL_ORDERS));
  const [coupons, setCoupons] = useState(() => load(couponsKey, COUPON_CODES));
  const [customers, setCustomers] = useState(() => load(customersKey, INITIAL_CUSTOMERS));
  const [storeSettings, setStoreSettings] = useState(() => load(settingsKey, INITIAL_SETTINGS));

  // Storefront Navbar Categories & Navigation Data State
  const [navbarCategories, setNavbarCategories] = useState(() => {
    const loaded = load(navbarCategoriesKey, DEFAULT_NAVBAR_CATEGORIES);
    if (Array.isArray(loaded) && !loaded.some(c => c.id === 'custom-3d-print')) {
      const copy = [...loaded];
      copy.splice(1, 0, {
        id: 'custom-3d-print',
        name: 'Custom 3D Print',
        icon: '🖨️',
        badge: 'NEW',
        badgeType: 'new',
        targetType: 'link',
        targetUrl: '#custom-3d-print',
        active: true,
        order: 2
      });
      return copy;
    }
    return loaded;
  });
  const [navbarSettings, setNavbarSettings] = useState(() => load(navbarSettingsKey, DEFAULT_NAVBAR_SETTINGS));

  // Storefront Hero Carousel & Side Promo Banners State
  const [heroSlides, setHeroSlides] = useState(() => load(heroSlidesKey, DEFAULT_HERO_SLIDES));
  const [heroSideBanners, setHeroSideBanners] = useState(() => load(heroSideBannersKey, DEFAULT_HERO_SIDE_BANNERS));
  const [heroSettings, setHeroSettings] = useState(() => load(heroSettingsKey, DEFAULT_HERO_SETTINGS));

  // Storefront Home Page Section: Filament Spool Zone
  const [filamentSectionSettings, setFilamentSectionSettings] = useState(
    () => load(filamentSectionSettingsKey, DEFAULT_FILAMENT_SECTION_SETTINGS)
  );

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Filter & Search state (Storefront)
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentTag, setCurrentTag] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(filamentSubcategoriesKey, JSON.stringify(filamentSubcategories));
  }, [filamentSubcategories]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(couponKey, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(couponKey);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem(productsKey, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ordersKey, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(couponsKey, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(customersKey, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(navbarCategoriesKey, JSON.stringify(navbarCategories));
  }, [navbarCategories]);

  useEffect(() => {
    localStorage.setItem(navbarSettingsKey, JSON.stringify(navbarSettings));
  }, [navbarSettings]);

  useEffect(() => {
    localStorage.setItem(heroSlidesKey, JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem(heroSideBannersKey, JSON.stringify(heroSideBanners));
  }, [heroSideBanners]);

  useEffect(() => {
    localStorage.setItem(heroSettingsKey, JSON.stringify(heroSettings));
  }, [heroSettings]);

  useEffect(() => {
    localStorage.setItem(filamentSectionSettingsKey, JSON.stringify(filamentSectionSettings));
  }, [filamentSectionSettings]);

  useEffect(() => {
    localStorage.setItem(usersKey, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(authKey, JSON.stringify(currentUser));
      if (currentUser.role === 'super_admin' && !localStorage.getItem('creotex_auth_token')) {
        localStorage.setItem('creotex_auth_token', currentUser.token || 'creotex_root_admin_session_token');
      }
    } else {
      localStorage.removeItem(authKey);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(viewKey, currentView);
  }, [currentView]);

  useEffect(() => {
    if (adminActiveTab) {
      localStorage.setItem(adminTabKey, adminActiveTab);
    }
  }, [adminActiveTab]);

  useEffect(() => {
    if (currentView === 'admin' && typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        let urlModified = false;
        if (!url.pathname.toLowerCase().includes('super')) {
          url.pathname = '/super';
          urlModified = true;
        }
        if (url.searchParams.get('tab') !== adminActiveTab) {
          url.searchParams.set('tab', adminActiveTab);
          urlModified = true;
        }
        if (urlModified) {
          window.history.replaceState({ view: 'admin', tab: adminActiveTab }, '', url.pathname + url.search + url.hash);
        }
      } catch {}
    }
  }, [currentView, adminActiveTab]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(themeKey, theme);
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0E0E11' : '#FFFDF9');
      }
    } catch (_) {}
  }, [theme]);

  // Initial Sync with Live Backend API on Render
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live products from backend
    api.products.getAll({ limit: 150 })
      .then(res => {
        if (!isMounted) return;
        if (res && res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      })
      .catch(err => {
        console.info('[Creotex API] Operating in hybrid fallback mode:', err.message);
      });

    // 2. Fetch live store settings from backend
    api.settings.get()
      .then(res => {
        if (!isMounted) return;
        if (res && res.data) {
          setStoreSettings(prev => ({ ...prev, ...res.data }));
          if (res.data.navbarCategories && Array.isArray(res.data.navbarCategories) && res.data.navbarCategories.length > 0) {
            setNavbarCategories(res.data.navbarCategories);
          }
          if (res.data.heroSlides && Array.isArray(res.data.heroSlides) && res.data.heroSlides.length > 0) {
            setHeroSlides(res.data.heroSlides);
          }
          if (res.data.filamentSubcategories && Array.isArray(res.data.filamentSubcategories) && res.data.filamentSubcategories.length > 0) {
            setFilamentSubcategories(res.data.filamentSubcategories);
          }
        }
      })
      .catch(() => {});

    // 3. If admin token exists, fetch live orders & customers
    const token = localStorage.getItem('creotex_auth_token');
    if (token) {
      api.orders.getAll()
        .then(res => {
          if (!isMounted) return;
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setOrders(res.data);
          }
        })
        .catch(() => {});

      api.customers.getAll()
        .then(res => {
          if (!isMounted) return;
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setCustomers(res.data);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Silent Toast Notification handler
  const showToast = useCallback(() => {}, []);

  const persistDelete = async (request, updateLocalState, itemLabel) => {
    try {
      await request();
      updateLocalState();
    } catch (error) {
      if (error.status === 404) {
        updateLocalState();
        return;
      }
      window.alert(`Could not delete ${itemLabel} from the database: ${error.message}`);
    }
  };

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  // View Navigation
  const setAdminActiveTab = useCallback((tab) => {
    const validTab = VALID_ADMIN_TABS.includes(tab) ? tab : 'dashboard';
    setAdminActiveTabState(validTab);
    try {
      localStorage.setItem(adminTabKey, validTab);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (!url.pathname.toLowerCase().includes('super')) {
          url.pathname = '/super';
        }
        url.searchParams.set('tab', validTab);
        window.history.replaceState({ view: 'admin', tab: validTab }, '', url.pathname + url.search + url.hash);
      }
    } catch {}
  }, []);

  const navigateToAdmin = useCallback((tab = null) => {
    const targetTab = (tab && VALID_ADMIN_TABS.includes(tab)) ? tab : 'dashboard';
    setAdminActiveTab(targetTab);
    setCurrentView("admin");
    try {
      const url = new URL(window.location.href);
      if (!url.pathname.toLowerCase().includes('super')) {
        url.pathname = '/super';
      }
      url.searchParams.set('tab', targetTab);
      window.history.pushState({ view: 'admin', tab: targetTab }, '', url.pathname + url.search + url.hash);
    } catch {
      window.location.hash = `super?tab=${targetTab}`;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setAdminActiveTab]);

  const navigateToStorefront = useCallback(() => {
    setCurrentView("storefront");
    try {
      if (window.location.pathname.toLowerCase().includes('super') || window.location.hash.toLowerCase().includes('super') || window.location.search.toLowerCase().includes('tab=')) {
        window.history.pushState({ view: 'storefront' }, '', '/');
      }
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateToHome = useCallback(() => {
    setCurrentCategory("all");
    setCurrentView("storefront");
    try {
      if (window.location.hash.includes('custom-3d') || window.location.hash.includes('filaments')) {
        window.history.pushState({ view: 'storefront' }, '', '/');
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateToFilaments = useCallback((subCat = "all") => {
    setActiveFilamentSubcategory(subCat);
    setCurrentCategory("filaments");
    setCurrentView("filaments");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateToCustom3DPrint = useCallback(() => {
    setCurrentCategory("custom-3d-print");
    setCurrentView("custom-3d-print");
    try {
      window.history.pushState({ view: 'custom-3d-print' }, '', '/#custom-3d-print');
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo404 = useCallback(() => {
    setCurrentView("404");
    try {
      window.history.pushState({ view: '404' }, '', '/404');
    } catch {
      window.location.hash = '404';
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sync state on browser back/forward or hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const detected = getViewFromLocation();
      setCurrentView(detected);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // 3D Filament Subcategory & Color Variant CRUD
  const updateFilamentSubcategory = useCallback((subCategoryKey, updatedMeta) => {
    setFilamentSubcategories(prev => {
      const next = prev.map(sub => {
        const match = (sub.subCategoryKey && sub.subCategoryKey.toLowerCase() === subCategoryKey.toLowerCase()) ||
                      (sub.id && updatedMeta.id && sub.id === updatedMeta.id);
        if (match) {
          return { ...sub, ...updatedMeta };
        }
        return sub;
      });
      api.settings.update({ filamentSubcategories: next }).catch(err => console.warn('[CartContext] Could not update filament subcategories in MongoDB:', err.message));
      return next;
    });

    setProducts(prev => prev.map(prod => {
      const match = (prod.subCategory && prod.subCategory.toLowerCase() === subCategoryKey.toLowerCase()) ||
                    (prod.category === 'filaments' && updatedMeta.productId && prod.id === updatedMeta.productId);

      if (match) {
        const updatedColors = updatedMeta.colors !== undefined ? updatedMeta.colors : (prod.colors || DEFAULT_FILAMENT_COLORS);
        const discountStr = (updatedMeta.originalPrice && updatedMeta.price && updatedMeta.originalPrice > updatedMeta.price)
          ? `${Math.round(((updatedMeta.originalPrice - updatedMeta.price) / updatedMeta.originalPrice) * 100)}% OFF`
          : prod.discount;

        const updatedProd = {
          ...prod,
          name: updatedMeta.productName || prod.name,
          price: updatedMeta.price !== undefined ? parseFloat(updatedMeta.price) : prod.price,
          originalPrice: updatedMeta.originalPrice !== undefined ? parseFloat(updatedMeta.originalPrice) : prod.originalPrice,
          discount: discountStr,
          badge: updatedMeta.badge !== undefined ? updatedMeta.badge : prod.badge,
          shortDesc: updatedMeta.desc !== undefined ? updatedMeta.desc : prod.shortDesc,
          stock: updatedMeta.stock !== undefined ? parseInt(updatedMeta.stock, 10) : prod.stock,
          colors: updatedColors,
          spoolTypes: updatedMeta.spoolTypes || prod.spoolTypes || ['Filament with Spool', 'Refill'],
          weights: updatedMeta.weights || prod.weights || ['1 kg', '3 kg'],
          specs: {
            ...prod.specs,
            ...(updatedMeta.specs || {}),
            "Print Temp": updatedMeta.printTemp || prod.specs?.["Print Temp"],
            "Bed Temp": updatedMeta.bedTemp || prod.specs?.["Bed Temp"],
            "Recommended Speed": updatedMeta.speed || prod.specs?.["Recommended Speed"],
            "Impact Strength": updatedMeta.strength || prod.specs?.["Impact Strength"]
          }
        };

        api.products.update(prod.id, updatedProd).catch(err => console.warn('[CartContext] Could not update filament product in MongoDB:', err.message));
        return updatedProd;
      }
      return prod;
    }));
  }, []);

  const addFilamentSubcategory = useCallback((newSub) => {
    const subKey = (newSub.subCategoryKey || newSub.name || 'CUSTOM').trim().toUpperCase().replace(/\s+/g, '_');
    const subId = newSub.id || `sub-${Date.now().toString(36)}`;
    const fullSub = {
      id: subId,
      name: newSub.name || subKey,
      displayName: newSub.displayName || newSub.name || subKey,
      subCategoryKey: subKey,
      badge: newSub.badge || "High Precision",
      badgeColor: newSub.badgeColor || "#06B6D4",
      accentColor: newSub.accentColor || "#06B6D4",
      subtitle: newSub.subtitle || newSub.desc || "Engineering filament formulation for clean, warp-free prints.",
      printTemp: newSub.printTemp || "200°C - 230°C",
      bedTemp: newSub.bedTemp || "50°C - 65°C",
      speed: newSub.speed || "Up to 500 mm/s",
      strength: newSub.strength || "High Durability",
      bestFor: newSub.bestFor || "Robotics Brackets & Rapid Prototyping",
      desc: newSub.desc || "High-performance 3D printing filament engineered for ultra-smooth extrusion and precision layer adhesion.",
      image: newSub.image || "/filaments/spool_pla_blue.jpg",
      colors: newSub.colors && newSub.colors.length > 0 ? newSub.colors : DEFAULT_FILAMENT_COLORS,
      price: parseFloat(newSub.price) || 899,
      originalPrice: parseFloat(newSub.originalPrice) || 1399,
      stock: parseInt(newSub.stock, 10) || 150,
      published: newSub.published !== undefined ? Boolean(newSub.published) : true
    };

    setFilamentSubcategories(prev => {
      const next = [fullSub, ...prev];
      api.settings.update({ filamentSubcategories: next }).catch(err => console.warn('[CartContext] Could not sync filament subcategories to MongoDB:', err.message));
      return next;
    });

    const newProduct = {
      id: `fil-${subId}`,
      name: `Creotex ${fullSub.displayName} 1.75mm - Multi-Color`,
      category: "filaments",
      subCategory: subKey,
      categoryLabel: "3D Printing & Filaments",
      price: fullSub.price,
      originalPrice: fullSub.originalPrice,
      discount: fullSub.originalPrice > fullSub.price ? `${Math.round(((fullSub.originalPrice - fullSub.price) / fullSub.originalPrice) * 100)}% OFF` : "30% OFF",
      rating: 4.9,
      reviewsCount: 12,
      stock: fullSub.stock,
      isBestSeller: false,
      isFeatured: fullSub.published,
      isDeal: false,
      badge: fullSub.badge,
      shortDesc: fullSub.desc,
      specs: {
        "Material": fullSub.displayName,
        "Diameter": "1.75mm ± 0.02mm Precision",
        "Print Temp": fullSub.printTemp,
        "Bed Temp": fullSub.bedTemp,
        "Recommended Speed": fullSub.speed,
        "Net Weight": "1.0 KG (2.2 lbs) Spool"
      },
      tags: [subKey, "Filaments", "3D Printing", "Robotics"],
      sku: `CTX-3DP-${subKey.replace(/[^A-Z0-9]/g, '')}`,
      image: fullSub.image,
      colors: fullSub.colors,
      spoolTypes: newSub.spoolTypes || ["Filament with Spool", "Refill"],
      weights: newSub.weights || ["1 kg", "3 kg"]
    };

    setProducts(prev => [newProduct, ...prev]);

    api.products.create({
      ...newProduct,
      customId: newProduct.id
    }).catch(err => console.warn('[CartContext] Could not persist filament product to MongoDB:', err.message));

    return fullSub;
  }, []);

  const toggleFilamentSubcategoryPublish = useCallback((subKey) => {
    setFilamentSubcategories(prev => {
      const next = prev.map(s => {
        if (s.subCategoryKey.toLowerCase() === subKey.toLowerCase()) {
          return { ...s, published: s.published === false };
        }
        return s;
      });
      api.settings.update({ filamentSubcategories: next }).catch(err => console.warn('[CartContext] Could not sync filament publish state to MongoDB:', err.message));
      return next;
    });

    setProducts(prev => prev.map(p => {
      if (p.subCategory && p.subCategory.toLowerCase() === subKey.toLowerCase()) {
        const updated = { ...p, isFeatured: !p.isFeatured };
        api.products.update(p.id, { isFeatured: updated.isFeatured }).catch(err => console.warn('[CartContext] Could not update featured status in MongoDB:', err.message));
        return updated;
      }
      return p;
    }));
  }, []);

  const deleteFilamentSubcategory = useCallback((subKey) => {
    setFilamentSubcategories(prev => {
      const next = prev.filter(s => s.subCategoryKey.toLowerCase() !== subKey.toLowerCase());
      api.settings.update({ filamentSubcategories: next }).catch(err => console.warn('[CartContext] Could not sync deleted filament subcategory to MongoDB:', err.message));
      return next;
    });

    setProducts(prev => prev.filter(p => !p.subCategory || p.subCategory.toLowerCase() !== subKey.toLowerCase()));
    api.products.deleteBySubcategory(subKey).catch(err => console.warn('[CartContext] Could not delete products by subcategory from MongoDB:', err.message));
  }, []);

  const resetFilamentSubcategoriesDefaults = useCallback(() => {
    localStorage.removeItem(filamentSubcategoriesKey);
    setFilamentSubcategories(FILAMENT_SUBCATEGORIES);
    api.settings.update({ filamentSubcategories: FILAMENT_SUBCATEGORIES }).catch(err => console.warn('[CartContext] Could not reset filament subcategories in MongoDB:', err.message));
  }, [filamentSubcategoriesKey]);

  // Auth Handlers
  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response && response.data) {
        const u = response.data;
        setCurrentUser(u);
        closeAuthModal();
        return { success: true };
      }
    } catch {}

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: "Account not found." };
    }
    if (found.password && found.password !== password) {
      return { success: false, message: "Invalid password!" };
    }

    setCurrentUser(found);
    closeAuthModal();
    return { success: true };
  }, [users, closeAuthModal]);

  const signup = useCallback(async (formData) => {
    const exists = users.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) {
      return { success: false, message: "Email already registered." };
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'customer',
      tier: 'Maker Pro',
      phone: formData.phone || '',
      city: formData.city || 'Bengaluru',
      state: formData.state || 'Karnataka',
      address: formData.address || '',
      pincode: formData.pincode || '',
      status: 'Active',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastLogin: 'Just now'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    closeAuthModal();
    return { success: true };
  }, [users, closeAuthModal]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(authKey);
    localStorage.removeItem('creotex_auth_token');
    setCurrentView('storefront');
  }, [authKey]);

  const updateProfile = useCallback((profileData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  }, [currentUser]);

  // Admin User CRUD
  const addUser = useCallback((userData) => {
    const newUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastLogin: 'Never',
      tier: 'Hobbyist',
      role: 'customer',
      ...userData
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  }, []);

  const updateUser = useCallback((userId, updatedData) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updatedData } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
  }, [currentUser]);

  const deleteUser = useCallback((userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const resetUserPassword = useCallback((userId, newPassword) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, password: newPassword } : u)));
  }, []);

  const toggleUserStatus = useCallback((userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  }, []);

  // Cart Methods
  const addItem = useCallback((productId, quantity = 1, customConfig = null) => {
    const product = typeof productId === 'object' ? productId : products.find(p => p.id === productId);
    if (!product) return false;

    const cartItemId = customConfig ? `${product.id}-${JSON.stringify(customConfig)}` : product.id;

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock || 99);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: customConfig && customConfig.customPrice ? customConfig.customPrice : product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            sku: product.sku,
            stock: product.stock || 99,
            quantity: Math.min(quantity, product.stock || 99),
            customConfig: customConfig
          }
        ];
      }
    });

    setIsCartOpen(true);
    return true;
  }, [products]);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    } else {
      setItems(prev => prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: Math.min(quantity, item.stock) };
        }
        return item;
      }));
    }
  }, []);

  const removeItem = useCallback((cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  // Coupon Methods
  const applyCoupon = useCallback((code) => {
    const upperCode = code.trim().toUpperCase();
    const coupon = coupons[upperCode];

    if (!coupon) {
      return { success: false, message: "Invalid coupon code!" };
    }

    const currentSubtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    if (currentSubtotal < coupon.minOrder) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrder} required.` };
    }

    setAppliedCoupon({ code: upperCode, ...coupon });
    return { success: true, message: "Coupon applied!" };
  }, [coupons, items]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Wishlist
  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]));
  }, []);

  const isInWishlist = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  // Unified Cart Calculations (Single memoized loop for max performance)
  const cartCalculations = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let originalSubtotal = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const qty = item.quantity || 1;
      count += qty;
      subtotal += (item.price || 0) * qty;
      originalSubtotal += (item.originalPrice || item.price || 0) * qty;
    }

    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.flatDiscount) {
        discountAmount = Math.min(appliedCoupon.flatDiscount, subtotal);
      } else if (appliedCoupon.discountPercent) {
        discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      }
    }

    const freeThreshold = storeSettings.freeShippingThreshold || 999;
    const stdShipping = storeSettings.standardShippingCost || 79;
    const gstRateVal = (storeSettings.gstRate || 18) / 100;

    const shippingCost = (subtotal === 0 || subtotal >= freeThreshold) ? 0 : stdShipping;
    const total = Math.max(0, subtotal - discountAmount + shippingCost);
    const basePrice = Math.round(total / (1 + gstRateVal));
    const gstAmount = total - basePrice;

    const needed = Math.max(0, freeThreshold - subtotal);
    const percent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

    return {
      totalCount: count,
      subtotal,
      originalSubtotal,
      discountAmount,
      shippingCost,
      total,
      gst: { basePrice, gstAmount },
      freeShipping: {
        qualified: subtotal >= freeThreshold,
        subtotal,
        threshold: freeThreshold,
        needed,
        percent
      },
      totalSavings: (originalSubtotal - subtotal) + discountAmount
    };
  }, [items, appliedCoupon, storeSettings.freeShippingThreshold, storeSettings.standardShippingCost, storeSettings.gstRate]);

  // Filters Reset
  const resetFilters = useCallback(() => {
    setCurrentCategory("all");
    setCurrentTag("all");
    setMaxPrice(5000);
    setSearchQuery("");
    setSortBy("featured");
  }, []);

  const openQuickView = useCallback((productId) => {
    const product = typeof productId === 'object' ? productId : products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  }, [products]);

  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  const openCheckoutModal = useCallback(() => {
    if (items.length === 0) return;
    setIsCartOpen(false);
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  }, [items.length]);

  const closeCheckoutModal = useCallback(() => setIsCheckoutOpen(false), []);

  // Product CRUD
  const addProduct = useCallback(async (productData) => {
    const newId = productData.id || `3dp-${Date.now().toString().slice(-4)}`;
    const productToAdd = {
      ...productData,
      id: newId,
      customId: newId,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      createdAt: new Date().toISOString()
    };

    // 1. Instantly update local state so UI updates with zero lag
    setProducts(prev => [productToAdd, ...prev]);

    // 2. Persist to MongoDB database via Backend API
    try {
      const response = await api.products.create({
        ...productToAdd,
        customId: newId,
        sku: (productToAdd.sku || `CTX-${Date.now()}`).toUpperCase().trim()
      });
      if (response && response.data) {
        const saved = response.data;
        const normalized = {
          ...saved,
          id: saved.customId || (saved._id ? saved._id.toString() : newId)
        };
        setProducts(prev => prev.map(p => (p.id === newId ? normalized : p)));
        return normalized;
      }
    } catch (err) {
      console.warn('[CartContext] Could not persist product to MongoDB:', err.message);
    }
    return productToAdd;
  }, []);

  const updateProduct = useCallback(async (id, updatedData) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedData } : p)));

    try {
      await api.products.update(id, updatedData);
    } catch (err) {
      console.warn('[CartContext] Could not update product in MongoDB:', err.message);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await persistDelete(
      () => api.products.delete(id),
      () => setProducts(prev => prev.filter(p => p.id !== id)),
      'product'
    );
  }, []);

  const updateStock = useCallback(async (id, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock, 10));
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock: stockVal } : p)));

    try {
      await api.products.update(id, { stock: stockVal });
    } catch (err) {
      console.warn('[CartContext] Could not update stock in MongoDB:', err.message);
    }
  }, []);

  // Order CRUD
  const createOrder = useCallback(async (orderData) => {
    try {
      const response = await api.orders.create(orderData);
      if (response && response.data) {
        const o = response.data;
        const normalized = {
          ...o,
          id: o.orderId || o.id || `ORD-${Date.now().toString().slice(-4)}`
        };
        setOrders(prev => [normalized, ...prev]);
        clearCart();
        return normalized;
      }
    } catch {}

    const randomId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: randomId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      orderStatus: "Processing",
      paymentStatus: "Paid",
      trackingNumber: `CTX-EXPRESS-${Date.now().toString().slice(-6)}`,
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock locally
    if (orderData.items) {
      orderData.items.forEach(item => {
        updateStock(item.id, (products.find(p => p.id === item.id)?.stock || 10) - item.quantity);
      });
    }

    clearCart();
    return newOrder;
  }, [clearCart, products, updateStock]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));

    try {
      await api.orders.updateStatus(orderId, { status: newStatus });
    } catch (err) {
      console.warn('[CartContext] Could not update order status in MongoDB:', err.message);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId) => {
    await persistDelete(
      () => api.orders.delete(orderId),
      () => setOrders(prev => prev.filter(o => o.id !== orderId)),
      'order'
    );
  }, []);

  // Coupon CRUD
  const addCoupon = useCallback(async (code, couponData) => {
    const upper = code.trim().toUpperCase();
    setCoupons(prev => ({ ...prev, [upper]: couponData }));

    try {
      await api.coupons.create({
        code: upper,
        discountType: couponData.discountType || (couponData.type === 'percentage' ? 'percentage' : 'fixed'),
        discountValue: couponData.discount || couponData.discountValue || 10,
        minOrderAmount: couponData.minOrderAmount || couponData.minOrder || 0,
        description: couponData.description || `Special coupon ${upper}`
      });
    } catch (err) {
      console.warn('[CartContext] Could not persist coupon to MongoDB:', err.message);
    }
  }, []);

  const deleteCoupon = useCallback(async (code) => {
    await persistDelete(
      () => api.coupons.delete(code),
      () => {
        setCoupons(prev => {
          const next = { ...prev };
          delete next[code];
          return next;
        });
      },
      'coupon'
    );
  }, []);

  // Customer CRUD
  const addCustomer = useCallback(async (customerData) => {
    const id = `CUST-${Date.now().toString().slice(-3)}`;
    const newCust = {
      ...customerData,
      id,
      totalOrders: 1,
      joinedDate: new Date().toISOString().slice(0, 10),
      status: "Active"
    };
    setCustomers(prev => [newCust, ...prev]);

    try {
      await api.customers.create(newCust);
    } catch (err) {
      console.warn('[CartContext] Could not persist customer to MongoDB:', err.message);
    }
  }, []);

  const updateCustomer = useCallback(async (id, data) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));

    try {
      await api.customers.update(id, data);
    } catch (err) {
      console.warn('[CartContext] Could not update customer in MongoDB:', err.message);
    }
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    await persistDelete(
      () => api.customers.delete(id),
      () => setCustomers(prev => prev.filter(c => c.id !== id)),
      'customer'
    );
  }, []);

  // Store Settings & Reset
  const updateStoreSettings = useCallback(async (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));

    try {
      await api.settings.update(newSettings);
    } catch (err) {
      console.warn('[CartContext] Could not persist settings to MongoDB:', err.message);
    }
  }, []);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(productsKey);
    localStorage.removeItem(ordersKey);
    localStorage.removeItem(couponsKey);
    localStorage.removeItem(customersKey);
    localStorage.removeItem(settingsKey);
    localStorage.removeItem(usersKey);
    localStorage.removeItem(authKey);
    localStorage.removeItem(navbarCategoriesKey);
    localStorage.removeItem(navbarSettingsKey);
    localStorage.removeItem(filamentSectionSettingsKey);

    setProducts(PRODUCTS_DATA);
    setOrders(INITIAL_ORDERS);
    setCoupons(COUPON_CODES);
    setCustomers(INITIAL_CUSTOMERS);
    setStoreSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setNavbarCategories(DEFAULT_NAVBAR_CATEGORIES);
    setNavbarSettings(DEFAULT_NAVBAR_SETTINGS);
    setFilamentSectionSettings(DEFAULT_FILAMENT_SECTION_SETTINGS);
  }, [productsKey, ordersKey, couponsKey, customersKey, settingsKey, usersKey, authKey, navbarCategoriesKey, navbarSettingsKey, filamentSectionSettingsKey]);

  // Navbar Categories CRUD
  const addNavbarCategory = useCallback((newCat) => {
    const id = newCat.id ? newCat.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : `cat-${Date.now().toString(36)}`;
    const order = newCat.order || (navbarCategories.length + 1);
    const catToAdd = {
      ...newCat,
      id,
      order: Number(order),
      active: newCat.active !== undefined ? newCat.active : true
    };
    setNavbarCategories(prev => [...prev, catToAdd]);
  }, [navbarCategories.length]);

  const updateNavbarCategory = useCallback((id, updatedData) => {
    setNavbarCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updatedData } : c)));
  }, []);

  const deleteNavbarCategory = useCallback((id) => {
    setNavbarCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleNavbarCategoryActive = useCallback((id) => {
    setNavbarCategories(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));
  }, []);

  const updateNavbarSettings = useCallback((newSettings) => {
    setNavbarSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const reorderNavbarCategories = useCallback((reorderedCats) => {
    setNavbarCategories(reorderedCats);
  }, []);

  const resetNavbarCategoriesDefaults = useCallback(() => {
    localStorage.removeItem(navbarCategoriesKey);
    localStorage.removeItem(navbarSettingsKey);
    setNavbarCategories(DEFAULT_NAVBAR_CATEGORIES);
    setNavbarSettings(DEFAULT_NAVBAR_SETTINGS);
  }, [navbarCategoriesKey, navbarSettingsKey]);

  // Hero Slides & Banners CRUD
  const addHeroSlide = useCallback((newSlide) => {
    const id = newSlide.id || `slide-${Date.now().toString(36)}`;
    const order = newSlide.order || (heroSlides.length + 1);
    const slideToAdd = {
      ...newSlide,
      id,
      order: Number(order),
      active: newSlide.active !== undefined ? newSlide.active : true
    };
    setHeroSlides(prev => [...prev, slideToAdd]);
  }, [heroSlides.length]);

  const updateHeroSlide = useCallback((id, updatedData) => {
    setHeroSlides(prev => prev.map(s => (s.id === id ? { ...s, ...updatedData } : s)));
  }, []);

  const deleteHeroSlide = useCallback((id) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  }, []);

  const toggleHeroSlideActive = useCallback((id) => {
    setHeroSlides(prev => prev.map(s => (s.id === id ? { ...s, active: !s.active } : s)));
  }, []);

  const reorderHeroSlides = useCallback((reorderedSlides) => {
    setHeroSlides(reorderedSlides);
  }, []);

  const addHeroSideBanner = useCallback((newBanner) => {
    const id = newBanner.id || `side-${Date.now().toString(36)}`;
    const order = newBanner.order || (heroSideBanners.length + 1);
    const bannerToAdd = {
      ...newBanner,
      id,
      order: Number(order),
      active: newBanner.active !== undefined ? newBanner.active : true
    };
    setHeroSideBanners(prev => [...prev, bannerToAdd]);
  }, [heroSideBanners.length]);

  const updateHeroSideBanner = useCallback((id, updatedData) => {
    setHeroSideBanners(prev => prev.map(b => (b.id === id ? { ...b, ...updatedData } : b)));
  }, []);

  const deleteHeroSideBanner = useCallback((id) => {
    setHeroSideBanners(prev => prev.filter(b => b.id !== id));
  }, []);

  const toggleHeroSideBannerActive = useCallback((id) => {
    setHeroSideBanners(prev => prev.map(b => (b.id === id ? { ...b, active: !b.active } : b)));
  }, []);

  const reorderHeroSideBanners = useCallback((reorderedBanners) => {
    setHeroSideBanners(reorderedBanners);
  }, []);

  const updateHeroSettings = useCallback((newSettings) => {
    setHeroSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetHeroDefaults = useCallback(() => {
    localStorage.removeItem(heroSlidesKey);
    localStorage.removeItem(heroSideBannersKey);
    localStorage.removeItem(heroSettingsKey);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setHeroSideBanners(DEFAULT_HERO_SIDE_BANNERS);
    setHeroSettings(DEFAULT_HERO_SETTINGS);
  }, [heroSlidesKey, heroSideBannersKey, heroSettingsKey]);

  // Filament Section Settings
  const updateFilamentSectionSettings = useCallback((newSettings) => {
    setFilamentSectionSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetFilamentSectionDefaults = useCallback(() => {
    localStorage.removeItem(filamentSectionSettingsKey);
    setFilamentSectionSettings(DEFAULT_FILAMENT_SECTION_SETTINGS);
  }, [filamentSectionSettingsKey]);

  // Master Memoized Context Value
  const contextValue = useMemo(() => ({
    // Auth & Profile
    currentUser,
    users,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    logout,
    updateProfile,

    // Cart & Navigation
    items,
    wishlist,
    appliedCoupon,
    theme,
    currentView,
    setCurrentView,
    adminActiveTab,
    setAdminActiveTab,
    navigateToAdmin,
    navigateToStorefront,
    navigateToHome,
    navigateToFilaments,
    navigateToCustom3DPrint,
    navigateTo404,
    isCartOpen,
    setIsCartOpen,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    isCheckoutOpen,
    checkoutStep,
    setCheckoutStep,
    openCheckoutModal,
    closeCheckoutModal,

    // Storefront Filters
    currentCategory,
    setCurrentCategory,
    currentTag,
    setCurrentTag,
    maxPrice,
    setMaxPrice,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters,

    // Performance-Calculated Cart Totals
    totalCount: cartCalculations.totalCount,
    subtotal: cartCalculations.subtotal,
    originalSubtotal: cartCalculations.originalSubtotal,
    discountAmount: cartCalculations.discountAmount,
    shippingCost: cartCalculations.shippingCost,
    total: cartCalculations.total,
    gst: cartCalculations.gst,
    freeShipping: cartCalculations.freeShipping,
    totalSavings: cartCalculations.totalSavings,

    // Cart Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    isInWishlist,
    toggleTheme,
    showToast,

    // Admin Catalog & Operations
    products,
    orders,
    coupons,
    customers,
    storeSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    addCoupon,
    deleteCoupon,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    toggleUserStatus,
    updateStoreSettings,
    resetDemoData,

    // Navbar Categories Manager
    navbarCategories,
    navbarSettings,
    addNavbarCategory,
    updateNavbarCategory,
    deleteNavbarCategory,
    toggleNavbarCategoryActive,
    updateNavbarSettings,
    reorderNavbarCategories,
    resetNavbarCategoriesDefaults,

    // Hero Carousel Manager
    heroSlides,
    heroSideBanners,
    heroSettings,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideActive,
    reorderHeroSlides,
    addHeroSideBanner,
    updateHeroSideBanner,
    deleteHeroSideBanner,
    toggleHeroSideBannerActive,
    reorderHeroSideBanners,
    updateHeroSettings,
    resetHeroDefaults,

    // 3D Filaments & Materials Hub
    filamentSubcategories,
    activeFilamentSubcategory,
    setActiveFilamentSubcategory,
    updateFilamentSubcategory,
    addFilamentSubcategory,
    toggleFilamentSubcategoryPublish,
    deleteFilamentSubcategory,
    resetFilamentSubcategoriesDefaults,

    // Storefront Filament Section Settings
    filamentSectionSettings,
    updateFilamentSectionSettings,
    resetFilamentSectionDefaults
  }), [
    currentUser,
    users,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    logout,
    updateProfile,
    items,
    wishlist,
    appliedCoupon,
    theme,
    currentView,
    adminActiveTab,
    setAdminActiveTab,
    navigateToAdmin,
    navigateToStorefront,
    navigateToHome,
    navigateToFilaments,
    navigateToCustom3DPrint,
    navigateTo404,
    isCartOpen,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    isCheckoutOpen,
    checkoutStep,
    openCheckoutModal,
    closeCheckoutModal,
    currentCategory,
    currentTag,
    maxPrice,
    searchQuery,
    sortBy,
    resetFilters,
    cartCalculations,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    isInWishlist,
    toggleTheme,
    showToast,
    products,
    orders,
    coupons,
    customers,
    storeSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    addCoupon,
    deleteCoupon,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    toggleUserStatus,
    updateStoreSettings,
    resetDemoData,
    navbarCategories,
    navbarSettings,
    addNavbarCategory,
    updateNavbarCategory,
    deleteNavbarCategory,
    toggleNavbarCategoryActive,
    updateNavbarSettings,
    reorderNavbarCategories,
    resetNavbarCategoriesDefaults,
    heroSlides,
    heroSideBanners,
    heroSettings,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideActive,
    reorderHeroSlides,
    addHeroSideBanner,
    updateHeroSideBanner,
    deleteHeroSideBanner,
    toggleHeroSideBannerActive,
    reorderHeroSideBanners,
    updateHeroSettings,
    resetHeroDefaults,
    filamentSubcategories,
    activeFilamentSubcategory,
    updateFilamentSubcategory,
    addFilamentSubcategory,
    toggleFilamentSubcategoryPublish,
    deleteFilamentSubcategory,
    resetFilamentSubcategoriesDefaults,
    filamentSectionSettings,
    updateFilamentSectionSettings,
    resetFilamentSectionDefaults
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
