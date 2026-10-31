import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, COUPON_CODES, FILAMENT_SUBCATEGORIES, DEFAULT_FILAMENT_COLORS } from '../data/productsData';
import {
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_DATASHEETS,
  INITIAL_SETTINGS,
  INITIAL_USERS
} from '../data/adminDemoData';
import {
  DEFAULT_BUILDER_PRESETS,
  DEFAULT_BUILDER_SLOTS,
  DEFAULT_BUILDER_SETTINGS
} from '../data/robotBuilderData';
import { api } from '../services/api';

export const DEFAULT_NAVBAR_CATEGORIES = [
  { id: 'filaments', name: '3D Filament Spool', icon: '🧵', badge: '1KG SPOOLS', badgeType: 'hot', targetType: 'link', targetUrl: '#filament-hub-section', active: true, order: 1 },
  { id: '3d-products', name: '3D Print Product', icon: '📦', badge: 'FINISHED PRINTS', badgeType: 'pro', targetType: 'link', targetUrl: '#section-3d-print-products', active: true, order: 2 },
  { id: 'custom-3d-print', name: 'Custom 3D Print', icon: '🖨️', badge: 'INSTANT QUOTE', badgeType: 'new', targetType: 'link', targetUrl: '#custom-3d-print', active: true, order: 3 }
];

export const DEFAULT_NAVBAR_SETTINGS = {
  enabled: true, // Master toggle: publish / unpublish on storefront home page
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
  enabled: true, // Master toggle: publish / unpublish Hero Section from home page
  autoplay: true,
  autoplayInterval: 5000,
  showSideBanners: true
};

export const DEFAULT_FLASH_DEALS_SETTINGS = {
  enabled: true, // Master toggle: publish / unpublish on home page
  title: 'Flash Maker Deals of the Day',
  subtitle: 'Limited stock at special tournament discount pricing',
  icon: '🔥',
  badgeText: 'ENDS TODAY',
  showCountdown: true,
  countdownSeconds: 14 * 3600 + 42 * 60 + 19,
  maxProducts: 4,
  customProductIds: [] // If empty, auto picks products with isDeal: true
};

export const DEFAULT_FILAMENT_SECTION_SETTINGS = {
  enabled: true, // Master toggle: publish / unpublish on home page
  title: '3D Printer Filament Spool Zone',
  subtitle: 'Precision 1.75mm engineering filaments for rapid prototyping, combat robots & heat-resistant parts',
  icon: '🧵',
  badgeText: '', // empty = dynamic `${count} SUB-CATEGORIES AVAILABLE`
  buttonText: 'Explore All 3D Filaments',
  buttonLink: '#filaments-hub',
  showSubcategoriesGrid: true,
  showShelf: true,
  shelfTitle: '⭐ Popular In-Stock 1KG Spools',
  shelfSubtitle: 'Bambu Lab RFID & Standard 1KG spools vacuum-sealed with desiccant',
  shelfButtonText: 'View All Filaments',
  maxShelfProducts: 4,
  customShelfProductIds: [], // If empty, auto picks top filament products
  hiddenSubcategoryKeys: [] // Keys of subcategories hidden specifically from the home section
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
    // 1. Check URL search query parameter: ?tab=products or ?adminTab=products
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || params.get('adminTab') || params.get('section');
      if (tabParam && VALID_ADMIN_TABS.includes(tabParam.toLowerCase())) {
        return tabParam.toLowerCase();
      }
    } catch {}

    // 2. Check URL hash: #products or #tab=products
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

    // 3. Check pathname: /super/products
    try {
      const pathParts = window.location.pathname.toLowerCase().split('/').filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1];
      if (VALID_ADMIN_TABS.includes(lastPart)) {
        return lastPart;
      }
    } catch {}
  }

  // 4. Check localStorage fallback
  try {
    const saved = localStorage.getItem('creotex_admin_active_tab');
    if (saved && VALID_ADMIN_TABS.includes(saved.toLowerCase())) {
      return saved.toLowerCase();
    }
  } catch {}

  return 'dashboard';
};

