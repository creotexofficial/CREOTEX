import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, COUPON_CODES } from '../data/productsData';
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

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Storage Keys
  const cartKey = "creotex_cart_items";
  const wishlistKey = "creotex_wishlist_items";
  const compareKey = "creotex_compare_items";
  const couponKey = "creotex_applied_coupon";
  const themeKey = "creotex_theme";
  const productsKey = "creotex_admin_products";
  const ordersKey = "creotex_admin_orders";
  const couponsKey = "creotex_admin_coupons";
  const customersKey = "creotex_admin_customers";
  const datasheetsKey = "creotex_admin_datasheets";
  const settingsKey = "creotex_admin_settings";
  const viewKey = "creotex_current_view";
  const usersKey = "creotex_users";
  const authKey = "creotex_auth_user";
  const builderPresetsKey = "creotex_admin_builder_presets";
  const builderSlotsKey = "creotex_admin_builder_slots";
  const builderSettingsKey = "creotex_admin_builder_settings";

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
  const [theme, setTheme] = useState(() => localStorage.getItem(themeKey) || "dark");
  const [toasts, setToasts] = useState([]);

  // Auth & User State
  const [users, setUsers] = useState(() => load(usersKey, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => load(authKey, null));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'signup' | 'profile'

  // Navigation & Admin View State
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes('super') || h.includes('super') || s.includes('super')) {
        return "admin";
      }
    }
    return localStorage.getItem(viewKey) || "storefront";
  });
  const [adminActiveTab, setAdminActiveTab] = useState("dashboard");

  // Dynamic Store Data with LocalStorage Sync
  const [products, setProducts] = useState(() => load(productsKey, PRODUCTS_DATA));
  const [orders, setOrders] = useState(() => load(ordersKey, INITIAL_ORDERS));
  const [coupons, setCoupons] = useState(() => load(couponsKey, COUPON_CODES));
  const [customers, setCustomers] = useState(() => load(customersKey, INITIAL_CUSTOMERS));
  const [datasheets, setDatasheets] = useState(() => load(datasheetsKey, INITIAL_DATASHEETS));
  const [storeSettings, setStoreSettings] = useState(() => load(settingsKey, INITIAL_SETTINGS));

  // Custom Competition Robot Builder Data State
  const [robotBuilderPresets, setRobotBuilderPresets] = useState(() => load(builderPresetsKey, DEFAULT_BUILDER_PRESETS));
  const [robotBuilderSlots, setRobotBuilderSlots] = useState(() => load(builderSlotsKey, DEFAULT_BUILDER_SLOTS));
  const [robotBuilderSettings, setRobotBuilderSettings] = useState(() => load(builderSettingsKey, DEFAULT_BUILDER_SETTINGS));

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
    localStorage.setItem(usersKey, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(authKey, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(authKey);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(viewKey, currentView);
  }, [currentView]);

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeKey, theme);
  }, [theme]);

  // Toast Notification
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Maker' : 'Light Maker'} Mode`, "info");
  };

  // View Navigation
  const navigateToAdmin = (tab = "dashboard") => {
    setAdminActiveTab(tab);
    setCurrentView("admin");
    try {
      if (!window.location.pathname.toLowerCase().includes('super') && !window.location.hash.toLowerCase().includes('super')) {
        window.history.pushState({ view: 'admin' }, '', '/super');
      }
    } catch {
      window.location.hash = 'super';
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToStorefront = () => {
    setCurrentView("storefront");
    try {
      if (window.location.pathname.toLowerCase().includes('super') || window.location.hash.toLowerCase().includes('super')) {
        window.history.pushState({ view: 'storefront' }, '', '/');
      }
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // URL route change listener (popstate / hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes('super') || h.includes('super') || s.includes('super')) {
        setCurrentView("admin");
      } else {
        setCurrentView("storefront");
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // ================= AUTHENTICATION METHODS =================
  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

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
    setCurrentUser(null);
    setIsAuthModalOpen(false);
    if (wasAdmin && currentView === 'admin') {
      setCurrentView('storefront');
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

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product deleted from catalog", "info");
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

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order ${orderId} removed`, "info");
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

  const deleteCoupon = (code) => {
    setCoupons(prev => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
    showToast(`Coupon ${code} deleted`, "info");
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

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast("Customer record deleted", "info");
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

  const deleteDatasheet = (id) => {
    setDatasheets(prev => prev.filter(d => d.id !== id));
    showToast("Datasheet removed", "info");
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

  const deleteRobotBuilderPreset = (presetKey) => {
    setRobotBuilderPresets(prev => {
      const next = { ...prev };
      delete next[presetKey];
      return next;
    });
    showToast(`Preset "${presetKey}" removed`, "info");
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

  const deleteRobotBuilderSlot = (slotKey) => {
    setRobotBuilderSlots(prev => prev.filter(s => s.key !== slotKey));
    showToast(`Slot "${slotKey}" deleted`, "info");
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

  const deleteSlotOption = (slotKey, optionId) => {
    setRobotBuilderSlots(prev => prev.map(slot => {
      if (slot.key === slotKey) {
        return {
          ...slot,
          options: (slot.options || []).filter(opt => opt.id !== optionId)
        };
      }
      return slot;
    }));
    showToast("Component option removed from slot", "info");
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

    showToast("Reset all store, accounts & demo data to original state", "info");
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
        resetRobotBuilderDefaults
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