export const CartProvider = ({ children }) => {
  // Storage Keys
  const cartKey = "creotex_cart_items";
  const wishlistKey = "creotex_wishlist_items";
  const compareKey = "creotex_compare_items";
  const couponKey = "creotex_applied_coupon";
  const themeKey = "creotex_theme_v3";
  const productsKey = "creotex_admin_products_v4";
  const ordersKey = "creotex_admin_orders";
  const couponsKey = "creotex_admin_coupons";
  const customersKey = "creotex_admin_customers";
  const datasheetsKey = "creotex_admin_datasheets";
  const settingsKey = "creotex_admin_settings";
  const viewKey = "creotex_current_view";
  const adminTabKey = "creotex_admin_active_tab";
  const usersKey = "creotex_users";
  const authKey = "creotex_auth_user";
  const builderPresetsKey = "creotex_admin_builder_presets";
  const builderSlotsKey = "creotex_admin_builder_slots";
  const builderSettingsKey = "creotex_admin_builder_settings";
  const navbarCategoriesKey = "creotex_navbar_categories_v4";
  const navbarSettingsKey = "creotex_navbar_settings_v4";
  const heroSlidesKey = "creotex_hero_slides_v4";
  const heroSideBannersKey = "creotex_hero_side_banners_v4";
  const heroSettingsKey = "creotex_hero_settings";
  const filamentSubcategoriesKey = "creotex_filament_subcategories";
  const flashDealsSettingsKey = "creotex_flash_deals_settings";
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
  const [compareList, setCompareList] = useState(() => load(compareKey, []));
  const [appliedCoupon, setAppliedCoupon] = useState(() => load(couponKey, null));
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(themeKey);
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return "light";
  });
  const [toasts, setToasts] = useState([]);

  // Auth & User State
  const [users, setUsers] = useState(() => load(usersKey, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => load(authKey, null));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'signup' | 'profile'

  // Navigation & Admin View State - persist across reload
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes('super') || h.includes('super') || s.includes('super')) {
        return "admin";
      }
      if (p.includes('custom-3d') || h.includes('custom-3d') || s.includes('custom-3d')) {
        return "custom-3d-print";
      }
    }
    return localStorage.getItem(viewKey) || "storefront";
  });
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
  const [datasheets, setDatasheets] = useState(() => load(datasheetsKey, INITIAL_DATASHEETS));
  const [storeSettings, setStoreSettings] = useState(() => load(settingsKey, INITIAL_SETTINGS));

  // Custom Competition Robot Builder Data State
  const [robotBuilderPresets, setRobotBuilderPresets] = useState(() => load(builderPresetsKey, DEFAULT_BUILDER_PRESETS));
  const [robotBuilderSlots, setRobotBuilderSlots] = useState(() => load(builderSlotsKey, DEFAULT_BUILDER_SLOTS));
  const [robotBuilderSettings, setRobotBuilderSettings] = useState(() => load(builderSettingsKey, DEFAULT_BUILDER_SETTINGS));

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

  // Storefront Home Page Sections: Flash Deals & Filament Spool Zone
  const [flashDealsSettings, setFlashDealsSettings] = useState(() => load(flashDealsSettingsKey, DEFAULT_FLASH_DEALS_SETTINGS));
  const [filamentSectionSettings, setFilamentSectionSettings] = useState(() => load(filamentSectionSettingsKey, DEFAULT_FILAMENT_SECTION_SETTINGS));

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Filter & Search state (Storefront)
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentTag, setCurrentTag] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const freeShippingThreshold = storeSettings.freeShippingThreshold || 999;
  const standardShippingCost = storeSettings.standardShippingCost || 79;
  const gstRate = (storeSettings.gstRate || 18) / 100;

  useEffect(() => {
    localStorage.setItem(filamentSubcategoriesKey, JSON.stringify(filamentSubcategories));
  }, [filamentSubcategories]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(compareKey, JSON.stringify(compareList));
  }, [compareList]);

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
    localStorage.setItem(datasheetsKey, JSON.stringify(datasheets));
  }, [datasheets]);

  useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(builderPresetsKey, JSON.stringify(robotBuilderPresets));
  }, [robotBuilderPresets]);

  useEffect(() => {
    localStorage.setItem(builderSlotsKey, JSON.stringify(robotBuilderSlots));
  }, [robotBuilderSlots]);

  useEffect(() => {
    localStorage.setItem(builderSettingsKey, JSON.stringify(robotBuilderSettings));
  }, [robotBuilderSettings]);

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
    localStorage.setItem(flashDealsSettingsKey, JSON.stringify(flashDealsSettings));
  }, [flashDealsSettings]);

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

  // Persist admin active tab in localStorage
  useEffect(() => {
    if (adminActiveTab) {
      localStorage.setItem(adminTabKey, adminActiveTab);
    }
  }, [adminActiveTab]);

  // Keep browser URL in sync when in Super Admin view so page refresh stays on this exact page
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

  // Sync Theme attribute
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

  // Toast Notification (Disabled globally as requested)
  const showToast = () => {};

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

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Maker' : 'Light Maker'} Mode`, "info");
  };

  // View Navigation
  const setAdminActiveTab = (tab) => {
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
  };

  const navigateToAdmin = (tab = null) => {
    const targetTab = (tab && VALID_ADMIN_TABS.includes(tab))
      ? tab
      : (adminActiveTab && VALID_ADMIN_TABS.includes(adminActiveTab) ? adminActiveTab : getInitialAdminTab());
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
  };

  const navigateToStorefront = () => {
    setCurrentView("storefront");
    try {
      if (window.location.pathname.toLowerCase().includes('super') || window.location.hash.toLowerCase().includes('super') || window.location.search.toLowerCase().includes('tab=')) {
        window.history.pushState({ view: 'storefront' }, '', '/');
      }
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHome = () => {
    setCurrentCategory("all");
    setCurrentView("storefront");
    try {
      if (window.location.hash.includes('custom-3d') || window.location.hash.includes('filaments')) {
        window.history.pushState({ view: 'storefront' }, '', '/');
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToFilaments = (subCat = "all") => {
    setActiveFilamentSubcategory(subCat);
    setCurrentCategory("filaments");
    setCurrentView("filaments");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToCustom3DPrint = () => {
    setCurrentCategory("custom-3d-print");
    setCurrentView("custom-3d-print");
    try {
      window.history.pushState({ view: 'custom-3d-print' }, '', '/#custom-3d-print');
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= 3D FILAMENT SUBCATEGORY & COLOR VARIANT CRUD =================
  const updateFilamentSubcategory = (subCategoryKey, updatedMeta) => {
    // 1. Update subcategory metadata list
    setFilamentSubcategories(prev => prev.map(sub => {
      const match = (sub.subCategoryKey && sub.subCategoryKey.toLowerCase() === subCategoryKey.toLowerCase()) ||
                    (sub.id && updatedMeta.id && sub.id === updatedMeta.id);
      if (match) {
        return {
          ...sub,
          ...updatedMeta
        };
      }
      return sub;
    }));

    // 2. Synchronize the corresponding product in catalog
    setProducts(prev => prev.map(prod => {
      const match = (prod.subCategory && prod.subCategory.toLowerCase() === subCategoryKey.toLowerCase()) ||
                    (prod.category === 'filaments' && updatedMeta.productId && prod.id === updatedMeta.productId);

      if (match) {
        const updatedColors = updatedMeta.colors !== undefined ? updatedMeta.colors : (prod.colors || DEFAULT_FILAMENT_COLORS);
        const discountStr = (updatedMeta.originalPrice && updatedMeta.price && updatedMeta.originalPrice > updatedMeta.price)
          ? `${Math.round(((updatedMeta.originalPrice - updatedMeta.price) / updatedMeta.originalPrice) * 100)}% OFF`
          : prod.discount;

        return {
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
      }
      return prod;
    }));

    showToast(`Updated subcategory "${updatedMeta.displayName || subCategoryKey}" & colors!`, 'success');
  };

  const addFilamentSubcategory = (newSub) => {
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

    setFilamentSubcategories(prev => [fullSub, ...prev]);

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
    showToast(`Added new filament subcategory "${fullSub.displayName}"!`, 'success');
    return fullSub;
  };

  const toggleFilamentSubcategoryPublish = (subKey) => {
    setFilamentSubcategories(prev => prev.map(s => {
      if (s.subCategoryKey.toLowerCase() === subKey.toLowerCase()) {
        const nextStatus = s.published === false ? true : false;
        return { ...s, published: nextStatus };
      }
      return s;
    }));

    setProducts(prev => prev.map(p => {
      if (p.subCategory && p.subCategory.toLowerCase() === subKey.toLowerCase()) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    }));

    showToast(`Toggled visibility for subcategory "${subKey}".`, 'info');
  };

  const deleteFilamentSubcategory = async (subKey) => {
    const nextSubcategories = filamentSubcategories.filter(
      s => s.subCategoryKey.toLowerCase() !== subKey.toLowerCase()
    );

    await persistDelete(
      () => Promise.all([
        api.products.deleteBySubcategory(subKey),
        api.settings.update({ filamentSubcategories: nextSubcategories })
      ]),
      () => {
        setFilamentSubcategories(nextSubcategories);
        setProducts(prev => prev.filter(p => !p.subCategory || p.subCategory.toLowerCase() !== subKey.toLowerCase()));
        showToast(`Removed subcategory "${subKey}" from system.`, 'info');
      },
      `subcategory "${subKey}"`
    );
  };

  const resetFilamentSubcategoriesDefaults = () => {
    try {
      localStorage.removeItem(filamentSubcategoriesKey);
    } catch {}
    setFilamentSubcategories(FILAMENT_SUBCATEGORIES);
    showToast(`Reset filament subcategories to factory defaults.`, 'info');
  };


  // URL route change listener (popstate / hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes('super') || h.includes('super') || s.includes('super')) {
        setCurrentView("admin");
        const detectedTab = getInitialAdminTab();
        if (detectedTab && detectedTab !== adminActiveTab) {
          setAdminActiveTabState(detectedTab);
          localStorage.setItem(adminTabKey, detectedTab);
        }
      } else {
        const storedView = localStorage.getItem(viewKey);
        if (storedView !== 'admin') {
          setCurrentView("storefront");
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [adminActiveTab]);

  // ================= AUTHENTICATION METHODS =================
  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email, password, authenticatedUser = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (authenticatedUser) {
      const loggedInUser = {
        ...(found || {}),
        ...authenticatedUser,
        email: authenticatedUser.email.toLowerCase()
      };
      setUsers(prev => (
        prev.some(u => u.email.toLowerCase() === cleanEmail)
          ? prev.map(u => u.email.toLowerCase() === cleanEmail ? loggedInUser : u)
          : [loggedInUser, ...prev]
      ));
      setCurrentUser(loggedInUser);
      setIsAuthModalOpen(false);
      return { success: true, user: loggedInUser };
    }

    if (!found) {
      showToast("Account not found. Please sign up or check email.", "error");
      return { success: false, message: "Account not found." };
    }

    if (found.password !== password) {
      showToast("Invalid password! Please try again.", "error");
      return { success: false, message: "Invalid password." };
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${found.name}! 👋`, "success");

    return { success: true, user: found };
  };

  const signup = (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      showToast("An account with this email already exists. Please log in.", "error");
      return { success: false, message: "Email already registered." };
    }

    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      phone: userData.phone ? userData.phone.trim() : "+91 98765 00000",
      city: userData.city ? userData.city.trim() : "India",
      role: "customer",
      tier: userData.tier || "Student Maker",
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    // Add to users
    setUsers(prev => [newUser, ...prev]);

    // Add to customer accounts
    setCustomers(prev => [
      {
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        tier: newUser.tier,
        totalOrders: 0,
        totalSpent: 0,
        status: "Active",
        joinedDate: newUser.joinedDate
      },
      ...prev
    ]);

    // Auto-login
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Account created! Welcome to Creotex, ${newUser.name}! 🚀`, "success");

    return { success: true, user: newUser };
  };

  const logout = () => {
    const wasAdmin = currentUser?.role === 'super_admin';
    localStorage.removeItem('creotex_auth_token');
    localStorage.removeItem(adminTabKey);
    setCurrentUser(null);
    setIsAuthModalOpen(false);
    if (wasAdmin && currentView === 'admin') {
      navigateToStorefront();
    }
    showToast("You have been logged out successfully.", "info");
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setCustomers(prev => prev.map(c => c.email === updated.email ? { ...c, ...updatedFields } : c));
    showToast("Profile updated successfully!", "success");
  };

  // ================= ADMIN USER ACCOUNTS CRUD =================
  const addUser = (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      showToast("A user account with this email already exists.", "error");
      return { success: false, message: "Email already registered." };
    }

    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password || "maker123",
      phone: userData.phone ? userData.phone.trim() : "+91 98765 00000",
      city: userData.city ? userData.city.trim() : "Bengaluru",
      role: userData.role || "customer",
      tier: userData.tier || (userData.role === 'super_admin' ? 'Super Admin' : 'Maker Pro'),
      status: userData.status || "Active",
      joinedDate: new Date().toISOString().slice(0, 10),
      lastLogin: "Never"
    };

    setUsers(prev => [newUser, ...prev]);

    // Also sync to customer accounts directory if it's a customer / maker
    if (newUser.role !== 'super_admin') {
      setCustomers(prev => [
        {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          city: newUser.city,
          tier: newUser.tier,
          totalOrders: 0,
          totalSpent: 0,
          status: newUser.status,
          joinedDate: newUser.joinedDate
        },
        ...prev
      ]);
    }

    showToast(`User account for ${newUser.name} created!`, "success");
    return { success: true, user: newUser };
  };

  const updateUser = (id, updatedFields) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const merged = { ...u, ...updatedFields };
        if (currentUser && currentUser.id === id) {
          setCurrentUser(merged);
        }
        return merged;
      }
      return u;
    }));

    // Sync corresponding customer record
    setCustomers(prev => prev.map(c => {
      const user = users.find(u => u.id === id);
      if (user && (c.email.toLowerCase() === user.email.toLowerCase() || (updatedFields.email && c.email.toLowerCase() === updatedFields.email.toLowerCase()))) {
        return {
          ...c,
          name: updatedFields.name !== undefined ? updatedFields.name : c.name,
          email: updatedFields.email !== undefined ? updatedFields.email : c.email,
          phone: updatedFields.phone !== undefined ? updatedFields.phone : c.phone,
          city: updatedFields.city !== undefined ? updatedFields.city : c.city,
          tier: updatedFields.tier !== undefined ? updatedFields.tier : c.tier,
          status: updatedFields.status !== undefined ? updatedFields.status : c.status
        };
      }
      return c;
    }));

    showToast("User account details updated!", "success");
  };

  const deleteUser = (id) => {
    const target = users.find(u => u.id === id);
    if (target && target.role === 'super_admin' && users.filter(u => u.role === 'super_admin').length <= 1) {
      showToast("Cannot delete the primary Super Admin account!", "error");
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== id));
    if (target) {
      setCustomers(prev => prev.filter(c => c.email.toLowerCase() !== target.email.toLowerCase()));
    }
    showToast("User account removed from database.", "info");
  };

  const resetUserPassword = (id, newPassword) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, password: newPassword };
        if (currentUser && currentUser.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    showToast("Password updated for user!", "success");
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        const updated = { ...u, status: nextStatus };
        if (currentUser && currentUser.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    showToast("User account status toggled!", "info");
  };

  // ================= CART METHODS =================
  const addItem = (productId, quantity = 1, customConfig = null) => {
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

    showToast(`Added ${product.name.substring(0, 24)}... to cart!`, "success");
    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
    } else {
      setItems(prev => prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: Math.min(quantity, item.stock) };
        }
        return item;
      }));
    }
  };

  const removeItem = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // ================= COUPON METHODS =================
  const applyCoupon = (code) => {
    const upperCode = code.trim().toUpperCase();
    const coupon = coupons[upperCode];

    if (!coupon) {
      showToast("Invalid coupon code! Try ROBO10 or MAKER50", "error");
      return { success: false, message: "Invalid coupon code!" };
    }

    const subtotal = getSubtotal();
    if (subtotal < coupon.minOrder) {
      const msg = `Order subtotal must be at least ₹${coupon.minOrder} to apply ${upperCode}`;
      showToast(msg, "error");
      return { success: false, message: msg };
    }

    setAppliedCoupon({ code: upperCode, ...coupon });
    showToast(`Coupon ${upperCode} applied successfully!`, "success");
    return { success: true, message: "Coupon applied!" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.", "info");
  };

  // ================= WISHLIST & COMPARE =================
  const toggleWishlist = (productId) => {
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast("Removed from Wishlist", "info");
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast("Added to Wishlist!", "success");
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const toggleCompare = (productId) => {
    const exists = compareList.includes(productId);
    if (exists) {
      setCompareList(prev => prev.filter(id => id !== productId));
      showToast("Removed from comparison", "info");
    } else {
      if (compareList.length >= 4) {
        showToast("You can compare a maximum of 4 products at once.", "error");
        return;
      }
      setCompareList(prev => [...prev, productId]);
      showToast(`Added to comparison (${compareList.length + 1}/4)`, "info");
    }
  };

  const isInCompare = (productId) => compareList.includes(productId);
  const clearCompare = () => setCompareList([]);

  // ================= CALCULATIONS =================
  const getSubtotal = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getOriginalSubtotal = () => items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    if (!appliedCoupon) return 0;
    if (appliedCoupon.flatDiscount) {
      return Math.min(appliedCoupon.flatDiscount, subtotal);
    } else if (appliedCoupon.discountPercent) {
      return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }
    return 0;
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0 || subtotal >= freeShippingThreshold) return 0;
    return standardShippingCost;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    const discount = getDiscountAmount();
    const shipping = getShippingCost();
    return Math.max(0, subtotal - discount + shipping);
  };

  const getGstBreakdown = () => {
    const total = getTotal();
    const basePrice = Math.round(total / (1 + gstRate));
    const gstAmount = total - basePrice;
    return { basePrice, gstAmount };
  };

  const getFreeShippingProgress = () => {
    const subtotal = getSubtotal();
    const needed = Math.max(0, freeShippingThreshold - subtotal);
    const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    return {
      qualified: subtotal >= freeShippingThreshold,
      subtotal,
      threshold: freeShippingThreshold,
      needed,
      percent
    };
  };

  const totalCount = items.reduce((count, item) => count + item.quantity, 0);

  // Filters Reset
  const resetFilters = () => {
    setCurrentCategory("all");
    setCurrentTag("all");
    setMaxPrice(5000);
    setSearchQuery("");
    setSortBy("featured");
    showToast("All filters have been reset", "info");
  };

  const openQuickView = (productId) => {
    const product = typeof productId === 'object' ? productId : products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  const closeQuickView = () => setQuickViewProduct(null);

  const openCheckoutModal = () => {
    if (items.length === 0) {
      showToast("Your cart is empty! Add products first.", "error");
      return;
    }
    setIsCartOpen(false);
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  };

  const closeCheckoutModal = () => setIsCheckoutOpen(false);

  // ================= ADMIN PRODUCT CRUD =================
  const addProduct = (newProduct) => {
    const id = newProduct.id || `prod-${Date.now().toString(36)}`;
    const productToAdd = {
      ...newProduct,
      id,
      rating: newProduct.rating || 4.8,
      reviewsCount: newProduct.reviewsCount || 1,
      stock: parseInt(newProduct.stock, 10) || 0,
      price: parseFloat(newProduct.price) || 0,
      originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price) || 0,
      tags: Array.isArray(newProduct.tags) ? newProduct.tags : (newProduct.tags || "").split(",").map(t => t.trim()).filter(Boolean),
      specs: typeof newProduct.specs === 'object' ? newProduct.specs : {}
    };

    setProducts(prev => [productToAdd, ...prev]);
    showToast(`Product "${productToAdd.name}" added successfully!`, "success");
    return productToAdd;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          stock: updatedFields.stock !== undefined ? parseInt(updatedFields.stock, 10) : p.stock,
          price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : p.price,
          originalPrice: updatedFields.originalPrice !== undefined ? parseFloat(updatedFields.originalPrice) : p.originalPrice
        };
      }
      return p;
    }));
    showToast(`Product updated successfully!`, "success");
  };

  const deleteProduct = async (id) => {
    await persistDelete(
      () => api.products.delete(id),
      () => {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast("Product deleted from catalog", "info");
      },
      'product'
    );
  };

  const updateStock = (id, newStock) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock: Math.max(0, parseInt(newStock, 10) || 0) } : p)));
    showToast("Stock updated successfully!", "success");
  };

  // ================= ADMIN ORDER MANAGEMENT =================
  const createOrder = (orderData) => {
    const newOrder = {
      id: orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customer: orderData.customer,
      items: orderData.items || items,
      subtotal: orderData.subtotal || getSubtotal(),
      discount: orderData.discount || getDiscountAmount(),
      shipping: orderData.shipping || getShippingCost(),
      tax: orderData.tax || getGstBreakdown().gstAmount,
      totalAmount: orderData.totalAmount || getTotal(),
      couponApplied: orderData.couponApplied || (appliedCoupon ? appliedCoupon.code : null),
      paymentMethod: orderData.paymentMethod || "UPI",
      paymentStatus: orderData.paymentStatus || "Paid",
      orderStatus: orderData.orderStatus || "Processing",
      trackingNumber: orderData.trackingNumber || `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    // Deduct stock
    setProducts(prev => prev.map(prod => {
      const purchased = (orderData.items || items).find(item => item.id === prod.id);
      if (purchased) {
        return { ...prod, stock: Math.max(0, prod.stock - purchased.quantity) };
      }
      return prod;
    }));

    // Update customer stats
    if (orderData.customer && orderData.customer.email) {
      setCustomers(prev => {
        const existing = prev.find(c => c.email === orderData.customer.email);
        if (existing) {
          return prev.map(c => c.email === orderData.customer.email ? {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalSpent: c.totalSpent + (orderData.totalAmount || getTotal())
          } : c);
        } else {
          return [
            ...prev,
            {
              id: `CUST-${Date.now().toString().slice(-4)}`,
              name: orderData.customer.name,
              email: orderData.customer.email,
              phone: orderData.customer.phone,
              city: orderData.customer.city || "India",
              tier: "Hobbyist",
              totalOrders: 1,
              totalSpent: orderData.totalAmount || getTotal(),
              status: "Active",
              joinedDate: new Date().toISOString().slice(0, 10)
            }
          ];
        }
      });
    }

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, trackingNumber = null) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: newStatus,
          trackingNumber: trackingNumber !== null ? trackingNumber : ord.trackingNumber
        };
      }
      return ord;
    }));
    showToast(`Order ${orderId} status set to ${newStatus}`, "success");
  };

  const deleteOrder = async (orderId) => {
    await persistDelete(
      () => api.orders.delete(orderId),
      () => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        showToast(`Order ${orderId} removed`, "info");
      },
      `order ${orderId}`
    );
  };

  // ================= ADMIN COUPONS =================
  const addCoupon = (code, couponData) => {
    const upper = code.trim().toUpperCase();
    setCoupons(prev => ({
      ...prev,
      [upper]: couponData
    }));
    showToast(`Coupon ${upper} added!`, "success");
  };

  const deleteCoupon = async (code) => {
    await persistDelete(
      () => api.coupons.delete(code),
      () => {
        setCoupons(prev => {
          const next = { ...prev };
          delete next[code];
          return next;
        });
        showToast(`Coupon ${code} deleted`, "info");
      },
      `coupon ${code}`
    );
  };

  // ================= ADMIN CUSTOMERS =================
  const addCustomer = (customerData) => {
    const id = `CUST-${Date.now().toString().slice(-4)}`;
    const newCust = {
      ...customerData,
      id,
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
      joinedDate: new Date().toISOString().slice(0, 10)
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(`Customer ${newCust.name} added!`, "success");
  };

  const updateCustomer = (id, updated) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    showToast("Customer record updated", "success");
  };

  const deleteCustomer = async (id) => {
    await persistDelete(
      () => api.customers.delete(id),
      () => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        showToast("Customer record deleted", "info");
      },
      'customer'
    );
  };

  // ================= ADMIN DATASHEETS =================
  const addDatasheet = (data) => {
    const id = `DS-${Date.now().toString().slice(-3)}`;
    const newDs = {
      ...data,
      id,
      downloads: 0,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
    setDatasheets(prev => [newDs, ...prev]);
    showToast("Technical Datasheet added!", "success");
  };

  const deleteDatasheet = async (id) => {
    await persistDelete(
      () => api.datasheets.delete(id),
      () => {
        setDatasheets(prev => prev.filter(d => d.id !== id));
        showToast("Datasheet removed", "info");
      },
      'datasheet'
    );
  };

  // ================= ROBOT BUILDER ADMIN CRUD =================
  const updateRobotBuilderSettings = (newSettings) => {
    setRobotBuilderSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Robot Builder settings updated!", "success");
  };

  const saveRobotBuilderPreset = (presetKey, presetData) => {
    setRobotBuilderPresets(prev => ({
      ...prev,
      [presetKey]: {
        ...prev[presetKey],
        ...presetData,
        id: presetKey
      }
    }));
    showToast(`Preset "${presetData.name || presetKey}" saved successfully!`, "success");
  };

  const deleteRobotBuilderPreset = async (presetKey) => {
    const nextPresets = { ...robotBuilderPresets };
    delete nextPresets[presetKey];

    await persistDelete(
      () => api.robotBuilder.updatePresets(nextPresets),
      () => {
        setRobotBuilderPresets(nextPresets);
        showToast(`Preset "${presetKey}" removed`, "info");
      },
      `robot preset "${presetKey}"`
    );
  };

  const saveRobotBuilderSlot = (slotKey, slotData) => {
    setRobotBuilderSlots(prev => {
      const existingIdx = prev.findIndex(s => s.key === slotKey);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...slotData };
        return updated;
      } else {
        return [...prev, { key: slotKey, ...slotData, options: slotData.options || [] }];
      }
    });
    showToast(`Slot "${slotData.name || slotKey}" saved!`, "success");
  };

  const deleteRobotBuilderSlot = async (slotKey) => {
    const nextSlots = robotBuilderSlots.filter(s => s.key !== slotKey);
    await persistDelete(
      () => api.robotBuilder.updateSlots(nextSlots),
      () => {
        setRobotBuilderSlots(nextSlots);
        showToast(`Slot "${slotKey}" deleted`, "info");
      },
      `robot builder slot "${slotKey}"`
    );
  };

  const addSlotOption = (slotKey, optionData) => {
    const optId = optionData.id || `opt-${Date.now().toString(36)}`;
    const newOpt = {
      ...optionData,
      id: optId,
      price: parseFloat(optionData.price) || 0
    };

    setRobotBuilderSlots(prev => prev.map(slot => {
      if (slot.key === slotKey) {
        return {
          ...slot,
          options: [...(slot.options || []), newOpt]
        };
      }
      return slot;
    }));
    showToast(`Added "${newOpt.name}" to ${slotKey}!`, "success");
  };

  const updateSlotOption = (slotKey, optionId, optionData) => {
    setRobotBuilderSlots(prev => prev.map(slot => {
      if (slot.key === slotKey) {
        return {
          ...slot,
          options: (slot.options || []).map(opt => (
            opt.id === optionId
              ? { ...opt, ...optionData, price: parseFloat(optionData.price !== undefined ? optionData.price : opt.price) || 0 }
              : opt
          ))
        };
      }
      return slot;
    }));
    showToast("Component option updated successfully!", "success");
  };

  const deleteSlotOption = async (slotKey, optionId) => {
    const nextSlots = robotBuilderSlots.map(slot => {
      if (slot.key === slotKey) {
        return {
          ...slot,
          options: (slot.options || []).filter(opt => opt.id !== optionId)
        };
      }
      return slot;
    });

    await persistDelete(
      () => api.robotBuilder.updateSlots(nextSlots),
      () => {
        setRobotBuilderSlots(nextSlots);
        showToast("Component option removed from slot", "info");
      },
      'robot builder component'
    );
  };

  const resetRobotBuilderDefaults = () => {
    localStorage.removeItem(builderPresetsKey);
    localStorage.removeItem(builderSlotsKey);
    localStorage.removeItem(builderSettingsKey);
    setRobotBuilderPresets(DEFAULT_BUILDER_PRESETS);
    setRobotBuilderSlots(DEFAULT_BUILDER_SLOTS);
    setRobotBuilderSettings(DEFAULT_BUILDER_SETTINGS);
    showToast("Restored Robot Builder factory presets & slots!", "info");
  };

  // ================= SETTINGS & RESET =================
  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Store settings saved successfully!", "success");
  };

  const resetDemoData = () => {
    localStorage.removeItem(productsKey);
    localStorage.removeItem(ordersKey);
    localStorage.removeItem(couponsKey);
    localStorage.removeItem(customersKey);
    localStorage.removeItem(datasheetsKey);
    localStorage.removeItem(settingsKey);
    localStorage.removeItem(usersKey);
    localStorage.removeItem(authKey);
    localStorage.removeItem(builderPresetsKey);
    localStorage.removeItem(builderSlotsKey);
    localStorage.removeItem(builderSettingsKey);

    localStorage.removeItem(navbarCategoriesKey);
    localStorage.removeItem(navbarSettingsKey);
    localStorage.removeItem(flashDealsSettingsKey);
    localStorage.removeItem(filamentSectionSettingsKey);

    setProducts(PRODUCTS_DATA);
    setOrders(INITIAL_ORDERS);
    setCoupons(COUPON_CODES);
    setCustomers(INITIAL_CUSTOMERS);
    setDatasheets(INITIAL_DATASHEETS);
    setStoreSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setRobotBuilderPresets(DEFAULT_BUILDER_PRESETS);
    setRobotBuilderSlots(DEFAULT_BUILDER_SLOTS);
    setRobotBuilderSettings(DEFAULT_BUILDER_SETTINGS);
    setNavbarCategories(DEFAULT_NAVBAR_CATEGORIES);
    setNavbarSettings(DEFAULT_NAVBAR_SETTINGS);
    setFlashDealsSettings(DEFAULT_FLASH_DEALS_SETTINGS);
    setFilamentSectionSettings(DEFAULT_FILAMENT_SECTION_SETTINGS);

    showToast("Reset all store, accounts & demo data to original state", "info");
  };

  // ================= NAVBAR CATEGORIES CRUD =================
  const addNavbarCategory = (newCat) => {
    const id = newCat.id ? newCat.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : `cat-${Date.now().toString(36)}`;
    const order = newCat.order || (navbarCategories.length + 1);
    const catToAdd = {
      ...newCat,
      id,
      order: Number(order),
      active: newCat.active !== false
    };
    setNavbarCategories(prev => [...prev, catToAdd]);
    showToast(`Category "${catToAdd.name}" added to Navbar!`, "success");
    return catToAdd;
  };

  const updateNavbarCategory = (id, updatedCat) => {
    setNavbarCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCat } : c));
    showToast(`Navbar category updated!`, "success");
  };

  const deleteNavbarCategory = async (id) => {
    const nextCategories = navbarCategories.filter(c => c.id !== id);
    await persistDelete(
      () => api.settings.update({ navbarCategories: nextCategories }),
      () => {
        setNavbarCategories(nextCategories);
        showToast(`Category removed from Navbar!`, "info");
      },
      'navbar category'
    );
  };

  const toggleNavbarCategoryActive = (id) => {
    setNavbarCategories(prev => prev.map(c => {
      if (c.id === id) {
        const nextActive = !c.active;
        showToast(`Category "${c.name}" is now ${nextActive ? 'PUBLISHED' : 'UNPUBLISHED (Hidden)'}!`, nextActive ? "success" : "info");
        return { ...c, active: nextActive };
      }
      return c;
    }));
  };

  const updateNavbarSettings = (newSettings) => {
    setNavbarSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Navbar categories settings updated!", "success");
  };

  const reorderNavbarCategories = (reorderedList) => {
    setNavbarCategories(reorderedList.map((cat, idx) => ({ ...cat, order: idx + 1 })));
    showToast("Navbar order updated!", "success");
  };

  const resetNavbarCategoriesDefaults = () => {
    localStorage.removeItem(navbarCategoriesKey);
    localStorage.removeItem(navbarSettingsKey);
    setNavbarCategories(DEFAULT_NAVBAR_CATEGORIES);
    setNavbarSettings(DEFAULT_NAVBAR_SETTINGS);
    showToast("Navbar categories reset to factory defaults!", "info");
  };

  // ================= HERO SLIDES & SIDE PROMO BANNERS CRUD =================
  const addHeroSlide = (slideData) => {
    const id = slideData.id || `slide-${Date.now()}`;
    const newSlide = {
      ...slideData,
      id,
      order: slideData.order || (heroSlides.length + 1),
      active: slideData.active !== false
    };
    setHeroSlides(prev => [...prev, newSlide]);
    showToast(`Hero Slide "${slideData.titleHighlight || slideData.title}" added successfully!`, "success");
    return newSlide;
  };

  const updateHeroSlide = (id, updatedData) => {
    setHeroSlides(prev => prev.map(s => (s.id === id ? { ...s, ...updatedData } : s)));
    showToast("Hero Slide updated successfully!", "success");
  };

  const deleteHeroSlide = async (id) => {
    const nextSlides = heroSlides.filter(s => s.id !== id);
    await persistDelete(
      () => api.settings.update({ heroSlides: nextSlides }),
      () => {
        setHeroSlides(nextSlides);
        showToast("Hero Slide removed!", "info");
      },
      'hero slide'
    );
  };

  const toggleHeroSlideActive = (id) => {
    setHeroSlides(prev => prev.map(s => {
      if (s.id === id) {
        const nextActive = !s.active;
        showToast(`Hero Slide is now ${nextActive ? 'PUBLISHED (Visible)' : 'UNPUBLISHED (Hidden)'}!`, nextActive ? "success" : "info");
        return { ...s, active: nextActive };
      }
      return s;
    }));
  };

  const reorderHeroSlides = (reorderedList) => {
    setHeroSlides(reorderedList.map((slide, idx) => ({ ...slide, order: idx + 1 })));
    showToast("Hero slides order updated!", "success");
  };

  const addHeroSideBanner = (bannerData) => {
    const id = bannerData.id || `side-${Date.now()}`;
    const newBanner = {
      ...bannerData,
      id,
      order: bannerData.order || (heroSideBanners.length + 1),
      active: bannerData.active !== false
    };
    setHeroSideBanners(prev => [...prev, newBanner]);
    showToast(`Side Promo Banner "${bannerData.title}" added successfully!`, "success");
    return newBanner;
  };

  const updateHeroSideBanner = (id, updatedData) => {
    setHeroSideBanners(prev => prev.map(b => (b.id === id ? { ...b, ...updatedData } : b)));
    showToast("Side Banner updated successfully!", "success");
  };

  const deleteHeroSideBanner = async (id) => {
    const nextBanners = heroSideBanners.filter(b => b.id !== id);
    await persistDelete(
      () => api.settings.update({ heroSideBanners: nextBanners }),
      () => {
        setHeroSideBanners(nextBanners);
        showToast("Side Banner removed!", "info");
      },
      'side banner'
    );
  };

  const toggleHeroSideBannerActive = (id) => {
    setHeroSideBanners(prev => prev.map(b => {
      if (b.id === id) {
        const nextActive = !b.active;
        showToast(`Side Banner is now ${nextActive ? 'PUBLISHED (Visible)' : 'UNPUBLISHED (Hidden)'}!`, nextActive ? "success" : "info");
        return { ...b, active: nextActive };
      }
      return b;
    }));
  };

  const reorderHeroSideBanners = (reorderedList) => {
    setHeroSideBanners(reorderedList.map((banner, idx) => ({ ...banner, order: idx + 1 })));
    showToast("Side banners order updated!", "success");
  };

  const updateHeroSettings = (newSettings) => {
    setHeroSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Hero section settings updated!", "success");
  };

  const resetHeroDefaults = () => {
    localStorage.removeItem(heroSlidesKey);
    localStorage.removeItem(heroSideBannersKey);
    localStorage.removeItem(heroSettingsKey);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setHeroSideBanners(DEFAULT_HERO_SIDE_BANNERS);
    setHeroSettings(DEFAULT_HERO_SETTINGS);
    showToast("Hero slider & banners reset to factory defaults!", "info");
  };

  // ================= FLASH DEALS & FILAMENT SECTION MANAGEMENT =================
  const updateFlashDealsSettings = (newSettings) => {
    setFlashDealsSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        api.settings.update({ flashDealsSettings: updated }).catch(() => {});
      } catch {}
      return updated;
    });
    showToast("Flash Deals settings saved successfully!", "success");
  };

  const updateFilamentSectionSettings = (newSettings) => {
    setFilamentSectionSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        api.settings.update({ filamentSectionSettings: updated }).catch(() => {});
      } catch {}
      return updated;
    });
    showToast("3D Filament Spool Zone settings saved successfully!", "success");
  };

  const toggleProductFlashDeal = (productId) => {
    const prod = (products || []).find(p => p.id === productId);
    if (!prod) return;
    const nextDealState = !prod.isDeal;

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isDeal: nextDealState } : p));

    setFlashDealsSettings(prev => {
      const currentList = prev.customProductIds || [];
      let nextList;
      if (nextDealState) {
        if (!currentList.includes(productId)) {
          nextList = [...currentList, productId];
        } else {
          nextList = currentList;
        }
      } else {
        nextList = currentList.filter(id => id !== productId);
      }
      return { ...prev, customProductIds: nextList };
    });

    showToast(`Product "${prod.name}" ${nextDealState ? 'added to' : 'removed from'} Flash Deals!`, nextDealState ? 'success' : 'info');
  };

  const addProductToFlashDeals = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isDeal: true } : p));
    setFlashDealsSettings(prev => {
      const baseList = prev.customProductIds && prev.customProductIds.length > 0
        ? prev.customProductIds
        : (products || []).filter(p => p.isDeal).map(p => p.id);
      if (!baseList.includes(productId)) {
        return { ...prev, customProductIds: [productId, ...baseList] };
      }
      return prev;
    });
    showToast("Added product to Flash Deals!", "success");
  };

  const removeProductFromFlashDeals = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isDeal: false } : p));
    setFlashDealsSettings(prev => {
      const baseList = prev.customProductIds && prev.customProductIds.length > 0
        ? prev.customProductIds
        : (products || []).filter(p => p.isDeal).map(p => p.id);
      return { ...prev, customProductIds: baseList.filter(id => id !== productId) };
    });
    showToast("Removed product from Flash Deals!", "info");
  };

  const reorderFlashDeals = (reorderedIds) => {
    setFlashDealsSettings(prev => ({ ...prev, customProductIds: reorderedIds }));
    showToast("Flash Deals display order updated!", "success");
  };

  const resetFlashDealsDefaults = () => {
    localStorage.removeItem(flashDealsSettingsKey);
    setFlashDealsSettings(DEFAULT_FLASH_DEALS_SETTINGS);
    showToast("Flash Deals restored to factory defaults!", "info");
  };

  const resetFilamentSectionDefaults = () => {
    localStorage.removeItem(filamentSectionSettingsKey);
    setFilamentSectionSettings(DEFAULT_FILAMENT_SECTION_SETTINGS);
    showToast("Filament Spool Zone restored to factory defaults!", "info");
  };

  return (
    <CartContext.Provider
      value={{
        // Authentication & Profile State
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

        // Storefront Cart & Nav
        items,
        wishlist,
        compareList,
        appliedCoupon,
        theme,
        toasts,
        currentView,
        setCurrentView,
        adminActiveTab,
        setAdminActiveTab,
        navigateToAdmin,
        navigateToStorefront,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isCompareOpen,
        setIsCompareOpen,
        isCheckoutOpen,
        checkoutStep,
        setCheckoutStep,
        openCheckoutModal,
        closeCheckoutModal,
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
        totalCount,
        subtotal: getSubtotal(),
        originalSubtotal: getOriginalSubtotal(),
        discountAmount: getDiscountAmount(),
        shippingCost: getShippingCost(),
        total: getTotal(),
        gst: getGstBreakdown(),
        freeShipping: getFreeShippingProgress(),
        totalSavings: (getOriginalSubtotal() - getSubtotal()) + getDiscountAmount(),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        clearCompare,
        toggleTheme,
        showToast,
        resetFilters,

        // Super Admin Dynamic Data & CRUD
        products,
        orders,
        coupons,
        customers,
        datasheets,
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
        addDatasheet,
        deleteDatasheet,
        updateStoreSettings,
        resetDemoData,

        // Custom Competition Robot Builder State & CRUD
        robotBuilderPresets,
        robotBuilderSlots,
        robotBuilderSettings,
        updateRobotBuilderSettings,
        saveRobotBuilderPreset,
        deleteRobotBuilderPreset,
        saveRobotBuilderSlot,
        deleteRobotBuilderSlot,
        addSlotOption,
        updateSlotOption,
        deleteSlotOption,
        resetRobotBuilderDefaults,

        // Storefront Navbar Categories & Navigation Manager State & CRUD
        navbarCategories,
        navbarSettings,
        addNavbarCategory,
        updateNavbarCategory,
        deleteNavbarCategory,
        toggleNavbarCategoryActive,
        updateNavbarSettings,
        reorderNavbarCategories,
        resetNavbarCategoriesDefaults,

        // Storefront Hero Carousel & Side Promo Banners State & CRUD
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

        // 3D Printer Filaments State, Subcategories & Colors
        filamentSubcategories,
        activeFilamentSubcategory,
        setActiveFilamentSubcategory,
        updateFilamentSubcategory,
        addFilamentSubcategory,
        toggleFilamentSubcategoryPublish,
        deleteFilamentSubcategory,
        resetFilamentSubcategoriesDefaults,
        navigateToFilaments,
        navigateToCustom3DPrint,
        navigateToHome,

        // Homepage Featured Sections: Flash Deals & Filament Spool Zone
        flashDealsSettings,
        filamentSectionSettings,
        updateFlashDealsSettings,
        updateFilamentSectionSettings,
        toggleProductFlashDeal,
        addProductToFlashDeals,
        removeProductFromFlashDeals,
        reorderFlashDeals,
        resetFlashDealsDefaults,
        resetFilamentSectionDefaults
      }}

    >
      {children}
    </CartContext.Provider>
  );
};

